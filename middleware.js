import { NextResponse } from "next/server";

import { verifySessionToken, sessionCookieName } from "@/lib/auth";

const authPages = ["/login", "/signup"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(sessionCookieName)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isAuthPage = authPages.includes(pathname);

  if (!session && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isAuthPage) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)",
  ],
};
