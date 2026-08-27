import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

async function getPedidoConTienda(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, estado, cliente_id, tiendas ( propietario_id )')
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

  const { data, error } = await supabase
    .from('seguimiento_pedido')
    .select('*')
    .eq('pedido_id', id)
    .order('created_at', { ascending: true })

  if (error) return errors.server(error.message)

  return ok(data)
}

// Agrega un comentario de seguimiento sin cambiar formalmente el estado del pedido
export async function POST(
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
  const { comentario } = body

  if (!comentario || !comentario.trim()) {
    return errors.validation('comentario es requerido.')
  }

  const { data, error } = await supabase
    .from('seguimiento_pedido')
    .insert({
      pedido_id: id,
      estado: pedido.estado, // mantiene el estado actual del pedido
      comentario,
      actualizado_por: auth.user.id,
    })
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data, 201)
}