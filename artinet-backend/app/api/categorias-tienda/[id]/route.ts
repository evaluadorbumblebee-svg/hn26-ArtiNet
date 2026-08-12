import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const supabase = await createClient()

    const { id } = await params

    const categoriaId = Number(id)

    if (Number.isNaN(categoriaId)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'El ID de la categoría no es válido',
          },
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('categorias_tienda')
      .select(
        'id, nombre, descripcion, activo'
      )
      .eq('id', categoriaId)
      .single()

    if (error || !data) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Categoría de tienda no encontrada',
          },
        },
        { status: 404 }
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

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const supabase = await createClient()

    const { id } = await params

    const categoriaId = Number(id)

    if (Number.isNaN(categoriaId)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'El ID de la categoría no es válido',
          },
        },
        { status: 400 }
      )
    }

    const body = await request.json()

    const allowedFields = [
      'nombre',
      'descripcion',
      'activo',
    ]

    const updateData: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No se enviaron campos para actualizar',
          },
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('categorias_tienda')
      .update(updateData)
      .eq('id', categoriaId)
      .select(
        'id, nombre, descripcion, activo'
      )
      .single()

    if (error) {
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