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

  let query = supabase.from('reportes').select('*', { count: 'exact' })

  const isAdmin = auth.perfil?.rol === 'administrador'

  if (isAdmin) {
    const estado = searchParams.get('estado')
    const producto_id = searchParams.get('producto_id')
    const tienda_id = searchParams.get('tienda_id')

    if (estado) query = query.eq('estado', estado)
    if (producto_id) query = query.eq('producto_id', producto_id)
    if (tienda_id) query = query.eq('tienda_id', tienda_id)
  } else {
    // Un usuario normal solo ve los reportes que él mismo hizo
    query = query.eq('usuario_id', auth.user.id)
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)
  return ok(data, 200, { page, pageSize, total: count })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const body = await request.json()
  const { producto_id, tienda_id, motivo, descripcion } = body

  if (!producto_id && !tienda_id) {
    return errors.validation('Debes indicar producto_id o tienda_id.')
  }
  if (producto_id && tienda_id) {
    return errors.validation('Solo puedes reportar un producto o una tienda a la vez, no ambos.')
  }
  if (!motivo || !motivo.trim()) return errors.validation('motivo es requerido.')

  const supabase = await createClient()

  // Validar que el producto o la tienda existan
  if (producto_id) {
    const { data: producto } = await supabase
      .from('productos')
      .select('id')
      .eq('id', producto_id)
      .maybeSingle()
    if (!producto) return errors.notFound('Producto no encontrado.')
  }

  if (tienda_id) {
    const { data: tienda } = await supabase
      .from('tiendas')
      .select('id')
      .eq('id', tienda_id)
      .maybeSingle()
    if (!tienda) return errors.notFound('Tienda no encontrada.')
  }

  const { data, error } = await supabase
    .from('reportes')
    .insert({
      usuario_id: auth.user.id,
      producto_id: producto_id ?? null,
      tienda_id: tienda_id ?? null,
      motivo,
      descripcion: descripcion ?? null,
      estado: 'pendiente',
    })
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data, 201)
}