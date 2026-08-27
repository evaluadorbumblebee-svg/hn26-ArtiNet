import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()

  const { data: liquidacion, error } = await supabase
    .from('liquidaciones')
    .select(
      `id, tienda_id, monto, estado, referencia, fecha_pago, observaciones, created_at, updated_at,
       tiendas(id, propietario_id, nombre),
       cuentas_bancarias(titular, numero_cuenta, bancos(nombre)),
       detalle_liquidacion(id, monto, comisiones(id, pedido_id, monto_venta, monto_comision, monto_vendedor))`
    )
    .eq('id', id)
    .maybeSingle()

  if (error) return errors.server(error.message)
  if (!liquidacion) return errors.notFound('Liquidación no encontrada.')

  const isAdmin = auth.perfil?.rol === 'administrador'
  const isOwner = (liquidacion as any).tiendas?.propietario_id === auth.user.id
  if (!isAdmin && !isOwner) return errors.forbidden()

  return ok(liquidacion)
}
