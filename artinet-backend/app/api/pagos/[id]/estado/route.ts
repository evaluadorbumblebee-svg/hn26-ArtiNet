import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

const ESTADOS_VALIDOS = ['pendiente', 'confirmado', 'rechazado']

// Trae el pago junto con datos del pedido (tienda_id) para validar permisos
async function getPagoConPedido(supabase: any, pagoId: string) {
  const { data, error } = await supabase
    .from('pagos')
    .select('id, pedido_id, estado, pedidos ( id, tienda_id, tiendas ( propietario_id ) )')
    .eq('id', pagoId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  let pago
  try {
    pago = await getPagoConPedido(supabase, id)
  } catch (error: any) {
    return errors.server(error.message)
  }
  if (!pago) return errors.notFound('Pago no encontrado.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isTienda = pago.pedidos?.tiendas?.propietario_id === auth.user.id
  if (!isAdmin && !isTienda) return errors.forbidden()

  const body = await request.json()
  const { estado } = body

  if (!estado) return errors.validation('estado es requerido.')
  if (!ESTADOS_VALIDOS.includes(estado)) {
    return errors.validation(`estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`)
  }

  const updates: Record<string, unknown> = { estado }
  if (estado === 'confirmado') {
    updates.fecha_pago = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('pagos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data)
}