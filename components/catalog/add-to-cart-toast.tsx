"use client";

import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";

export function AddToCartToast({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`pointer-events-none fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm transition duration-300 sm:bottom-7 sm:right-7 ${
        open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      aria-live="polite"
    >
      <div className="pointer-events-auto overflow-hidden rounded-[1.8rem] border border-[#d7a12a]/18 bg-[#0a0a0a]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d7a12a]/12 text-[#f4deb0]">
            <Check className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
              Adăugat în coș
            </p>
            <p className="mt-2 text-sm leading-7 text-white/78">
              Obiecte gândite să stea la vedere în spațiul cuiva.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-[#d7a12a]/18 bg-[#d7a12a]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f7df9b] transition hover:border-[#d7a12a]/36 hover:text-white"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Vezi coșul
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="text-xs uppercase tracking-[0.24em] text-white/36 transition hover:text-white/70"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
