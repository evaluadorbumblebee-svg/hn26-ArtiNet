import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

// ================= GET: resumen/estadísticas de auditoría (solo administrador) =================
// Query params opcionales: desde, hasta (YYYY-MM-DD) para acotar el rango.
// Devuelve conteos agrupados por tabla y por tipo de acción, más los últimos 10 eventos.
export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()
  if (auth.perfil?.rol !== 'administrador') return errors.forbidden()

  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const desde = searchParams.get('desde')
  const hasta = searchParams.get('hasta')

  let baseQuery = supabase.from('auditoria').select('tabla, accion, created_at')
  if (desde) baseQuery = baseQuery.gte('created_at', desde)
  if (hasta) baseQuery = baseQuery.lte('created_at', hasta)

  const { data: eventos, error: errorEventos } = await baseQuery

  if (errorEventos) return errors.server(errorEventos.message)

  // Agregamos en memoria porque Supabase (PostgREST) no soporta GROUP BY nativo
  // vía el query builder estándar. Para volúmenes muy grandes, esto conviene
  // moverlo a una vista SQL o función RPC (ej: rpc('auditoria_resumen')).
  const porTabla: Record<string, number> = {}
  const porAccion: Record<string, number> = {}

  for (const e of eventos ?? []) {
    porTabla[e.tabla] = (porTabla[e.tabla] ?? 0) + 1
    porAccion[e.accion] = (porAccion[e.accion] ?? 0) + 1
  }

  const { data: ultimosEventos, error: errorUltimos } = await supabase
    .from('auditoria')
    .select(
      `
      id, tabla, registro_id, accion, created_at,
      usuario:perfiles(id, nombres, apellidos)
    `
    )
    .order('created_at', { ascending: false })
    .limit(10)

  if (errorUltimos) return errors.server(errorUltimos.message)

  return ok({
    total_eventos: eventos?.length ?? 0,
    por_tabla: porTabla,
    por_accion: porAccion,
    ultimos_eventos: ultimosEventos,
  })
}