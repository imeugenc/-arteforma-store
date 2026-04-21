"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getShipping, getSubtotal, getTotal } from "@/lib/checkout";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = getSubtotal(items);
  const shipping = getShipping(items);
  const total = getTotal(items);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h1 className="font-serif-display text-4xl text-white">Coș</h1>
          <p className="text-white/65">Checkout curat, cantități editabile, livrare doar în România în v1.</p>
          <div className="space-y-4">
            {items.length ? (
              items.map((item) => (
                <div key={`${item.slug}-${item.size}-${item.color}-${item.material}`} className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-serif-display text-2xl text-white">{item.name}</h2>
                      <p className="mt-2 text-sm text-white/55">
                        {item.size} · {item.color} · {item.material}
                      </p>
                      {item.personalization ? (
                        <p className="mt-1 text-sm text-white/55">Personalizare: {item.personalization}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="rounded-full border border-white/10 p-2 text-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="rounded-full border border-white/10 p-2 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="rounded-full border border-white/10 p-2 text-white/70"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-right text-lg font-semibold text-[#f6d57a]">
                    {formatPrice(item.price * item.quantity)}
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
        <div className="h-fit rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
          <h2 className="font-serif-display text-2xl text-white">Rezumat comandă</h2>
          <div className="mt-6 space-y-3 text-sm text-white/65">
            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
            <SummaryRow label="Livrare" value={formatPrice(shipping)} />
            <SummaryRow label="Total" value={formatPrice(total)} strong />
          </div>
          <p className="mt-6 text-sm leading-7 text-white/55">
            Realizat la comandă în România. Timp de producție: 3–7 zile.
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
