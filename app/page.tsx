import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, Truck, WandSparkles } from "lucide-react";
import { categories } from "@/lib/catalog";
import { getCatalogFeaturedProducts, getCatalogProductsByCategory } from "@/lib/admin-catalog";
import { testimonials, trustPoints } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/catalog/category-card";
import { ProductCard } from "@/components/catalog/product-card";

export const metadata = buildMetadata({
  description:
    "ArteForma creează în Brașov obiecte printate 3D, din colecție și la comandă, pentru birou, decor, auto, cadouri și spații în care detaliile contează.",
  path: "/",
});

export default async function HomePage() {
  const featured = await getCatalogFeaturedProducts();
  const deskProducts = (await getCatalogProductsByCategory("desk-setup")).slice(0, 3);
  const autoProducts = (await getCatalogProductsByCategory("auto-moto")).slice(0, 3);
  const cryptoProducts = (await getCatalogProductsByCategory("crypto-trading")).slice(0, 2);
  const giftProducts = (await getCatalogProductsByCategory("gifts")).slice(0, 2);
  const collectionHighlights = [
    {
      title: "Lămpi",
      body: "Piese luminoase pentru birou, raft sau cadou, cu accent mai puternic pe atmosferă și prezentare.",
    },
    {
      title: "Ceasuri de perete",
      body: "Modele statement pentru spații personale, birouri sau zone de display unde obiectul trebuie să conteze vizual.",
    },
    {
      title: "Vaze decorative",
      body: "Pentru utilizare decorativă. Rezistența la apă poate varia în funcție de model și finisaj.",
    },
  ];

  return (
    <div className="pb-20">
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-8 sm:px-8 lg:min-h-[70vh] lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-10 lg:pt-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#d7a12a]/20 bg-[#d7a12a]/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e8cf93]">
            <Sparkles className="h-4 w-4" />
            Realizat la comandă în România
          </div>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-white/34">ArteForma, Brașov</p>
            <h1 className="max-w-2xl font-serif-display text-[2.4rem] leading-[1.03] text-white sm:text-[3rem] lg:text-[3.45rem]">
              Obiecte premium printate 3D, create pentru spațiul tău.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Cadouri, decor și piese custom realizate la comandă.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/shop">
              <Button>Vezi colecția</Button>
            </Link>
            <Link href="/custom-orders">
              <Button variant="secondary">Creează un produs personalizat</Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Realizat în" value="Brașov, România" />
            <Stat label="Producție" value="2–5 zile lucrătoare" />
            <Stat label="Plată" value="Securizată online" />
          </div>
        </div>

        <div className="surface-panel-strong relative overflow-hidden rounded-[2.35rem] p-4 sm:p-5">
          <div className="absolute inset-0 premium-grid opacity-30" />
          <div className="absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#d7a12a]/14 blur-3xl" />
          <div className="absolute bottom-10 right-2 h-56 w-56 rounded-full bg-[#d7a12a]/10 blur-3xl" />
          <div className="relative">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d7a12a]">
                  Selecție ArteForma
                </p>
                <p className="max-w-md text-sm leading-7 text-white/58">
                  Piese pentru auto, crypto, birou și cadouri, într-o prezentare mai clară și mai ușor de cumpărat.
                </p>
              </div>
              <div className="hidden items-start lg:flex">
                <FeaturePill icon={<WandSparkles className="h-4 w-4" />} label="Colecție + comenzi custom analizate manual" />
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(215,161,42,0.16),transparent_32%),linear-gradient(145deg,#111_0%,#070707_55%,#050505_100%)] p-3 sm:p-4">
              <Image
                src="/brand/1.jpg"
                alt="Piese ArteForma expuse într-un context premium"
                width={1024}
                height={1024}
                className="mx-auto aspect-square w-full rounded-[1.65rem] object-cover"
                priority
              />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <FeaturePill icon={<ShieldCheck className="h-4 w-4" />} label="Plată securizată" />
              <FeaturePill icon={<Truck className="h-4 w-4" />} label="Livrare în România" />
              <FeaturePill icon={<Sparkles className="h-4 w-4" />} label="Ambalare premium" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="surface-panel-strong grid gap-6 rounded-[2.35rem] p-5 sm:p-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-black/20">
            <Image
              src="/brand/2.jpg"
              alt="ArteForma într-un context de brand premium"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                Cum se citește produsul
              </p>
              <p className="mt-3 text-sm leading-7 text-white/68">
                Un produs bun trebuie înțeles repede: ce este, unde arată bine și de ce merită cumpărat. De aceea insistăm pe volum clar, finisaj curat și prezență reală în spațiu.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                Pentru cadouri și decor
              </p>
              <p className="mt-3 text-sm leading-7 text-white/68">
                Fie că merg spre birou, perete sau cadou, piesele trebuie să fie suficient de clare încât clientul să le înțeleagă imediat și să simtă că se potrivesc locului în care ajung.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                Ce urmează în colecție
              </p>
              <p className="mt-3 text-sm leading-7 text-white/68">
                Pe lângă siluete auto, desk pieces și cadouri, colecția poate merge natural și spre lămpi, ceasuri de perete și vaze decorative gândite pentru utilizare decorativă.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Best sellers"
            title="Produsele pe care oamenii le înțeleg și le comandă repede."
            description="Cele mai clare piese pentru birou, cadouri, auto și setup. Preț vizibil, producție clară și opțiuni ușor de ales."
          />
          <Link href="/shop">
            <Button variant="ghost">Vezi tot magazinul</Button>
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featured.slice(0, 3).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeading
          eyebrow="Categorii"
          title="Găsești repede ce vrei după tipul de produs și spațiul în care va ajunge."
          description="Auto / Moto, Crypto / Trading, Birou / Setup, Cadouri și obiecte cu personalitate. Totul este organizat ca un magazin real, nu ca o colecție greu de descifrat."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {collectionHighlights.map((item) => (
            <div key={item.title} className="surface-panel rounded-[1.75rem] p-5 text-sm leading-7 text-white/68">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                {item.title}
              </p>
              <p className="mt-3">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Piese pentru birou"
            title="Piese pentru birou, trading și branding fizic care se cumpără ușor."
            description="Pentru birouri curate, rafturi bine controlate vizual și spații în care fiecare detaliu trebuie să pară intenționat."
          />
          <Link href="/shop">
            <Button variant="ghost">Vezi toate piesele de birou</Button>
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {deskProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-panel rounded-[2.5rem] p-7 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d7a12a]">
                  Auto / Moto
                </p>
                <h2 className="mt-4 font-serif-display text-3xl text-white">
                  Siluete și obiecte pentru oameni care recunosc imediat forma potrivită.
                </h2>
              </div>
              <Link href="/categories/auto-moto">
                <Button variant="ghost">Vezi categoria</Button>
              </Link>
            </div>
            <div className="mt-6 grid gap-6">
              {autoProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
          <div className="surface-panel rounded-[2.5rem] p-7 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d7a12a]">
                  Crypto / Trading & Cadouri
                </p>
                <h2 className="mt-4 font-serif-display text-3xl text-white">
                  Piese de birou și cadouri cu prezență clară, nu doar bune pentru o poză.
                </h2>
              </div>
              <Link href="/categories/crypto-trading">
                <Button variant="ghost">Vezi colecțiile</Button>
              </Link>
            </div>
            <div className="mt-6 grid gap-6">
              {[...cryptoProducts, ...giftProducts].map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="surface-panel-strong grid gap-8 rounded-[2.5rem] p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d7a12a]">
              Comenzi custom
            </p>
            <h2 className="font-serif-display text-[2.15rem] leading-tight text-white lg:text-[2.9rem]">
              Trimite-ne ideea, referința sau contextul în care va fi folosit produsul.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-white/68 sm:text-[15px]">
              Revenim cu o variantă realistă și potrivită pentru produsul final, după ce verificăm dimensiunea, materialul și felul în care va fi folosit produsul.
            </p>
            <Link href="/custom-orders">
              <Button>Creează un produs personalizat</Button>
            </Link>
          </div>
          <div className="rounded-[2rem] border border-white/8 bg-black/25 p-6">
            <ol className="space-y-5">
              {[
                "Ne trimiți o referință, un logo, o poză sau o idee clară.",
                "Analizăm dimensiunea, finisajul, fezabilitatea și locul în care va sta produsul.",
                "Pregătim o variantă clară, proporționată și potrivită pentru producție.",
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

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeading
          eyebrow="Proces"
          title="Cum funcționează, din alegere până la livrare."
          description="Vrem să înțelegi repede ce cumperi, cât durează și ce urmează după plasarea comenzii."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {[
            {
              title: "Alegi produsul",
              body: "Intri direct în colecție sau pornești o cerere custom, cu referințe, dimensiuni și context clar.",
            },
            {
              title: "Confirmăm detaliile",
              body: "Verificăm materialul, finisajul, dimensiunea și opțiunile de personalizare înainte de producție.",
            },
            {
              title: "Producem",
              body: "Fiecare obiect este realizat la comandă în România, cu verificare atentă înainte de ambalare.",
            },
            {
              title: "Livrare",
              body: "Livrăm în România, cu tarif fix, ambalare atentă și opțiune separată de ambalare premium pentru cadou.",
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

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <SectionHeading
          eyebrow="De ce ArteForma"
          title="Motive clare pentru care oamenii comandă cu mai multă încredere."
          description="Nu ne bazăm doar pe vizual. Contează producția, claritatea opțiunilor, livrarea și faptul că fiecare cerere custom este analizată manual."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {trustPoints.map((point) => (
            <div key={point} className="surface-panel rounded-[2rem] p-6 text-sm leading-7 text-white/72">
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <SectionHeading
          eyebrow="Ce spun clienții"
          title="Contează ca produsul să confirme ce promite pagina."
          description="Recenzii scurte, directe, despre felul în care produsul arată după livrare și cum se simte în spațiul clientului."
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

      <section className="mx-auto max-w-7xl px-5 pb-8 pt-10 sm:px-8">
        <div className="surface-panel-strong rounded-[2.75rem] p-8 text-center lg:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d7a12a]">
            Ultimul pas
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-serif-display text-[2.15rem] text-white lg:text-[2.9rem]">
            Vezi colecția sau pornește de la ideea ta.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/68 sm:text-[15px]">
            Fie din colecție, fie complet custom, fiecare obiect ArteForma este realizat la comandă în România și intră în producție doar după ce detaliile sunt clare.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/shop">
              <Button>Vezi colecția</Button>
            </Link>
            <Link href="/custom-orders">
              <Button variant="secondary">Creează un produs personalizat</Button>
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
