import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: tienda, error: tiendaError } = await supabase
    .from('tiendas')
    .select('id, propietario_id, nombre, calificacion, estado')
    .eq('id', id)
    .maybeSingle()

  if (tiendaError) return errors.server(tiendaError.message)
  if (!tienda) return errors.notFound('Tienda no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isOwner = tienda.propietario_id === auth.user.id
  if (!isAdmin && !isOwner) return errors.forbidden()

  const { searchParams } = new URL(request.url)
  const desde = searchParams.get('desde') // opcional, filtra pedidos por rango de fechas
  const hasta = searchParams.get('hasta')

  // --- Pedidos: totales y desglose por estado ---
  let pedidosQuery = supabase
    .from('pedidos')
    .select('id, estado, total, created_at')
    .eq('tienda_id', id)

  if (desde) pedidosQuery = pedidosQuery.gte('created_at', desde)
  if (hasta) pedidosQuery = pedidosQuery.lte('created_at', hasta)

  const { data: pedidos, error: pedidosError } = await pedidosQuery
  if (pedidosError) return errors.server(pedidosError.message)

  const pedidosPorEstado: Record<string, number> = {}
  let ventasTotales = 0
  for (const p of pedidos ?? []) {
    pedidosPorEstado[p.estado] = (pedidosPorEstado[p.estado] ?? 0) + 1
    if (p.estado === 'entregado') ventasTotales += Number(p.total)
  }

  // --- Productos: totales, activos, más vendidos ---
  const { data: productos, error: productosError } = await supabase
    .from('productos')
    .select('id, nombre, total_ventas, visitas, calificacion, activo')
    .eq('tienda_id', id)

  if (productosError) return errors.server(productosError.message)

  const productosActivos = (productos ?? []).filter((p: any) => p.activo).length
  const topProductos = [...(productos ?? [])]
    .sort((a: any, b: any) => b.total_ventas - a.total_ventas)
    .slice(0, 5)
    .map((p: any) => ({ id: p.id, nombre: p.nombre, total_ventas: p.total_ventas }))

  // --- Reseñas ---
  const { data: resenas, error: resenasError } = await supabase
    .from('resenas')
    .select('calificacion')
    .eq('tienda_id', id)

  if (resenasError) return errors.server(resenasError.message)

  // --- Comisiones: cuánto hay pendiente de liquidar ---
  const { data: comisiones, error: comisionesError } = await supabase
    .from('comisiones')
    .select('estado, monto_vendedor')
    .eq('tienda_id', id)

  if (comisionesError) return errors.server(comisionesError.message)

  const pendientePorLiquidar = (comisiones ?? [])
    .filter((c: any) => c.estado === 'pendiente')
    .reduce((acc: number, c: any) => acc + Number(c.monto_vendedor), 0)

  // --- Saldo actual desde el libro de movimientos financieros ---
  const { data: ultimoMovimiento } = await supabase
    .from('movimientos_financieros')
    .select('saldo')
    .eq('tienda_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // --- Liquidaciones históricas ---
  const { data: liquidaciones, error: liquidacionesError } = await supabase
    .from('liquidaciones')
    .select('monto, estado')
    .eq('tienda_id', id)

  if (liquidacionesError) return errors.server(liquidacionesError.message)

  const totalLiquidado = (liquidaciones ?? [])
    .filter((l: any) => l.estado === 'procesada')
    .reduce((acc: number, l: any) => acc + Number(l.monto), 0)

  return ok({
    tienda: { id: tienda.id, nombre: tienda.nombre, estado: tienda.estado, calificacion: tienda.calificacion },
    ventas: {
      total_pedidos: (pedidos ?? []).length,
      pedidos_por_estado: pedidosPorEstado,
      ventas_totales_entregadas: ventasTotales,
    },
    productos: {
      total: (productos ?? []).length,
      activos: productosActivos,
      top_vendidos: topProductos,
    },
    resenas: {
      total: (resenas ?? []).length,
      promedio: tienda.calificacion,
    },
    finanzas: {
      saldo_actual: Number(ultimoMovimiento?.saldo ?? 0),
      pendiente_por_liquidar: pendientePorLiquidar,
      total_liquidado_historico: totalLiquidado,
    },
  })
}