import {
  ArrowRight,
  BarChart3,
  Blocks,
  Camera,
  ClipboardList,
  ContactRound,
  Cpu,
  Database,
  FileSearch,
  Gauge,
  GraduationCap,
  Hand,
  Headset,
  Languages,
  Lock,
  MessagesSquare,
  PackageCheck,
  ServerOff,
  ShieldCheck,
  SlidersHorizontal,
  WifiOff,
  X,
} from "lucide-react";
import { Reveal } from "@/lib/landing-motion";
import { BentoPanel, Section, SectionHead } from "./LandingUI";
import { cn } from "@/lib/cn";

export function Technology() {
  return (
    <Section labelledBy="tech-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="tech-title"
          eyebrow="Responsible Technology"
          eyebrowIcon={ShieldCheck}
          title="Built Around Responsible AI."
          sub="Every architectural choice follows one rule: capability must never outrun accountability."
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Reveal delay={60} className="lg:col-span-2">
          <BentoPanel className="h-full p-7 sm:p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/[0.06] text-gold-300">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-[17px] font-extrabold text-mist-100">Privacy-conscious recognition</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-mist-400">
              Camera processing is designed to minimize unnecessary data transmission — the device is a sensor for
              the interaction, not a recording instrument.
            </p>
          </BentoPanel>
        </Reveal>

        {[
          { icon: Hand, title: "Hand Landmark Recognition", desc: "Hand landmark extraction forms the recognition input — structured geometry, not stored imagery.", delay: 120 },
          { icon: Blocks, title: "Modular Recognition Engine", desc: "Recognition architecture designed to evolve — models and packs can be validated and replaced.", delay: 180 },
          { icon: Gauge, title: "Confidence-aware AI", desc: "No blind guesses. Every output carries a confidence state the clerk can see.", delay: 60 },
          { icon: Headset, title: "Human-in-the-loop", desc: "Interpreter escalation is a designed pathway, not an afterthought.", delay: 120 },
          { icon: WifiOff, title: "PWA / Offline Readiness", desc: "Designed for practical counter environments — installable, resilient, low-friction.", delay: 180 },
        ].map((t) => (
          <Reveal key={t.title} delay={t.delay}>
            <BentoPanel className="h-full p-6 sm:p-7">
              <t.icon className="h-5 w-5 text-tealx-300" aria-hidden="true" />
              <h3 className="mt-4 text-[15px] font-extrabold text-mist-100">{t.title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-mist-400">{t.desc}</p>
            </BentoPanel>
          </Reveal>
        ))}

        <Reveal delay={220}>
          <BentoPanel className="h-full p-6 sm:p-7">
            <Languages className="h-5 w-5 text-bluex-300" aria-hidden="true" />
            <h3 className="mt-4 text-[15px] font-extrabold text-mist-100">Multilingual Interfaces</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["English", "Hindi", "Marathi", "Gujarati"].map((l) => (
                <span key={l} className="rounded-md border border-bluex-400/25 bg-bluex-400/[0.06] px-2.5 py-1 text-[11px] font-bold text-bluex-300">
                  {l}
                </span>
              ))}
            </div>
          </BentoPanel>
        </Reveal>
      </div>

      <Reveal delay={260}>
        <p className="mt-7 max-w-3xl text-[12px] leading-relaxed text-mist-500">
          Note: translation services may assist human-language localization where appropriate. They do not — and
          Sanket does not claim they can — directly translate Indian Sign Language.
        </p>
      </Reveal>
    </Section>
  );
}

const PRINCIPLES = [
  { icon: Database, label: "Minimize unnecessary data" },
  { icon: Camera, label: "Responsible camera permissions" },
  { icon: SlidersHorizontal, label: "Transparent interaction controls" },
  { icon: Cpu, label: "Privacy-conscious processing" },
  { icon: ServerOff, label: "Avoid unnecessary storage" },
  { icon: Lock, label: "Protect session information" },
  { icon: FileSearch, label: "Audit important institutional actions" },
];

const NO_CLAIMS = [
  "No invented compliance certifications",
  "No unverified government endorsements",
  "No fabricated accuracy statistics",
  "No promised deployments",
];

