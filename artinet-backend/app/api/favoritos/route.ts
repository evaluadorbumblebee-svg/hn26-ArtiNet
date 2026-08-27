import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return errors.unauthorized()
  }

  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)

  const allowedSortFields = ['id', 'created_at']
  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at'

  const { data, error, count } = await supabase
    .from('favoritos')
    .select('*, productos(*)', { count: 'exact' })
    .eq('usuario_id', user.id)
    .order(finalSortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) {
    return errors.server(error.message)
  }

  return ok(data, 200, {
    page,
    pageSize,
    total: count,
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return errors.unauthorized()
  }

  const body = await request.json()
  const { producto_id } = body

  if (!producto_id || !/^\d+$/.test(String(producto_id))) {
    return errors.validation('producto_id es requerido y debe ser numérico.')
  }

  const { data: existente } = await supabase
    .from('favoritos')
    .select('id')
    .eq('usuario_id', user.id)
    .eq('producto_id', producto_id)
    .maybeSingle()

  if (existente) {
    return ok(existente, 200)
  }

  const { data, error } = await supabase
    .from('favoritos')
    .insert({ usuario_id: user.id, producto_id })
    .select()
    .single()

  if (error) {
    return errors.server(error.message)
  }

  return ok(data, 201)
}