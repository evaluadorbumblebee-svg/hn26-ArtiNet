import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

const ESTADOS_VALIDOS = [
  'pendiente',
  'confirmado',
  'en_preparacion',
  'enviado',
  'entregado',
  'cancelado',
]

async function getPedidoConTienda(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, estado, tiendas ( propietario_id )')
    .eq('id', id)
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

  let pedido
  try {
    pedido = await getPedidoConTienda(supabase, id)
  } catch (error: any) {
    return errors.server(error.message)
  }
  if (!pedido) return errors.notFound('Pedido no encontrado.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isTienda = pedido.tiendas?.propietario_id === auth.user.id
  if (!isAdmin && !isTienda) return errors.forbidden()

  const body = await request.json()
  const { estado, comentario } = body

  if (!estado) return errors.validation('estado es requerido.')
  if (!ESTADOS_VALIDOS.includes(estado)) {
    return errors.validation(`estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`)
  }

  const { data: actualizado, error: updateError } = await supabase
    .from('pedidos')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (updateError) return errors.server(updateError.message)

  const { error: seguimientoError } = await supabase.from('seguimiento_pedido').insert({
    pedido_id: id,
    estado,
    comentario: comentario ?? null,
    actualizado_por: auth.user.id,
  })

  if (seguimientoError) return errors.server(seguimientoError.message)

  return ok(actualizado)
}