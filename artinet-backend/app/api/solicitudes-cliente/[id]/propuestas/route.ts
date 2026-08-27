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

  const { data: solicitud, error: solicitudError } = await supabase
    .from('solicitudes_cliente')
    .select('id, cliente_id')
    .eq('id', id)
    .maybeSingle()

  if (solicitudError) return errors.server(solicitudError.message)
  if (!solicitud) return errors.notFound('Solicitud no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isCliente = solicitud.cliente_id === auth.user.id

  let query = supabase
    .from('propuestas_solicitud')
    .select('*, tiendas ( id, nombre, slug, logo, calificacion )')
    .eq('solicitud_id', id)

  if (isAdmin || isCliente) {
    // El dueño de la solicitud y el admin ven todas las propuestas recibidas
  } else {
    // Un vendedor solo puede ver su propia propuesta, nunca las de la competencia
    const { data: tiendas } = await supabase
      .from('tiendas')
      .select('id')
      .eq('propietario_id', auth.user.id)

    const tiendaIds = (tiendas ?? []).map((t: any) => t.id)
    if (tiendaIds.length === 0) return ok([])

    query = query.in('tienda_id', tiendaIds)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return errors.server(error.message)

  return ok(data)
}

// El vendedor (dueño de una tienda) envía una propuesta para esta solicitud del cliente
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: solicitud, error: solicitudError } = await supabase
    .from('solicitudes_cliente')
    .select('id, cliente_id, estado')
    .eq('id', id)
    .maybeSingle()

  if (solicitudError) return errors.server(solicitudError.message)
  if (!solicitud) return errors.notFound('Solicitud no encontrada.')

  if (solicitud.estado !== 'abierta') {
    return errors.validation('Esta solicitud ya no acepta nuevas propuestas.')
  }

  if (solicitud.cliente_id === auth.user.id) {
    return errors.validation('No puedes proponer en tu propia solicitud.')
  }

  // Se deriva la tienda del propio vendedor autenticado; nunca se confía en un tienda_id externo
  const { data: tiendas, error: tiendasError } = await supabase
    .from('tiendas')
    .select('id')
    .eq('propietario_id', auth.user.id)
    .eq('activo', true)

  if (tiendasError) return errors.server(tiendasError.message)
  if (!tiendas || tiendas.length === 0) {
    return errors.forbidden()
  }

  const body = await request.json()
  const { tienda_id, descripcion, monto, moneda_id, tiempo_entrega, observaciones } = body

  let tiendaSeleccionada = tiendas[0].id
  if (tienda_id) {
    const esPropia = tiendas.some((t: any) => t.id === Number(tienda_id))
    if (!esPropia) return errors.forbidden()
    tiendaSeleccionada = tienda_id
  } else if (tiendas.length > 1) {
    return errors.validation('Tienes varias tiendas; especifica con cuál tienda_id vas a proponer.')
  }

  if (!descripcion || !descripcion.trim()) return errors.validation('descripcion es requerida.')
  if (!monto || Number(monto) <= 0) return errors.validation('monto debe ser mayor a 0.')
  if (!moneda_id) return errors.validation('moneda_id es requerido.')

  // Evitar que la misma tienda proponga dos veces a la misma solicitud
  const { data: existente } = await supabase
    .from('propuestas_solicitud')
    .select('id')
    .eq('solicitud_id', id)
    .eq('tienda_id', tiendaSeleccionada)
    .maybeSingle()

  if (existente) return errors.conflict('Ya enviaste una propuesta para esta solicitud.')

  const { data: propuesta, error: propuestaError } = await supabase
    .from('propuestas_solicitud')
    .insert({
      solicitud_id: id,
      tienda_id: tiendaSeleccionada,
      descripcion,
      monto,
      moneda_id,
      tiempo_entrega: tiempo_entrega ?? null,
      observaciones: observaciones ?? null,
      estado: 'pendiente',
    })
    .select()
    .single()

  if (propuestaError) return errors.server(propuestaError.message)

  // Notificar al cliente que recibió una nueva propuesta
  await supabase.from('notificaciones').insert({
    usuario_id: solicitud.cliente_id,
    titulo: 'Nueva propuesta recibida',
    mensaje: 'Un vendedor envió una propuesta para tu solicitud.',
    enlace: `/solicitudes/${id}/propuestas`,
    leida: false,
  })

  return ok(propuesta, 201)
}