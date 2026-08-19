import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

// ================= GET: listar productos =================
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)

  let query = supabase
    .from('productos')
    .select(`
      *,
      imagenes(id, url, principal, orden, variante_id),
      variantes_producto(id, color, talla, sku, precio, stock, activo)
    `, { count: 'exact' })

  const tienda_id = searchParams.get('tienda_id')
  const categoria_id = searchParams.get('categoria_id')
  const destacado = searchParams.get('destacado')
  const q = searchParams.get('q')

  if (tienda_id) query = query.eq('tienda_id', tienda_id)
  if (categoria_id) query = query.eq('categoria_id', categoria_id)
  if (destacado) query = query.eq('destacado', destacado === 'true')
  if (q) query = query.ilike('nombre', `%${q}%`)

  const auth = await getAuthUser()
  if (auth?.perfil?.rol === 'administrador') {
    const estado = searchParams.get('estado')
    if (estado) query = query.eq('estado', estado)
  } else {
    query = query.eq('activo', true)
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)
  return ok(data, 200, { page, pageSize, total: count })
}

// ================= POST: crear producto completo =================
export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()
  if (auth.perfil.rol !== 'vendedor') return errors.forbidden()

  const supabase = await createClient()

  // ---------- 0. Resolver la tienda del vendedor automáticamente ----------
  const { data: tienda, error: errorTienda } = await supabase
    .from('tiendas')
    .select('id, estado')
    .eq('propietario_id', auth.user.id)
    .single()

if (errorTienda || !tienda) {
  return errors.forbidden()
}

