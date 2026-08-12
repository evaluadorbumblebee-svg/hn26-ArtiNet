export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10) || 20))
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? true : false
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return { page, pageSize, sortBy, sortOrder, from, to }
}
