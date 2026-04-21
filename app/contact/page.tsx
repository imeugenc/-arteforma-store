import { Metadata } from "next";
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
        title="Întrebări, estimări, colaborări."
        description="Pentru proiecte custom, întrebări despre produse sau colaborări, aici începe conversația. Comunicarea rămâne directă, clară și umană."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <ContactCard label="Email" value={siteConfig.email} />
        <ContactCard label="Telefon" value={siteConfig.phone} />
        <ContactCard label="Locație" value={`${siteConfig.city}, ${siteConfig.country}`} />
      </div>
    </div>
  );
}

function ContactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-[#d7a12a]">{label}</p>
      <p className="mt-4 text-lg text-white">{value}</p>
    </div>
  );
}
