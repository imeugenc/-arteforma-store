import Stripe from "stripe";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { persistStripeOrder } from "@/lib/orders";

export async function POST(request: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, message: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { ok: false, message: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
      });

      await persistStripeOrder({
        session,
        lineItems: lineItems.data,
      });

      // Future transactional email hook:
      // Add order confirmation email enqueue/send logic here after persistence succeeds.
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
