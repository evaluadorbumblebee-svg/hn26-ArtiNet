import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)

  const mine = searchParams.get('mine') === 'true'
  const categoria_id = searchParams.get('categoria_id')
  const ciudad = searchParams.get('ciudad')
  const departamento = searchParams.get('departamento')
  const estado = searchParams.get('estado')

  let query = supabase.from('solicitudes_cliente').select('*', { count: 'exact' })

  const isAdmin = auth.perfil?.rol === 'administrador'

  if (mine) {
    // El cliente ve únicamente sus propias solicitudes, en cualquier estado
    query = query.eq('cliente_id', auth.user.id)
    if (estado) query = query.eq('estado', estado)
  } else if (isAdmin) {
    if (estado) query = query.eq('estado', estado)
  } else {
    // Vista tipo "marketplace": cualquier usuario (típicamente vendedores) navega solicitudes abiertas
    query = query.eq('estado', 'abierta')
  }

  if (categoria_id) query = query.eq('categoria_id', categoria_id)
  if (ciudad) query = query.eq('ciudad', ciudad)
  if (departamento) query = query.eq('departamento', departamento)

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)
  return ok(data, 200, { page, pageSize, total: count })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()

  const body = await request.json()
  const {
    categoria_id,
    titulo,
    descripcion,
    presupuesto,
    moneda_id,
    pais,
    departamento,
    ciudad,
    direccion,
    imagen_referencia,
    fecha_limite,
  } = body

  if (!titulo || titulo.trim().length < 3) {
    return errors.validation('titulo debe tener al menos 3 caracteres.')
  }
  if (!moneda_id) return errors.validation('moneda_id es requerido.')
  if (!pais || !departamento || !ciudad || !direccion) {
    return errors.validation('pais, departamento, ciudad y direccion son requeridos.')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('solicitudes_cliente')
    .insert({
      cliente_id: auth.user.id,
      categoria_id: categoria_id ?? null,
      titulo,
      descripcion: descripcion ?? null,
      presupuesto: presupuesto ?? null,
      moneda_id,
      pais,
      departamento,
      ciudad,
      direccion,
      imagen_referencia: imagen_referencia ?? null,
      fecha_limite: fecha_limite ?? null,
      estado: 'abierta',
    })
    .select()
    .single()

  if (error) return errors.server(error.message)

  return ok(data, 201)
}