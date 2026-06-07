import { NextResponse, type NextRequest } from 'next/server'
import { decryptSession } from '@/lib/auth-session'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname
  
  // Read session cookie
  const sessionToken = request.cookies.get('erudogix_session')?.value
  const payload = sessionToken ? await decryptSession(sessionToken) : null

  if (payload) {
    // If logged in, block all auth pages
    if (
      path.startsWith('/auth/login') || 
      path.startsWith('/auth/signup') ||
      path.startsWith('/auth/specialist-login') ||
      path.startsWith('/auth/admin-login')
    ) {
      url.pathname = `/dashboard/${payload.role}`
      return NextResponse.redirect(url)
    }

    // Restrict Admin and Specialist/Tutor from public brochure routes
    if (payload.role !== 'student') {
      const publicPaths = ['/', '/services', '/process', '/pricing', '/library', '/about', '/latest']
      const isPublicPath = publicPaths.includes(path) || publicPaths.some(p => p !== '/' && path.startsWith(p + '/'))
      if (isPublicPath) {
        url.pathname = `/dashboard/${payload.role}`
        return NextResponse.redirect(url)
      }
    }

    // Role-based routing guards
    if (path.startsWith('/dashboard')) {
      if (path === '/dashboard') {
        url.pathname = `/dashboard/${payload.role}`
        return NextResponse.redirect(url)
      }
      if (path.startsWith('/dashboard/student') && payload.role !== 'student') {
        url.pathname = `/dashboard/${payload.role}`
        return NextResponse.redirect(url)
      }
      if (path.startsWith('/dashboard/specialist') && payload.role !== 'specialist') {
        url.pathname = `/dashboard/${payload.role}`
        return NextResponse.redirect(url)
      }
      if (path.startsWith('/dashboard/admin') && payload.role !== 'admin') {
        url.pathname = `/dashboard/${payload.role}`
        return NextResponse.redirect(url)
      }
    }
  } else {
    // If not logged in, protect dashboards
    if (path.startsWith('/dashboard')) {
      if (path.startsWith('/dashboard/admin')) {
        url.pathname = '/auth/admin-login'
      } else if (path.startsWith('/dashboard/specialist')) {
        url.pathname = '/auth/specialist-login'
      } else {
        url.pathname = '/auth/login'
      }
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, folders)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
