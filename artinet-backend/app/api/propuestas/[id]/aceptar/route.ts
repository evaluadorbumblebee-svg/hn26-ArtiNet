import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

// Trae la propuesta junto con su tienda y la solicitud del cliente para validar propiedad
async function getPropuestaConTiendaYSolicitud(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('propuestas_solicitud')
    .select('*, tiendas ( propietario_id ), solicitudes_cliente ( id, cliente_id, estado )')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  let propuesta
  try {
    propuesta = await getPropuestaConTiendaYSolicitud(supabase, id)
  } catch (error: any) {
    return errors.server(error.message)
  }
  if (!propuesta) return errors.notFound('Propuesta no encontrada.')

  const solicitud = propuesta.solicitudes_cliente
  const isAdmin = auth.perfil?.rol === 'administrador'
  const isVendedor = propuesta.tiendas?.propietario_id === auth.user.id

  // Solo la tienda dueña de la propuesta (o un admin) puede aceptarla
  if (!isAdmin && !isVendedor) return errors.forbidden()

  if (propuesta.estado !== 'pendiente') {
    return errors.validation('Esta propuesta ya fue procesada y no se puede aceptar.')
  }

  if (solicitud?.estado === 'cerrada') {
    return errors.validation('La solicitud ya fue cerrada con otra propuesta.')
  }

  // Aceptar esta propuesta
  const { data: propuestaAceptada, error: updateError } = await supabase
    .from('propuestas_solicitud')
    .update({ estado: 'aceptada', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (updateError) return errors.server(updateError.message)

  // Rechazar automáticamente el resto de propuestas de la misma solicitud
  const { error: rechazarError } = await supabase
    .from('propuestas_solicitud')
    .update({ estado: 'rechazada', updated_at: new Date().toISOString() })
    .eq('solicitud_id', propuesta.solicitud_id)
    .neq('id', id)
    .eq('estado', 'pendiente')

  if (rechazarError) return errors.server(rechazarError.message)

  // Cerrar la solicitud del cliente
  const { error: solicitudError } = await supabase
    .from('solicitudes_cliente')
    .update({ estado: 'cerrada', updated_at: new Date().toISOString() })
    .eq('id', propuesta.solicitud_id)

  if (solicitudError) return errors.server(solicitudError.message)

  return ok(propuestaAceptada)
}