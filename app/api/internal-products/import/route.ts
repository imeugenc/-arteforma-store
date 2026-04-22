import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
import { seedCatalogProductsFromCode } from "@/lib/admin-catalog";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (!hasValidInternalSecret(token)) {
    return NextResponse.json({ ok: false, message: "Acces neautorizat." }, { status: 401 });
  }

  try {
    const imported = await seedCatalogProductsFromCode();
    return NextResponse.redirect(new URL(`/internal/products?imported=${imported}`, request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Catalogul nu a putut fi importat.";
    return NextResponse.redirect(
      new URL(`/internal/products?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
