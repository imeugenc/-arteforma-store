"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  getGiftPackagingTotal,
  getPersonalizationTotal,
  getShipping,
  getSubtotal,
  getTotal,
} from "@/lib/checkout";
import { siteConfig } from "@/lib/site";

export default function CartPage() {
  const { items, updateQuantity, removeItem, giftPackaging, setGiftPackaging } = useCart();
  const subtotal = getSubtotal(items);
  const personalizationTotal = getPersonalizationTotal(items);
  const shipping = getShipping(items);
  const giftPackagingTotal = getGiftPackagingTotal(items, giftPackaging);
  const total = getTotal(items, giftPackaging);
  const freeShippingReached = subtotal >= siteConfig.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(siteConfig.freeShippingThreshold - subtotal, 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h1 className="font-serif-display text-3xl text-white sm:text-4xl">Coș</h1>
          <p className="text-white/65">
            Verifică rapid piesele alese, ajustează cantitatea și mergi mai departe spre plată.
          </p>
          <div className="rounded-[1.5rem] border border-[#d7a12a]/16 bg-[#d7a12a]/6 px-4 py-3 text-sm text-white/70">
            {freeShippingReached
              ? "Livrare gratuită activă pentru această comandă."
              : `Livrare gratuită pentru comenzile peste ${siteConfig.freeShippingThreshold} RON. Mai ai ${formatPrice(remainingForFreeShipping)} până la prag.`}
          </div>
          <div className="space-y-4">
            {items.length ? (
              items.map((item) => (
                <div key={item.id} className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-serif-display text-2xl text-white">{item.name}</h2>
                      <p className="mt-2 text-sm text-white/55">{[item.size, item.color, item.material].filter(Boolean).join(" · ")}</p>
                      {item.personalization ? (
                        <p className="mt-1 text-sm text-white/55">Personalizare: {item.personalization}</p>
                      ) : null}
                      {item.personalizationSelected ? (
                        <p className="mt-1 text-sm text-[#e7ce91]">
                          Personalizare activă: +{formatPrice(siteConfig.personalizationPrice)}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-full border border-white/10 p-2 text-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-full border border-white/10 p-2 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-full border border-white/10 p-2 text-white/70"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-right text-lg font-semibold text-[#f6d57a]">
                    {formatPrice(
                      (item.price +
                        (item.personalizationSelected ? siteConfig.personalizationPrice : 0)) *
                        item.quantity,
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-8 text-white/65">
                Coșul tău este gol. Începe din magazin sau trimite o comandă custom.
              </div>
            )}
          </div>
        </div>
        <div className="h-fit rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6">
          <h2 className="font-serif-display text-2xl text-white">Rezumat comandă</h2>
          <label className="mt-6 flex items-start gap-4 rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
            <input
              type="checkbox"
              checked={giftPackaging}
              onChange={(event) => setGiftPackaging(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 accent-[#d7a12a]"
            />
            <span className="block">
              <span className="block text-sm font-medium text-white">
                Ambalare premium (+{siteConfig.giftPackagingPrice} RON)
              </span>
              <span className="mt-1 block text-sm leading-7 text-white/55">
                Opțiune disponibilă pentru comenzile care merg direct într-un cadou sau pentru o prezentare mai atentă.
              </span>
            </span>
          </label>
          <div className="mt-6 space-y-3 text-sm text-white/65">
            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
            <SummaryRow
              label="Personalizare"
              value={personalizationTotal ? formatPrice(personalizationTotal) : "Nu"}
            />
            <SummaryRow label="Livrare" value={shipping ? formatPrice(shipping) : "Gratuit"} />
            <SummaryRow
              label="Ambalare premium"
              value={giftPackagingTotal ? formatPrice(giftPackagingTotal) : "Nu"}
            />
            <SummaryRow label="Total" value={formatPrice(total)} strong />
          </div>
          <p className="mt-6 text-sm leading-7 text-white/55">
            Realizat la comandă în România. Timp de producție: 2–5 zile lucrătoare.
          </p>
          <p className="mt-2 text-sm leading-7 text-white/45">
            Pentru piese dintr-o singură bucată, dimensiunea maximă este {siteConfig.maxPrintVolume}.
          </p>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full" disabled={!items.length}>
              Continuă spre checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${strong ? "pt-3 text-white" : ""}`}>
      <span>{label}</span>
      <span className={strong ? "font-semibold text-[#f6d57a]" : ""}>{value}</span>
    </div>
  );
}
