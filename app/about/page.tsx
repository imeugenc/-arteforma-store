import { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { materialGuide } from "@/lib/materials";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Despre / Proces",
  description:
    "ArteForma creează în Brașov obiecte printate 3D, din colecție și la comandă, pentru birou, decor și cadouri care merită să rămână la vedere.",
  path: "/about",
});

const editorialCards = [
  {
    title: "Ce este ArteForma",
    body:
      "ArteForma pornește din Brașov și construiește obiecte printate 3D pentru birou, decor și cadouri care trebuie să se simtă bine rezolvate, nu doar spectaculoase într-o poză.",
  },
  {
    title: "Pentru cine lucrăm",
    body:
      "Pentru oameni care vor o piesă clară, bine proporționată și potrivită spațiului în care ajunge: birou, studio, perete, raft sau cadou.",
  },
  {
    title: "Ce înseamnă «realizat la comandă în România»",
    body:
      "Mai mult control pe producție, mai multă atenție pe detalii și o comunicare mai directă atunci când piesa are nevoie de ajustări sau clarificări.",
  },
];

const processSteps = [
  "Ne trimiți produsul ales sau o referință clară pentru proiectul custom.",
  "Confirmăm ce este realist de produs: dimensiune, material, finisaj și mod de prezentare.",
  "Piesa intră în producție și trece prin verificările necesare înainte de livrare.",
  "Comanda este pregătită atent pentru transport și pleacă spre livrare în România.",
];

const operations = [
  "Realizat la comandă în România",
  "Timp de producție: 2–5 zile lucrătoare",
  "Ambalare premium disponibilă ca opțiune separată",
  "Fiecare comandă custom este analizată manual",
  "Livrare gratuită pentru comenzile peste 250 RON",
  "Plată securizată online",
];

export default function AboutPage() {
  const materials = Object.values(materialGuide);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Despre ArteForma"
            title="Obiecte realizate la comandă, construite să arate bine și după ce ajung în spațiul clientului."
            description="Nu construim doar piese de prezentare. Scopul este ca produsul final să aibă proporție bună, prezență clară și un finisaj potrivit locului în care va sta."
          />
          <div className="surface-panel-strong rounded-[2.5rem] p-8 lg:p-10">
            <div className="space-y-5 text-base leading-8 text-white/68">
              <p>
                ArteForma lucrează atât cu piese din colecție, cât și cu proiecte pornite de la o idee, un logo sau o referință vizuală. Uneori clientul știe exact ce vrea. Alteori are doar direcția. În ambele cazuri, filtrul rămâne același: piesa trebuie să fie credibilă, bine rezolvată și potrivită pentru producție.
              </p>
              <p>
                Tocmai de aceea nu promitem orice formă sau orice idee instant. Preferăm să spunem clar ce se poate face bine, în ce dimensiune, din ce material și cu ce rezultat realist în produsul final.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {editorialCards.map((item) => (
            <div key={item.title} className="surface-panel rounded-[2rem] p-6">
              <h2 className="font-serif-display text-2xl text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 surface-panel rounded-[2.5rem] p-8 lg:p-10">
        <SectionHeading
          eyebrow="Cum lucrăm"
          title="Proces simplu, clar și potrivit pentru piese din colecție sau proiecte personalizate"
          description="Important este să știm ce trebuie să iasă bine în produsul final: forma, dimensiunea, finisajul și felul în care va fi folosită piesa."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step} className="rounded-[1.8rem] border border-white/8 bg-black/20 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d7a12a]">
                Pasul {index + 1}
              </p>
              <p className="mt-4 text-sm leading-7 text-white/66">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {operations.map((item) => (
            <div key={item} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-5 py-4 text-sm text-white/65">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 surface-panel rounded-[2.5rem] p-8 lg:p-10">
        <SectionHeading
          eyebrow="Materiale și finisaje"
          title="Materialele pe care le folosim, explicate simplu"
          description="Nu toate piesele cer aceeași bază. Unele trebuie să iasă mai bine vizual, altele trebuie să fie mai rezistente sau să aibă un efect special în lumină."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {materials.map((material) => (
            <div key={material.title} className="rounded-[1.8rem] border border-white/8 bg-black/20 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d7a12a]">
                {material.title}
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-white/68">
                <p>
                  <span className="text-white">Aspect:</span> {material.aspect}
                </p>
                <p>
                  <span className="text-white">Rezistență:</span> {material.resistance}
                </p>
                <p>
                  <span className="text-white">Utilizare:</span> {material.use}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="surface-panel rounded-[2rem] p-6">
          <h2 className="font-serif-display text-2xl text-white">Când o piesă merită făcută custom</h2>
          <p className="mt-4 text-sm leading-8 text-white/68">
            Atunci când obiectul trebuie adaptat unui model anume, unui logo, unui cadou sau unui context clar de utilizare. Acolo diferența nu stă doar în idee, ci în cum este tradusă bine într-o piesă fizică.
          </p>
        </div>
        <div className="surface-panel rounded-[2rem] p-6">
          <h2 className="font-serif-display text-2xl text-white">Cum ne contactezi</h2>
          <p className="mt-4 text-sm leading-8 text-white/68">
            Pentru produse, proiecte custom sau clarificări legate de comandă, emailul principal este {siteConfig.email}. Pe partea de prezență publică și exemple vizuale, ne găsești și pe Instagram și TikTok.
          </p>
        </div>
      </div>
    </div>
  );
}
