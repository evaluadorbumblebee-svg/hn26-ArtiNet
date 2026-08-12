import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)

  const { page, pageSize, sortBy, sortOrder, from, to } =
    parsePagination(searchParams)

  let query = supabase
    .from('bancos')
    .select('*', { count: 'exact' })

  const activo = searchParams.get('activo')
  const q = searchParams.get('q')

  if (activo !== null) {
    query = query.eq('activo', activo === 'true')
  }

  if (q) {
    query = query.ilike('nombre', `%${q}%`)
  }

  const allowedSortFields = [
    'id',
    'nombre',
    'activo',
  ]

  const finalSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'id'

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