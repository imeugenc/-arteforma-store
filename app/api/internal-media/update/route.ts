import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
import { updateProductMedia } from "@/lib/admin-catalog";

const schema = z.object({
  mediaId: z.string().uuid("Imagine invalidă."),
  altText: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  kind: z.string().optional(),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (!hasValidInternalSecret(token)) {
    return NextResponse.json({ ok: false, message: "Acces neautorizat." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("replacementFile");
    const parsed = schema.parse({
      mediaId: formData.get("mediaId"),
      altText: formData.get("altText")?.toString(),
      sortOrder: formData.get("sortOrder"),
      kind: formData.get("kind")?.toString(),
    });

    await updateProductMedia({
      mediaId: parsed.mediaId,
      altText: parsed.altText,
      sortOrder: parsed.sortOrder,
      kind: parsed.kind,
      replacementFile: file instanceof File && file.size > 0 ? file : null,
    });

    return NextResponse.redirect(new URL("/internal/media?updated=1", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Imaginea nu a putut fi actualizată.";
    return NextResponse.redirect(
      new URL(`/internal/media?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
