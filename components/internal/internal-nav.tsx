"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const navItems = [
  { href: "/internal", label: "Dashboard" },
  { href: "/internal/orders", label: "Comenzi" },
  { href: "/internal/products", label: "Produse" },
  { href: "/internal/reviews", label: "Recenzii" },
  { href: "/internal/media", label: "Media" },
];

export function InternalNav() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <nav className="mb-8 flex flex-wrap gap-3">
      {navItems.map((item) => {
        const href = token ? `${item.href}?token=${encodeURIComponent(token)}` : item.href;

        return (
          <Link
            key={item.href}
            href={href}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-[#d7a12a]/35 hover:text-white"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
