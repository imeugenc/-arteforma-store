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

  useEffect(() => {
    if (hasHandledSuccess.current) {
      return;
    }

    hasHandledSuccess.current = true;
    clearCart();

    if (orderId || sessionId) {
      void trackEvent("purchase", {
        orderId,
        sessionId,
        totalAmount,
      });
    }
  }, [clearCart, orderId, sessionId, totalAmount]);

  return null;
}
