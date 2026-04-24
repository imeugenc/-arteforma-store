"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { Product } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { AddToCartToast } from "@/components/catalog/add-to-cart-toast";
import { siteConfig } from "@/lib/site";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [material, setMaterial] = useState(product.materials[0] ?? "");
  const [personalizationSelected, setPersonalizationSelected] = useState(false);
  const [personalization, setPersonalization] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (!toastOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastOpen(false);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [toastOpen]);

  return (
    <>
      <div className="space-y-5 rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
        <OptionSelect
          label={product.sizeLabel ?? "Dimensiune"}
          value={size}
          onChange={setSize}
          options={product.sizes}
        />
        <OptionSelect
          label={product.colorLabel ?? "Finisaj"}
          value={color}
          onChange={setColor}
          options={product.colors}
        />
        <OptionSelect
          label={product.materialLabel ?? "Material"}
          value={material}
          onChange={setMaterial}
          options={product.materials}
        />
        {product.personalizationLabel ? (
          <div className="space-y-3 rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
            <label className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={personalizationSelected}
                onChange={(event) => setPersonalizationSelected(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 accent-[#d7a12a]"
              />
              <span className="block">
                <span className="block text-sm font-medium text-white">
                  Personalizare (+{siteConfig.personalizationPrice} RON)
                </span>
                <span className="mt-1 block text-sm leading-7 text-white/55">
                  Personalizarea poate genera un cost suplimentar.
                </span>
              </span>
            </label>
            <label className="block space-y-2 text-sm text-white/70">
              <span className="font-medium text-white">{product.personalizationLabel}</span>
              <input
                value={personalization}
                onChange={(event) => setPersonalization(event.target.value)}
                placeholder="Exemplu: nume, inițiale sau text scurt"
                disabled={!personalizationSelected}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d7a12a]/40 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>
          </div>
        ) : null}
        <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/62">
          <p>Realizat la comandă în România.</p>
          <p>Timp de producție: {product.leadTime}.</p>
          <p>Livrare gratuită pentru comenzile peste {siteConfig.freeShippingThreshold} RON.</p>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            const itemId = [
              product.slug,
              size,
              color,
              material,
              personalizationSelected ? "personalized" : "standard",
              personalizationSelected ? personalization : "",
            ].join("::");

            addItem({
              id: itemId,
              slug: product.slug,
              name: product.name,
              price: product.price,
              quantity: 1,
              size,
              color,
              material,
              personalizationSelected,
              personalization: personalizationSelected ? personalization : "",
              accent: product.visual.accent,
              shippingSettings: product.shippingSettings,
              shippingNote: product.shippingNote,
            });
            setToastOpen(true);
            void trackEvent("add_to_cart", {
              slug: product.slug,
              price: product.price,
              size,
              color,
              material,
              personalizationSelected,
            });
          }}
        >
          Adaugă în coș
        </Button>
      </div>
      <AddToCartToast open={toastOpen} onClose={() => setToastOpen(false)} />
    </>
  );
}

function OptionSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#d7a12a]/40"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
