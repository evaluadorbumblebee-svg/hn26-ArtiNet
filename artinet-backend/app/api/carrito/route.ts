import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

// Trae el carrito activo del usuario, o lo crea si no existe.
async function getOrCreateCarritoActivo(supabase: any, usuarioId: string) {
  const { data: existente } = await supabase
    .from('carritos')
    .select('*')
    .eq('usuario_id', usuarioId)
    .eq('estado', 'activo')
    .maybeSingle()

  if (existente) return existente

  const { data: nuevo, error } = await supabase
    .from('carritos')
    .insert({ usuario_id: usuarioId, subtotal: 0, total: 0, estado: 'activo' })
    .select()
    .single()

  if (error) throw error
  return nuevo
}

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  let carrito
  try {
    carrito = await getOrCreateCarritoActivo(supabase, auth.user.id)
  } catch (error: any) {
    return errors.server(error.message)
  }

  const { data: items, error: itemsError } = await supabase
    .from('detalle_carrito')
    .select(`
      id, cantidad, precio_unitario, subtotal, created_at,
      variantes_producto (
        id, color, talla, sku, precio, stock, activo,
        productos (
          id, nombre, slug, tienda_id,
          imagenes ( url, principal )
        )
      )
    `)
    .eq('carrito_id', carrito.id)
    .order('created_at', { ascending: true })

  if (itemsError) return errors.server(itemsError.message)

  return ok({ ...carrito, items })
}

// Vacía el carrito (elimina todos los items y reinicia los totales)
export async function DELETE(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: carrito } = await supabase
    .from('carritos')
    .select('id')
    .eq('usuario_id', auth.user.id)
    .eq('estado', 'activo')
    .maybeSingle()

  if (!carrito) return errors.notFound('No tienes un carrito activo.')

  const { error: deleteError } = await supabase
    .from('detalle_carrito')
    .delete()
    .eq('carrito_id', carrito.id)

  if (deleteError) return errors.server(deleteError.message)

  const { data: actualizado, error: updateError } = await supabase
    .from('carritos')
    .update({ subtotal: 0, total: 0, updated_at: new Date().toISOString() })
    .eq('id', carrito.id)
    .select()
    .single()

  if (updateError) return errors.server(updateError.message)

  return ok(actualizado)
}
