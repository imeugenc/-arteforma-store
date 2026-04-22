import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env, isProduction } from "@/lib/env";
import { INTERNAL_ACCESS_COOKIE } from "@/lib/internal";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "").trim();
  const next = String(formData.get("next") ?? "/internal").trim() || "/internal";

  if (!env.INTERNAL_ORDERS_TOKEN || token !== env.INTERNAL_ORDERS_TOKEN) {
    return NextResponse.redirect(new URL(`/internal/login?error=1&next=${encodeURIComponent(next)}`, request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set(INTERNAL_ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/internal",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.redirect(new URL(next, request.url));
}
