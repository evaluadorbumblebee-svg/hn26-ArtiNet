import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

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

// Recalcula subtotal/total del carrito a partir de sus items
async function recalcularCarrito(supabase: any, carritoId: number) {
  const { data: items, error } = await supabase
    .from('detalle_carrito')
    .select('subtotal')
    .eq('carrito_id', carritoId)

  if (error) throw error

  const subtotal = (items ?? []).reduce((acc: number, i: any) => acc + Number(i.subtotal), 0)
  const total = subtotal // aquí se pueden sumar envío/comisiones más adelante

  const { error: updateError } = await supabase
    .from('carritos')
    .update({ subtotal, total, updated_at: new Date().toISOString() })
    .eq('id', carritoId)

  if (updateError) throw updateError

  return { subtotal, total }
}

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: carrito } = await supabase
    .from('carritos')
    .select('id')
    .eq('usuario_id', auth.user.id)
    .eq('estado', 'activo')
    .maybeSingle()

  if (!carrito) return ok([])

  const { data: items, error } = await supabase
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

  if (error) return errors.server(error.message)

  return ok(items)
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const body = await request.json()
  const { variante_id, cantidad } = body

  if (!variante_id) return errors.validation('variante_id es requerido.')
  if (!cantidad || !Number.isInteger(cantidad) || cantidad <= 0) {
    return errors.validation('cantidad debe ser un número entero mayor a 0.')
  }

  const supabase = await createClient()

  const { data: variante, error: varianteError } = await supabase
    .from('variantes_producto')
    .select('id, precio, stock, activo')
    .eq('id', variante_id)
    .maybeSingle()

  if (varianteError) return errors.server(varianteError.message)
  if (!variante || !variante.activo) return errors.notFound('La variante del producto no existe o no está disponible.')

  let carrito
  try {
    carrito = await getOrCreateCarritoActivo(supabase, auth.user.id)
  } catch (error: any) {
    return errors.server(error.message)
  }

  const { data: itemExistente } = await supabase
    .from('detalle_carrito')
    .select('id, cantidad')
    .eq('carrito_id', carrito.id)
    .eq('variante_id', variante_id)
    .maybeSingle()

  const cantidadFinal = (itemExistente?.cantidad ?? 0) + cantidad

  if (cantidadFinal > variante.stock) {
    return errors.validation(`Stock insuficiente. Disponible: ${variante.stock}.`)
  }

  const precioUnitario = Number(variante.precio)
  const subtotalItem = precioUnitario * cantidadFinal

  let item
  if (itemExistente) {
    const { data, error } = await supabase
      .from('detalle_carrito')
      .update({ cantidad: cantidadFinal, precio_unitario: precioUnitario, subtotal: subtotalItem })
      .eq('id', itemExistente.id)
      .select()
      .single()

    if (error) return errors.server(error.message)
    item = data
  } else {
    const { data, error } = await supabase
      .from('detalle_carrito')
      .insert({
        carrito_id: carrito.id,
        variante_id,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal: precioUnitario * cantidad,
      })
      .select()
      .single()

    if (error) return errors.server(error.message)
    item = data
  }

  try {
    await recalcularCarrito(supabase, carrito.id)
  } catch (error: any) {
    return errors.server(error.message)
  }

  return ok(item, 201)
}
