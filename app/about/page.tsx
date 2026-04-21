import { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Despre / Proces",
  description:
    "ArteForma este un brand românesc premium din Brașov care creează obiecte printate 3D, din colecție și custom, cu estetică premium-tech.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Despre ArteForma"
        title="Nu este doar un obiect. Este o extensie a ta."
        description="ArteForma este construit în Brașov și creează obiecte premium printate 3D care se simt personale, rafinate și făcute să rămână la vedere."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Premium înainte de toate",
            body: "Concurăm prin design, storytelling și experiență. Nu prin preț mic sau volum generic de catalog.",
          },
          {
            title: "Custom în centrul brandului",
            body: "Magazinul este doar o parte din business. Diferențiatorul real este transformarea unor idei individuale în obiecte care par că aparțin deja spațiului tău.",
          },
          {
            title: "Realizat în România",
            body: "Păstrăm procesul aproape, controlat și condus de design, astfel încât fiecare piesă să se simtă intenționată de la ecran până pe raft.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6">
            <h2 className="font-serif-display text-2xl text-white">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/68">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
