import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/auth/login',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const authObj = await auth();
  const userSessionCookie = request.cookies.get('premium_session')?.value;

  if (pathname.startsWith('/admin')) {
    if (authObj.userId) return NextResponse.next();
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (pathname.startsWith('/user')) {
    if (userSessionCookie) {
      try {
        const parsed = JSON.parse(userSessionCookie);
        if (parsed.role === 'user') return NextResponse.next();
      } catch {}
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (authObj.userId) return NextResponse.next();
  if (userSessionCookie) return NextResponse.next();
  return NextResponse.redirect(new URL('/auth/login', request.url));
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};