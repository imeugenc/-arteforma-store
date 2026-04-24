import Stripe from "stripe";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { buildOrderConfirmationPayload, getOrderDisplayReference, persistStripeOrder } from "@/lib/orders";
import { sendPaidOrderEmails } from "@/lib/order-emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  console.log("[stripe-webhook] Direct route hit.", {
    url: request.url,
    method: request.method,
  });

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
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid Stripe webhook signature.";

      console.error("[stripe-webhook] Signature verification failed:", message);

      return NextResponse.json({ ok: false, message }, { status: 400 });
    }

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

      console.log("[stripe-webhook] Line items loaded.", {
        sessionId: session.id,
        lineItemsCount: lineItems.data.length,
      });

      const persisted = await persistStripeOrder({
        session,
        lineItems: lineItems.data,
      });

      console.log("[stripe-webhook] Order persistence result:", {
        sessionId: session.id,
        persisted: Boolean(persisted),
        isNew: persisted?.isNew ?? false,
        amount: (session.amount_total ?? 0) / 100,
        email:
          session.customer_details?.email ?? session.metadata?.customer_email ?? null,
        products: lineItems.data.map((item) => item.description ?? "ArteForma item"),
        stripe_session_id: session.id,
        status: "paid",
      });

      if (persisted?.isNew) {
        console.log("[stripe-webhook] Sending order emails.", {
          sessionId: session.id,
          orderReference: getOrderDisplayReference(persisted.order),
          customerEmail: persisted.order.customer_email,
        });

        await sendPaidOrderEmails(buildOrderConfirmationPayload({
          order: persisted.order,
          items: persisted.items,
        }));

        console.log("[stripe-webhook] Order emails completed.", {
          sessionId: session.id,
          orderReference: getOrderDisplayReference(persisted.order),
        });
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed.";

    console.error("[stripe-webhook] Processing failed:", message);

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/stripe/webhook" }, { status: 200 });
}
