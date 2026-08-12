import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)

    const activoParam = searchParams.get('activo')
    const q = searchParams.get('q')
    const page = Number(searchParams.get('page') || 1)
    const pageSize = Number(searchParams.get('pageSize') || 20)
    const sortBy = searchParams.get('sortBy') || 'id'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const allowedSortFields = [
      'id',
      'nombre',
      'descripcion',
      'activo',
    ]

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'id'

    const ascending = sortOrder === 'asc'

    let query = supabase
      .from('categorias_tienda')
      .select(
        'id, nombre, descripcion, activo',
        {
          count: 'exact',
        }
      )

    if (activoParam !== null) {
      query = query.eq(
        'activo',
        activoParam === 'true'
      )
    }

    if (q) {
      query = query.ilike(
        'nombre',
        `%${q}%`
      )
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query
      .order(safeSortBy, { ascending })
      .range(from, to)

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
      data: data ?? [],
      meta: {
        page,
        pageSize,
        total: count ?? 0,
      },
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

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const body = await request.json()

    const {
      nombre,
      descripcion,
      activo,
    } = body

    if (!nombre) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'El nombre de la categoría es obligatorio',
          },
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('categorias_tienda')
      .insert({
        nombre,
        descripcion: descripcion ?? null,
        activo: activo ?? true,
      })
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

    return NextResponse.json(
      {
        ok: true,
        data,
      },
      { status: 201 }
    )
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