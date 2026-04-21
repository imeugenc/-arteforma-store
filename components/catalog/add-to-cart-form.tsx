"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { Product } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [material, setMaterial] = useState(product.materials[0] ?? "");
  const [personalization, setPersonalization] = useState("");

  return (
    <div className="space-y-5 rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
      <OptionSelect
        label={product.sizeLabel ?? "Dimensiune"}
        value={size}
        onChange={setSize}
        options={product.sizes}
      />
      <OptionSelect
        label={product.colorLabel ?? "Culoare"}
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
        <label className="block space-y-2 text-sm text-white/70">
          <span className="font-medium text-white">{product.personalizationLabel}</span>
          <input
            value={personalization}
            onChange={(event) => setPersonalization(event.target.value)}
            placeholder="Personalizare opțională"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d7a12a]/40"
          />
        </label>
      ) : null}
      <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/62">
        <p>Realizat la comandă în România.</p>
        <p>Timp de producție: {product.leadTime}.</p>
      </div>
      <Button
        className="w-full"
        onClick={() => {
          addItem({
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: 1,
            size,
            color,
            material,
            personalization,
            accent: product.visual.accent,
          });
          void trackEvent("add_to_cart", {
            slug: product.slug,
            price: product.price,
            size,
            color,
            material,
          });
        }}
      >
        Adaugă în coș
      </Button>
    </div>
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
