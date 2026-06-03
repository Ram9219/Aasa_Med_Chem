/**
 * Next.js 16 Proxy (replaces middleware.ts)
 *
 * Handles:
 * 1. Authentication — redirects unauthenticated users to /login
 * 2. Role-based access — ensures users only access their role's dashboard
 */
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check authentication via JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (token.role as string)?.toUpperCase();

  // Role-based route protection
  if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
  }

  if (pathname.startsWith('/dashboard/seller') && role !== 'SELLER') {
    return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
  }

  if (pathname.startsWith('/dashboard/buyer') && role !== 'BUYER') {
    return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
  }

  // Redirect /dashboard to role-specific dashboard
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
