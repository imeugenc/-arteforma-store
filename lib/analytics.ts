export type AnalyticsEvent =
  | "add_to_cart"
  | "checkout_start"
  | "custom_order_submit"
  | "purchase";

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
