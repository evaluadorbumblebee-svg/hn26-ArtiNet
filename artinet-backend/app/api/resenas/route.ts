import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

// Recalcula el promedio de calificación de un producto a partir de sus reseñas
async function recalcularCalificacionProducto(supabase: any, productoId: number) {
  const { data, error } = await supabase
    .from('resenas')
    .select('calificacion')
    .eq('producto_id', productoId)

  if (error) throw error

  const calificaciones = (data ?? []).map((r: any) => Number(r.calificacion))
  const promedio =
    calificaciones.length > 0
      ? calificaciones.reduce((a: number, b: number) => a + b, 0) / calificaciones.length
      : 0

  const { error: updateError } = await supabase
    .from('productos')
    .update({ calificacion: Number(promedio.toFixed(2)) })
    .eq('id', productoId)

  if (updateError) throw updateError
}

// Recalcula el promedio de calificación de una tienda a partir de todas sus reseñas
async function recalcularCalificacionTienda(supabase: any, tiendaId: number) {
  const { data, error } = await supabase
    .from('resenas')
    .select('calificacion')
    .eq('tienda_id', tiendaId)

  if (error) throw error

  const calificaciones = (data ?? []).map((r: any) => Number(r.calificacion))
  const promedio =
    calificaciones.length > 0
      ? calificaciones.reduce((a: number, b: number) => a + b, 0) / calificaciones.length
      : 0

  const { error: updateError } = await supabase
    .from('tiendas')
    .update({ calificacion: Number(promedio.toFixed(2)) })
    .eq('id', tiendaId)

  if (updateError) throw updateError
}

// Calcula distribución de estrellas (1 a 5) para mostrar un gráfico tipo Amazon
function calcularDistribucion(calificaciones: number[]) {
  const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
  for (const c of calificaciones) {
    const estrella = Math.round(c) as 1 | 2 | 3 | 4 | 5
    if (distribucion[estrella] !== undefined) distribucion[estrella]++
  }
  const total = calificaciones.length
  const promedio = total > 0 ? calificaciones.reduce((a, b) => a + b, 0) / total : 0
  return { total, promedio: Number(promedio.toFixed(2)), distribucion }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)

  const producto_id = searchParams.get('producto_id')
  const tienda_id = searchParams.get('tienda_id')
  const usuario_id = searchParams.get('usuario_id')
  const calificacion = searchParams.get('calificacion')

  let query = supabase
    .from('resenas')
    .select('*, perfiles ( nombres, apellidos, foto )', { count: 'exact' })

  if (producto_id) query = query.eq('producto_id', producto_id)
  if (tienda_id) query = query.eq('tienda_id', tienda_id)
  if (usuario_id) query = query.eq('usuario_id', usuario_id)
  if (calificacion) query = query.eq('calificacion', calificacion)

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)

  // Estadísticas de distribución, solo cuando se filtra por un producto o tienda específicos
  let stats = null
  if (producto_id || tienda_id) {
    let statsQuery = supabase.from('resenas').select('calificacion')
    if (producto_id) statsQuery = statsQuery.eq('producto_id', producto_id)
    if (tienda_id) statsQuery = statsQuery.eq('tienda_id', tienda_id)

    const { data: todasCalificaciones, error: statsError } = await statsQuery
    if (statsError) return errors.server(statsError.message)

    stats = calcularDistribucion((todasCalificaciones ?? []).map((r: any) => Number(r.calificacion)))
  }

  return ok(data, 200, { page, pageSize, total: count, stats })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const body = await request.json()
  const { pedido_id, producto_id, calificacion, comentario } = body

  if (!pedido_id) return errors.validation('pedido_id es requerido.')
  if (!producto_id) return errors.validation('producto_id es requerido.')
  if (!calificacion || calificacion < 1 || calificacion > 5) {
    return errors.validation('calificacion debe estar entre 1 y 5.')
  }

  const supabase = await createClient()

  // 1. El pedido debe existir, ser del usuario autenticado, y estar entregado
  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .select('id, cliente_id, tienda_id, estado')
    .eq('id', pedido_id)
    .maybeSingle()

  if (pedidoError) return errors.server(pedidoError.message)
  if (!pedido) return errors.notFound('Pedido no encontrado.')
  if (pedido.cliente_id !== auth.user.id) return errors.forbidden()
  if (pedido.estado !== 'entregado') {
    return errors.validation('Solo puedes reseñar productos de pedidos ya entregados.')
  }

  // 2. El producto reseñado debe pertenecer realmente a ese pedido (vía detalle_pedido -> variantes_producto)
  const { data: detalle, error: detalleError } = await supabase
    .from('detalle_pedido')
    .select('id, variantes_producto ( producto_id )')
    .eq('pedido_id', pedido_id)

  if (detalleError) return errors.server(detalleError.message)

  const productoComprado = (detalle ?? []).some(
    (d: any) => d.variantes_producto?.producto_id === Number(producto_id)
  )

  if (!productoComprado) {
    return errors.validation('Este producto no pertenece al pedido indicado.')
  }

  // 3. No permitir reseñas duplicadas para el mismo pedido + producto
  const { data: existente } = await supabase
    .from('resenas')
    .select('id')
    .eq('pedido_id', pedido_id)
    .eq('producto_id', producto_id)
    .maybeSingle()

  if (existente) return errors.conflict('Ya reseñaste este producto para este pedido.')

  // tienda_id se deriva del pedido real, nunca se confía en lo que envíe el cliente
  const { data: resena, error: resenaError } = await supabase
    .from('resenas')
    .insert({
      usuario_id: auth.user.id,
      pedido_id,
      producto_id,
      tienda_id: pedido.tienda_id,
      calificacion,
      comentario: comentario ?? null,
    })
    .select()
    .single()

  if (resenaError) return errors.server(resenaError.message)

  try {
    await recalcularCalificacionProducto(supabase, producto_id)
    await recalcularCalificacionTienda(supabase, pedido.tienda_id)
  } catch (error: any) {
    // La reseña ya se guardó; solo informamos que el recálculo de promedios falló
    return ok(resena, 201, { warning: `Reseña creada, pero falló el recálculo de calificaciones: ${error.message}` })
  }

  // Notificar al dueño de la tienda
  const { data: tienda } = await supabase
    .from('tiendas')
    .select('propietario_id, nombre')
    .eq('id', pedido.tienda_id)
    .maybeSingle()

  if (tienda?.propietario_id) {
    await supabase.from('notificaciones').insert({
      usuario_id: tienda.propietario_id,
      titulo: 'Nueva reseña recibida',
      mensaje: `Un cliente calificó con ${calificacion} estrella(s) uno de tus productos.`,
      enlace: `/tienda/productos/${producto_id}/resenas`,
      leida: false,
    })
  }

  return ok(resena, 201)
}