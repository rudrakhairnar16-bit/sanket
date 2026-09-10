import {
  ArrowRight,
  BadgeCheck,
  Cpu,
  Gauge,
  Headset,
  MessageCircleQuestion,
  Workflow,
} from "lucide-react";
import { Reveal } from "@/lib/landing-motion";
import { BentoPanel, Section, SectionHead, Tag } from "./LandingUI";
import { cn } from "@/lib/cn";

const STATES = [
  {
    icon: BadgeCheck,
    band: "HIGH",
    word: "CLEAR",
    tone: "green" as const,
    filled: 5,
    desc: "Recognition is sufficiently confident. The clerk receives the supported interpretation — the interaction simply continues.",
    accent: "text-greenx-400",
    border: "hover:border-greenx-400/30",
    meter: "bg-greenx-400",
    chip: "border-greenx-400/30 bg-greenx-400/[0.07] text-greenx-400",
  },
  {
    icon: MessageCircleQuestion,
    band: "MEDIUM",
    word: "CONFIRM",
    tone: "gold" as const,
    filled: 3,
    desc: "Sanket presents the possible interpretation and encourages confirmation or a retry. Nothing arrives as fact until it is confirmed.",
    accent: "text-gold-300",
    border: "hover:border-gold-400/30",
    meter: "bg-gold-400",
    chip: "border-gold-400/30 bg-gold-400/[0.07] text-gold-300",
  },
  {
    icon: Headset,
    band: "LOW / UNKNOWN",
    word: "ESCALATE",
    tone: "orange" as const,
    filled: 1,
    desc: "Sanket refuses to guess. The clerk is prompted to clarify — or request human interpreter assistance so the service continues safely.",
    accent: "text-orangex-300",
    border: "hover:border-orangex-400/30",
    meter: "bg-orangex-400",
    chip: "border-orangex-400/30 bg-orangex-400/[0.07] text-orangex-300",
  },
];

export function Confidence() {
  return (
    <Section id="confidence" labelledBy="conf-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="conf-title"
          align="center"
          eyebrow="Confidence-Aware AI"
          eyebrowIcon={Gauge}
          title={
            <>
              {"Sanket Doesn't Pretend"} <span className="text-gold-grad">{"AI Is Perfect."}</span>
            </>
          }
          sub={"When confidence drops, certainty stops. Every recognition carries its own confidence state — shown through words, shape, and icon, never color alone."}
        />
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STATES.map((s, i) => (
          <Reveal key={s.word} delay={i * 120}>
            <BentoPanel className={cn("flex h-full flex-col p-7 sm:p-8", s.border)}>
              <div className="flex items-center justify-between">
                <span className={cn("rounded-full border px-3 py-1 text-[10px] font-extrabold tracking-[0.18em]", s.chip)}>
                  {s.band}
                </span>
                <s.icon className={cn("h-6 w-6", s.accent)} aria-hidden="true" />
              </div>

              <h3 className={cn("mt-7 text-[clamp(1.9rem,3vw,2.4rem)] font-extrabold tracking-[-0.01em]", s.accent)}>
                {s.word}
              </h3>

              <div className="mt-5 flex items-center gap-2" role="img" aria-label={`Confidence level ${s.filled} of 5 — ${s.band}`}>
                {Array.from({ length: 5 }).map((_, k) => (
                  <span
                    key={k}
                    aria-hidden="true"
                    className={cn(
                      "h-2 flex-1 rounded-full",
                      k < s.filled ? s.meter : "border border-white/10 bg-white/[0.03]"
                    )}
                  />
                ))}
                <span className="ml-2 text-[10px] font-extrabold tracking-widest text-mist-500">{s.filled}/5</span>
              </div>

              <p className="mt-6 text-[13.5px] leading-[1.75] text-mist-400">{s.desc}</p>
            </BentoPanel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const NET_FLOW = [
  { icon: Cpu, label: "AI Assistance", sub: "Accelerates common interactions" },
  { icon: Gauge, label: "Confidence Check", sub: "Decides if automation is enough" },
  { icon: Headset, label: "Human Interpreter", sub: "Takes over when AI is uncertain" },
  { icon: Workflow, label: "Service Continues", sub: "No citizen is turned away" },
];

export function SafetyNet() {
  return (
    <Section labelledBy="net-title" className="pt-24 sm:pt-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHead
              id="net-title"
              eyebrow="Human-in-the-Loop"
              eyebrowIcon={Headset}
              title={
                <>
                  Technology When It Can.
                  <br />
                  <span className="text-gold-grad">Humans When It Must.</span>
                </>
              }
              sub="Sanket is designed around human-in-the-loop accessibility. AI accelerates the common cases; human support remains available whenever automated recognition is uncertain or insufficient."
            />
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-8 space-y-3">
              <Tag tone="orange">Escalation — prototype demo mode</Tag>
              <p className="max-w-md text-[12.5px] leading-relaxed text-mist-500">
                Interpreter availability is orchestrated by the institution deploying Sanket. This hackathon build
                simulates the escalation path in demo mode — the architecture keeps the human route replaceable and real.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={160}>
          <BentoPanel hover={false} className="p-7 sm:p-10">
            <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {NET_FLOW.map((f, i) => (
                <li key={f.label} className="relative flex flex-col items-center gap-3 text-center">
                  {i > 0 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="absolute -left-[22px] top-7 hidden h-4 w-4 text-gold-500/60 xl:block"
                    />
                  )}
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl border",
                      i === 2
                        ? "border-tealx-400/45 bg-tealx-400/[0.08] text-tealx-300 shadow-[0_0_30px_-6px_rgba(62,198,184,0.5)]"
                        : "border-white/10 bg-white/[0.03] text-gold-300"
                    )}
                  >
                    <f.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-[14px] font-extrabold text-mist-100">{f.label}</span>
                  <span className="text-[11.5px] leading-snug text-mist-500">{f.sub}</span>
                </li>
              ))}
            </ol>
            <p className="mt-9 border-t border-white/[0.06] pt-6 text-center text-[13px] leading-relaxed text-mist-400">
              The goal is never full automation.{" "}
              <span className="font-semibold text-mist-100">The goal is that the citizen always gets served.</span>
            </p>
          </BentoPanel>
        </Reveal>
      </div>
    </Section>
  );
}
