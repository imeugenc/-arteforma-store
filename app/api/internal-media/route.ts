import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
import { uploadProductMedia } from "@/lib/admin-catalog";

const schema = z.object({
  productId: z.string().uuid("Produs invalid."),
  altText: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  kind: z.string().optional(),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (env.INTERNAL_ORDERS_TOKEN && token !== env.INTERNAL_ORDERS_TOKEN) {
    return NextResponse.json({ ok: false, message: "Acces neautorizat." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      throw new Error("Alege o imagine înainte să trimiți formularul.");
    }

    const parsed = schema.parse({
      productId: formData.get("productId"),
      altText: formData.get("altText")?.toString(),
      sortOrder: formData.get("sortOrder"),
      kind: formData.get("kind")?.toString(),
    });

    await uploadProductMedia({
      productId: parsed.productId,
      file,
      altText: parsed.altText,
      sortOrder: parsed.sortOrder,
      kind: parsed.kind,
    });

    return NextResponse.redirect(new URL("/internal/media?uploaded=1", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Imaginea nu a putut fi încărcată.";
    return NextResponse.redirect(
      new URL(`/internal/media?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
