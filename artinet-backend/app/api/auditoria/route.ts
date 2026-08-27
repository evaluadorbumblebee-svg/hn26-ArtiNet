import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

// ================= GET: listar auditoría (solo administrador) =================
// Filtros soportados: tabla, registro_id, usuario_id, accion, desde, hasta, q (busca en descripcion de accion)
export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()
  if (auth.perfil?.rol !== 'administrador') return errors.forbidden()

  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)
  // Nota: para auditoría normalmente se quiere lo más reciente primero.
  // Si el cliente no manda ?sortBy=, cae en el default que traiga parsePagination;
  // ajusta ese default a created_at/desc si aún no lo tiene.

  let query = supabase
    .from('auditoria')
    .select(
      `
      *,
      usuario:perfiles(id, nombres, apellidos, rol)
    `,
      { count: 'exact' }
    )

  const tabla = searchParams.get('tabla')
  const registro_id = searchParams.get('registro_id')
  const usuario_id = searchParams.get('usuario_id')
  const accion = searchParams.get('accion')
  const desde = searchParams.get('desde') // YYYY-MM-DD
  const hasta = searchParams.get('hasta') // YYYY-MM-DD

  if (tabla) query = query.eq('tabla', tabla)
  if (registro_id) query = query.eq('registro_id', registro_id)
  if (usuario_id) query = query.eq('usuario_id', usuario_id)
  if (accion) query = query.eq('accion', accion)
  if (desde) query = query.gte('created_at', desde)
  if (hasta) query = query.lte('created_at', hasta)

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)
  return ok(data, 200, { page, pageSize, total: count })
}