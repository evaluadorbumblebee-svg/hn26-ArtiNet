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
    .from('solicitudes_cliente')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return errors.server(error.message)
  if (!solicitud) return errors.notFound('Solicitud no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isDueno = solicitud.cliente_id === auth.user.id

  // Solo el dueño, un admin, o (si está abierta) cualquiera navegando el marketplace puede verla
  if (!isAdmin && !isDueno && solicitud.estado !== 'abierta') {
    return errors.forbidden()
  }

  return ok(solicitud)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: solicitud, error } = await supabase
    .from('solicitudes_cliente')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return errors.server(error.message)
  if (!solicitud) return errors.notFound('Solicitud no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isDueno = solicitud.cliente_id === auth.user.id
  if (!isAdmin && !isDueno) return errors.forbidden()

  const body = await request.json()
  const { estado, ...resto } = body

  // Solo se permite pasar la solicitud a 'cancelada' manualmente; a 'cerrada' la pasa
  // automáticamente el endpoint de aceptar propuesta.
  if (estado && estado !== 'cancelada') {
    return errors.validation("El único cambio de estado permitido aquí es 'cancelada'.")
  }

  if (solicitud.estado !== 'abierta') {
    return errors.validation('Solo se puede editar o cancelar una solicitud mientras está abierta.')
  }

  const allowed = [
    'categoria_id',
    'titulo',
    'descripcion',
    'presupuesto',
    'moneda_id',
    'pais',
    'departamento',
    'ciudad',
    'direccion',
    'imagen_referencia',
    'fecha_limite',
  ]

  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in resto) updates[key] = resto[key]
  }
  if (estado === 'cancelada') updates.estado = 'cancelada'

  if (Object.keys(updates).length === 0) {
    return errors.validation('No se enviaron campos para actualizar.')
  }

  updates.updated_at = new Date().toISOString()

  const { data, error: updateError } = await supabase
    .from('solicitudes_cliente')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (updateError) return errors.server(updateError.message)

  // Si se canceló, rechazamos automáticamente las propuestas pendientes asociadas
  if (updates.estado === 'cancelada') {
    await supabase
      .from('propuestas_solicitud')
      .update({ estado: 'rechazada', updated_at: new Date().toISOString() })
      .eq('solicitud_id', id)
      .eq('estado', 'pendiente')
  }

  return ok(data)
}