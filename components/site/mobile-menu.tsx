"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileMenu({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        aria-label="Deschide meniul"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full border border-white/10 p-3 text-white"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open ? (
        <div className="absolute inset-x-5 top-[76px] rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-5 shadow-2xl">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80"
              >
                {item.label}
              </Link>
            ))}
            <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7a12a]"
              >
              Coș
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
