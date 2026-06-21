import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Jika belum login, redirect ke login page saat mencoba akses dashboard
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login
  if (token) {
    if (role === "customer") {
      // Customer tidak boleh akses halaman dashboard atau auth
      if (isDashboardPage || isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else {
      // Admin (atau role selain customer) tidak boleh akses halaman auth
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
