"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { trackEvent } from "@/lib/analytics";

export function SuccessEffects({
  orderId,
  totalAmount,
  sessionId,
}: {
  orderId?: string;
  totalAmount?: number;
  sessionId?: string;
}) {
  const { clearCart } = useCart();
  const hasHandledSuccess = useRef(false);
  const storageKey = sessionId ? `arteforma-success-${sessionId}` : null;

  useEffect(() => {
    if (hasHandledSuccess.current) {
      return;
    }

    if (storageKey && typeof window !== "undefined") {
      const alreadyHandled = window.sessionStorage.getItem(storageKey);
      if (alreadyHandled) {
        hasHandledSuccess.current = true;
        return;
      }
    }

    hasHandledSuccess.current = true;
    clearCart();

    if (storageKey && typeof window !== "undefined") {
      window.sessionStorage.setItem(storageKey, "1");
    }

    if (orderId || sessionId) {
      void trackEvent("purchase", {
        orderId,
        sessionId,
        totalAmount,
      });
    }
  }, [clearCart, orderId, sessionId, storageKey, totalAmount]);

  return null;
}
