import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { LoginButton } from "./LandingUI";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { label: "Problem", href: "/#problem" },
  { label: "Solution", href: "/#solution" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Ecosystem", href: "/#ecosystem" },
  { label: "Impact", href: "/#impact" },
  { label: "Team", href: "/#team" },
];

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Sanket — home">
      <span
        aria-hidden="true"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gold-400/40 bg-gradient-to-b from-gold-400/15 to-transparent shadow-[0_0_20px_-4px_rgba(234,182,83,0.5)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5CD74" strokeWidth="2" strokeLinecap="round">
          <path d="M7 10a5 5 0 0 1 10 0" />
          <path d="M4.5 13a7.5 7.5 0 0 1 15 0" opacity="0.6" />
          <path d="M9.8 13a2.2 2.2 0 0 1 4.4 0" />
          <circle cx="12" cy="16.5" r="1.4" fill="#F5CD74" stroke="none" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-[0.22em] text-mist-100">SANKET</span>
        {!compact && (
          <span className="mt-1 text-[9px] font-bold tracking-[0.3em] uppercase text-mist-500">Beyond Words</span>
        )}
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const goTo = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    if (window.location.pathname !== "/") {
      window.location.href = "/";
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10"
      >
        <Wordmark />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={goTo(l.href.split("#")[1])}
                className="rounded-full px-4 py-2.5 text-[13px] font-semibold text-mist-400 transition-colors duration-200 hover:bg-white/[0.05] hover:text-mist-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <LoginButton />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LoginButton />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-mist-100"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden overflow-hidden border-b border-white/[0.06] bg-ink-950/95 backdrop-blur-xl transition-[max-height,opacity] duration-400 ease-out",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="space-y-1 px-5 py-5" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={goTo(l.href.split("#")[1])}
                className="flex min-h-11 items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold text-mist-300 transition-colors hover:bg-white/[0.05] hover:text-mist-100"
              >
                {l.label}
                <span className="text-[10px] font-bold tracking-[0.2em] text-mist-500">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
