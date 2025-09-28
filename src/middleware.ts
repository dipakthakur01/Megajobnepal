import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Check if user has admin role
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!user || user.role !== 'admin') {
      // Redirect to home if not admin
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Protected job seeker dashboard routes
  if (req.nextUrl.pathname.startsWith('/jobseeker-dashboard')) {
    if (!session) {
      // Redirect to home with login modal trigger
      return NextResponse.redirect(new URL('/?login=true&role=job_seeker', req.url))
    }

    // Check if user has job_seeker role
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!user || user.role !== 'job_seeker') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Protected employer dashboard routes
  if (req.nextUrl.pathname.startsWith('/employer-dashboard')) {
    if (!session) {
      // Redirect to home with login modal trigger
      return NextResponse.redirect(new URL('/?login=true&role=employer', req.url))
    }

    // Check if user has employer or hr role
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!user || !['employer', 'hr'].includes(user.role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}