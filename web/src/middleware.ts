import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware function to handle authentication and route access control.
 *
 * - Redirects authenticated users away from the login page to the admin page.
 * - Allows unauthenticated users to access the login page.
 * - Redirects unauthenticated users trying to access protected routes to the login page.
 * - Allows authenticated users to access protected routes.
 *
 * @param request - The incoming Next.js request object.
 * @returns A NextResponse object that either continues the request or redirects the user.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const path = request.nextUrl.pathname;

  if (path.startsWith('/login')) {
    if (token) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.next();
  }

  if (!token) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/map', '/login', '/'],
};
