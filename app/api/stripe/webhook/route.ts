import Stripe from "stripe";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { persistStripeOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe-webhook] Missing Stripe configuration.");
    return NextResponse.json(
      { ok: false, message: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[stripe-webhook] Missing Stripe signature header.");
    return NextResponse.json(
      { ok: false, message: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  try {
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("[stripe-webhook] Event received:", {
      id: event.id,
      type: event.type,
    });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[stripe-webhook] Processing completed checkout session:", {
        sessionId: session.id,
        customerEmail:
          session.customer_details?.email ?? session.metadata?.customer_email ?? null,
        amountTotal: session.amount_total ?? 0,
      });

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
      });

      const persisted = await persistStripeOrder({
        session,
        lineItems: lineItems.data,
      });

      console.log("[stripe-webhook] Order persistence result:", {
        sessionId: session.id,
        persisted: Boolean(persisted),
        amount: (session.amount_total ?? 0) / 100,
        email:
          session.customer_details?.email ?? session.metadata?.customer_email ?? null,
        products: lineItems.data.map((item) => item.description ?? "ArteForma item"),
        stripe_session_id: session.id,
        status: "paid",
      });

      // Future transactional email hook:
      // Add order confirmation email enqueue/send logic here after persistence succeeds.
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed.";

    console.error("[stripe-webhook] Processing failed:", message);

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
