import type { ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Section({
  id,
  children,
  className = "",
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10", className)}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children, icon: Icon }: { children: ReactNode; icon?: LucideIcon }) {
  return (
    <p className="mb-5 flex items-center gap-2.5 text-[11px] font-bold tracking-[0.24em] uppercase text-gold-400">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_12px_rgba(234,182,83,0.9)]" aria-hidden="true" />
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{children}</span>
    </p>
  );
}

export function SectionHead({
  eyebrow,
  eyebrowIcon,
  title,
  sub,
  align = "left",
  id,
  className = "",
}: {
  eyebrow: string;
  eyebrowIcon?: LucideIcon;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
      </div>
      <h2
        id={id}
        className="text-balance text-[clamp(1.9rem,4.2vw,3.1rem)] leading-[1.08] font-extrabold tracking-[-0.02em] text-mist-100"
      >
        {title}
      </h2>
      {sub && (
        <p className={cn("mt-5 max-w-2xl text-[15px] sm:text-base leading-relaxed text-mist-400", align === "center" && "mx-auto")}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function LoginButton({
  size = "md",
  className = "",
  label = "Login",
}: {
  size?: "md" | "lg";
  className?: string;
  label?: string;
}) {
  return (
    <Link
      href="/login"
      aria-label="Log in to Sanket"
      className={cn(
        "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full font-bold tracking-wide",
        "bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950",
        "shadow-[0_0_0_1px_rgba(249,221,176,0.35),0_10px_34px_-8px_rgba(217,159,56,0.55)]",
        "transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(249,221,176,0.6),0_16px_44px_-6px_rgba(217,159,56,0.7)] hover:-translate-y-0.5",
        "focus-visible:outline-2 focus-visible:outline-offset-4",
        size === "lg" ? "px-9 py-4 text-base" : "px-6 py-2.5 text-[13px] uppercase tracking-[0.14em]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative">{label}</span>
      <ArrowRight className={cn("relative transition-transform duration-300 group-hover:translate-x-1", size === "lg" ? "h-4.5 w-4.5" : "h-4 w-4")} aria-hidden="true" />
    </Link>
  );
}

export function Tag({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "teal" | "blue" | "orange" | "green" | "muted" }) {
  const tones: Record<string, string> = {
    gold: "border-gold-400/30 bg-gold-400/[0.07] text-gold-300",
    teal: "border-tealx-400/30 bg-tealx-400/[0.07] text-tealx-300",
    blue: "border-bluex-400/30 bg-bluex-400/[0.07] text-bluex-300",
    orange: "border-orangex-400/30 bg-orangex-400/[0.07] text-orangex-300",
    green: "border-greenx-400/30 bg-greenx-400/[0.07] text-greenx-400",
    muted: "border-white/10 bg-white/[0.04] text-mist-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-bold tracking-[0.14em] uppercase",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function FlowDown({ tone = "gold", animated = false }: { tone?: "gold" | "teal" | "muted"; animated?: boolean }) {
  const colors = {
    gold: "text-gold-400",
    teal: "text-tealx-400",
    muted: "text-mist-500",
  } as const;
  return (
    <div aria-hidden="true" className={cn("flex flex-col items-center", colors[tone])}>
      <span className={cn("block h-8 w-px", tone === "muted" ? "bg-white/12" : "bg-current opacity-50")} />
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" className={cn(animated && "anim-float")}>
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Divider() {
  return (
    <div aria-hidden="true" className="mx-auto mt-24 flex w-full max-w-[1240px] items-center gap-4 px-5 sm:mt-32 sm:px-8 lg:px-10">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-white/[0.08]" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold-400/60" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/[0.08] to-white/[0.08]" />
    </div>
  );
}

export function BentoPanel({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass relative overflow-hidden rounded-2xl",
        hover &&
          "transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
}
