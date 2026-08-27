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
    .select('id, tiendas!inner(propietario_id)')
    .eq('id', productoId)
    .single()

  if (error || !producto) return { permitido: false, notFound: true }

  const propietarioId = (producto as any).tiendas?.propietario_id
  const permitido = propietarioId === authUserId || rol === 'administrador'
  return { permitido, notFound: false }
}

// ================= PATCH: actualizar campos de una variante =================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; varianteId: string }> }
) {
  const { id, varianteId } = await params
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

  const permitidos = ['color', 'talla', 'sku', 'precio', 'stock', 'activo']
  const updates: Record<string, unknown> = {}

  for (const campo of permitidos) {
    if (campo in body) updates[campo] = body[campo]
  }

  if ('precio' in updates && Number(updates.precio) < 0) {
    return errors.validation('precio es inválido.')
  }
  if ('stock' in updates && Number(updates.stock) < 0) {
    return errors.validation('stock es inválido.')
  }
  if ('sku' in updates && (!updates.sku || String(updates.sku).trim().length === 0)) {
    return errors.validation('sku no puede estar vacío.')
  }

  if (Object.keys(updates).length === 0) {
    return errors.validation('No se enviaron campos para actualizar.')
  }

  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('variantes_producto')
    .update(updates)
    .eq('id', varianteId)
    .eq('producto_id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return errors.conflict('Ese SKU ya existe.')
    return errors.server(error.message)
  }
  if (!data) return errors.notFound('Variante no encontrada.')

  return ok(data)
}

// ================= DELETE: desactivar (soft delete) una variante =================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; varianteId: string }> }
) {
  const { id, varianteId } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { permitido, notFound } = await verificarPropietario(
    supabase, id, auth.user.id, auth.perfil?.rol
  )
  if (notFound) return errors.notFound('Producto no encontrado.')
  if (!permitido) return errors.forbidden()

  const { data, error } = await supabase
    .from('variantes_producto')
    .update({ activo: false, updated_at: new Date().toISOString() })
    .eq('id', varianteId)
    .eq('producto_id', id)
    .select()
    .single()

  if (error) return errors.server(error.message)
  if (!data) return errors.notFound('Variante no encontrada.')

  return ok({ message: 'Variante desactivada correctamente.' })
}
