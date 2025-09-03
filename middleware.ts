import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to the access page and static assets
  if (
    pathname === "/access" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Check if user has access key in cookies (for SSR)
  const accessKey = request.cookies.get("historianAccessKey");

  // If no access key, redirect to access page
  if (!accessKey) {
    return NextResponse.redirect(new URL("/access", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - access (access page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|access).*)",
  ],
};
