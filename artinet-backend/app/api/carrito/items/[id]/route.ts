import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

// Recalcula subtotal/total del carrito a partir de sus items
async function recalcularCarrito(supabase: any, carritoId: number) {
  const { data: items, error } = await supabase
    .from('detalle_carrito')
    .select('subtotal')
    .eq('carrito_id', carritoId)

  if (error) throw error

  const subtotal = (items ?? []).reduce((acc: number, i: any) => acc + Number(i.subtotal), 0)
  const total = subtotal

  const { error: updateError } = await supabase
    .from('carritos')
    .update({ subtotal, total, updated_at: new Date().toISOString() })
    .eq('id', carritoId)

  if (updateError) throw updateError
}

// Trae el item junto con el carrito, y valida que pertenezca al usuario autenticado
async function getItemDelUsuario(supabase: any, itemId: string, usuarioId: string) {
  const { data: item, error } = await supabase
    .from('detalle_carrito')
    .select('id, carrito_id, variante_id, cantidad, precio_unitario, subtotal, carritos ( id, usuario_id )')
    .eq('id', itemId)
    .maybeSingle()

  if (error) throw error
  if (!item || item.carritos?.usuario_id !== usuarioId) return null
  return item
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const body = await request.json()
  const { cantidad } = body

  if (!cantidad || !Number.isInteger(cantidad) || cantidad <= 0) {
    return errors.validation('cantidad debe ser un número entero mayor a 0.')
  }

  const supabase = await createClient()

  let item
  try {
    item = await getItemDelUsuario(supabase, id, auth.user.id)
  } catch (error: any) {
    return errors.server(error.message)
  }
  if (!item) return errors.notFound('Item de carrito no encontrado.')

  const { data: variante, error: varianteError } = await supabase
    .from('variantes_producto')
    .select('id, precio, stock, activo')
    .eq('id', item.variante_id)
    .maybeSingle()

  if (varianteError) return errors.server(varianteError.message)
  if (!variante || !variante.activo) return errors.notFound('La variante del producto ya no está disponible.')
  if (cantidad > variante.stock) return errors.validation(`Stock insuficiente. Disponible: ${variante.stock}.`)

  const precioUnitario = Number(variante.precio)

  const { data: actualizado, error: updateError } = await supabase
    .from('detalle_carrito')
    .update({ cantidad, precio_unitario: precioUnitario, subtotal: precioUnitario * cantidad })
    .eq('id', id)
    .select()
    .single()

  if (updateError) return errors.server(updateError.message)

  try {
    await recalcularCarrito(supabase, item.carrito_id)
  } catch (error: any) {
    return errors.server(error.message)
  }

  return ok(actualizado)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  let item
  try {
    item = await getItemDelUsuario(supabase, id, auth.user.id)
  } catch (error: any) {
    return errors.server(error.message)
  }
  if (!item) return errors.notFound('Item de carrito no encontrado.')

  const { error: deleteError } = await supabase
    .from('detalle_carrito')
    .delete()
    .eq('id', id)

  if (deleteError) return errors.server(deleteError.message)

  try {
    await recalcularCarrito(supabase, item.carrito_id)
  } catch (error: any) {
    return errors.server(error.message)
  }

  return ok({ deleted: true, id })
}