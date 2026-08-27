import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

function generarNumeroOrden() {
  const fecha = new Date()
  const yyyymmdd = fecha.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `ORD-${yyyymmdd}-${random}`
}

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)

  let query = supabase.from('pedidos').select('*', { count: 'exact' })

  const estado = searchParams.get('estado')
  const tienda_id = searchParams.get('tienda_id')

  const isAdmin = auth.perfil?.rol === 'administrador'

  if (isAdmin) {
    if (tienda_id) query = query.eq('tienda_id', tienda_id)
  } else if (auth.perfil?.rol === 'vendedor') {
    // Un vendedor solo ve los pedidos de sus propias tiendas
    const { data: tiendas } = await supabase
      .from('tiendas')
      .select('id')
      .eq('propietario_id', auth.user.id)

    const tiendaIds = (tiendas ?? []).map((t: any) => t.id)
    if (tiendaIds.length === 0) return ok([], 200, { page, pageSize, total: 0 })

    query = query.in('tienda_id', tienda_id ? [tienda_id] : tiendaIds)
  } else {
    // Cliente: solo sus propios pedidos
    query = query.eq('cliente_id', auth.user.id)
  }

  if (estado) query = query.eq('estado', estado)

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)
  return ok(data, 200, { page, pageSize, total: count })
}

// Checkout: crea un pedido a partir de los items del carrito activo que pertenezcan a una tienda
export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const body = await request.json()
  const {
    tienda_id,
    direccion_entrega_id,
    metodo_pago_id,
    moneda_id,
    tipo_entrega,
    observaciones,
    solicitud_cliente_id,
  } = body

  if (!tienda_id) return errors.validation('tienda_id es requerido.')
  if (!direccion_entrega_id) return errors.validation('direccion_entrega_id es requerido.')
  if (!metodo_pago_id) return errors.validation('metodo_pago_id es requerido.')
  if (!moneda_id) return errors.validation('moneda_id es requerido.')
  if (!tipo_entrega) return errors.validation('tipo_entrega es requerido.')

  const supabase = await createClient()

  // Validar dirección de entrega del usuario
  const { data: direccion } = await supabase
    .from('direcciones_entrega')
    .select('id')
    .eq('id', direccion_entrega_id)
    .eq('usuario_id', auth.user.id)
    .maybeSingle()

  if (!direccion) return errors.validation('direccion_entrega_id inválida.')

  // Carrito activo
  const { data: carrito } = await supabase
    .from('carritos')
    .select('id')
    .eq('usuario_id', auth.user.id)
    .eq('estado', 'activo')
    .maybeSingle()

  if (!carrito) return errors.validation('No tienes un carrito activo.')

  // Items del carrito cuyo producto pertenece a la tienda solicitada
  const { data: items, error: itemsError } = await supabase
    .from('detalle_carrito')
    .select('id, variante_id, cantidad, precio_unitario, subtotal, variantes_producto ( id, stock, activo, productos ( id, tienda_id ) )')
    .eq('carrito_id', carrito.id)

  if (itemsError) return errors.server(itemsError.message)

  const itemsTienda = (items ?? []).filter(
    (i: any) => i.variantes_producto?.productos?.tienda_id === Number(tienda_id)
  )

  if (itemsTienda.length === 0) {
    return errors.validation('No hay items en el carrito para esta tienda.')
  }

  // Validar stock antes de crear el pedido
  for (const item of itemsTienda as any[]) {
    if (!item.variantes_producto?.activo) {
      return errors.validation('Una de las variantes ya no está disponible.')
    }
    if (item.cantidad > item.variantes_producto.stock) {
      return errors.validation('Stock insuficiente para uno de los items del carrito.')
    }
  }

  const subtotal = itemsTienda.reduce((acc: number, i: any) => acc + Number(i.subtotal), 0)
  // TODO: ajustar el cálculo de comisión según porcentaje_comision de la tienda
  const monto_comision = 10
  const total = subtotal

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      numero_orden: generarNumeroOrden(),
      cliente_id: auth.user.id,
      tienda_id,
      direccion_entrega_id,
      metodo_pago_id,
      moneda_id,
      tipo_entrega,
      subtotal,
      monto_comision,
      total,
      estado: 'pendiente',
      observaciones: observaciones ?? null,
      solicitud_cliente_id: solicitud_cliente_id ?? null,
    })
    .select()
    .single()

  if (pedidoError) return errors.server(pedidoError.message)

  const detalle = (itemsTienda as any[]).map((i) => ({
    pedido_id: pedido.id,
    variante_id: i.variante_id,
    cantidad: i.cantidad,
    precio_unitario: i.precio_unitario,
    subtotal: i.subtotal,
  }))

  const { error: detalleError } = await supabase.from('detalle_pedido').insert(detalle)
  if (detalleError) return errors.server(detalleError.message)

  // Registro inicial de seguimiento
  await supabase.from('seguimiento_pedido').insert({
    pedido_id: pedido.id,
    estado: 'pendiente',
    comentario: 'Pedido creado.',
    actualizado_por: auth.user.id,
  })

  // Descontar stock reservado y limpiar esos items del carrito
  for (const item of itemsTienda as any[]) {
    await supabase
      .from('variantes_producto')
      .update({ stock: item.variantes_producto.stock - item.cantidad })
      .eq('id', item.variante_id)
  }

  const idsEliminar = (itemsTienda as any[]).map((i) => i.id)
  await supabase.from('detalle_carrito').delete().in('id', idsEliminar)

  // Recalcular totales del carrito restante
  const { data: itemsRestantes } = await supabase
    .from('detalle_carrito')
    .select('subtotal')
    .eq('carrito_id', carrito.id)

  const nuevoSubtotal = (itemsRestantes ?? []).reduce((acc: number, i: any) => acc + Number(i.subtotal), 0)
  await supabase
    .from('carritos')
    .update({ subtotal: nuevoSubtotal, total: nuevoSubtotal, updated_at: new Date().toISOString() })
    .eq('id', carrito.id)

  return ok(pedido, 201)
}