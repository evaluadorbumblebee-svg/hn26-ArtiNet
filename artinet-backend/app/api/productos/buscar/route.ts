import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

const ORDENES_VALIDOS = [
  'relevancia',
  'mas_recientes',
  'mas_vendidos',
  'mejor_calificados',
  'precio_asc',
  'precio_desc',
] as const

type OrdenProducto = (typeof ORDENES_VALIDOS)[number]

type ProductoBusqueda = {
  id: number
  tienda_id: number
  categoria_id: number
  nombre: string
  slug: string
  descripcion: string | null
  material: string | null
  peso: number | null
  largo: number | null
  ancho: number | null
  alto: number | null
  estado: string
  destacado: boolean
  calificacion: number
  total_ventas: number
  visitas: number
  favoritos: number
  activo: boolean
  created_at: string
  updated_at: string
  tienda_nombre: string | null
  categoria_nombre: string | null
  precio_minimo: number | null
  precio_maximo: number | null
  disponible: boolean
  imagen_principal: string | null
  total_count: number
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)

    const { page, pageSize } = parsePagination(searchParams)

    // =========================================================
    // BÚSQUEDA
    // =========================================================

    const q = searchParams.get('q')?.trim() || null

    // =========================================================
    // FILTROS
    // =========================================================

    const categoriaIdParam = searchParams.get('categoria_id')
    const tiendaIdParam = searchParams.get('tienda_id')

    const precioMinParam = searchParams.get('precio_min')
    const precioMaxParam = searchParams.get('precio_max')

    const calificacionMinParam =
      searchParams.get('calificacion_min')

    const destacadoParam = searchParams.get('destacado')
    const disponibleParam = searchParams.get('disponible')

    // =========================================================
    // CONVERSIONES SEGURAS
    // =========================================================

    const categoriaId = categoriaIdParam
      ? Number(categoriaIdParam)
      : null

    const tiendaId = tiendaIdParam
      ? Number(tiendaIdParam)
      : null

    const precioMin = precioMinParam
      ? Number(precioMinParam)
      : null

    const precioMax = precioMaxParam
      ? Number(precioMaxParam)
      : null

    const calificacionMin = calificacionMinParam
      ? Number(calificacionMinParam)
      : null

    // =========================================================
    // VALIDACIONES
    // =========================================================

    if (
      categoriaId !== null &&
      (!Number.isInteger(categoriaId) || categoriaId <= 0)
    ) {
      return errors.validation(
        'categoria_id debe ser un número válido.'
      )
    }

    if (
      tiendaId !== null &&
      (!Number.isInteger(tiendaId) || tiendaId <= 0)
    ) {
      return errors.validation(
        'tienda_id debe ser un número válido.'
      )
    }

    if (
      precioMin !== null &&
      (!Number.isFinite(precioMin) || precioMin < 0)
    ) {
      return errors.validation(
        'precio_min debe ser un número válido.'
      )
    }

    if (
      precioMax !== null &&
      (!Number.isFinite(precioMax) || precioMax < 0)
    ) {
      return errors.validation(
        'precio_max debe ser un número válido.'
      )
    }

    if (
      precioMin !== null &&
      precioMax !== null &&
      precioMin > precioMax
    ) {
      return errors.validation(
        'precio_min no puede ser mayor que precio_max.'
      )
    }

    if (
      calificacionMin !== null &&
      (
        !Number.isFinite(calificacionMin) ||
        calificacionMin < 0 ||
        calificacionMin > 5
      )
    ) {
      return errors.validation(
        'calificacion_min debe estar entre 0 y 5.'
      )
    }

    // =========================================================
    // BOOLEANOS
    // =========================================================

    let destacado: boolean | null = null

    if (destacadoParam !== null) {
      if (
        destacadoParam !== 'true' &&
        destacadoParam !== 'false'
      ) {
        return errors.validation(
          'destacado debe ser true o false.'
        )
      }

      destacado = destacadoParam === 'true'
    }

    let disponible: boolean | null = null

    if (disponibleParam !== null) {
      if (
        disponibleParam !== 'true' &&
        disponibleParam !== 'false'
      ) {
        return errors.validation(
          'disponible debe ser true o false.'
        )
      }

      disponible = disponibleParam === 'true'
    }

    // =========================================================
    // ORDENAMIENTO
    // =========================================================

    const ordenarParam = searchParams.get('ordenar')

    const ordenar: OrdenProducto =
      ordenarParam &&
      (ORDENES_VALIDOS as readonly string[]).includes(
        ordenarParam
      )
        ? (ordenarParam as OrdenProducto)
        : 'relevancia'

    // =========================================================
    // AUTENTICACIÓN
    // =========================================================

    const auth = await getAuthUser()

    const esAdmin =
      auth?.perfil?.rol === 'administrador'

    // Solo administrador puede consultar estado
    // y productos inactivos.
    const estado = esAdmin
      ? searchParams.get('estado')
      : null

    // =========================================================
    // PAGINACIÓN
    // =========================================================

    const offset = (page - 1) * pageSize

    // =========================================================
    // RPC
    // =========================================================

    const { data, error } = await supabase.rpc(
      'buscar_productos',
      {
        p_q: q,

        p_categoria_id:
          categoriaId,

        p_tienda_id:
          tiendaId,

        p_precio_min:
          precioMin,

        p_precio_max:
          precioMax,

        p_calificacion_min:
          calificacionMin,

        p_destacado:
          destacado,

        p_disponible:
          disponible,

        p_estado:
          estado,

        p_incluir_inactivos:
          esAdmin,

        p_ordenar:
          ordenar,

        p_limit:
          pageSize,

        p_offset:
          offset,
      }
    )

    if (error) {
      console.error(
        'Error buscar_productos:',
        error
      )

      return errors.server(
        error.message
      )
    }

    // =========================================================
    // TIPADO DEL RESULTADO
    // =========================================================

    const resultados =
      (data ?? []) as unknown as ProductoBusqueda[]

    const total =
      resultados.length > 0
        ? Number(resultados[0].total_count)
        : 0

    // Quitamos total_count de cada producto
    const productos = resultados.map(
      ({
        total_count: _totalCount,
        ...producto
      }) => producto
    )

    return ok(
      productos,
      200,
      {
        page,
        pageSize,
        total,
        totalPages:
          Math.ceil(total / pageSize),
      }
    )
  } catch (error) {
    console.error(
      'Error inesperado GET productos:',
      error
    )

    return errors.server(
      'Ocurrió un error al buscar los productos.'
    )
  }
}