if (tienda.estado !== 'activa') {
  return errors.forbidden()
}

  // ---------- 1. Leer FormData ----------
  const formData = await request.formData()

  const categoria_id = formData.get('categoria_id') as string
  const nombre = formData.get('nombre') as string
  const slug = formData.get('slug') as string | null
  const descripcion = formData.get('descripcion') as string | null
  const material = formData.get('material') as string | null
  const peso = formData.get('peso') as string | null
  const largo = formData.get('largo') as string | null
  const ancho = formData.get('ancho') as string | null
  const alto = formData.get('alto') as string | null
  const destacado = formData.get('destacado') === 'true'

  // ---------- 2. Validaciones básicas ----------
  if (!categoria_id) return errors.validation('categoria_id es requerido.')
  if (!nombre || nombre.trim().length < 2) return errors.validation('nombre debe tener al menos 2 caracteres.')

  const { data: categoriaExiste } = await supabase
    .from('categorias_producto')
    .select('id')
    .eq('id', categoria_id)
    .eq('activo', true)
    .single()

  if (!categoriaExiste) return errors.validation('La categoria seleccionada no existe o está inactiva.')

  // ---------- 3. Parsear variantes ----------
  let variantes: Array<{
    color?: string
    talla?: string
    sku: string
    precio: number
    stock: number
    activo?: boolean
  }> = []

  const variantesRaw = formData.get('variantes') as string | null
  if (variantesRaw) {
    try {
      variantes = JSON.parse(variantesRaw)
    } catch {
      return errors.validation('El campo variantes debe ser un JSON válido.')
    }
  }

  if (variantes.length === 0) {
    return errors.validation('Debes registrar al menos una variante (ej: color/talla/precio/stock).')
  }

  for (const [i, v] of variantes.entries()) {
    if (!v.sku) return errors.validation(`variantes[${i}].sku es requerido.`)
    if (v.precio === undefined || v.precio < 0) return errors.validation(`variantes[${i}].precio es inválido.`)
    if (v.stock === undefined || v.stock < 0) return errors.validation(`variantes[${i}].stock es inválido.`)
  }

  const finalSlug = slug || nombre.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // ---------- 4. Crear el producto ----------
  const { data: producto, error: errorProducto } = await supabase
    .from('productos')
    .insert({
      tienda_id: tienda.id,
      categoria_id,
      nombre: nombre.trim(),
      slug: finalSlug,
      descripcion,
      material,
      peso: peso ? Number(peso) : null,
      largo: largo ? Number(largo) : null,
      ancho: ancho ? Number(ancho) : null,
      alto: alto ? Number(alto) : null,
      estado: 'activo',
      destacado,
      calificacion: 0,
      total_ventas: 0,
      visitas: 0,
      favoritos: 0,
      activo: true,
    })
    .select()
    .single()

  if (errorProducto) {
    if (errorProducto.code === '23505') return errors.conflict('El slug ya existe, prueba con otro nombre.')
    return errors.server(errorProducto.message)
  }

  const rollback = async () => {
    await supabase.from('productos').delete().eq('id', producto.id)
  }

  // ---------- 5. Crear variantes ----------
  const variantesInsert = variantes.map((v) => ({
    producto_id: producto.id,
    color: v.color?.trim() || null,
    talla: v.talla?.trim() || null,
    sku: v.sku.trim(),
    precio: v.precio,
    stock: v.stock,
    activo: v.activo ?? true,
  }))

  const { data: variantesCreadas, error: errorVariantes } = await supabase
    .from('variantes_producto')
    .insert(variantesInsert)
    .select()

  if (errorVariantes) {
    await rollback()
    if (errorVariantes.code === '23505') return errors.conflict('Uno de los SKU ya existe.')
    return errors.server(errorVariantes.message)
  }

  // ---------- 6. Subir imágenes generales ----------
  const imagenesInsert: any[] = []
  const filesGenerales = formData.getAll('imagenes') as File[]

  for (let i = 0; i < filesGenerales.length; i++) {
    const file = filesGenerales[i]
    if (!file || file.size === 0) continue

    const fileExt = file.name.split('.').pop()
    const filePath = `productos/${producto.id}/general-${Date.now()}-${i}.${fileExt}`

    const { error: errorUpload } = await supabase.storage.from('imagenes').upload(filePath, file)
    if (errorUpload) {
      await rollback()
      return errors.server(`Error subiendo imagen general: ${errorUpload.message}`)
    }

    const { data: urlData } = supabase.storage.from('imagenes').getPublicUrl(filePath)

    imagenesInsert.push({
      producto_id: producto.id,
      variante_id: null,
      url: urlData.publicUrl,
      principal: i === 0,
      orden: i,
    })
  }

  // ---------- 7. Subir imágenes por variante ----------
  for (let vIndex = 0; vIndex < variantesCreadas.length; vIndex++) {
    const varianteId = variantesCreadas[vIndex].id
    const filesVariante = formData.getAll(`imagen_variante_${vIndex}`) as File[]

    for (let i = 0; i < filesVariante.length; i++) {
      const file = filesVariante[i]
      if (!file || file.size === 0) continue

      const fileExt = file.name.split('.').pop()
      const filePath = `productos/${producto.id}/variantes/${varianteId}-${Date.now()}-${i}.${fileExt}`

      const { error: errorUpload } = await supabase.storage.from('imagenes').upload(filePath, file)
      if (errorUpload) {
        await rollback()
        return errors.server(`Error subiendo imagen de variante: ${errorUpload.message}`)
      }

      const { data: urlData } = supabase.storage.from('imagenes').getPublicUrl(filePath)

      imagenesInsert.push({
        producto_id: producto.id,
        variante_id: varianteId,
        url: urlData.publicUrl,
        principal: i === 0,
        orden: i,
      })
    }
  }

  if (imagenesInsert.length === 0) {
    await rollback()
    return errors.validation('Debes subir al menos una imagen del producto.')
  }

  const { error: errorImagenes } = await supabase.from('imagenes').insert(imagenesInsert)
  if (errorImagenes) {
    await rollback()
    return errors.server(errorImagenes.message)
  }

  // ---------- 8. Retornar producto completo y listo ----------
  const { data: productoCompleto } = await supabase
    .from('productos')
    .select(`
      *,
      imagenes(id, url, principal, orden, variante_id),
      variantes_producto(id, color, talla, sku, precio, stock, activo)
    `)
    .eq('id', producto.id)
    .single()

  return ok(productoCompleto, 201)
}