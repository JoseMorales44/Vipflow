import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = new URL(request.url)

  // Rutas que no requieren chequeo de organización
  const isPublicRoute = url.pathname === '/' || url.pathname.startsWith('/auth') || url.pathname === '/login' || url.pathname === '/register'

  if (!user) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // Si hay usuario logueado
  if (user) {
    // 1. Chequeo de Organización (Dueño o Miembro)
    const [{ data: ownedOrgs }, { data: memberships }] = await Promise.all([
      supabase.from('organizations').select('id').eq('owner_id', user.id).limit(1),
      supabase.from('org_members').select('org_id').eq('user_id', user.id).limit(1)
    ]);

    const hasOrg = (ownedOrgs && ownedOrgs.length > 0) || (memberships && memberships.length > 0);

    // 2. Redirecciones lógicas
    if (url.pathname === '/onboarding' && hasOrg) {
      return NextResponse.redirect(new URL('/dashboard/inbox', request.url))
    }

    if (url.pathname.startsWith('/dashboard') && !hasOrg) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    if (isPublicRoute && url.pathname !== '/') {
      return NextResponse.redirect(new URL('/dashboard/inbox', request.url))
    }
  }

  return supabaseResponse
}
