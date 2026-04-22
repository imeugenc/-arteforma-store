import Stripe from "stripe";
import { env } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { OrderItemRecord, OrderRecord } from "@/lib/types";

export type PersistedOrder = {
  order: OrderRecord;
  items: OrderItemRecord[];
};

export type OrderConfirmationPayload = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  leadTime: string;
  shippingMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    variantSummary?: string | null;
  }>;
};

export async function persistStripeOrder({
  session,
  lineItems,
}: {
  session: Stripe.Checkout.Session;
  lineItems: Stripe.LineItem[];
}): Promise<PersistedOrder | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const existing = await supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .select("*")
    .eq("stripe_session_id", session.id)
    .maybeSingle<OrderRecord>();

  if (existing.data) {
    const existingItems = await supabase
      .from(env.SUPABASE_ORDER_ITEMS_TABLE)
      .select("*")
      .eq("order_id", existing.data.id)
      .returns<OrderItemRecord[]>();

    return {
      order: existing.data,
      items: existingItems.data ?? [],
    };
  }

  const customerName = session.customer_details?.name ?? session.metadata?.customer_name ?? "Client";
  const customerEmail = session.customer_details?.email ?? session.metadata?.customer_email ?? "";
  const customerPhone = session.customer_details?.phone ?? session.metadata?.customer_phone ?? null;
  const giftPackaging = session.metadata?.gift_packaging === "true";
  const personalization = lineItems.some((item) => {
    const variantSummary =
      item.price?.product &&
      typeof item.price.product !== "string" &&
      "metadata" in item.price.product
        ? item.price.product.metadata?.variant_summary
        : item.price?.nickname;

    return Boolean(variantSummary?.toLowerCase().includes("personalizare"));
  });
  const shippingCost = session.shipping_cost?.amount_total
    ? session.shipping_cost.amount_total / 100
    : Number(session.metadata?.shipping_cost ?? 0);

  const orderId = crypto.randomUUID();
  const orderPayload = {
    id: orderId,
    email: customerEmail,
    total: (session.amount_total ?? 0) / 100,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    total_amount: (session.amount_total ?? 0) / 100,
    currency: (session.currency ?? "ron").toUpperCase(),
    status: "paid",
    payment_status: session.payment_status ?? "paid",
    gift_packaging: giftPackaging,
    personalization,
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    shipping_method: session.metadata?.shipping_method ?? "Tarif fix România",
    shipping_cost: shippingCost,
    notes: session.metadata?.notes ?? null,
    source: session.metadata?.source ?? "website",
    metadata: {
      channel: session.metadata?.channel ?? "arteforma-web",
      customer_name: customerName,
      customer_email: customerEmail,
    },
  };

  const orderInsert = await insertOrderRecord(supabase, orderPayload);

  if (orderInsert.error) {
    throw orderInsert.error;
  }

  const orderItems = lineItems
    .filter((item) => item.amount_total !== null && item.quantity)
    .map((item) => {
      const product = item.price?.product;
      const metadata =
        product && typeof product !== "string" && "metadata" in product
          ? product.metadata
          : undefined;

      return {
        id: crypto.randomUUID(),
        order_id: orderId,
        product_slug: metadata?.product_slug ?? "shipping",
        product_name: item.description ?? metadata?.product_name ?? "ArteForma item",
        variant_summary: metadata?.variant_summary ?? item.price?.nickname ?? null,
        unit_price: ((item.price?.unit_amount ?? item.amount_total ?? 0) / 100) || 0,
        quantity: item.quantity ?? 1,
        line_total: (item.amount_total ?? 0) / 100,
      };
    });

  if (orderItems.length) {
    const itemsInsert = await supabase
      .from(env.SUPABASE_ORDER_ITEMS_TABLE)
      .insert(orderItems);

    if (itemsInsert.error) {
      throw itemsInsert.error;
    }
  }

  await insertOrderStatusEvent(supabase, {
    order_id: orderId,
    status: "paid",
    note: "Comandă confirmată automat după checkout.session.completed.",
  });

  const confirmationPayload = buildOrderConfirmationPayload({
    order: orderInsert.data,
    items: orderItems,
  });

  // Future email hook:
  // Use `confirmationPayload` here when transactional email is configured.
  void confirmationPayload;

  return {
    order: orderInsert.data,
    items: orderItems,
  };
}

