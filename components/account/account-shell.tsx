import { accountFeatures } from "@/lib/account";

export function AccountShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">{eyebrow}</p>
        <h1 className="mt-5 font-serif-display text-4xl text-white lg:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">{description}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {accountFeatures.map((item) => (
          <div key={item} className="surface-panel rounded-[1.75rem] px-5 py-4 text-sm text-white/68">
            {item}
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}
