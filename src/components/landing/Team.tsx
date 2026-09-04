import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/lib/landing-motion";
import { LoginButton, Section, SectionHead } from "./LandingUI";
import { Wordmark } from "./Navbar";

const TEAM = [
  { name: "Pratiksha Jawale", role: "Team Leader", lead: true },
  { name: "Rudra Keyur Khaire", role: "Developer", lead: false },
  { name: "Mahi Panchal", role: "Research & Insights", lead: false },
  { name: "Suhani Pawar", role: "Research & Insights", lead: false },
  { name: "Sheena Sharma", role: "Research & Insights", lead: false },
];

export function Team() {
  return (
    <Section id="team" labelledBy="team-title" className="pt-24 sm:pt-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            id="team-title"
            eyebrow="The Team"
            eyebrowIcon={Crown}
            title="Team Beyond Words"
            sub="YI Future 6.0 · National-Level Hackathon — because communication should never depend on hearing."
          />
        </div>
      </Reveal>

      <div className="mt-12 border-t border-white/[0.07]">
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={i * 60}>
            <div className="group grid grid-cols-12 items-center gap-4 border-b border-white/[0.07] py-7 transition-colors duration-300 hover:bg-white/[0.015]">
              <span className="col-span-2 text-[12px] font-extrabold tracking-[0.2em] text-mist-500 transition-colors duration-300 group-hover:text-gold-400 sm:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="col-span-10 text-[clamp(1.2rem,2.6vw,1.9rem)] font-extrabold tracking-tight text-mist-100 transition-transform duration-500 group-hover:translate-x-1.5 sm:col-span-7">
                {m.name}
              </h3>
              <div className="col-span-12 flex sm:col-span-4 sm:justify-end">
                <span
                  className={
                    m.lead
                      ? "inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/[0.08] px-4 py-1.5 text-[10.5px] font-extrabold tracking-[0.16em] text-gold-300 uppercase"
                      : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[10.5px] font-extrabold tracking-[0.16em] text-mist-400 uppercase"
                  }
                >
                  {m.lead && <Crown className="h-3 w-3" aria-hidden="true" />}
                  {m.role}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function FinalCTA() {
  return (
    <Section labelledBy="cta-title" className="pt-28 pb-28 sm:pt-40 sm:pb-36">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] border border-gold-400/25 bg-gradient-to-b from-gold-400/[0.08] via-ink-900 to-ink-950 px-6 py-16 text-center sm:px-12 sm:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-180px] h-[380px] w-[640px] -translate-x-1/2 rounded-full bg-gold-400/[0.14] blur-[110px]" />
          </div>
          <div className="relative">
            <p className="mb-6 flex items-center justify-center gap-2 text-[11px] font-extrabold tracking-[0.28em] text-gold-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Team Beyond Words · YI Future 6.0
            </p>
            <h2
              id="cta-title"
              className="mx-auto max-w-3xl text-balance text-[clamp(2.2rem,5.6vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-mist-100"
            >
              Beyond Words. <span className="text-gold-grad">Toward Access.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-mist-400">
              Building a more accessible experience at the moment public service matters.
            </p>
            <div className="mt-10">
              <LoginButton size="lg" />
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-900/60">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-mist-400">
            AI-assisted accessibility infrastructure for government service counters.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="mb-4 text-[10.5px] font-extrabold tracking-[0.22em] text-mist-500 uppercase">Explore</p>
          <ul className="space-y-2.5 text-[13px] font-semibold text-mist-400">
            {[
              ["Problem", "/#problem"],
              ["Solution", "/#solution"],
              ["How It Works", "/#how-it-works"],
              ["Ecosystem", "/#ecosystem"],
              ["Impact", "/#impact"],
              ["Team", "/#team"],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="transition-colors hover:text-gold-300">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="mb-4 text-[10.5px] font-extrabold tracking-[0.22em] text-mist-500 uppercase">Identity</p>
          <ul className="space-y-2.5 text-[13px] font-semibold text-mist-400">
            <li>SANKET</li>
            <li>Team Beyond Words</li>
            <li>YI Future 6.0</li>
            <li>National-Level Hackathon</li>
            <li>
              <Link href="/login" className="text-gold-300 transition-colors hover:text-gold-200">
                Login →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-start justify-between gap-3 px-5 py-6 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <p className="text-[11.5px] font-bold tracking-wide text-mist-500">
            © 2026 Team Beyond Words — YI Future 6.0 · National-Level Hackathon
          </p>
          <p className="text-[11.5px] font-extrabold tracking-[0.2em] text-gold-400/90 uppercase">
            Beyond Words. Toward Access.
          </p>
        </div>
      </div>
    </footer>
  );
}
