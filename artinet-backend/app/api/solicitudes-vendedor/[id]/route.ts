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

  const { data: solicitud, error } = await supabase
    .from('solicitudes_vendedor')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return errors.server(error.message)
  if (!solicitud) return errors.notFound('Solicitud no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isDueno = solicitud.usuario_id === auth.user.id
  if (!isAdmin && !isDueno) return errors.forbidden()

  return ok(solicitud)
}

// Solo un administrador aprueba o rechaza la postulación a vendedor
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  if (auth.perfil?.rol !== 'administrador') return errors.forbidden()

  const supabase = await createClient()

  const { data: solicitud, error } = await supabase
    .from('solicitudes_vendedor')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return errors.server(error.message)
  if (!solicitud) return errors.notFound('Solicitud no encontrada.')

  if (solicitud.estado !== 'pendiente') {
    return errors.validation('Esta solicitud ya fue revisada.')
  }

  const body = await request.json()
  const { estado, observaciones } = body

  if (!estado || !['aprobada', 'rechazada'].includes(estado)) {
    return errors.validation("estado debe ser 'aprobada' o 'rechazada'.")
  }

  const { data: actualizada, error: updateError } = await supabase
    .from('solicitudes_vendedor')
    .update({
      estado,
      observaciones: observaciones ?? null,
      revisado_por: auth.user.id,
      fecha_revision: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) return errors.server(updateError.message)

  if (estado === 'aprobada') {
    // Promueve al usuario a vendedor
    const { error: perfilError } = await supabase
      .from('perfiles')
      .update({ rol: 'vendedor', updated_at: new Date().toISOString() })
      .eq('id', solicitud.usuario_id)

    if (perfilError) return errors.server(perfilError.message)
  }

  await supabase.from('notificaciones').insert({
    usuario_id: solicitud.usuario_id,
    titulo: estado === 'aprobada' ? 'Postulación aprobada' : 'Postulación rechazada',
    mensaje:
      estado === 'aprobada'
        ? 'Tu postulación para ser vendedor fue aprobada. ¡Ya puedes crear tu tienda!'
        : 'Tu postulación para ser vendedor fue rechazada.',
    enlace: '/solicitudes-vendedor',
    leida: false,
  })

  return ok(actualizada)
}