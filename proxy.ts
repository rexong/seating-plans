import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  BASIC_AUTH_REALM,
  isBasicAuthorized,
} from "@/lib/basic-auth";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${BASIC_AUTH_REALM}"`,
    },
  });
}

export function proxy(request: NextRequest) {
  if (!isBasicAuthorized(request.headers.get("authorization"))) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
