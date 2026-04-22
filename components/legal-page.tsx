type LegalSection = {
  title: string;
  body?: string;
  bullets?: string[];
};

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">ArteForma</p>
        <h1 className="mt-5 font-serif-display text-[2.1rem] text-white lg:text-[2.7rem]">{title}</h1>
        <p className="mt-6 max-w-3xl text-sm leading-8 text-white/68 sm:text-[15px]">{intro}</p>
      </div>

      <div className="mt-8 grid gap-6">
        {sections.map((section) => (
          <section key={section.title} className="surface-panel rounded-[2rem] p-6 lg:p-7">
            <h2 className="font-serif-display text-2xl text-white">{section.title}</h2>
            {section.body ? <p className="mt-4 text-sm leading-8 text-white/68">{section.body}</p> : null}
            {section.bullets?.length ? (
              <ul className="mt-4 space-y-3 text-sm leading-8 text-white/68">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
