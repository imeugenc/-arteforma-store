import { track } from "@vercel/analytics";

type VercelAnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsEvent =
  | "add_to_cart"
  | "checkout_start"
  | "custom_order_submit"
  | "purchase";

function toVercelPayload(payload: Record<string, unknown>): VercelAnalyticsPayload {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null ||
        typeof value === "undefined"
      ) {
        return [key, value];
      }

      return [key, JSON.stringify(value)];
    }),
  );
}

export async function trackEvent(
  event: AnalyticsEvent,
  payload: Record<string, unknown>,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("arteforma:analytics", {
      detail: { event, payload },
    }),
  );

  track(event, toVercelPayload(payload));

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, payload }),
    });
  } catch {
    // Fire-and-forget analytics should not block UX.
  }
}