async function insertOrderRecord(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  payload: Record<string, unknown>,
) {
  const insert = await supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .insert(payload)
    .select("*")
    .single<OrderRecord>();

  if (!insert.error) {
    return insert;
  }

  const fallbackPayload = {
    id: payload.id,
    customer_name: payload.customer_name,
    customer_email: payload.customer_email,
    customer_phone: payload.customer_phone,
    total_amount: payload.total_amount,
    currency: payload.currency,
    status: payload.status,
    stripe_session_id: payload.stripe_session_id,
    stripe_payment_intent_id: payload.stripe_payment_intent_id,
    shipping_method: payload.shipping_method,
    shipping_cost: payload.shipping_cost,
    notes: payload.notes,
    source: payload.source,
    metadata: payload.metadata,
  };

  return supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .insert(fallbackPayload)
    .select("*")
    .single<OrderRecord>();
}

async function insertOrderStatusEvent(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  payload: {
    order_id: string;
    status: string;
    note: string;
  },
) {
  try {
    const result = await supabase.from("order_status_events").insert({
      id: crypto.randomUUID(),
      ...payload,
      visible_to_customer: true,
    });

    if (result.error) {
      console.warn("[orders] Skipping order_status_events insert:", result.error.message);
    }
  } catch {
    // Best effort only until every environment has the status-events table.
  }
}

export async function getOrderBySessionId(sessionId: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const orderResult = await supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle<OrderRecord>();

  if (!orderResult.data) {
    return null;
  }

  const itemsResult = await supabase
    .from(env.SUPABASE_ORDER_ITEMS_TABLE)
    .select("*")
    .eq("order_id", orderResult.data.id)
    .returns<OrderItemRecord[]>();

  return {
    order: orderResult.data,
    items: itemsResult.data ?? [],
  };
}

export async function getCheckoutSessionSnapshot(sessionId: string) {
  if (!env.STRIPE_SECRET_KEY) {
    return null;
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.status !== "complete") {
    return null;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    expand: ["data.price.product"],
  });

  return {
    order: {
      id: session.id,
      customer_name: session.customer_details?.name ?? "Client",
      customer_email: session.customer_details?.email ?? "",
      total_amount: (session.amount_total ?? 0) / 100,
      status: "paid" as const,
      shipping_method: session.metadata?.shipping_method ?? "Tarif fix România",
      currency: (session.currency ?? "ron").toUpperCase(),
    },
    items: lineItems.data
      .filter((item) => item.quantity && item.description !== "Livrare cu tarif fix")
      .map((item) => ({
        id: item.id,
        product_name: item.description ?? "ArteForma item",
        quantity: item.quantity ?? 1,
      })),
  };
}

export async function getRecentOrders(limit = 20) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const ordersResult = await supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<OrderRecord[]>();

  if (ordersResult.error) {
    throw ordersResult.error;
  }

  const orderIds = (ordersResult.data ?? []).map((order) => order.id);

  const itemsResult = orderIds.length
    ? await supabase
        .from(env.SUPABASE_ORDER_ITEMS_TABLE)
        .select("*")
        .in("order_id", orderIds)
        .returns<OrderItemRecord[]>()
    : { data: [] as OrderItemRecord[], error: null };

  if (itemsResult.error) {
    throw itemsResult.error;
  }

  return {
    orders: ordersResult.data ?? [],
    items: itemsResult.data ?? [],
  };
}

export function buildOrderConfirmationPayload({
  order,
  items,
}: PersistedOrder): OrderConfirmationPayload {
  return {
    orderId: order.id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    totalAmount: order.total_amount,
    currency: order.currency,
    leadTime: "2–5 zile lucrătoare",
    shippingMethod: order.shipping_method,
    items: items.map((item) => ({
      name: item.product_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.line_total,
      variantSummary: item.variant_summary,
    })),
  };
}
