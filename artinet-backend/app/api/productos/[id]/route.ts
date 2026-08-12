import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const query = supabase.from('productos').select('*')
  const { data, error } = UUID_REGEX.test(id)
    ? await query.eq('id', id).single()
    : await query.eq('slug', id).single()

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 404 })
  }

  return NextResponse.json({ ok: true, data })
}