import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

async function verificarPropietario(
  supabase: any,
  productoId: string,
  authUserId: string,
  rol: string | undefined
) {
  const { data: producto, error } = await supabase
    .from('productos')
    .select('id, tienda_id, tiendas!inner(propietario_id)')
    .eq('id', productoId)
    .single()

  if (error || !producto) return { permitido: false, notFound: true }

  const propietarioId = (producto as any).tiendas?.propietario_id
  const permitido = propietarioId === authUserId || rol === 'administrador'
  return { permitido, notFound: false, producto }
}

// ================= GET: listar variantes de un producto =================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('variantes_producto')
    .select('id, color, talla, sku, precio, stock, activo, created_at, updated_at, imagenes(id, url, principal, orden)')
    .eq('producto_id', id)
    .order('created_at', { ascending: true })

  if (error) return errors.server(error.message)
  return ok(data)
}

// ================= POST: agregar una variante nueva =================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { permitido, notFound } = await verificarPropietario(
    supabase, id, auth.user.id, auth.perfil?.rol
  )
  if (notFound) return errors.notFound('Producto no encontrado.')
  if (!permitido) return errors.forbidden()

  const body = await request.json().catch(() => null)
  if (!body) return errors.validation('Body JSON inválido.')

  const { color, talla, sku, precio, stock, activo } = body

  if (!sku || typeof sku !== 'string' || !sku.trim()) {
    return errors.validation('sku es requerido.')
  }
  if (precio === undefined || Number(precio) < 0) {
    return errors.validation('precio es inválido.')
  }
  if (stock === undefined || Number(stock) < 0) {
    return errors.validation('stock es inválido.')
  }

  const { data, error } = await supabase
    .from('variantes_producto')
    .insert({
      producto_id: id,
      color: color?.trim() || null,
      talla: talla?.trim() || null,
      sku: sku.trim(),
      precio: Number(precio),
      stock: Number(stock),
      activo: activo ?? true,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return errors.conflict(`El SKU "${sku}" ya existe.`)
    return errors.server(error.message)
  }

  return ok(data, 201)
}
