import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ok, errors } from '@/lib/responses'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')

  if (!q || q.trim().length < 2) {
    return errors.validation('El parámetro q debe tener al menos 2 caracteres.')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select('*, imagenes(id, url, principal, orden)')
    .eq('activo', true)
    .ilike('nombre', `%${q.trim()}%`)

  if (error) {
    return errors.server(error.message)
  }

  return ok(data)
}
