import { NextResponse } from "next/server";
import { z } from "zod";
import {
  SEATING_BASIC_COOKIE,
  isBasicAuthorized,
} from "@/lib/basic-auth";
import { isOperatorAuthorized } from "@/lib/request-auth";

const credentialsSchema = z.object({
  user: z.string().min(1),
  password: z.string().min(1),
});

function basicToken(user: string, password: string) {
  return Buffer.from(`${user}:${password}`, "utf8").toString("base64");
}

export async function GET() {
  if (await isOperatorAuthorized()) {
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  const token = basicToken(parsed.data.user, parsed.data.password);
  if (!isBasicAuthorized(`Basic ${token}`)) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SEATING_BASIC_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
