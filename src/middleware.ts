import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

const GUESSABLE_PATHS = [
  '/admin',
  '/admin/login',
  '/admin/dashboard',
  '/login',
  '/dashboard',
  '/wp-admin',
  '/wp-login.php',
  '/administrator',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSecretPath = process.env.ADMIN_SECRET_PATH || 'craftora-hq-7f3k9x';

  // 1. Block direct access to internal admin-portal route or guessable admin paths with genuine 404
  if (
    pathname === '/_admin' ||
    pathname.startsWith('/_admin/') ||
    pathname === '/admin-portal' ||
    pathname.startsWith('/admin-portal/') ||
    GUESSABLE_PATHS.includes(pathname.toLowerCase()) ||
    GUESSABLE_PATHS.some((p) => pathname.toLowerCase().startsWith(p + '/'))
  ) {
    const notFoundUrl = new URL('/not-found', request.url);
    const response = NextResponse.rewrite(notFoundUrl, { status: 404 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // 2. Handle Secret Admin Path
  const secretPrefix = `/${adminSecretPath}`;
  if (pathname === secretPrefix || pathname.startsWith(`${secretPrefix}/`)) {
    // Extract subpath: e.g. /craftora-hq-7f3k9x/dashboard -> /dashboard
    const subPath = pathname.slice(secretPrefix.length) || '/';
    const internalPath = `/admin-portal${subPath === '/' ? '/dashboard' : subPath}`;

    // Verify admin token
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminToken(token) : null;
    const isLoginPage = subPath === '/login';

    // If authenticated user visits login, redirect to admin dashboard
    if (isLoginPage && session) {
      const redirectUrl = new URL(`${secretPrefix}/dashboard`, request.url);
      const res = NextResponse.redirect(redirectUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return res;
    }

    // If unauthenticated user visits any admin page other than login, redirect to secret login
    if (!isLoginPage && !session) {
      const redirectUrl = new URL(`${secretPrefix}/login`, request.url);
      const res = NextResponse.redirect(redirectUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return res;
    }

    // Rewrite to internal route group with noindex headers
    const rewriteUrl = new URL(internalPath, request.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // 3. API protection for /api/admin/* (except login)
  if (pathname.startsWith('/api/admin/') && pathname !== '/api/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/download).*)',
  ],
};
