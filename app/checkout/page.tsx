"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { getShipping, getSubtotal, getTotal } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    await trackEvent("checkout_start", {
      itemCount: items.length,
      total: getTotal(items),
    });

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    const data = (await response.json()) as { url?: string; ok?: boolean; message?: string };
    if (response.ok && data.url) {
      router.push(data.url);
      return;
    }

    setError(data.message || "Checkout-ul nu a putut fi pornit acum.");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="rounded-[2.5rem] border border-white/8 bg-white/[0.03] p-8">
        <h1 className="font-serif-display text-4xl text-white">Finalizare comandă</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Stripe Checkout în RON, fără cont necesar. Livrarea este disponibilă doar în România în v1.
        </p>
        <div className="mt-10 space-y-3 text-sm text-white/68">
          <Row label="Subtotal produse" value={formatPrice(getSubtotal(items))} />
          <Row label="Livrare fixă" value={formatPrice(getShipping(items))} />
          <Row label="Total" value={formatPrice(getTotal(items))} strong />
        </div>
        <Button className="mt-8" disabled={!items.length || loading} onClick={handleCheckout}>
          {loading ? "Redirecționăm..." : "Plătește cu Stripe"}
        </Button>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex justify-between ${strong ? "pt-3 text-white" : ""}`}>
      <span>{label}</span>
      <span className={strong ? "font-semibold text-[#f6d57a]" : ""}>{value}</span>
    </div>
  );
}
