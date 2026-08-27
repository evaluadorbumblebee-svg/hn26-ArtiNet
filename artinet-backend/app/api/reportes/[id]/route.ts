import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

const ESTADOS_VALIDOS = ['pendiente', 'en_revision', 'resuelto', 'descartado']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: reporte, error } = await supabase
    .from('reportes')
    .select(`
      *,
      productos ( id, nombre, slug ),
      tiendas ( id, nombre, slug )
    `)
    .eq('id', id)
    .maybeSingle()

  if (error) return errors.server(error.message)
  if (!reporte) return errors.notFound('Reporte no encontrado.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isDueno = reporte.usuario_id === auth.user.id
  if (!isAdmin && !isDueno) return errors.forbidden()

  return ok(reporte)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  if (auth.perfil?.rol !== 'administrador') return errors.forbidden()

  const supabase = await createClient()

  const { data: reporte } = await supabase
    .from('reportes')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (!reporte) return errors.notFound('Reporte no encontrado.')

  const body = await request.json()
  const { estado, descripcion } = body

  if (!estado) return errors.validation('estado es requerido.')
  if (!ESTADOS_VALIDOS.includes(estado)) {
    return errors.validation(`estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`)
  }

  const updates: Record<string, unknown> = {
    estado,
    revisado_por: auth.user.id,
    fecha_revision: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (descripcion !== undefined) updates.descripcion = descripcion

  const { data, error } = await supabase
    .from('reportes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data)
}