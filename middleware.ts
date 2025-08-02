import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the pathname of the request (e.g. /, /admin, /teacher)
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    // Teacher routes protection
    if (pathname.startsWith('/teacher')) {
      if (!token || (token.role !== 'teacher' && token.role !== 'admin')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const pathname = req.nextUrl.pathname;
        const publicRoutes = ['/', '/teachers', '/content', '/auth'];
        
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // For protected routes, check if user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protect admin routes
    '/admin/:path*',
    // Protect teacher dashboard routes
    '/teacher/:path*',
    // Protect API routes that need authentication
    '/api/admin/:path*',
    '/api/teacher/:path*',
  ],
};