export function Privacy() {
  return (
    <Section labelledBy="privacy-title" className="pt-24 sm:pt-32">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHead
              id="privacy-title"
              eyebrow="Privacy & Trust"
              eyebrowIcon={Lock}
              title="Accessibility Should Never Come at the Cost of Privacy."
              sub={"A citizen sharing a signed conversation at a government counter deserves the same discretion as any signed document. These principles are architectural commitments, not policy footnotes."}
            />
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-9 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <p className="mb-4 text-[10.5px] font-extrabold tracking-[0.22em] text-mist-500 uppercase">
                {"What we deliberately don't claim"}
              </p>
              <ul className="space-y-2.5">
                {NO_CLAIMS.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-[13px] font-semibold text-mist-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 text-mist-500">
                      <X className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={120}>
          <BentoPanel hover={false} className="h-full p-7 sm:p-9">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <li
                  key={p.label}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-colors duration-300 hover:border-greenx-400/30",
                    i === PRINCIPLES.length - 1 && "sm:col-span-2"
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-greenx-400/25 bg-greenx-400/[0.06] text-greenx-400">
                    <p.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="text-[14px] font-bold text-mist-200">{p.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[12px] leading-relaxed text-mist-500">
              Trust is not a certificate on a wall. It is the set of things a system refuses to do with your data.
            </p>
          </BentoPanel>
        </Reveal>
      </div>
    </Section>
  );
}

const EXISTING = [
  "Interpreter services",
  "Sign-language learning apps",
  "Recognition technology",
  "Accessibility tooling",
  "E-governance interfaces",
];

const DIFFS = [
  { icon: ContactRound, title: "Clerk-First", desc: "Designed around the staff member operating the counter — not around demos." },
  { icon: ClipboardList, title: "Service Packs", desc: "Communication tied to actual service workflows, scoped and validated." },
  { icon: Gauge, title: "Confidence Aware", desc: "AI that can acknowledge uncertainty instead of hiding it." },
  { icon: Headset, title: "Human Safety Net", desc: "Escalation when automation is insufficient — by design." },
  { icon: GraduationCap, title: "Clerk Learning", desc: "One-time assistance compounds into long-term readiness." },
  { icon: BarChart3, title: "Sugamya Score", desc: "Institutional accessibility becomes measurable — and improvable." },
];

export function Differentiation() {
  return (
    <Section labelledBy="diff-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="diff-title"
          eyebrow="Positioning"
          eyebrowIcon={PackageCheck}
          title={
            <>
              Not Just Translation. <span className="text-gold-grad">Infrastructure.</span>
            </>
          }
          sub="Existing technology addresses individual pieces of the accessibility problem. Sanket connects those capabilities around the government service counter — the place the problem actually happens."
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        <Reveal delay={80} className="lg:col-span-5">
          <div className="flex h-full flex-col justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
            <p className="mb-5 text-[10.5px] font-extrabold tracking-[0.22em] text-mist-500 uppercase">The pieces exist</p>
            <ul className="space-y-2.5">
              {EXISTING.map((p) => (
                <li key={p} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-[13px] font-bold text-mist-300">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140} className="flex items-center justify-center lg:col-span-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/[0.07]" aria-hidden="true">
            <ArrowRight className="h-5 w-5 rotate-90 text-gold-300 lg:rotate-0" />
          </div>
        </Reveal>

        <Reveal delay={200} className="lg:col-span-5">
          <BentoPanel hover={false} className="flex h-full flex-col justify-center border-gold-400/25 bg-gradient-to-br from-gold-400/[0.09] to-transparent p-7 sm:p-8">
            <p className="mb-4 text-[10.5px] font-extrabold tracking-[0.22em] text-gold-400 uppercase">Sanket</p>
            <p className="text-[clamp(1.15rem,2vw,1.45rem)] font-extrabold leading-snug tracking-tight text-mist-100">
              Connects them around{" "}
              <span className="text-gold-grad">the counter</span> — with confidence awareness, escalation, and
              learning built in.
            </p>
          </BentoPanel>
        </Reveal>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DIFFS.map((d, i) => (
          <Reveal key={d.title} delay={(i % 3) * 90}>
            <BentoPanel className="h-full p-6">
              <d.icon className="h-5 w-5 text-gold-300" aria-hidden="true" />
              <h3 className="mt-4 text-[15px] font-extrabold tracking-wide text-mist-100 uppercase">{d.title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-mist-400">{d.desc}</p>
            </BentoPanel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={160}>
        <blockquote className="mx-auto mt-16 max-w-4xl border-l-2 border-gold-400 pl-6 sm:pl-8">
          <p className="text-[clamp(1.25rem,2.6vw,1.75rem)] font-extrabold leading-[1.35] tracking-tight text-mist-100">
            &quot;Sanket doesn&apos;t just translate signs. It helps a government institution become{" "}
            <span className="text-gold-grad">{"capable of serving ISL users."}</span>&quot;
          </p>
        </blockquote>
      </Reveal>
    </Section>
  );
}

const WHY = [
  { icon: MessagesSquare, word: "COMMUNICATE", desc: "Help bridge the immediate communication gap at the counter — the moment access is won or lost." },
  { icon: ShieldCheck, word: "PROTECT", desc: "Avoid blindly trusting uncertain AI. Certainty is earned by confidence, or handed to a human." },
  { icon: GraduationCap, word: "PREPARE", desc: "Build clerk readiness that outlives any single interaction — skill that stays in the institution." },
  { icon: BarChart3, word: "MEASURE", desc: "Make accessibility visible. What gets measured gets funded, staffed, and improved." },
];

export function WhySanket() {
  return (
    <Section labelledBy="why-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead id="why-title" eyebrow="Why Sanket" title="Four Commitments." />
      </Reveal>
      <div className="mt-12 border-t border-white/[0.07]">
        {WHY.map((w, i) => (
          <Reveal key={w.word} delay={i * 60}>
            <div className="group grid grid-cols-1 gap-3 border-b border-white/[0.07] py-9 transition-colors duration-300 hover:bg-white/[0.015] md:grid-cols-12 md:items-center md:gap-6">
              <div className="flex items-center gap-5 md:col-span-5">
                <span className="text-[12px] font-extrabold tracking-[0.2em] text-mist-500 transition-colors duration-300 group-hover:text-gold-400">
                  0{i + 1}
                </span>
                <h3 className="text-[clamp(1.6rem,3.4vw,2.5rem)] font-extrabold tracking-[-0.02em] text-mist-100 transition-transform duration-500 group-hover:translate-x-2">
                  {w.word}
                </h3>
              </div>
              <p className="text-[14px] leading-relaxed text-mist-400 md:col-span-6">{w.desc}</p>
              <div className="hidden md:col-span-1 md:flex md:justify-end">
                <w.icon className="h-6 w-6 text-mist-500 transition-colors duration-300 group-hover:text-gold-300" aria-hidden="true" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
