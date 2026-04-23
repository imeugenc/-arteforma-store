import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Vorbește cu ArteForma despre comenzi custom, întrebări despre produse sau oportunități de colaborare.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Întrebări, colaborări sau cereri personalizate"
        description="Scrie-ne dacă vrei detalii despre un produs, ai o idee pentru un produs personalizat sau vrei să discutăm o colaborare."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <ContactCard
          label="Email"
          value={siteConfig.email}
          href={`mailto:${siteConfig.email}`}
        />
        <ContactCard
          label="Instagram"
          value={siteConfig.instagram}
          href={siteConfig.instagramUrl}
        />
        <ContactCard
          label="TikTok"
          value={siteConfig.tiktok}
          href={siteConfig.tiktokUrl}
        />
      </div>
      <div className="mt-8 rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 text-sm leading-8 text-white/68">
        <p className="text-white">
          Pentru majoritatea discuțiilor, emailul rămâne canalul principal: clar, ușor de urmărit și potrivit pentru detalii, referințe și confirmări.
        </p>
        <p className="mt-3">
          Dacă vrei să pornești de la un proiect personalizat, poți folosi și formularul de comenzi custom sau ne poți scrie direct la{" "}
          <Link href={`mailto:${siteConfig.email}`} className="text-[#f3dfae] transition hover:text-white">
            {siteConfig.email}
          </Link>.
        </p>
        <p className="mt-3">
          Dacă ai deja o comandă plasată și vrei să vezi în ce stadiu se află, poți verifica direct în{" "}
          <Link href="/account/status" className="text-[#f3dfae] transition hover:text-white">
            pagina de status comandă
          </Link>.
        </p>
      </div>
    </div>
  );
}

function ContactCard({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-[#d7a12a]">{label}</p>
      {href ? (
        <Link href={href} className="mt-4 block text-lg text-white transition hover:text-[#f3dfae]">
          {value}
        </Link>
      ) : (
        <p className="mt-4 text-lg text-white">{value}</p>
      )}
    </div>
  );
}
