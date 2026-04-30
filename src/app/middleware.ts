import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require auth
  const publicRoutes = ["/", "/login", "/forgot-password", "/_next", "/favicon.ico"];
  if (publicRoutes.some(route => pathname.startsWith(route)) && pathname !== "/") {
    return NextResponse.next();
  }

  // Not authenticated - redirect to login (except for home page which is now public)
  if (!authToken && pathname !== "/login" && pathname !== "/" && pathname !== "/forgot-password") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated users trying to access login - redirect to their portal
  // (client-side will handle actual role-based redirect)
  if (authToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
