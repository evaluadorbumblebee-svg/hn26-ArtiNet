import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

async function getPropuestaConTienda(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('propuestas_solicitud')
    .select('*, tiendas ( propietario_id )')
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
    propuesta = await getPropuestaConTienda(supabase, id)
  } catch (error: any) {
    return errors.server(error.message)
  }
  if (!propuesta) return errors.notFound('Propuesta no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isVendedor = propuesta.tiendas?.propietario_id === auth.user.id

  // Solo la tienda dueña de la propuesta (o un admin) puede rechazarla
  if (!isAdmin && !isVendedor) return errors.forbidden()

  if (propuesta.estado !== 'pendiente') {
    return errors.validation('Esta propuesta ya fue procesada y no se puede rechazar.')
  }

  const body = await request.json().catch(() => ({}))
  const { observaciones } = body

  const { data, error } = await supabase
    .from('propuestas_solicitud')
    .update({
      estado: 'rechazada',
      observaciones: observaciones ?? propuesta.observaciones,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data)
}