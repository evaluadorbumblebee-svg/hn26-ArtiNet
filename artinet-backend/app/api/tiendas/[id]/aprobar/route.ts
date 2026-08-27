import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

type Accion = 'aprobar' | 'suspender' | 'reactivar'

// Transiciones válidas de la máquina de estados de una tienda
const TRANSICIONES: Record<Accion, { desde: string[]; hasta: string }> = {
  aprobar: { desde: ['pendiente'], hasta: 'activa' },
  suspender: { desde: ['activa'], hasta: 'suspendida' },
  reactivar: { desde: ['suspendida'], hasta: 'activa' },
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()
  if (auth.perfil?.rol !== 'administrador') return errors.forbidden()

  const supabase = await createClient()

  const { data: tienda, error } = await supabase
    .from('tiendas')
    .select('id, propietario_id, nombre, estado')
    .eq('id', id)
    .maybeSingle()

  if (error) return errors.server(error.message)
  if (!tienda) return errors.notFound('Tienda no encontrada.')

  const body = await request.json()
  const { accion, observaciones } = body as { accion: Accion; observaciones?: string }

  if (!accion || !TRANSICIONES[accion]) {
    return errors.validation("accion debe ser 'aprobar', 'suspender' o 'reactivar'.")
  }

  const transicion = TRANSICIONES[accion]
  if (!transicion.desde.includes(tienda.estado)) {
    return errors.validation(
      `No se puede ${accion} una tienda en estado '${tienda.estado}'. Estados válidos: ${transicion.desde.join(', ')}.`
    )
  }

  const updates: Record<string, unknown> = {
    estado: transicion.hasta,
    activo: transicion.hasta === 'activa',
    updated_at: new Date().toISOString(),
  }

  if (accion === 'aprobar') {
    updates.fecha_aprobacion = new Date().toISOString()
    updates.aprobado_por = auth.user.id
  }

  const { data: actualizada, error: updateError } = await supabase
    .from('tiendas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (updateError) return errors.server(updateError.message)

  const mensajes: Record<Accion, string> = {
    aprobar: `¡Felicidades! Tu tienda "${tienda.nombre}" fue aprobada y ya está activa.`,
    suspender: `Tu tienda "${tienda.nombre}" fue suspendida.${observaciones ? ` Motivo: ${observaciones}` : ''}`,
    reactivar: `Tu tienda "${tienda.nombre}" fue reactivada y vuelve a estar visible.`,
  }

  await supabase.from('notificaciones').insert({
    usuario_id: tienda.propietario_id,
    titulo: 'Actualización del estado de tu tienda',
    mensaje: mensajes[accion],
    enlace: `/vendedor/tienda`,
    leida: false,
  })

  return ok(actualizada)
}