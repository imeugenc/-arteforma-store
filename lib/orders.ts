import Stripe from "stripe";
import { env } from "@/lib/env";
import { sendOrderStatusEmail } from "@/lib/order-emails";
import { siteConfig } from "@/lib/site";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type {
  OrderItemRecord,
  OrderRecord,
  OrderStatus,
  OrderStatusEventRecord,
} from "@/lib/types";

export type PersistedOrder = {
  order: OrderRecord;
  items: OrderItemRecord[];
  isNew: boolean;
};

export const ADMIN_ORDER_STATUSES: OrderStatus[] = [
  "paid",
  "in_production",
  "shipped",
  "completed",
  "cancelled",
];

export type OrderConfirmationPayload = {
  orderReference: string;
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

const PUBLIC_ORDER_PREFIX = "AF";
const PUBLIC_ORDER_START = 1049;

function buildPublicOrderRef(value: number) {
  return `${PUBLIC_ORDER_PREFIX}-${value}`;
}

function parsePublicOrderRef(value?: string | null) {
  if (!value) {
    return null;
  }

  const match = value.trim().toUpperCase().match(/^AF-(\d+)$/);
  return match ? Number(match[1]) : null;
}

function isPublicOrderRefSchemaMissing(message?: string) {
  if (!message) {
    return false;
  }

  return message.includes("public_order_ref") && (message.includes("column") || message.includes("schema cache"));
}

export function getOrderDisplayReference(order: Pick<OrderRecord, "id" | "public_order_ref">) {
  return order.public_order_ref ?? `AF-${order.id.slice(0, 8).toUpperCase()}`;
}

export function translateOrderStatus(status: string) {
  switch (status) {
    case "paid":
      return "Plătită";
    case "in_production":
      return "În producție";
    case "shipped":
      return "Expediată";
    case "completed":
      return "Finalizată";
    case "cancelled":
      return "Anulată";
    default:
      return status;
  }
}

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
    const existingOrder = await ensurePublicOrderRefForOrder(supabase, existing.data);
    const existingItems = await supabase
      .from(env.SUPABASE_ORDER_ITEMS_TABLE)
      .select("*")
      .eq("order_id", existingOrder.id)
      .returns<OrderItemRecord[]>();

    return {
      order: existingOrder,
      items: existingItems.data ?? [],
      isNew: false,
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

  const orderWithPublicRef = await ensurePublicOrderRefForOrder(supabase, orderInsert.data);

  const confirmationPayload = buildOrderConfirmationPayload({
    order: orderWithPublicRef,
    items: orderItems,
  });

  // Future email hook:
  // Use `confirmationPayload` here when transactional email is configured.
  void confirmationPayload;

  return {
    order: orderWithPublicRef,
    items: orderItems,
    isNew: true,
  };
}

async function ensurePublicOrderRefForOrder(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  order: OrderRecord,
) {
  if (order.public_order_ref) {
    return order;
  }

  const publicOrderRef = await claimNextPublicOrderRef(supabase, order.id);

  if (!publicOrderRef) {
    return order;
  }

  return {
    ...order,
    public_order_ref: publicOrderRef,
  };
}

async function ensurePublicOrderRefs(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  orders: OrderRecord[],
) {
  const normalized: OrderRecord[] = [];

  for (const order of orders) {
    normalized.push(await ensurePublicOrderRefForOrder(supabase, order));
  }

  return normalized;
}

async function claimNextPublicOrderRef(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  orderId: string,
) {
  const currentResult = await supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .select("public_order_ref")
    .eq("id", orderId)
    .maybeSingle<{ public_order_ref?: string | null }>();

  if (currentResult.error) {
    if (isPublicOrderRefSchemaMissing(currentResult.error.message)) {
      return null;
    }

    throw currentResult.error;
  }

  if (currentResult.data?.public_order_ref) {
    return currentResult.data.public_order_ref;
  }

  const refsResult = await supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .select("public_order_ref")
    .not("public_order_ref", "is", null)
    .returns<Array<{ public_order_ref?: string | null }>>();

  if (refsResult.error) {
    if (isPublicOrderRefSchemaMissing(refsResult.error.message)) {
      return null;
    }

    throw refsResult.error;
  }

  const nextBase =
    Math.max(
      PUBLIC_ORDER_START - 1,
      ...(refsResult.data ?? [])
        .map((row) => parsePublicOrderRef(row.public_order_ref))
        .filter((value): value is number => typeof value === "number"),
    ) + 1;

  for (let offset = 0; offset < 8; offset += 1) {
    const candidate = buildPublicOrderRef(nextBase + offset);
    const updateResult = await supabase
      .from(env.SUPABASE_ORDERS_TABLE)
      .update({ public_order_ref: candidate })
      .eq("id", orderId)
      .is("public_order_ref", null)
      .select("public_order_ref")
      .maybeSingle<{ public_order_ref?: string | null }>();

    if (!updateResult.error && updateResult.data?.public_order_ref) {
      return updateResult.data.public_order_ref;
    }

    if (updateResult.error && !isPublicOrderRefSchemaMissing(updateResult.error.message)) {
      const lower = updateResult.error.message.toLowerCase();

      if (!lower.includes("duplicate")) {
        throw updateResult.error;
      }
    }

    const refreshed = await supabase
      .from(env.SUPABASE_ORDERS_TABLE)
      .select("public_order_ref")
      .eq("id", orderId)
      .maybeSingle<{ public_order_ref?: string | null }>();

    if (refreshed.data?.public_order_ref) {
      return refreshed.data.public_order_ref;
    }
  }

  throw new Error("Nu am putut genera o referință publică pentru comandă.");
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

  const normalizedOrder = await ensurePublicOrderRefForOrder(supabase, orderResult.data);

  const itemsResult = await supabase
    .from(env.SUPABASE_ORDER_ITEMS_TABLE)
    .select("*")
    .eq("order_id", normalizedOrder.id)
    .returns<OrderItemRecord[]>();

  return {
    order: normalizedOrder,
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
      public_order_ref: null,
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

  const normalizedOrders = await ensurePublicOrderRefs(supabase, ordersResult.data ?? []);
  const orderIds = normalizedOrders.map((order) => order.id);

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
    orders: normalizedOrders,
    items: itemsResult.data ?? [],
  };
}

export async function getRecentOrdersFiltered({
  limit = 25,
  status,
  email,
}: {
  limit?: number;
  status?: string;
  email?: string;
}) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  let query = supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  if (email) {
    query = query.ilike("customer_email", `%${email}%`);
  }

  const ordersResult = await query.returns<OrderRecord[]>();

  if (ordersResult.error) {
    throw ordersResult.error;
  }

  const normalizedOrders = await ensurePublicOrderRefs(supabase, ordersResult.data ?? []);
  const orderIds = normalizedOrders.map((order) => order.id);
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

  const eventsResult = orderIds.length
    ? await supabase
        .from("order_status_events")
        .select("*")
        .in("order_id", orderIds)
        .order("created_at", { ascending: false })
        .returns<OrderStatusEventRecord[]>()
    : { data: [] as OrderStatusEventRecord[], error: null };

  if (eventsResult.error) {
    console.warn("[orders] Could not load status events:", eventsResult.error.message);
  }

  return {
    orders: normalizedOrders,
    items: itemsResult.data ?? [],
    events: eventsResult.data ?? [],
  };
}

