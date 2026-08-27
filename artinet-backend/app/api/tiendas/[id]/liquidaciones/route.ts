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
    .select('id, propietario_id')
    .eq('id', id)
    .maybeSingle()

  if (tiendaError) return errors.server(tiendaError.message)
  if (!tienda) return errors.notFound('Tienda no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isOwner = tienda.propietario_id === auth.user.id
  if (!isAdmin && !isOwner) return errors.forbidden()

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') ?? 20)))
  const estado = searchParams.get('estado') // 'pendiente' | 'procesada' | 'rechazada'
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('liquidaciones')
    .select(
      'id, cuenta_bancaria_id, monto, estado, referencia, fecha_pago, observaciones, created_at, updated_at, cuentas_bancarias(titular, numero_cuenta, bancos(nombre))',
      { count: 'exact' }
    )
    .eq('tienda_id', id)
    .order('created_at', { ascending: false })

  if (estado) query = query.eq('estado', estado)

  const { data: liquidaciones, error, count } = await query.range(from, to)
  if (error) return errors.server(error.message)

  const { data: pendientes } = await supabase
    .from('comisiones')
    .select('monto_vendedor')
    .eq('tienda_id', id)
    .eq('estado', 'pendiente')

  const totalPendientePorLiquidar = (pendientes ?? []).reduce(
    (acc: number, c: any) => acc + Number(c.monto_vendedor),
    0
  )

  return ok({
    total_pendiente_por_liquidar: totalPendientePorLiquidar,
    liquidaciones,
    meta: { page, pageSize, total: count ?? 0 },
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: tienda, error: tiendaError } = await supabase
    .from('tiendas')
    .select('id, propietario_id, estado, activo')
    .eq('id', id)
    .maybeSingle()

  if (tiendaError) return errors.server(tiendaError.message)
  if (!tienda) return errors.notFound('Tienda no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isOwner = tienda.propietario_id === auth.user.id
  if (!isAdmin && !isOwner) return errors.forbidden()

  if (!tienda.activo || tienda.estado !== 'aprobada') {
    return errors.badRequest('La tienda debe estar activa y aprobada para solicitar liquidaciones.')
  }

  const body = await request.json().catch(() => null)
  const cuentaBancariaId = body?.cuenta_bancaria_id

  if (!cuentaBancariaId) {
    return errors.badRequest('Debe indicar la cuenta bancaria de destino (cuenta_bancaria_id).')
  }

  const { data, error } = await supabase.rpc('crear_liquidacion', {
    p_tienda_id: Number(id),
    p_cuenta_bancaria_id: Number(cuentaBancariaId),
  })

  if (error) return errors.badRequest(error.message)

  return ok(data, 201)
}
