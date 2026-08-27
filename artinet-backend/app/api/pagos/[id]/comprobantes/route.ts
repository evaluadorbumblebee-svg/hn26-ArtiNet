import { NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

import { getAuthUser } from '@/lib/auth'

import { ok, errors } from '@/lib/responses'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

// ======================================================
// OBTENER PAGO CON DATOS DEL PEDIDO
// ======================================================

async function getPagoConPedido(
  supabase: any,
  pagoId: string
) {
  const { data, error } = await supabase
    .from('pagos')
    .select(`
      id,
      pedido_id,
      estado,
      pedidos (
        id,
        cliente_id,
        tienda_id,
        tiendas (
          propietario_id
        )
      )
    `)
    .eq('id', pagoId)
    .maybeSingle()

  if (error) throw error

  return data
}

// ======================================================
// VALIDAR PERMISOS
// ======================================================

function puedeVerOGestionar(
  pago: any,
  auth: any
) {
  if (!pago) return false

  const isAdmin =
    auth.perfil?.rol === 'administrador'

  const isCliente =
    pago.pedidos?.cliente_id === auth.user.id

  const isTienda =
    pago.pedidos?.tiendas?.propietario_id === auth.user.id

  return isAdmin || isCliente || isTienda
}

// ======================================================
// GET
// GET /api/pagos/{id}/comprobantes
// ======================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = await getAuthUser()

  if (!auth) {
    return errors.unauthorized()
  }

  const supabase = await createClient()

  let pago

  try {
    pago = await getPagoConPedido(
      supabase,
      id
    )
  } catch (error: any) {
    return errors.server(error.message)
  }

  if (!pago) {
    return errors.notFound(
      'Pago no encontrado.'
    )
  }

  if (!puedeVerOGestionar(pago, auth)) {
    return errors.forbidden()
  }

  const { data, error } = await supabase
    .from('comprobantes')
    .select('*')
    .eq('pago_id', id)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    return errors.server(error.message)
  }

  return ok(data)
}

// ======================================================
// POST
// POST /api/pagos/{id}/comprobantes
// ======================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = await getAuthUser()

  if (!auth) {
    return errors.unauthorized()
  }

  const supabase = await createClient()

  let pago

  try {
    pago = await getPagoConPedido(
      supabase,
      id
    )
  } catch (error: any) {
    return errors.server(error.message)
  }

  if (!pago) {
    return errors.notFound(
      'Pago no encontrado.'
    )
  }

  if (!puedeVerOGestionar(pago, auth)) {
    return errors.forbidden()
  }

  // ====================================================
  // CLIENTE SUPABASE ADMIN
  // ====================================================

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

  // ====================================================
  // OBTENER MULTIPART/FORM-DATA
  // ====================================================

  const formData = await request.formData()

  const file =
    formData.get('file') as File | null

  const observacion =
    (formData.get('observacion') as string | null) || null

  // ====================================================
  // VALIDAR ARCHIVO
  // ====================================================

  if (!file) {
    return errors.validation(
      'No se envió ningún archivo (campo "file").'
    )
  }

  // ====================================================
  // VALIDAR TIPO DE IMAGEN
  // ====================================================

  if (!ALLOWED_TYPES.includes(file.type)) {
    return errors.validation(
      'Tipo de archivo no permitido. Usa JPG, PNG, WEBP o GIF.'
    )
  }

  // ====================================================
  // VALIDAR TAMAÑO
  // ====================================================

  if (file.size > MAX_SIZE) {
    return errors.validation(
      'El archivo supera el tamaño máximo de 5MB.'
    )
  }

  // ====================================================
  // OBTENER EXTENSIÓN
  // ====================================================

  const originalName = file.name

  const extension =
    originalName.includes('.')
      ? originalName
          .split('.')
          .pop()
          ?.toLowerCase()
      : 'webp'

  // ====================================================
  // NOMBRE ÚNICO
  // ====================================================

  const fileName =
    `comprobantes/${id}-${Date.now()}.${extension}`

  // ====================================================
  // SUBIR IMAGEN A SUPABASE STORAGE
  // ====================================================

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
      `Error subiendo comprobante: ${uploadError.message}`
    )
  }

  // ====================================================
  // OBTENER URL PÚBLICA
  // ====================================================

  const { data: publicUrlData } =
    supabaseAdmin.storage
      .from('artinet-images')
      .getPublicUrl(fileName)

  const publicUrl =
    publicUrlData.publicUrl

  // ====================================================
  // GUARDAR EN TABLA COMPROBANTES
  // ====================================================

  const { data, error } =
    await supabaseAdmin
      .from('comprobantes')
      .insert({
        pago_id: id,
        archivo: publicUrl,
        observacion,
      })
      .select()
      .single()

  // ====================================================
  // SI FALLA LA BD, ELIMINAR ARCHIVO
  // ====================================================

  if (error) {
    await supabaseAdmin.storage
      .from('artinet-images')
      .remove([fileName])

    return errors.server(
      `Error creando comprobante: ${error.message}`
    )
  }

  // ====================================================
  // RESPUESTA
  // ====================================================

  return ok(data, 201)
}