import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

async function getTiendaYValidarDueno(supabase: any, tiendaId: string, auth: any) {
  const { data: tienda, error } = await supabase
    .from('tiendas')
    .select('id, propietario_id')
    .eq('id', tiendaId)
    .maybeSingle()

  if (error) throw error
  if (!tienda) return { tienda: null, autorizado: false }

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isOwner = tienda.propietario_id === auth.user.id
  return { tienda, autorizado: isAdmin || isOwner }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  let resultado
  try {
    resultado = await getTiendaYValidarDueno(supabase, id, auth)
  } catch (error: any) {
    return errors.server(error.message)
  }
  if (!resultado.tienda) return errors.notFound('Tienda no encontrada.')
  if (!resultado.autorizado) return errors.forbidden()

  const { data, error } = await supabase
    .from('cuentas_bancarias')
    .select('*, bancos ( nombre ), metodos_pago ( nombre )')
    .eq('tienda_id', id)
    .order('principal', { ascending: false })

  if (error) return errors.server(error.message)

  return ok(data)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  let resultado
  try {
    resultado = await getTiendaYValidarDueno(supabase, id, auth)
  } catch (error: any) {
    return errors.server(error.message)
  }
  if (!resultado.tienda) return errors.notFound('Tienda no encontrada.')
  if (!resultado.autorizado) return errors.forbidden()

  const body = await request.json()
  const { banco_id, metodo_pago_id, titular, numero_cuenta, principal } = body

  if (!banco_id) return errors.validation('banco_id es requerido.')
  if (!metodo_pago_id) return errors.validation('metodo_pago_id es requerido.')
  if (!titular || !titular.trim()) return errors.validation('titular es requerido.')
  if (!numero_cuenta || !numero_cuenta.trim()) return errors.validation('numero_cuenta es requerido.')

  // ¿Es la primera cuenta de la tienda? Si es así, se vuelve principal automáticamente.
  const { count: totalCuentas } = await supabase
    .from('cuentas_bancarias')
    .select('id', { count: 'exact', head: true })
    .eq('tienda_id', id)

  const esPrincipal = principal === true || (totalCuentas ?? 0) === 0

  // Regla de negocio: solo puede existir una cuenta principal por tienda.
  if (esPrincipal) {
    const { error: unsetError } = await supabase
      .from('cuentas_bancarias')
      .update({ principal: false })
      .eq('tienda_id', id)
      .eq('principal', true)

    if (unsetError) return errors.server(unsetError.message)
  }

  const { data, error } = await supabase
    .from('cuentas_bancarias')
    .insert({
      tienda_id: id,
      banco_id,
      metodo_pago_id,
      titular,
      numero_cuenta,
      principal: esPrincipal,
      activa: true,
    })
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data, 201)
}