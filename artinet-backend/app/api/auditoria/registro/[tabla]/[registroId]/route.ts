import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

// ================= GET: historial de cambios de un registro específico =================
// Ej: /api/auditoria/registro/productos/3f1e...  -> todo el historial de ese producto
// Útil para trazabilidad puntual sin tener que filtrar manualmente el log completo.
export async function GET(
  _request: Request,
  { params }: { params: { tabla: string; registroId: string } }
) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()
  if (auth.perfil?.rol !== 'administrador') return errors.forbidden()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('auditoria')
    .select(
      `
      *,
      usuario:perfiles(id, nombres, apellidos, rol)
    `
    )
    .eq('tabla', params.tabla)
    .eq('registro_id', params.registroId)
    .order('created_at', { ascending: true }) // orden cronológico: del más antiguo al más nuevo

  if (error) return errors.server(error.message)
  if (!data || data.length === 0) {
    return errors.notFound('No hay historial de auditoría para ese registro.')
  }

  return ok(data)
}