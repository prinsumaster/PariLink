import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/pricing', '/track'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude static files and API routes from middleware
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/backend') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. JWT Session Handling via HttpOnly Cookies
  const token = request.cookies.get('parilink_session')?.value || request.cookies.get('access_token')?.value;
  const isPublicRoute = pathname === '/' || publicRoutes.some(route => route !== '/' && pathname.startsWith(route));

  if (!token && !isPublicRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Tenant Detection & Routing Context
  const tenantSlug = request.cookies.get('tenant_slug')?.value;
  const response = NextResponse.next();

  if (tenantSlug) {
    response.headers.set('x-tenant-slug', tenantSlug);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|backend|_next/static|_next/image|favicon.ico).*)'],
};
