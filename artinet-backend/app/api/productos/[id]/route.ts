import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

// ================= GET: obtener producto por ID =================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      imagenes(
        id,
        url,
        principal,
        orden,
        variante_id,
        created_at
      ),
      variantes_producto(
        id,
        color,
        talla,
        sku,
        precio,
        stock,
        activo
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return errors.notFound('Producto no encontrado.')
  }

  return ok(data)
}

// ================= PUT: actualizar producto =================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = await getAuthUser()

  if (!auth) {
    return errors.unauthorized()
  }

  const supabase = await createClient()

  // ---------- 1. Buscar producto y propietario ----------
  const { data: productoExistente, error: errorFind } = await supabase
    .from('productos')
    .select(`
      id,
      tienda_id,
      tiendas!inner(propietario_id)
    `)
    .eq('id', id)
    .single()

  if (errorFind || !productoExistente) {
    return errors.notFound('Producto no encontrado.')
  }

  const propietarioId = (productoExistente as any).tiendas?.propietario_id

  // El propietario o administrador puede modificar
  if (
    propietarioId !== auth.user.id &&
    auth.perfil.rol !== 'administrador'
  ) {
    return errors.forbidden()
  }

  // ---------- 2. Leer FormData ----------
  const formData = await request.formData()

  // ---------- 3. Actualizar datos principales ----------
  const camposPermitidos = [
    'categoria_id',
    'nombre',
    'slug',
    'descripcion',
    'material',
    'peso',
    'largo',
    'ancho',
    'alto',
    'estado',
    'destacado',
    'activo',
  ]

  const updateData: Record<string, any> = {}

  for (const campo of camposPermitidos) {
    const valor = formData.get(campo)

    if (valor === null) continue

    if (['peso', 'largo', 'ancho', 'alto'].includes(campo)) {
      const numero = Number(valor)

      if (Number.isNaN(numero)) {
        return errors.validation(`${campo} debe ser un número válido.`)
      }

      updateData[campo] = numero
    } else if (['destacado', 'activo'].includes(campo)) {
      updateData[campo] = valor === 'true'
    } else {
      updateData[campo] = String(valor)
    }
  }

  updateData.updated_at = new Date().toISOString()

  // ---------- 4. Validar categoría si viene ----------
  if (updateData.categoria_id) {
    const { data: categoriaExiste } = await supabase
      .from('categorias_producto')
      .select('id')
      .eq('id', updateData.categoria_id)
      .eq('activo', true)
      .single()

    if (!categoriaExiste) {
      return errors.validation(
        'La categoria seleccionada no existe o está inactiva.'
      )
    }
  }

  // ---------- 5. Validar nombre ----------
  if (
    updateData.nombre !== undefined &&
    String(updateData.nombre).trim().length < 2
  ) {
    return errors.validation(
      'nombre debe tener al menos 2 caracteres.'
    )
  }

  if (updateData.nombre !== undefined) {
    updateData.nombre = String(updateData.nombre).trim()
  }

  // ---------- 6. Actualizar producto ----------
  if (Object.keys(updateData).length > 0) {
    const { error: errorUpdate } = await supabase
      .from('productos')
      .update(updateData)
      .eq('id', id)

    if (errorUpdate) {
      if (errorUpdate.code === '23505') {
        return errors.conflict(
          'El slug ya existe, prueba con otro nombre.'
        )
      }

      return errors.server(errorUpdate.message)
    }
  }

  // ============================================================
  // 7. ACTUALIZAR / CREAR VARIANTES
  // ============================================================

  const variantesRaw = formData.get('variantes') as string | null

  if (variantesRaw) {
    let variantes: Array<{
      id?: string
      color?: string
      talla?: string
      sku: string
      precio: number
      stock: number
      activo?: boolean
    }>

    try {
      variantes = JSON.parse(variantesRaw)
    } catch {
      return errors.validation(
        'El campo variantes debe ser un JSON válido.'
      )
    }

    if (!Array.isArray(variantes)) {
      return errors.validation(
        'El campo variantes debe ser un arreglo.'
      )
    }

    for (const [i, variante] of variantes.entries()) {
      if (!variante.sku) {
        return errors.validation(
          `variantes[${i}].sku es requerido.`
        )
      }

      if (
        variante.precio === undefined ||
        Number(variante.precio) < 0
      ) {
        return errors.validation(
          `variantes[${i}].precio es inválido.`
        )
      }

      if (
        variante.stock === undefined ||
        Number(variante.stock) < 0
      ) {
        return errors.validation(
          `variantes[${i}].stock es inválido.`
        )
      }
    }

    // Obtener variantes actuales
    const { data: variantesActuales, error: errorVariantesActuales } =
      await supabase
        .from('variantes_producto')
        .select('id')
        .eq('producto_id', id)

    if (errorVariantesActuales) {
      return errors.server(errorVariantesActuales.message)
    }

    const idsEnviados = variantes
      .filter((v) => v.id)
      .map((v) => v.id as string)

    // ---------- Eliminar variantes que ya no vienen ----------
    const idsParaEliminar = (variantesActuales ?? [])
      .map((v) => v.id)
      .filter((variantId) => !idsEnviados.includes(variantId))

    if (idsParaEliminar.length > 0) {
      // Primero eliminar imágenes de esas variantes
      await supabase
        .from('imagenes')
        .delete()
        .in('variante_id', idsParaEliminar)

      const { error: errorDeleteVariantes } = await supabase
        .from('variantes_producto')
        .delete()
        .in('id', idsParaEliminar)
        .eq('producto_id', id)

      if (errorDeleteVariantes) {
        return errors.server(
          errorDeleteVariantes.message
        )
      }
    }

    // ---------- Crear / actualizar variantes ----------
    for (const variante of variantes) {
      const varianteData = {
        producto_id: id,
        color: variante.color?.trim() || null,
        talla: variante.talla?.trim() || null,
        sku: variante.sku.trim(),
        precio: Number(variante.precio),
        stock: Number(variante.stock),
        activo: variante.activo ?? true,
      }

      if (variante.id) {
        const { error: errorVariante } = await supabase
          .from('variantes_producto')
          .update(varianteData)
          .eq('id', variante.id)
          .eq('producto_id', id)

        if (errorVariante) {
          if (errorVariante.code === '23505') {
            return errors.conflict(
              `El SKU ${variante.sku} ya existe.`
            )
          }

          return errors.server(errorVariante.message)
        }
      } else {
        const { error: errorVariante } = await supabase
          .from('variantes_producto')
          .insert(varianteData)

        if (errorVariante) {
          if (errorVariante.code === '23505') {
            return errors.conflict(
              `El SKU ${variante.sku} ya existe.`
            )
          }

          return errors.server(errorVariante.message)
        }
      }
    }
  }

  // ============================================================
  // 8. SUBIR IMÁGENES GENERALES
  // ============================================================

  const filesGenerales = formData.getAll('imagenes') as File[]

  if (filesGenerales.length > 0) {
    const { count: totalImagenes } = await supabase
      .from('imagenes')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('producto_id', id)
      .is('variante_id', null)

    const ordenInicial = totalImagenes ?? 0

    const imagenesInsert: Array<{
      producto_id: string
      variante_id: string | null
      url: string
      principal: boolean
      orden: number
    }> = []

    for (let i = 0; i < filesGenerales.length; i++) {
      const file = filesGenerales[i]

      if (!file || file.size === 0) continue

      const fileExt =
        file.name.split('.').pop()?.toLowerCase() || 'jpg'

      const filePath =
        `productos/${id}/general-${Date.now()}-${i}.${fileExt}`

      const { error: errorUpload } = await supabase.storage
        .from('imagenes')
        .upload(filePath, file)

      if (errorUpload) {
        return errors.server(
          `Error subiendo imagen general: ${errorUpload.message}`
        )
      }

      const { data: urlData } = supabase.storage
        .from('imagenes')
        .getPublicUrl(filePath)

      imagenesInsert.push({
        producto_id: id,
        variante_id: null,
        url: urlData.publicUrl,
        principal: ordenInicial === 0 && i === 0,
        orden: ordenInicial + i,
      })
    }

    if (imagenesInsert.length > 0) {
      const { error: errorImagenes } = await supabase
        .from('imagenes')
        .insert(imagenesInsert)

      if (errorImagenes) {
        return errors.server(errorImagenes.message)
      }
    }
  }

  // ============================================================
  // 9. SUBIR IMÁGENES POR VARIANTE
  // ============================================================

  // Primero obtenemos las variantes actuales para poder
  // relacionar imagen_variante_0, imagen_variante_1, etc.
  const { data: variantesParaImagenes, error: errorVariantes } =
    await supabase
      .from('variantes_producto')
      .select('id')
      .eq('producto_id', id)
      .order('id')

  if (errorVariantes) {
    return errors.server(errorVariantes.message)
  }

  if (variantesParaImagenes) {
    for (
      let vIndex = 0;
      vIndex < variantesParaImagenes.length;
      vIndex++
    ) {
      const varianteId = variantesParaImagenes[vIndex].id

      const filesVariante = formData.getAll(
        `imagen_variante_${vIndex}`
      ) as File[]

      if (filesVariante.length === 0) continue

      const { count: totalImagenesVariante } =
        await supabase
          .from('imagenes')
          .select('id', {
            count: 'exact',
            head: true,
          })
          .eq('producto_id', id)
          .eq('variante_id', varianteId)

      const ordenInicial = totalImagenesVariante ?? 0

      const imagenesVarianteInsert: Array<{
        producto_id: string
        variante_id: string
        url: string
        principal: boolean
        orden: number
      }> = []

      for (let i = 0; i < filesVariante.length; i++) {
        const file = filesVariante[i]

        if (!file || file.size === 0) continue

        const fileExt =
          file.name.split('.').pop()?.toLowerCase() || 'jpg'

        const filePath =
          `productos/${id}/variantes/${varianteId}-${Date.now()}-${i}.${fileExt}`

        const { error: errorUpload } =
          await supabase.storage
            .from('imagenes')
            .upload(filePath, file)

        if (errorUpload) {
          return errors.server(
            `Error subiendo imagen de variante: ${errorUpload.message}`
          )
        }

        const { data: urlData } = supabase.storage
          .from('imagenes')
          .getPublicUrl(filePath)

        imagenesVarianteInsert.push({
          producto_id: id,
          variante_id: varianteId,
          url: urlData.publicUrl,
          principal: ordenInicial === 0 && i === 0,
          orden: ordenInicial + i,
        })
      }

      if (imagenesVarianteInsert.length > 0) {
        const { error: errorInsert } =
          await supabase
            .from('imagenes')
            .insert(imagenesVarianteInsert)

        if (errorInsert) {
          return errors.server(errorInsert.message)
        }
      }
    }
  }

  // ============================================================
  // 10. ELIMINAR IMÁGENES
  // ============================================================

  const eliminarImagenes =
    formData.get('eliminar_imagenes') as string | null

  if (eliminarImagenes) {
    const ids = eliminarImagenes
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)

    if (ids.length > 0) {
      const { error: errorEliminar } = await supabase
        .from('imagenes')
        .delete()
        .in('id', ids)
        .eq('producto_id', id)

      if (errorEliminar) {
        return errors.server(errorEliminar.message)
      }
    }
  }

  // ============================================================
  // 11. RETORNAR PRODUCTO COMPLETO
  // ============================================================

  const {
    data: productoActualizado,
    error: errorProductoActualizado,
  } = await supabase
    .from('productos')
    .select(`
      *,
      imagenes(
        id,
        url,
        principal,
        orden,
        variante_id,
        created_at
      ),
      variantes_producto(
        id,
        color,
        talla,
        sku,
        precio,
        stock,
        activo
      )
    `)
    .eq('id', id)
    .single()

  if (errorProductoActualizado || !productoActualizado) {
    return errors.server(
      errorProductoActualizado?.message ||
      'No se pudo obtener el producto actualizado.'
    )
  }

  return ok(productoActualizado)
}

// ================= DELETE: desactivar producto =================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = await getAuthUser()

  if (!auth) {
    return errors.unauthorized()
  }

  const supabase = await createClient()

  // ---------- 1. Buscar producto ----------
  const { data: productoExistente, error: errorFind } =
    await supabase
      .from('productos')
      .select(`
        id,
        tienda_id,
        tiendas!inner(propietario_id)
      `)
      .eq('id', id)
      .single()

  if (errorFind || !productoExistente) {
    return errors.notFound('Producto no encontrado.')
  }

  const propietarioId =
    (productoExistente as any).tiendas?.propietario_id

  // ---------- 2. Verificar permisos ----------
  if (
    propietarioId !== auth.user.id &&
    auth.perfil.rol !== 'administrador'
  ) {
    return errors.forbidden()
  }

  // ---------- 3. Soft delete ----------
  const { error } = await supabase
    .from('productos')
    .update({
      activo: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return errors.server(error.message)
  }

  return ok({
    message: 'Producto desactivado correctamente.',
  })
}

/*import { NextResponse } from 'next/server'
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
}*/