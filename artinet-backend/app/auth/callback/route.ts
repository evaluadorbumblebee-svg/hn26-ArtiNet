import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')

  // Si "next" existe, lo usamos como URL de destino
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Obtener el usuario autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Consultar el teléfono del perfil
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('telefono')
          .eq('id', user.id)
          .single()

        // Si no tiene teléfono, obligar a completar el perfil
        const destino = !perfil?.telefono
          ? '/completar-perfil'
          : next

        const forwardedHost =
          request.headers.get('x-forwarded-host')

        const isLocalEnv =
          process.env.NODE_ENV === 'development'

        if (isLocalEnv) {
          return NextResponse.redirect(
            `${origin}${destino}`
          )
        }

        if (forwardedHost) {
          return NextResponse.redirect(
            `https://${forwardedHost}${destino}`
          )
        }

        return NextResponse.redirect(
          `${origin}${destino}`
        )
      }

      // No se pudo obtener el usuario
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error`
      )
    }
  }

  // Error al intercambiar el código o código inexistente
  return NextResponse.redirect(
    `${origin}/auth/auth-code-error`
  )
}
