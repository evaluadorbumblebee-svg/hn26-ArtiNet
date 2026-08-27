import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)

  let query = supabase.from('solicitudes_vendedor').select('*', { count: 'exact' })

  const isAdmin = auth.perfil?.rol === 'administrador'

  if (isAdmin) {
    const estado = searchParams.get('estado')
    if (estado) query = query.eq('estado', estado)
  } else {
    // Un usuario normal solo ve sus propias postulaciones
    query = query.eq('usuario_id', auth.user.id)
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)
  return ok(data, 200, { page, pageSize, total: count })
}

// El usuario postula para convertirse en vendedor
export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  if (auth.perfil?.rol === 'vendedor') {
    return errors.validation('Ya eres vendedor.')
  }
  if (auth.perfil?.rol === 'administrador') {
    return errors.validation('Los administradores no necesitan postular.')
  }

  const supabase = await createClient()

  // Evitar postulaciones duplicadas mientras haya una pendiente
  const { data: pendiente } = await supabase
    .from('solicitudes_vendedor')
    .select('id')
    .eq('usuario_id', auth.user.id)
    .eq('estado', 'pendiente')
    .maybeSingle()

  if (pendiente) {
    return errors.conflict('Ya tienes una postulación pendiente de revisión.')
  }

  const body = await request.json()
  const { descripcion } = body

  if (!descripcion || descripcion.trim().length < 10) {
    return errors.validation('descripcion debe tener al menos 10 caracteres.')
  }

  const { data, error } = await supabase
    .from('solicitudes_vendedor')
    .insert({
      usuario_id: auth.user.id,
      descripcion,
      estado: 'pendiente',
    })
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data, 201)
}