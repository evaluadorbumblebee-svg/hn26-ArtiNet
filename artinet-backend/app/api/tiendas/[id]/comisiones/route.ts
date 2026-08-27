import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

async function puedeVerFinanzas(supabase: any, tiendaId: string, auth: any) {
  if (auth.perfil?.rol === 'administrador') return true

  const { data: tienda } = await supabase
    .from('tiendas')
    .select('propietario_id')
    .eq('id', tiendaId)
    .maybeSingle()

  return tienda?.propietario_id === auth.user.id
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  if (!(await puedeVerFinanzas(supabase, id, auth))) return errors.forbidden()

  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)
  const estado = searchParams.get('estado')

  let query = supabase
    .from('comisiones')
    .select('*, pedidos ( numero_orden, estado )', { count: 'exact' })
    .eq('tienda_id', id)

  if (estado) query = query.eq('estado', estado)

  const { data, error, count } = await query
    .order(sortBy || 'created_at', { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)

  // Resumen agregado: totales generales y desglose por estado
  const { data: todas, error: statsError } = await supabase
    .from('comisiones')
    .select('monto_venta, monto_comision, monto_vendedor, estado')
    .eq('tienda_id', id)

  if (statsError) return errors.server(statsError.message)

  const resumen = (todas ?? []).reduce(
    (acc: any, c: any) => {
      acc.total_vendido += Number(c.monto_venta)
      acc.total_comision_plataforma += Number(c.monto_comision)
      acc.total_a_favor_vendedor += Number(c.monto_vendedor)

      if (!acc.por_estado[c.estado]) {
        acc.por_estado[c.estado] = { cantidad: 0, monto_vendedor: 0 }
      }
      acc.por_estado[c.estado].cantidad += 1
      acc.por_estado[c.estado].monto_vendedor += Number(c.monto_vendedor)

      return acc
    },
    { total_vendido: 0, total_comision_plataforma: 0, total_a_favor_vendedor: 0, por_estado: {} as Record<string, any> }
  )

  return ok(data, 200, { page, pageSize, total: count, resumen })
}