import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
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

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup') ||
                      request.nextUrl.pathname.startsWith('/reset-password');

  // If user is not logged in and trying to access a protected route
  if (!user && !isAuthRoute && request.nextUrl.pathname !== '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user IS logged in and tries to access login/signup pages
  if (user && isAuthRoute) {
    // Determine where to redirect based on role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('roles(name)')
      .eq('id', user.id)
      .single()

    const rolesData = profile?.roles as any
    const roleName = Array.isArray(rolesData) ? rolesData[0]?.name : rolesData?.name
    const url = request.nextUrl.clone()

    if (roleName === 'super_admin') url.pathname = '/backstage'
    else if (roleName === 'clerk') url.pathname = '/clerk'
    else if (roleName === 'institute') url.pathname = '/institute'
    else if (roleName === 'student') url.pathname = '/student'
    else url.pathname = '/'

    return NextResponse.redirect(url)
  }

  // Optional: Enforce specific role access (e.g. only super_admin can access /backstage)
  if (user && request.nextUrl.pathname.startsWith('/backstage')) {
    const { data: profile } = await supabase.from('user_profiles').select('roles(name)').eq('id', user.id).single()
    const rolesData = profile?.roles as any
    const roleName = Array.isArray(rolesData) ? rolesData[0]?.name : rolesData?.name
    if (roleName !== 'super_admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
