"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative rounded-full border border-white/10 p-3 text-white transition hover:border-[#d7a12a]/30"
      aria-label="Deschide coșul"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d7a12a] px-1 text-[10px] font-bold text-black">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
