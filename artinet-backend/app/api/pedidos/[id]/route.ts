import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

async function getPedidoConTienda(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, tiendas ( propietario_id )')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

function puedeAcceder(pedido: any, auth: any) {
  const isAdmin = auth.perfil?.rol === 'administrador'
  const isCliente = pedido.cliente_id === auth.user.id
  const isTienda = pedido.tiendas?.propietario_id === auth.user.id
  return isAdmin || isCliente || isTienda
}

export async function GET(
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
  if (!puedeAcceder(pedido, auth)) return errors.forbidden()

  const { data: detalle, error: detalleError } = await supabase
    .from('detalle_pedido')
    .select(`
      id, cantidad, precio_unitario, subtotal,
      variantes_producto (
        id, color, talla, sku,
        productos ( id, nombre, slug, imagenes ( url, principal ) )
      )
    `)
    .eq('pedido_id', id)

  if (detalleError) return errors.server(detalleError.message)

  return ok({ ...pedido, detalle })
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
  if (!puedeAcceder(pedido, auth)) return errors.forbidden()

  const body = await request.json()
  // El estado se maneja únicamente vía /api/pedidos/[id]/estado
  const allowed = ['observaciones', 'direccion_entrega_id', 'tipo_entrega']

  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  if (Object.keys(updates).length === 0) {
    return errors.validation('No se enviaron campos para actualizar.')
  }

  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('pedidos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data)
}