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
  const tipo = searchParams.get('tipo') // ej: 'venta' | 'liquidacion' | 'ajuste' | 'reembolso'
  const desde = searchParams.get('desde')
  const hasta = searchParams.get('hasta')
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('movimientos_financieros')
    .select('id, pedido_id, pago_id, tipo, descripcion, monto, saldo, created_at', { count: 'exact' })
    .eq('tienda_id', id)
    .order('created_at', { ascending: false })

  if (tipo) query = query.eq('tipo', tipo)
  if (desde) query = query.gte('created_at', desde)
  if (hasta) query = query.lte('created_at', hasta)

  const { data: movimientos, error, count } = await query.range(from, to)
  if (error) return errors.server(error.message)

  const { data: ultimo } = await supabase
    .from('movimientos_financieros')
    .select('saldo')
    .eq('tienda_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const resumenPagina = (movimientos ?? []).reduce(
    (acc: { ingresos: number; egresos: number }, m: any) => {
      if (Number(m.monto) >= 0) acc.ingresos += Number(m.monto)
      else acc.egresos += Math.abs(Number(m.monto))
      return acc
    },
    { ingresos: 0, egresos: 0 }
  )

  return ok({
    saldo_actual: Number(ultimo?.saldo ?? 0),
    resumen_pagina: resumenPagina,
    movimientos,
    meta: { page, pageSize, total: count ?? 0 },
  })
}
