import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getNewAccessToken } from "./service/refreshToken";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PUBLIC_ROUTES = ["/", "/news", "/gears","/gear", "/about", "/contact", "/privacy", "/terms","/how-it-works"];

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieStore = await cookies();

  let accessToken = request.cookies.get("accessToken")?.value 
  const refreshToken = request.cookies.get("refreshToken")?.value;



  let decodedAccessToken = accessToken 
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) 
    : null;

  const decodedRefreshToken = refreshToken 
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) 
    : null;

  // 1. Refresh Token Rotation
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result?.success && result?.data?.accessToken) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60,
        sameSite: "lax",
        path: "/",
      });

      accessToken = newAccessToken;
      decodedAccessToken = jwtUtils.verifyToken(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string
      );
    }
  }

  let userRole: string | null = null;

  if (!decodedAccessToken?.success) {
    cookieStore.delete("accessToken");
    cookieStore.delete("token");
  } else if (decodedAccessToken?.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // 2. Redirect logged-in users away from auth pages
  if (accessToken && decodedAccessToken?.success && isAuthRoute) {
    if (userRole === "PROVIDER") {
      return NextResponse.redirect(new URL('/dashboard/provider', request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3. Unauthenticated protection
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 4. Role-based access control
  if (pathname.startsWith("/dashboard/provider") && userRole !== "PROVIDER" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
        '/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)'
    ],
};