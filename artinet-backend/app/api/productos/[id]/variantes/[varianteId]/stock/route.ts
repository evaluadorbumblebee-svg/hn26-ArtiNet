import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

// ================= PATCH: ajustar stock de una variante (atómico) =================
// body: { cantidad: number } -> negativo descuenta, positivo repone
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; varianteId: string }> }
) {
  const { id, varianteId } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: producto, error: productoError } = await supabase
    .from('productos')
    .select('id, tiendas!inner(propietario_id)')
    .eq('id', id)
    .single()

  if (productoError || !producto) return errors.notFound('Producto no encontrado.')

  const propietarioId = (producto as any).tiendas?.propietario_id
  const isAdmin = auth.perfil?.rol === 'administrador'
  if (propietarioId !== auth.user.id && !isAdmin) return errors.forbidden()

  const body = await request.json().catch(() => null)
  const cantidad = body?.cantidad

  if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad === 0) {
    return errors.validation('cantidad debe ser un entero distinto de 0 (negativo para descontar, positivo para reponer).')
  }

  const { data, error } = await supabase.rpc('ajustar_stock_variante', {
    p_variante_id: Number(varianteId),
    p_cantidad: cantidad,
  })

  if (error) return errors.badRequest(error.message)

  return ok(data)
}
