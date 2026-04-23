import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CartButton } from "@/components/cart/cart-button";
import { MobileMenu } from "@/components/site/mobile-menu";
import { siteConfig, trustPoints } from "@/lib/site";

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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-[#d7a12a]/20 bg-[#0d0d0d]">
            <Image
              src="/brand/arteforma-mark.png"
              alt="Monogramă ArteForma"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-serif-display text-base tracking-[0.16em] text-white sm:text-lg">ARTEFORMA</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.2em] text-white/68 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/custom-orders"
            className="hidden items-center gap-2 rounded-full border border-[#d7a12a]/18 bg-[#d7a12a]/8 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f4deb0] transition hover:border-[#d7a12a]/40 hover:text-white xl:flex"
          >
            Creează un produs personalizat
            <ArrowRight className="h-3 w-3" />
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
            </div>
          </div>
          <h3 className="font-serif-display text-[1.9rem] leading-tight text-white sm:text-[2.2rem]">
            Piese printate 3D pentru birou, decor și cadouri, realizate la comandă în Brașov.
          </h3>
          <p className="max-w-xl text-sm leading-8 text-white/65">
            Produse din colecție și piese personalizate, realizate în Brașov.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 transition hover:border-[#d7a12a]/35 hover:text-white"
            >
              Instagram
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={siteConfig.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 transition hover:border-[#d7a12a]/35 hover:text-white"
            >
              TikTok
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
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
            <Link href="/account/status">Status comandă</Link>
            <Link href="/#recenzii">Recenzii</Link>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Informații & Legal</h4>
          <div className="space-y-3 text-sm leading-7 text-white/65">
            <p>{siteConfig.shippingNote}</p>
            <p>Ambalare premium.</p>
            <p>Livrare gratuită pentru comenzile peste {siteConfig.freeShippingThreshold} RON.</p>
            <p>
              Social: {siteConfig.instagram} / {siteConfig.tiktok}
            </p>
            <p>
              {siteConfig.city}, {siteConfig.country}
            </p>
            <a href={`mailto:${siteConfig.email}`} className="block text-white/74 transition hover:text-white">
              {siteConfig.email}
            </a>
            <Link href="/legal/terms" className="block text-white/74 transition hover:text-white">
              Termeni și condiții
            </Link>
            <Link href="/legal/privacy" className="block text-white/74 transition hover:text-white">
              Politica de confidențialitate
            </Link>
            <Link href="/legal/shipping" className="block text-white/74 transition hover:text-white">
              Livrare și retur
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
