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

  let query = supabase
    .from('notificaciones')
    .select('*', { count: 'exact' })
    .eq('usuario_id', user.id)

  const leida = searchParams.get('leida')
  if (leida !== null) {
    query = query.eq('leida', leida === 'true')
  }

  const allowedSortFields = ['id', 'created_at', 'leida']
  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at'

  const { data, error, count } = await query
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