import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
import { deleteReview } from "@/lib/reviews";

const schema = z.object({
  reviewId: z.string().uuid("Recenzie invalidă."),
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
      reviewId: formData.get("reviewId"),
    });

    await deleteReview(parsed.reviewId);

    return NextResponse.redirect(new URL("/internal/reviews?deleted=1", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recenzia nu a putut fi ștearsă.";
    return NextResponse.redirect(
      new URL(`/internal/reviews?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
