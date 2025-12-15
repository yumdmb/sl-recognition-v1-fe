import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define protected routes by role
const ADMIN_ROUTES = ['/admin']
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/learning',
  '/gesture',
  '/gesture-recognition',
  '/avatar',
  '/interaction',
  '/proficiency-test'
]
const PUBLIC_ROUTES = ['/', '/auth']

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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes
  if (!user && (isProtectedRoute || isAdminRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages (except callback)
  if (user && pathname.startsWith('/auth') && !pathname.startsWith('/auth/callback') && !pathname.startsWith('/auth/reset-password')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Role-based protection for admin routes
  if (user && isAdminRoute) {
    const userRole = user.user_metadata?.role
    if (userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Role-based redirects for gesture contribution routes
  // Need to fetch role from database since user_metadata may not be up to date
  if (user && (pathname === '/gesture/view' || pathname === '/gesture/manage-contributions')) {
    // Fetch user role from database
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const userRole = profile?.role || user.user_metadata?.role
    
    // Admin trying to access /gesture/view -> redirect to /gesture/manage-contributions
    if (userRole === 'admin' && pathname === '/gesture/view') {
      const url = request.nextUrl.clone()
      url.pathname = '/gesture/manage-contributions'
      return NextResponse.redirect(url)
    }
    
    // Non-admin trying to access /gesture/manage-contributions -> redirect to /gesture/view
    if (userRole !== 'admin' && pathname === '/gesture/manage-contributions') {
      const url = request.nextUrl.clone()
      url.pathname = '/gesture/view'
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
