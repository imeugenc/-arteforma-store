import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env, isProduction } from "@/lib/env";
import { getInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "/internal").trim() || "/internal";
  const secret = getInternalSecret();

  if (!secret || password !== secret) {
    return NextResponse.redirect(new URL(`/internal/login?error=1&next=${encodeURIComponent(next)}`, request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set(INTERNAL_ACCESS_COOKIE, secret, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.redirect(new URL(next, request.url));
}
