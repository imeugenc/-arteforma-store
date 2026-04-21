import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, Truck, WandSparkles } from "lucide-react";
import { categories, getFeaturedProducts } from "@/lib/catalog";
import { siteConfig, testimonials, trustPoints } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/catalog/category-card";
import { ProductCard } from "@/components/catalog/product-card";

export const metadata = buildMetadata({
  description:
    "ArteForma creează în Brașov obiecte premium printate 3D, din colecție și custom, pentru birouri, setup-uri, cadouri și interioare cu personalitate.",
  path: "/",
});

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div className="pb-20">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-18 pt-12 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:pt-20">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#d7a12a]/20 bg-[#d7a12a]/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e8cf93]">
            <Sparkles className="h-4 w-4" />
            Realizat la comandă în România
          </div>
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-white/34">ArteForma, Brașov</p>
            <h1 className="font-serif-display text-5xl leading-[0.94] text-white sm:text-6xl lg:text-[5.25rem]">
              Din idee în realitate.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/70 sm:text-xl">
              Artă printată 3D, creată pentru spațiul tău.
              <span className="block text-[#f2dfaf]">{siteConfig.heroStatement}</span>
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/shop">
              <Button>Intră în magazin</Button>
            </Link>
            <Link href="/custom-orders">
              <Button variant="secondary">Începe o comandă custom</Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Producție" value="3–7 zile lucrătoare" />
            <Stat label="Livrare" value="Oriunde în România" />
            <Stat label="Semnătură" value="Piesă custom premium" />
          </div>
        </div>

        <div className="surface-panel-strong relative overflow-hidden rounded-[2.75rem] p-5 sm:p-7">
          <div className="absolute inset-0 premium-grid opacity-30" />
          <div className="absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#d7a12a]/14 blur-3xl" />
          <div className="absolute bottom-10 right-2 h-56 w-56 rounded-full bg-[#d7a12a]/10 blur-3xl" />
          <div className="relative">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d7a12a]">
                  Identitate premium-tech
                </p>
                <p className="max-w-md text-sm leading-7 text-white/58">
                  Construit pentru cultura auto, birouri de trading, spații de creator, cadouri și obiecte de brand care au nevoie de prezență reală.
                </p>
              </div>
              <div className="hidden items-start lg:flex">
                <FeaturePill icon={<WandSparkles className="h-4 w-4" />} label="Brand construit în jurul pieselor custom" />
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-[2.25rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(215,161,42,0.16),transparent_32%),linear-gradient(145deg,#111_0%,#070707_55%,#050505_100%)] p-5 sm:p-8">
              <Image
                src="/brand/arteforma-logo-full.png"
                alt="Logo ArteForma"
                width={1002}
                height={638}
                className="mx-auto w-full object-contain"
                priority
              />
              <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.55em] text-[#d7a12a]">
                Made Different
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <FeaturePill icon={<ShieldCheck className="h-4 w-4" />} label="Finisaj premium" />
              <FeaturePill icon={<Truck className="h-4 w-4" />} label="Livrare în România" />
              <FeaturePill icon={<Sparkles className="h-4 w-4" />} label="Ambalare potrivită și pentru cadou" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <SectionHeading
          eyebrow="Alege după stilul tău"
          title="Colecția este organizată în jurul vieții în care va ajunge obiectul."
          description="Auto. Trading. Birou. Cadouri. Obiecte care se înțeleg repede, pentru că omul potrivit știe deja de ce contează."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Piese alese"
            title="Obiectele pe care oamenii le aleg când vor ca spațiul să spună mai mult."
            description="Selecția ArteForma cu cele mai căutate piese, alese pentru prezență vizuală, valoare de cadou și conversie clară."
          />
          <Link href="/shop">
            <Button variant="ghost">Vezi toate produsele</Button>
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <div className="surface-panel-strong grid gap-8 rounded-[2.5rem] p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d7a12a]">
              Comenzi custom
            </p>
            <h2 className="font-serif-display text-4xl leading-tight text-white lg:text-5xl">
              Tu trimiți ideea. Noi construim obiectul în jurul ei.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-white/68">
              Logo-uri, siluete auto, cadouri, piese pentru birou, obiecte de perete sau ceva ce nu găsești nicăieri gata făcut. Avantajul real ArteForma nu este doar catalogul, ci faptul că putem construi versiunea ta.
            </p>
            <Link href="/custom-orders">
              <Button>Cere o piesă custom</Button>
            </Link>
          </div>
          <div className="rounded-[2rem] border border-white/8 bg-black/25 p-6">
            <ol className="space-y-5">
              {[
                "Ne trimiți o referință, un logo, o poză sau o idee clară.",
                "Analizăm dimensiunea, finisajul, fezabilitatea și contextul de utilizare.",
                "Modelăm piesa ca să aibă impact vizual și prezență premium.",
                "Printăm, finisăm și livrăm din Brașov.",
              ].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d7a12a] font-semibold text-black">
                    {index + 1}
                  </span>
                  <span className="text-white/72">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <SectionHeading
          eyebrow="Proces"
          title="Clar, premium și făcut să se miște repede."
          description="Experiența de cumpărare trebuie să se simtă la fel de controlată ca obiectul pe care îl primești."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {[
            {
              title: "Idee",
              body: "Alegi o piesă din colecție sau ne trimiți un brief bun, cu referințe, dimensiuni și context.",
            },
            {
              title: "Design",
              body: "Transformăm ideea într-un obiect echilibrat, bun de expus și coerent cu estetica ArteForma.",
            },
            {
              title: "Print",
              body: "Fiecare obiect este realizat la comandă în România, cu accent pe finisaj și verificare atentă înainte de ambalare.",
            },
            {
              title: "Livrare",
              body: "Livrare cu tarif fix în România, ambalare premium și un produs care ajunge cu prezență, nu cu scuze.",
            },
          ].map((step, index) => (
            <div key={step.title} className="surface-panel rounded-[2rem] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">
                0{index + 1}
              </div>
              <h3 className="mt-5 font-serif-display text-2xl text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <SectionHeading
          eyebrow="De ce ArteForma"
          title="De ce convertește mai bine decât un magazin generic de print."
          description="Clientul nu plătește doar pentru un print. Plătește pentru gust, identitate și siguranța că obiectul chiar va aparține spațiului lui."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <div key={point} className="surface-panel rounded-[2rem] p-6 text-sm leading-7 text-white/72">
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <SectionHeading
          eyebrow="Galerie"
          title="Obiecte gândite să stea la vedere, în spații reale."
          description="Setup-uri dark, colțuri de birou, momente de gifting și contexte premium de display care îl ajută pe client să își imagineze rapid produsul în viața lui."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="surface-panel overflow-hidden rounded-[2rem]">
            <Image
              src="/mockups/arteforma-mockups-board.png"
              alt="Mockup-uri premium ArteForma"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-6">
            {[
              "Vizualurile mari ajută oamenii să înțeleagă calitatea în mai puțin de trei secunde.",
              "Ambalarea premium contează mult, pentru că multe comenzi sunt și cadouri.",
              "Direcția black & gold face brandul să se simtă high-end înainte ca prețul să intre în discuție.",
            ].map((item) => (
              <div key={item} className="surface-panel rounded-[2rem] p-6 text-white/70">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <SectionHeading
          eyebrow="Ce spun clienții"
          title="Premium funcționează doar când produsul confirmă promisiunea."
          description="Scopul e simplu: obiectul trebuie să se simtă mai bine în realitate decât părea în pagina de produs."
          align="center"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.name} className="surface-panel rounded-[2rem] p-6">
              <p className="text-lg leading-8 text-white/84">„{testimonial.quote}”</p>
              <footer className="mt-6 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">
                  {testimonial.name}
                </p>
                <p className="text-sm text-white/45">{testimonial.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8">
        <div className="surface-panel-strong rounded-[2.75rem] p-8 text-center lg:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d7a12a]">
            Ultimul pas
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-serif-display text-4xl text-white lg:text-5xl">
            Construiește ceva care pare făcut exact pentru spațiul tău.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/68">
            Fie din colecție, fie complet custom, fiecare obiect ArteForma este realizat la comandă în România și gândit să se simtă personal.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/shop">
              <Button>Intră în shop</Button>
            </Link>
            <Link href="/custom-orders">
              <Button variant="secondary">Vorbește cu noi despre o piesă custom</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-panel rounded-[1.75rem] p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-white/35">{label}</p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function FeaturePill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/8 bg-black/35 px-4 py-3 text-sm text-white/72">
      <span className="text-[#d7a12a]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
