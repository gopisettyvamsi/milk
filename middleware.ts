// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Skip NextAuth internal API routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // ✅ Detect logged-in state (supports both local & production cookie names)
  const isLoggedIn =
    request.cookies.get('__Secure-next-auth.session-token') ||
    request.cookies.get('next-auth.session-token');

  const isAdminRoute = pathname.startsWith('/admin');

  // ✅ Protect admin routes
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ✅ Only match admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
