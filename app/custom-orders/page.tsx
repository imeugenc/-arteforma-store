import { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { CustomOrderForm } from "@/components/forms/custom-order-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Comenzi custom",
  description:
    "Trimite-ne logo-ul, o poză, o schiță sau o idee și cere un obiect premium printat 3D, realizat la comandă în Brașov.",
  path: "/custom-orders",
});

export default function CustomOrdersPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Diferențiatorul real"
            title="Ideea ta, construită la același standard premium ca brandul."
            description="Aici ArteForma nu mai este doar un magazin, ci un partener de design pentru obiectul tău. Trimite-ne ideea, referința, spațiul în care va sta, contextul de utilizare sau pur și simplu senzația pe care vrei să o transmită."
          />
          <div className="surface-panel rounded-[2rem] p-6 text-sm leading-7 text-white/68">
            <p className="text-white">
              Cele mai bune brief-uri explică unde va sta obiectul, cât de prezent vrei să se simtă, ce dimensiuni ai în minte și dacă există un termen care contează.
            </p>
            <ul className="mt-4 space-y-2">
              <li>Obiecte de perete pentru birou, garaj sau studio</li>
              <li>Decor de birou pentru creatori, gameri, traderi și fondatori</li>
              <li>Piese logo pentru office, lansări și gifting premium</li>
              <li>Siluete auto sau moto adaptate unui model anume</li>
              <li>Cadouri cu semnificație personală sau emoțională</li>
            </ul>
          </div>
        </div>
        <CustomOrderForm />
      </div>
    </div>
  );
}
