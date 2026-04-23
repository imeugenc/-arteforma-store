import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteAdminProduct } from "@/lib/admin-catalog";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";

const schema = z.object({
  productId: z.string().uuid("Produs invalid."),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (!hasValidInternalSecret(token)) {
    return NextResponse.json({ ok: false, message: "Acces neautorizat." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const parsed = schema.parse({
      productId: formData.get("productId"),
    });

    await deleteAdminProduct(parsed.productId);

    return NextResponse.redirect(new URL("/internal/products?deleted=1", request.url), { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Produsul nu a putut fi șters.";
    return NextResponse.redirect(
      new URL(`/internal/products?error=${encodeURIComponent(message)}`, request.url),
      { status: 303 },
    );
  }
}
