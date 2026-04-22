import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
import { deleteProductMedia } from "@/lib/admin-catalog";

const schema = z.object({
  mediaId: z.string().uuid("Imagine invalidă."),
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
      mediaId: formData.get("mediaId"),
    });

    await deleteProductMedia(parsed.mediaId);

    return NextResponse.redirect(new URL("/internal/media?deleted=1", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Imaginea nu a putut fi ștearsă.";
    return NextResponse.redirect(
      new URL(`/internal/media?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
