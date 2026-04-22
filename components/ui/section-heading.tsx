import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl space-y-4", align === "center" && "mx-auto text-center")}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-[#d7a12a]">
        {eyebrow}
      </p>
      <h2 className="font-serif-display text-[1.7rem] leading-tight text-white sm:text-[2rem] lg:text-[2.45rem]">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-7 text-white/62 sm:text-[15px]">{description}</p>
      ) : null}
    </div>
  );
}
