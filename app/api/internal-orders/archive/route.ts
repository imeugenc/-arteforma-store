import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { archiveOrder } from "@/lib/orders";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";

const schema = z.object({
  orderId: z.string().uuid("ID comandă invalid."),
  archived: z.enum(["true", "false"]),
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
      orderId: formData.get("orderId"),
      archived: formData.get("archived"),
    });

    await archiveOrder({
      orderId: parsed.orderId,
      archived: parsed.archived === "true",
    });

    return NextResponse.redirect(new URL("/internal/orders?updated=1", request.url), {
      status: 303,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Comanda nu a putut fi arhivată.";

    return NextResponse.redirect(
      new URL(`/internal/orders?error=${encodeURIComponent(message)}`, request.url),
      { status: 303 },
    );
  }
}
