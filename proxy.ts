import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  BASIC_AUTH_DENIED_BODY,
  BASIC_AUTH_REALM,
  SEATING_BASIC_COOKIE,
  isBasicAuthorized,
  isCookieAuthorized,
} from "@/lib/basic-auth";

function unauthorized() {
  return new NextResponse(BASIC_AUTH_DENIED_BODY, {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${BASIC_AUTH_REALM}"`,
    },
  });
}

function isPublicPath(pathname: string) {
  return (
    /^\/events\/[^/]+\/export\/?$/.test(pathname) || pathname === "/api/session"
  );
}

function isAuthorized(request: NextRequest) {
  if (isBasicAuthorized(request.headers.get("authorization"))) {
    return true;
  }
  return isCookieAuthorized(request.cookies.get(SEATING_BASIC_COOKIE)?.value);
}

export function proxy(request: NextRequest) {
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!isAuthorized(request)) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
