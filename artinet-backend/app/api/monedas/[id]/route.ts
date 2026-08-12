import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('monedas')
    .select('id, nombre, codigo, simbolo, activo')
    .order('nombre', { ascending: true })

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 200 }
  )
}