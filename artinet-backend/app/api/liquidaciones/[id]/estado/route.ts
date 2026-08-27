import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  if (auth.perfil?.rol !== 'administrador') {
    return errors.forbidden()
  }

  const body = await request.json().catch(() => null)
  const accion = body?.accion // 'procesar' | 'rechazar'
  const referencia = body?.referencia ?? null
  const observaciones = body?.observaciones ?? null

  if (accion !== 'procesar' && accion !== 'rechazar') {
    return errors.badRequest('El campo "accion" debe ser "procesar" o "rechazar".')
  }

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('resolver_liquidacion', {
    p_liquidacion_id: Number(id),
    p_accion: accion,
    p_referencia: referencia,
    p_observaciones: observaciones,
  })

  if (error) return errors.badRequest(error.message)

  return ok(data)
}
