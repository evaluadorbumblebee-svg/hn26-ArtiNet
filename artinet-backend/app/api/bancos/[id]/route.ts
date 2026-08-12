import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ok, errors } from '@/lib/responses'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()

  if (!/^\d+$/.test(id)) {
    return errors.notFound('Banco no encontrado.')
  }

  const { data, error } = await supabase
    .from('bancos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return errors.notFound('Banco no encontrado.')
  }

  return ok(data)
}