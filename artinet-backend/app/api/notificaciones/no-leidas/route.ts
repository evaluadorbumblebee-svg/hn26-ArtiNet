import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ok, errors } from '@/lib/responses'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return errors.unauthorized('No autenticado.')
  }

  const { count, error } = await supabase
    .from('notificaciones')
    .select('*', { count: 'exact', head: true })
    .eq('usuario_id', user.id)
    .eq('leida', false)

  if (error) {
    return errors.server(error.message)
  }

  return ok({ noLeidas: count ?? 0 })
}
