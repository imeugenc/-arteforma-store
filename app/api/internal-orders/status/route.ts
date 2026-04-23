import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
import { ADMIN_ORDER_STATUSES, updateOrderStatus } from "@/lib/orders";

const schema = z.object({
  orderId: z.string().uuid("ID comandă invalid."),
  status: z.enum(ADMIN_ORDER_STATUSES),
  note: z.string().max(300).optional(),
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
      status: formData.get("status"),
      note: formData.get("note"),
    });

    await updateOrderStatus(parsed);

    return NextResponse.redirect(new URL("/internal/orders?updated=1", request.url), {
      status: 303,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Statusul nu a putut fi actualizat.";

    return NextResponse.redirect(
      new URL(`/internal/orders?error=${encodeURIComponent(message)}`, request.url),
      { status: 303 },
    );
  }
}
