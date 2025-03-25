import { NextResponse } from 'next/server'

export function middleware(request) {
  const authCookie = request.cookies.get('authToken')
  const { pathname } = request.nextUrl

  console.log("Middleware running for path:", pathname);
  console.log("Auth cookie:", authCookie ? {
    name: authCookie.name,
    value: authCookie.value.substring(0, 10) + "...",
    exists: !!authCookie.value
  } : "None");

  // Check if trying to access protected routes
  if (pathname.startsWith('/admin')) {
    if (!authCookie || !authCookie.value) {
      console.log("No auth cookie, redirecting to signin");
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    console.log("Auth cookie present, allowing access to admin");
  }

  // Check if authenticated user is trying to access signin page
  if (pathname === '/signin') {
    if (authCookie && authCookie.value) {
      console.log("Auth cookie present, redirecting to admin");
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    console.log("No auth cookie, allowing access to signin");
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/admin/:path*', '/signin']
} 