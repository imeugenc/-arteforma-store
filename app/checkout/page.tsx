"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import {
  getGiftPackagingTotal,
  getPersonalizationTotal,
  getShipping,
  getSubtotal,
  getTotal,
} from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, giftPackaging } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const subtotal = getSubtotal(items);
  const personalizationTotal = getPersonalizationTotal(items);
  const shipping = getShipping(items);
  const giftPackagingTotal = getGiftPackagingTotal(items, giftPackaging);
  const total = getTotal(items, giftPackaging);
  const freeShippingReached = subtotal >= siteConfig.freeShippingThreshold;

  async function handleCheckout() {
    try {
      setLoading(true);
      setError("");
      await trackEvent("checkout_start", {
        itemCount: items.length,
        total,
        giftPackaging,
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, giftPackaging }),
      });

      const data = (await response.json()) as { url?: string; ok?: boolean; message?: string };
      if (response.ok && data.url) {
        router.push(data.url);
        return;
      }

      setError(data.message || "Checkout-ul nu a putut fi pornit acum.");
    } catch {
      setError("A apărut o problemă la redirecționarea spre plată. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-14">
      <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 sm:p-8">
        <h1 className="font-serif-display text-3xl text-white sm:text-4xl">Finalizare comandă</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Plată în RON, fără cont necesar. Livrarea este disponibilă doar în România în această etapă.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
          Apple Pay și Google Pay apar automat în Stripe Checkout dacă sunt active în contul Stripe și disponibile pe dispozitivul clientului.
        </p>
        <div className="mt-5 rounded-[1.5rem] border border-[#d7a12a]/16 bg-[#d7a12a]/6 p-4 text-sm leading-7 text-white/68">
          <p>
            Livrare gratuită pentru comenzile peste {siteConfig.freeShippingThreshold} RON.
            {freeShippingReached ? " Pragul este activ pentru această comandă." : ""}
          </p>
        </div>
        <div className="mt-6 rounded-[1.75rem] border border-white/8 bg-black/20 p-5 text-sm leading-7 text-white/60">
          <p>Comenzile ArteForma sunt realizate la comandă în România și intră, de regulă, în producție în 2–5 zile lucrătoare.</p>
          <p>Dacă ai selectat ambalare premium pentru cadou sau personalizare, costurile apar clar și în Stripe Checkout.</p>
        </div>
        <div className="mt-10 space-y-3 text-sm text-white/68">
          <Row label="Subtotal produse" value={formatPrice(subtotal)} />
          <Row label="Personalizare" value={personalizationTotal ? formatPrice(personalizationTotal) : "Nu"} />
          <Row label="Livrare" value={shipping ? formatPrice(shipping) : "Gratuit"} />
          <Row
            label="Ambalare premium"
            value={giftPackaging ? formatPrice(giftPackagingTotal) : "Nu"}
          />
          <Row label="Total" value={formatPrice(total)} strong />
        </div>
        <Button className="mt-8" disabled={!items.length || loading} onClick={handleCheckout}>
          {loading ? "Redirecționăm..." : "Plătește"}
        </Button>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        {!items.length ? null : (
          <p className="mt-4 text-sm text-white/45">
            Ambalare premium: {giftPackaging ? `da, + ${formatPrice(siteConfig.giftPackagingPrice)}` : "nu este selectată"}
          </p>
        )}
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
