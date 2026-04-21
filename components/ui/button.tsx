"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold tracking-[0.18em] uppercase transition duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,#fff2b8_0%,#d7a12a_38%,#9c6613_100%)] text-black shadow-[0_14px_40px_rgba(215,161,42,0.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(215,161,42,0.28)]",
        variant === "secondary" &&
          "border border-white/12 bg-white/[0.035] text-white hover:border-[#d7a12a]/40 hover:bg-white/[0.06]",
        variant === "ghost" &&
          "text-[#e6d6ab] hover:bg-white/[0.04] hover:text-white",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
