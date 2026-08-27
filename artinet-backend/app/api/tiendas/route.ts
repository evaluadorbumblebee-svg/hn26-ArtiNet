import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { ok, errors } from '@/lib/responses'
import { parsePagination } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const { page, pageSize, sortBy, sortOrder, from, to } = parsePagination(searchParams)

  let query = supabase.from('tiendas').select('*', { count: 'exact' })

  const categoria_id = searchParams.get('categoria_id')
  const ciudad = searchParams.get('ciudad')
  const departamento = searchParams.get('departamento')
  const q = searchParams.get('q')

  if (categoria_id) query = query.eq('categoria_id', categoria_id)
  if (ciudad) query = query.eq('ciudad', ciudad)
  if (departamento) query = query.eq('departamento', departamento)
  if (q) query = query.ilike('nombre', `%${q}%`)

  // Por defecto solo tiendas activas, salvo que sea admin
  const auth = await getAuthUser()
  if (auth?.perfil?.rol === 'administrador') {
    const estado = searchParams.get('estado')
    if (estado) query = query.eq('estado', estado)
  } else {
    query = query.eq('estado', 'activa')
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder })
    .range(from, to)

  if (error) return errors.server(error.message)
  return ok(data, 200, { page, pageSize, total: count })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return errors.unauthorized()
  if (auth.perfil?.rol !== 'vendedor') return errors.forbidden()

  const supabase = await createClient()

  // Un propietario solo puede tener una tienda activa/pendiente a la vez
  const { data: existente } = await supabase
    .from('tiendas')
    .select('id')
    .eq('propietario_id', auth.user.id)
    .in('estado', ['pendiente', 'activa'])
    .maybeSingle()

  if (existente) {
    return errors.conflict('Ya tienes una tienda registrada.')
  }

  const body = await request.json()
  const {
    categoria_id, moneda_id, nombre, slug, descripcion, logo, banner,
    pais, departamento, ciudad, direccion, ruc, tipo_negocio, horario,
    telefono, whatsapp, email, facebook, instagram, sitio_web,
  } = body

  if (!moneda_id) return errors.validation('moneda_id es requerido.')
  if (!nombre || nombre.length < 2) return errors.validation('nombre debe tener al menos 2 caracteres.')
  if (!pais || !departamento || !ciudad || !direccion) {
    return errors.validation('pais, departamento, ciudad y direccion son requeridos.')
  }
  if (!tipo_negocio) return errors.validation('tipo_negocio es requerido.')

  const finalSlug = slug || nombre.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const { data, error } = await supabase
    .from('tiendas')
    .insert({
      propietario_id: auth.user.id,
      categoria_id, moneda_id, nombre, slug: finalSlug, descripcion, logo, banner,
      pais, departamento, ciudad, direccion, ruc, tipo_negocio, horario,
      telefono, whatsapp, email, facebook, instagram, sitio_web,
      porcentaje_comision: 10, // valor por defecto de la plataforma; el admin puede ajustarlo luego
      estado: 'pendiente',
      activo: true,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return errors.conflict('El slug ya existe.')
    return errors.server(error.message)
  }

  // Notificar a los administradores que hay una tienda por aprobar
  const { data: admins } = await supabase.from('perfiles').select('id').eq('rol', 'administrador')
  if (admins && admins.length > 0) {
    await supabase.from('notificaciones').insert(
      admins.map((a: any) => ({
        usuario_id: a.id,
        titulo: 'Nueva tienda pendiente de aprobación',
        mensaje: `La tienda "${data.nombre}" espera revisión.`,
        enlace: `/admin/tiendas/${data.id}/aprobar`,
        leida: false,
      }))
    )
  }

  return ok(data, 201)
}