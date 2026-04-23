import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteOrder } from "@/lib/orders";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";

const schema = z.object({
  orderId: z.string().uuid("ID comandă invalid."),
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
    });

    await deleteOrder(parsed.orderId);

    return NextResponse.redirect(new URL("/internal/orders?updated=1", request.url), {
      status: 303,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Comanda nu a putut fi ștearsă.";

    return NextResponse.redirect(
      new URL(`/internal/orders?error=${encodeURIComponent(message)}`, request.url),
      { status: 303 },
    );
  }
}
