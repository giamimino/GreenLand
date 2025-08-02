import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;
  const path = request.nextUrl.pathname;

  if (!sessionId) {
    const protectedPaths = ["/contact", "/profile", "/cart", "/verification", "/checkout"];

    if (protectedPaths.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL("/auth/signUp", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/contact",
    "/profile/:path*",
    "/cart/:path*",
    "/verification/:path*",
    "/checkout/:path*"
  ],
};
