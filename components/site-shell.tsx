import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { CartButton } from "@/components/cart/cart-button";
import { MobileMenu } from "@/components/site/mobile-menu";
import { siteConfig, trustPoints } from "@/lib/site";

const brandTagline = "Made Different";

const navItems = [
  { href: "/shop", label: "Magazin" },
  { href: "/custom-orders", label: "Comenzi custom" },
  { href: "/about", label: "Despre" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-black/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[#d7a12a]/20 bg-[#0d0d0d]">
            <Image
              src="/brand/arteforma-mark.png"
              alt="Monogramă ArteForma"
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-serif-display text-lg tracking-[0.18em] text-white">ARTEFORMA</div>
            <div className="truncate text-[10px] uppercase tracking-[0.45em] text-[#d7a12a]">
              {brandTagline}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.22em] text-white/68 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/custom-orders"
            className="hidden items-center gap-2 rounded-full border border-[#d7a12a]/18 bg-[#d7a12a]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#f4deb0] transition hover:border-[#d7a12a]/40 hover:text-white xl:flex"
          >
            Începe un custom
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/cart"
            className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 transition hover:border-[#d7a12a]/30 hover:text-white sm:flex"
          >
            <ShoppingBag className="h-4 w-4" />
            Coș
          </Link>
          <CartButton />
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-[#060606]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.35fr_1fr_1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-[1.4rem] border border-[#d7a12a]/18 bg-black">
              <Image
                src="/brand/arteforma-mark.png"
                alt="Monogramă ArteForma"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">ArteForma</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.45em] text-white/42">{brandTagline}</p>
            </div>
          </div>
          <h3 className="font-serif-display text-3xl leading-tight text-white">
            Obiecte premium printate 3D, create să pară că aparțin spațiului tău.
          </h3>
          <p className="max-w-xl text-sm leading-8 text-white/65">
            Construite în Brașov pentru oamenii cărora le pasă cum îi reprezintă spațiul. Piese din colecție și piese custom, realizate la comandă în România.
          </p>
          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/62">
                {point}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Navigare</h4>
          <div className="flex flex-col gap-3 text-sm text-white/65">
            <Link href="/shop">Magazin</Link>
            <Link href="/custom-orders">Comenzi custom</Link>
            <Link href="/about">Despre / Proces</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Brand</h4>
          <div className="space-y-3 text-sm leading-7 text-white/65">
            <p>{brandTagline}</p>
            <p>{siteConfig.heroStatement}</p>
            <p>{siteConfig.shippingNote}</p>
            <p>
              {siteConfig.city}, {siteConfig.country}
            </p>
            <p>{siteConfig.email}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
