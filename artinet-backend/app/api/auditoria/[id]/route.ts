import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

// ================= GET: detalle de un registro de auditoría (solo administrador) =================
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
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
      usuario:perfiles(id, nombres, apellidos, rol, foto)
    `
    )
    .eq('id', params.id)
    .single()

  if (error || !data) return errors.notFound('Registro de auditoría no encontrado.')

  return ok(data)
}