export async function updateOrderStatus({
  orderId,
  status,
  note,
}: {
  orderId: string;
  status: OrderStatus;
  note?: string;
}) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const updateResult = await supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .update({ status })
    .eq("id", orderId)
    .select("*")
    .single<OrderRecord>();

  if (updateResult.error) {
    throw updateResult.error;
  }

  const updatedOrder = await ensurePublicOrderRefForOrder(supabase, updateResult.data);

  await insertOrderStatusEvent(supabase, {
    order_id: orderId,
    status,
    note: note?.trim() || `Status actualizat la ${status}.`,
  });

  const statusLookupUrl = `${siteConfig.url}/account/status?identifier=${encodeURIComponent(
    getOrderDisplayReference(updatedOrder),
  )}&email=${encodeURIComponent(updatedOrder.customer_email)}`;

  await sendOrderStatusEmail({
    customerEmail: updatedOrder.customer_email,
    customerName: updatedOrder.customer_name,
    orderReference: getOrderDisplayReference(updatedOrder),
    status,
    statusLookupUrl,
  });

  return updatedOrder;
}

export async function getCustomerOrderStatus({
  identifier,
  email,
}: {
  identifier: string;
  email: string;
}) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const normalizedIdentifier = identifier.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedIdentifier || !normalizedEmail) {
    return null;
  }

  const candidates: OrderRecord[] = [];
  const normalizedPublicRef = normalizedIdentifier.toUpperCase();

  const byPublicRef = await supabase
    .from(env.SUPABASE_ORDERS_TABLE)
    .select("*")
    .eq("public_order_ref", normalizedPublicRef)
    .returns<OrderRecord[]>();

  if (!byPublicRef.error && byPublicRef.data?.length) {
    candidates.push(...byPublicRef.data);
  }

  if (!candidates.length) {
    const byId = await supabase
      .from(env.SUPABASE_ORDERS_TABLE)
      .select("*")
      .eq("id", normalizedIdentifier)
      .returns<OrderRecord[]>();

    if (!byId.error && byId.data?.length) {
      candidates.push(...byId.data);
    }
  }

  if (!candidates.length) {
    const bySession = await supabase
      .from(env.SUPABASE_ORDERS_TABLE)
      .select("*")
      .eq("stripe_session_id", normalizedIdentifier)
      .returns<OrderRecord[]>();

    if (!bySession.error && bySession.data?.length) {
      candidates.push(...bySession.data);
    }
  }

  const matchedOrder = candidates.find((candidate) => {
    const emailCandidates = [candidate.customer_email, candidate.email]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    return emailCandidates.includes(normalizedEmail);
  });

  if (!matchedOrder) {
    return null;
  }

  const order = await ensurePublicOrderRefForOrder(supabase, matchedOrder);

  const itemsResult = await supabase
    .from(env.SUPABASE_ORDER_ITEMS_TABLE)
    .select("*")
    .eq("order_id", order.id)
    .returns<OrderItemRecord[]>();

  if (itemsResult.error) {
    throw itemsResult.error;
  }

  const eventsResult = await supabase
    .from("order_status_events")
    .select("*")
    .eq("order_id", order.id)
    .eq("visible_to_customer", true)
    .order("created_at", { ascending: true })
    .returns<OrderStatusEventRecord[]>();

  if (eventsResult.error) {
    console.warn("[orders] Could not load customer-visible status events:", eventsResult.error.message);
  }

  return {
    order,
    items: itemsResult.data ?? [],
    events: eventsResult.data ?? [],
  };
}

export function buildOrderConfirmationPayload({
  order,
  items,
}: {
  order: OrderRecord;
  items: OrderItemRecord[];
}): OrderConfirmationPayload {
  return {
    orderReference: getOrderDisplayReference(order),
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
