import { Metadata } from "next";
import { faqItems } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description:
    "Răspunsuri despre timpul de producție, livrarea în România, comenzile custom, materiale și modul în care funcționează ArteForma.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Întrebări care apar firesc înainte de o comandă."
        description="Am adunat aici răspunsuri utile despre materiale, producție, ambalare, dimensiuni, livrare și modul în care funcționează comenzile custom."
      />
      <div className="mt-10 grid gap-4">
        {faqItems.map((item) => (
          <details key={item.question} className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6">
            <summary className="cursor-pointer list-none font-semibold text-white">{item.question}</summary>
            <p className="mt-4 text-sm leading-7 text-white/68">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
