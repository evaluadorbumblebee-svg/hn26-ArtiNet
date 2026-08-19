import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { ok, errors } from '@/lib/responses'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('imagenes')
    .select('*')
    .eq('producto_id', id)
    .order('orden', { ascending: true })

  if (error) {
    return errors.server(error.message)
  }

  return ok(data)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  /*
   * SOLO PARA PRUEBAS LOCALES
   *
   * Usa SUPABASE_SERVICE_ROLE_KEY para evitar RLS.
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

  // Verificar que el producto exista
  const { data: producto, error: productoError } = await supabaseAdmin
    .from('productos')
    .select('id, tiendas!inner(propietario_id)')
    .eq('id', id)
    .single()

  if (productoError) {
    return errors.server(productoError.message)
  }

  if (!producto) {
    return errors.notFound('Producto no encontrado.')
  }

  // Obtener multipart/form-data
  const formData = await request.formData()

  const file = formData.get('file') as File | null

  const variante_id =
    (formData.get('variante_id') as string | null) || null

  const principal =
    formData.get('principal') === 'true'

  const ordenRaw =
    formData.get('orden') as string | null

  // Validar archivo
  if (!file) {
    return errors.validation(
      'No se envió ningún archivo (campo "file").'
    )
  }

  // Validar tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    return errors.validation(
      'Tipo de archivo no permitido. Usa JPG, PNG, WEBP o GIF.'
    )
  }

  // Validar tamaño
  if (file.size > MAX_SIZE) {
    return errors.validation(
      'El archivo supera el tamaño máximo de 5MB.'
    )
  }

  /*
   * Obtener extensión
   */
  const originalName = file.name

  const extension =
    originalName.includes('.')
      ? originalName.split('.').pop()?.toLowerCase()
      : 'webp'

  /*
   * Nombre único para Storage
   */
  const fileName = `productos/${id}-${Date.now()}.${extension}`

  /*
   * 1. SUBIR IMAGEN A SUPABASE STORAGE
   */
  const { error: uploadError } =
    await supabaseAdmin.storage
      .from('artinet-images')
      .upload(
        fileName,
        file,
        {
          contentType: file.type,
          upsert: false,
        }
      )

  if (uploadError) {
    return errors.server(
      `Error subiendo imagen: ${uploadError.message}`
    )
  }

  /*
   * 2. OBTENER URL PÚBLICA
   */
  const { data: publicUrlData } =
    supabaseAdmin.storage
      .from('artinet-images')
      .getPublicUrl(fileName)

  const publicUrl =
    publicUrlData.publicUrl

  /*
   * 3. Si es principal,
   * quitar principal a las demás imágenes
   */
  if (principal) {
    const { error: updateError } =
      await supabaseAdmin
        .from('imagenes')
        .update({
          principal: false,
        })
        .eq('producto_id', id)

    if (updateError) {
      await supabaseAdmin.storage
        .from('artinet-images')
        .remove([fileName])

      return errors.server(
        updateError.message
      )
    }
  }

  /*
   * 4. Crear registro en tabla imagenes
   */
  const orden =
    ordenRaw
      ? parseInt(ordenRaw, 10)
      : 1

  const { data, error } =
    await supabaseAdmin
      .from('imagenes')
      .insert({
        producto_id: id,
        variante_id,
        url: publicUrl,
        principal,
        orden,
      })
      .select()
      .single()

  /*
   * Si falla la BD,
   * eliminar imagen de Storage
   */
  if (error) {
    await supabaseAdmin.storage
      .from('artinet-images')
      .remove([fileName])

    return errors.server(
      `Error creando registro: ${error.message}`
    )
  }

  /*
   * 5. Respuesta
   */
  return ok(data, 201)
}