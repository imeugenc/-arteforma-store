import { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { CustomOrderForm } from "@/components/forms/custom-order-form";
import { buildMetadata } from "@/lib/seo";
import { materialGuide } from "@/lib/materials";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Comenzi custom",
  description:
    "Trimite-ne un logo, o schiță, o referință sau o idee și cere un obiect printat 3D realizat la comandă în Brașov.",
  path: "/custom-orders",
});

export default function CustomOrdersPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="order-2 space-y-5 lg:order-1">
          <SectionHeading
            eyebrow="Comenzi custom"
            title="Trimite-ne ideea, referința sau contextul, iar noi îți spunem ce variantă este realistă și potrivită."
            description="Poți să ne trimiți un logo, o schiță, o fotografie sau câteva idei clare. Analizăm fezabilitatea, dimensiunea, materialul și felul în care piesa ar trebui să arate în produsul final."
          />
          <div className="surface-panel rounded-[1.75rem] p-5 text-sm leading-7 text-white/68">
            <p className="text-white">
              Ne ajută mult să știm unde va sta piesa, ce dimensiune îți imaginezi și dacă există un termen care contează pentru tine.
            </p>
            <ul className="mt-4 space-y-2">
              <li>Obiecte de perete pentru birou, garaj sau studio</li>
              <li>Decor de birou pentru creatori, pasionați auto, trading sau gaming</li>
              <li>Piese logo pentru birou, studio, lansări sau mici branduri care vor un obiect fizic premium</li>
              <li>Siluete auto sau moto adaptate unui model anume</li>
              <li>Cadouri, aniversări și piese care trebuie să arate bine din primul moment</li>
            </ul>
            <p className="mt-4 border-l border-[#d7a12a]/25 pl-4 text-white/58">
              Pentru piese dintr-o singură bucată, dimensiunea maximă este 20 × 20 × 24 cm. Piesele mai mari pot fi discutate separat, dacă designul permite o construcție din mai multe părți.
            </p>
            <p className="mt-4 text-white/58">
              Dacă preferi să pornești direct pe email, ne poți scrie la {siteConfig.email}.
            </p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <CustomOrderForm />
        </div>
      </div>
      <div className="mt-10">
        <SectionHeading
          eyebrow="Exemple custom"
          title="Tipuri de proiecte pe care le putem analiza realist."
          description="Nu promitem orice idee instant. În schimb, pornim de la referințe clare și construim variante care se pot produce bine și arată coerent în produsul final."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Logo de birou sau studio",
              body: "Pentru fondatori, creatori sau mici branduri care vor un obiect fizic curat, nu doar un logo pe ecran.",
            },
            {
              title: "Cadou personalizat",
              body: "Pentru aniversări, cadouri și piese care trebuie să arate bine din primul moment, fără să pară improvizate.",
            },
            {
              title: "Siluetă auto / moto",
              body: "Pentru forme ușor de identificat, adaptate după referință, dimensiunea dorită și locul în care va sta piesa.",
            },
          ].map((example) => (
            <div key={example.title} className="surface-panel rounded-[1.8rem] p-5 text-sm leading-7 text-white/66">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                {example.title}
              </p>
              <p className="mt-4">{example.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <SectionHeading
          eyebrow="Materiale"
          title="Îți recomandăm materialul potrivit după aspect, rezistență și locul în care va sta piesa."
          description="Nu trebuie să alegi tehnic. Spune-ne cum vrei să arate și cum va fi folosită, iar noi te ghidăm spre varianta potrivită."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {Object.values(materialGuide).map((material) => (
            <div
              key={material.title}
              className="surface-panel rounded-[1.8rem] p-5 text-sm leading-7 text-white/66"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                {material.title}
              </p>
              <p className="mt-4">
                <span className="text-white">Aspect:</span> {material.aspect}
              </p>
              <p className="mt-3">
                <span className="text-white">Rezistență:</span> {material.resistance}
              </p>
              <p className="mt-3">
                <span className="text-white">Utilizare:</span> {material.use}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
