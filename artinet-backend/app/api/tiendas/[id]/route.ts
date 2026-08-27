import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

const NUMERIC_REGEX = /^\d+$/

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  let query = supabase.from('tiendas').select('*')
  query = NUMERIC_REGEX.test(id) ? query.eq('id', id) : query.eq('slug', id)

  const { data, error } = await query.maybeSingle()

  if (error) return errors.server(error.message)
  if (!data) return errors.notFound('Tienda no encontrada.')

  return ok(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: tienda } = await supabase
    .from('tiendas')
    .select('propietario_id')
    .eq('id', id)
    .maybeSingle()

  if (!tienda) return errors.notFound('Tienda no encontrada.')

  const isOwner = tienda.propietario_id === auth.user.id
  const isAdmin = auth.perfil?.rol === 'administrador'
  if (!isOwner && !isAdmin) return errors.forbidden()

  const body = await request.json()
  const allowedDueno = [
    'categoria_id', 'nombre', 'slug', 'descripcion', 'logo', 'banner',
    'pais', 'departamento', 'ciudad', 'direccion', 'ruc', 'tipo_negocio', 'horario',
    'telefono', 'whatsapp', 'email', 'facebook', 'instagram', 'sitio_web',
  ]
  // Solo el admin puede tocar la comisión de la plataforma; el estado se maneja en /aprobar
  const allowedAdmin = [...allowedDueno, 'porcentaje_comision']

  const allowed = isAdmin ? allowedAdmin : allowedDueno

  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  if (Object.keys(updates).length === 0) {
    return errors.validation('No se enviaron campos para actualizar.')
  }

  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('tiendas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data)
}