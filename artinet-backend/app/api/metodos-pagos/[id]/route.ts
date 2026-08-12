import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const supabase = await createClient()

    const { id } = await context.params

    const metodoPagoId = Number(id)

    if (!Number.isInteger(metodoPagoId)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'INVALID_ID',
            message: 'El ID del método de pago no es válido',
          },
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('metodos_pago')
      .select('id, nombre, descripcion, activo')
      .eq('id', metodoPagoId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Método de pago no encontrado',
            },
          },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'DATABASE_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      data,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Error interno del servidor',
        },
      },
      { status: 500 }
    )
  }
}