import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error_description = searchParams.get('error_description')

  // Si Supabase ya nos manda un error en la URL, lo capturamos
  if (error_description) {
    console.error('Error de Supabase en el callback:', error_description);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?message=${encodeURIComponent(error_description)}`)
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Login exitoso, vamos al dashboard o al onboarding
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Si el error es que el código ya se usó (a veces Next.js llama dos veces), 
    // verificamos si ya tenemos sesión de todos modos
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('Error al intercambiar código:', error.message)
  }

  // Si llegamos aquí sin éxito, a la página de error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
