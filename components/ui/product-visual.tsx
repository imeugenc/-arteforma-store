import { cn } from "@/lib/utils";

export function ProductVisual({
  accent,
  glow,
  motif,
  label = "ArteForma",
  className,
}: {
  accent: string;
  glow: string;
  motif: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top,#1b1b1b_0%,#0c0c0c_55%,#070707_100%)] premium-grid",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 22%, ${glow}12 0%, transparent 42%)`,
        }}
      />
      <div
        className="absolute inset-x-8 top-8 h-40 rounded-full blur-3xl"
        style={{ background: `${glow}26` }}
      />
      <div
        className="absolute inset-x-0 bottom-8 h-24 opacity-90"
        style={{
          background: `linear-gradient(120deg, transparent 5%, ${accent} 25%, ${glow} 50%, ${accent} 75%, transparent 95%)`,
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent), radial-gradient(circle at center, black 50%, transparent 82%)",
        }}
      />
      <div className="absolute left-6 top-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-white/20">
        {label}
      </div>
      <div
        className="absolute inset-5 rounded-[1.75rem] border"
        style={{ borderColor: `${accent}20` }}
      />
      <div className="relative flex h-full min-h-[280px] items-center justify-center p-8">
        <div className="relative">
          <div
            className="absolute inset-0 scale-125 blur-2xl"
            style={{ background: `radial-gradient(circle, ${glow}55 0%, transparent 62%)` }}
          />
          <div
            className="relative rounded-[2.5rem] border px-10 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.35)] transition duration-500 group-hover:-translate-y-1"
            style={{
              borderColor: `${accent}55`,
              background: `linear-gradient(155deg, ${glow}20 0%, ${accent}26 32%, rgba(14,14,14,.94) 100%)`,
            }}
          >
            <div
              className="font-serif-display text-5xl tracking-[0.2em] sm:text-6xl"
              style={{
                color: accent,
                textShadow: `0 0 28px ${glow}26`,
              }}
            >
              {motif}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
