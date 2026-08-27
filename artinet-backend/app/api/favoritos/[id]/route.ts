import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ok, errors } from '@/lib/responses'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return errors.validation('No autenticado.')
  }

  if (!/^\d+$/.test(id)) {
    return errors.validation('Id de producto inválido.')
  }

  const { data, error } = await supabase
    .from('favoritos')
    .select('id')
    .eq('usuario_id', user.id)
    .eq('producto_id', id)
    .maybeSingle()

  if (error) {
    return errors.server(error.message)
  }

  return ok({ favorito: !!data, id: data?.id ?? null })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return errors.unauthorized()
  }

  if (!/^\d+$/.test(id)) {
    return errors.validation('Id de producto inválido.')
  }

  const { error } = await supabase
    .from('favoritos')
    .delete()
    .eq('usuario_id', user.id)
    .eq('producto_id', id)

  if (error) {
    return errors.server(error.message)
  }

  return ok({ eliminado: true })
}