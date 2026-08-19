import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { ok, errors } from '@/lib/responses'

// Estados de pedido que habilitan dejar una reseña
const ESTADOS_PEDIDO_PERMITIDOS = ['entregado']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('resenas')
    .select(
      `
      id,
      calificacion,
      comentario,
      created_at,
      updated_at,
      usuario_id,
      pedido_id,
      perfiles!resenas_usuario_id_fkey (
        nombres,
        apellidos,
        foto
      )
      `
    )
    .eq('producto_id', id)
    .order('created_at', { ascending: false })

  if (error) {
    return errors.server(error.message)
  }

  return ok(data)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: producto_id } = await params

  /*
   * 1. Autenticación
   *
   * El usuario_id de la reseña SIEMPRE sale de la sesión,
   * nunca del body — así evitamos que alguien cree reseñas
   * a nombre de otro usuario.
   */
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return errors.unauthorized()
  }

  /*
   * 2. Body
   */
  const body = await request.json()

  const { pedido_id, calificacion, comentario } = body as {
    pedido_id?: string
    calificacion?: number
    comentario?: string
  }

  if (!pedido_id) {
    return errors.validation('Falta el campo "pedido_id".')
  }

  if (
    typeof calificacion !== 'number' ||
    !Number.isInteger(calificacion) ||
    calificacion < 1 ||
    calificacion > 5
  ) {
    return errors.validation('"calificacion" debe ser un entero entre 1 y 5.')
  }

  /*
   * SOLO PARA PRUEBAS LOCALES
   *
   * Usa SUPABASE_SERVICE_ROLE_KEY para evitar RLS al hacer
   * el inner join de verificación de compra.
   * Esta clave NUNCA debe llegar al navegador.
   */
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  /*
   * 3. Verificar con INNER JOIN que:
   *    - el pedido existe y es del usuario autenticado
   *    - el pedido efectivamente contiene el producto
   *      (pedidos -> detalle_pedido -> variantes_producto -> productos)
   *    - el pedido ya fue entregado
   *
   * Si cualquiera de estas condiciones falla, la fila
   * simplemente no aparece (inner join la descarta),
   * así que no hace falta lógica extra: si no hay data,
   * no hay permiso para reseñar.
   */
  const { data: pedido, error: pedidoError } = await supabaseAdmin
    .from('pedidos')
    .select(
      `
      id,
      cliente_id,
      tienda_id,
      estado,
      detalle_pedido!inner (
        variante_id,
        variantes_producto!inner (
          producto_id
        )
      )
      `
    )
    .eq('id', pedido_id)
    .eq('cliente_id', user.id)
    .eq('detalle_pedido.variantes_producto.producto_id', producto_id)
    .single()

  if (pedidoError || !pedido) {
    return errors.validation(
      'No se encontró un pedido tuyo que contenga este producto.'
    )
  }

  if (!ESTADOS_PEDIDO_PERMITIDOS.includes(pedido.estado)) {
    return errors.validation(
      'Solo puedes reseñar productos de pedidos ya entregados.'
    )
  }

  /*
   * 4. Evitar reseñas duplicadas del mismo pedido/producto/usuario
   */
  const { data: resenaExistente, error: existenteError } =
    await supabaseAdmin
      .from('resenas')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('producto_id', producto_id)
      .eq('pedido_id', pedido_id)
      .maybeSingle()

  if (existenteError) {
    return errors.server(existenteError.message)
  }

  if (resenaExistente) {
    return errors.validation('Ya dejaste una reseña para este producto en este pedido.')
  }

  /*
   * 5. Crear la reseña
   *
   * tienda_id sale del pedido verificado en el join anterior,
   * no del body, para que quede consistente con el pedido real.
   */
  const { data, error } = await supabaseAdmin
    .from('resenas')
    .insert({
      usuario_id: user.id,
      pedido_id,
      producto_id,
      tienda_id: pedido.tienda_id,
      calificacion,
      comentario: comentario ?? null,
    })
    .select()
    .single()

  if (error) {
    return errors.server(error.message)
  }

  /*
   * 6. (Opcional) recalcular calificación promedio del producto
   */
  const { data: resenasProducto } = await supabaseAdmin
    .from('resenas')
    .select('calificacion')
    .eq('producto_id', producto_id)

  if (resenasProducto && resenasProducto.length > 0) {
    const promedio =
      resenasProducto.reduce((acc, r) => acc + r.calificacion, 0) /
      resenasProducto.length

    await supabaseAdmin
      .from('productos')
      .update({ calificacion: Number(promedio.toFixed(2)) })
      .eq('id', producto_id)
  }

  return ok(data, 201)
}