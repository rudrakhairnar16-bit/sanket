import {
  ArrowRight,
  AudioLines,
  Camera,
  Check,
  CircleAlert,
  CircleCheckBig,
  FileCheck2,
  Gauge,
  Hand,
  Headset,
  Landmark,
  MessagesSquare,
  MonitorCheck,
  ScanSearch,
  UserCheck,
  X,
} from "lucide-react";
import { Reveal } from "@/lib/landing-motion";
import { BentoPanel, Section, SectionHead, Tag } from "./LandingUI";
import { cn } from "@/lib/cn";

export function Problem() {
  const moments = [
    {
      icon: Landmark,
      title: "The Counter",
      desc: "The service desk is the moment of truth — where entitlement becomes experience.",
    },
    {
      icon: MessagesSquare,
      title: "The Conversation",
      desc: "A two-way exchange: a request made in sign, a process explained in speech or text.",
    },
    {
      icon: FileCheck2,
      title: "The Service",
      desc: "Certificates, payments, applications — outcomes that should never depend on hearing.",
    },
  ];

  return (
    <Section id="problem" labelledBy="problem-title" className="pt-24 pb-8 sm:pt-32">
      <Reveal>
        <SectionHead
          id="problem-title"
          eyebrow="The Problem"
          title={
            <>
              {"The Problem Isn't Access to Technology."}
              <br />
              <span className="text-gold-grad">{"It's Access at the Moment It Matters."}</span>
            </>
          }
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal delay={80}>
            <div className="space-y-5 text-[15px] leading-[1.8] text-mist-400">
              <p>
                {"A Deaf or hard-of-hearing citizen may arrive at a government service counter knowing "}
                <span className="font-semibold text-mist-200">{"exactly what they need"}</span>{". The clerk may know "}
                <span className="font-semibold text-mist-200">{"exactly how to provide the service"}</span>.
              </p>
              <p>
                {"But communication can become the barrier between the two. Accessibility resources may exist elsewhere — the challenge is bringing assistance into the "}
                <span className="font-semibold text-gold-300">{"actual service interaction"}</span>.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 space-y-3">
            {moments.map((m, i) => (
              <Reveal key={m.title} delay={140 + i * 90}>
                <div className="group flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-gold-400/25">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/[0.06] text-gold-300">
                    <m.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-extrabold text-mist-100">{m.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-mist-400">{m.desc}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="lg:col-span-7" delay={150}>
          <BentoPanel className="flex h-full min-h-[420px] flex-col justify-between p-7 sm:p-10" hover={false}>
            <div className="flex items-center justify-between">
              <Tag tone="muted">The moment of service</Tag>
              <CircleAlert className="h-4 w-4 text-orangex-400" aria-hidden="true" />
            </div>

            <div className="relative my-10 flex items-center justify-between gap-4">
              <div className="flex w-[34%] flex-col items-center gap-3 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-tealx-400/40 bg-tealx-400/[0.06]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7EE0D2" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="7.5" r="3.6" />
                    <path d="M4.8 20.5v-1.6a6 6 0 0 1 6-6h2.4a6 6 0 0 1 6 6v1.6" />
                  </svg>
                </span>
                <span className="text-[11px] font-extrabold tracking-[0.2em] text-tealx-300">CITIZEN</span>
                <span className="text-[11px] leading-snug text-mist-500">Knows exactly what they need</span>
              </div>

              <div className="relative flex flex-1 flex-col items-center" aria-hidden="true">
                <svg viewBox="0 0 200 44" className="w-full max-w-[220px]" fill="none">
                  <path d="M0 22 h38" stroke="rgba(62,198,184,0.5)" strokeWidth="1.5" strokeDasharray="3 6" className="dash-flow" />
                  <path d="M162 22 h38" stroke="rgba(109,155,245,0.5)" strokeWidth="1.5" strokeDasharray="3 6" className="dash-flow" />
                  <path d="M66 10 L78 34 M92 8 L84 36 M112 6 L104 38 M128 10 L118 34" stroke="rgba(232,134,60,0.75)" strokeWidth="1.6" strokeLinecap="round" className="pulse-soft" />
                </svg>
                <span className="absolute -top-7 text-[9px] font-extrabold tracking-[0.28em] text-orangex-300">
                  COMMUNICATION GAP
                </span>
                <span className="absolute -bottom-7 max-w-[190px] text-center text-[10px] leading-snug text-mist-500">
                  Assistance exists — somewhere. Not here. Not now.
                </span>
              </div>

              <div className="flex w-[34%] flex-col items-center gap-3 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-bluex-400/40 bg-bluex-400/[0.06]">
                  <Landmark className="h-6 w-6 text-bluex-300" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-extrabold tracking-[0.2em] text-bluex-300">CLERK</span>
                <span className="text-[11px] leading-snug text-mist-500">Knows exactly how to help</span>
              </div>
            </div>

            <p className="border-t border-white/[0.06] pt-6 text-[13px] leading-relaxed text-mist-400">
              Between two people who are both ready — the interaction fails. Every day. At counter after counter.{" "}
              <span className="font-semibold text-mist-200">This is the moment Sanket is built for.</span>
            </p>
          </BentoPanel>
        </Reveal>
      </div>
    </Section>
  );
}

const WITHOUT = [
  "Citizen arrives",
  "Communication barrier",
  "Clerk struggles to understand",
  "Interaction slows down",
  "Citizen experience suffers",
];

const WITH = [
  "Citizen signs",
  "Sanket assists",
  "Recognition is evaluated",
  "Clerk receives communication",
  "Response is provided",
  "Uncertainty? Human interpreter support",
  "Service continues",
];

function Timeline({
  title,
  tone,
  steps,
  icon: FinalIcon,
  finalLabel,
}: {
  title: string;
  tone: "off" | "on";
  steps: string[];
  icon: typeof X;
  finalLabel: string;
}) {
  const on = tone === "on";
  return (
    <BentoPanel hover={false} className={cn("p-7 sm:p-9", on && "border-gold-400/20 bg-gradient-to-b from-gold-400/[0.045] to-transparent")}>
      <div className="mb-8 flex items-center justify-between">
        <Tag tone={on ? "gold" : "muted"}>{title}</Tag>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border",
            on ? "border-greenx-400/40 bg-greenx-400/10 text-greenx-400" : "border-white/10 bg-white/[0.04] text-mist-500"
          )}
        >
          {on ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
        </span>
      </div>

      <ol className="relative space-y-0">
        <span
          aria-hidden="true"
          className={cn("tl-line absolute left-[11px] top-2 bottom-6 w-px", on ? "bg-gradient-to-b from-gold-400/70 to-tealx-400/50" : "bg-white/[0.09]")}
        />
        {steps.map((s, i) => (
          <li key={s} className="relative flex items-center gap-4 py-3">
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 h-[22px] w-[22px] shrink-0 rounded-full border-2",
                on
                  ? "border-gold-400/60 bg-ink-900 shadow-[0_0_14px_-2px_rgba(234,182,83,0.6)]"
                  : "border-white/15 bg-ink-900"
              )}
            />
            <span className={cn("text-[14.5px] font-semibold", on ? "text-mist-100" : "text-mist-500")}>
              <span className={cn("mr-2.5 text-[10px] font-extrabold tracking-widest", on ? "text-gold-500" : "text-mist-500")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {s}
            </span>
          </li>
        ))}
        <li className="relative flex items-center gap-4 pt-4">
          <span
            className={cn(
              "relative z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full",
              on ? "bg-greenx-400 text-ink-950" : "bg-white/10 text-mist-400"
            )}
          >
            <FinalIcon className="h-3 w-3" aria-hidden="true" />
          </span>
          <span className={cn("text-[12px] font-extrabold tracking-[0.14em] uppercase", on ? "text-greenx-400" : "text-mist-500")}>
            {finalLabel}
          </span>
        </li>
      </ol>
    </BentoPanel>
  );
}

export function BeforeAfter() {
  return (
    <Section id="solution" labelledBy="solution-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="solution-title"
          eyebrow="The Shift"
          title="One Counter. One Conversation. One Difference."
          sub="The same citizen, the same clerk, the same service — the only variable is whether assistance exists inside the interaction."
        />
      </Reveal>
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal delay={100}>
          <Timeline title="Without Sanket" tone="off" steps={WITHOUT} icon={CircleAlert} finalLabel="Service degrades" />
        </Reveal>
        <Reveal delay={220}>
          <Timeline title="With Sanket" tone="on" steps={WITH} icon={Check} finalLabel="Service continues" />
        </Reveal>
      </div>
    </Section>
  );
}

const STEPS = [
  { icon: Hand, title: "Citizen Communicates", desc: "The citizen signs using supported Indian Sign Language signs, right at the counter." },
  { icon: Camera, title: "Camera Captures", desc: "Sanket Sahayak uses the counter device's camera to capture the signing." },
  { icon: ScanSearch, title: "Recognition Engine", desc: "Hand landmarks and recognition models process the interaction." },
  { icon: Gauge, title: "Confidence Evaluation", desc: "Sanket scores its own confidence — before anything is presented as fact." },
  { icon: MonitorCheck, title: "Clerk Receives", desc: "The clerk receives the recognized communication as text, with clerk-facing audio." },
  { icon: AudioLines, title: "Clerk Responds", desc: "The clerk replies with text or quick responses, paired with service-specific sign guidance." },
  { icon: Headset, title: "Human Safety Net", desc: "If AI is uncertain, the clerk can request human interpreter assistance." },
  { icon: CircleCheckBig, title: "Interaction Complete", desc: "Feedback and outcomes feed clerk learning and institutional accessibility insight." },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="hiw-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="hiw-title"
          eyebrow="How Sanket Works"
          eyebrowIcon={ScanSearch}
          title="From Sign to Service."
          sub="Eight steps, one interaction — with a confidence check standing guard between recognition and response."
        />
      </Reveal>

      <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={(i % 2) * 100 + Math.floor(i / 2) * 40}>
            <li className="group relative flex items-start gap-5 border-b border-white/[0.06] py-7 transition-colors duration-300 hover:border-gold-400/25">
              <span
                aria-hidden="true"
                className="select-none text-[44px] font-extrabold leading-none tracking-tighter text-white/[0.07] transition-colors duration-300 group-hover:text-gold-400/25"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gold-300">
                <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span>
                <h3 className="text-[16px] font-extrabold text-mist-100">{s.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist-400">{s.desc}</p>
              </span>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

const C2K = ["ISL Sign", "Camera", "Recognition", "Confidence", "Text", "Clerk-facing Audio"];
const K2C = ["Clerk Text / Quick Response", "Supported Sign Visual Guidance", "Citizen"];

function Chain({ label, tone, items }: { label: string; tone: "gold" | "teal"; items: string[] }) {
  const styles =
    tone === "gold"
      ? "border-gold-400/25 bg-gold-400/[0.05] text-gold-200 text-gold-300"
      : "border-tealx-400/25 bg-tealx-400/[0.05] text-tealx-300";
  return (
    <BentoPanel hover={false} className="p-7 sm:p-8">
      <p className={cn("mb-6 text-[11px] font-extrabold tracking-[0.26em]", tone === "gold" ? "text-gold-400" : "text-tealx-400")}>
        {label}
      </p>
      <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-3">
        {items.map((it, i) => (
          <li key={it} className="flex items-center gap-2.5">
            {i > 0 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-mist-500" aria-hidden="true" />}
            <span className={cn("rounded-lg border px-3.5 py-2 text-[12.5px] font-bold", styles.split(" ").slice(0, 2).join(" "), tone === "gold" ? "text-gold-200" : "text-tealx-300")}>
              {it}
            </span>
          </li>
        ))}
      </ul>
    </BentoPanel>
  );
}

export function CommModel() {
  return (
    <Section labelledBy="comm-title" className="pt-24 sm:pt-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            id="comm-title"
            eyebrow="The Communication Model"
            title="Both Directions. By Design."
            sub="A counter conversation runs two ways — so Sanket does too. Sign becomes text and audio for the clerk; the clerk's response becomes text and validated sign guidance for the citizen."
          />
          <Tag tone="blue">Service-specific · validated signs</Tag>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal delay={100}><Chain label="CITIZEN → CLERK" tone="gold" items={C2K} /></Reveal>
        <Reveal delay={200}><Chain label="CLERK → CITIZEN" tone="teal" items={K2C} /></Reveal>
      </div>

      <Reveal delay={260}>
        <p className="mt-8 flex items-start gap-3 text-[13px] leading-relaxed text-mist-500">
          <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
          <span>
            Sanket operates within supported, service-specific sign content. It does not attempt unlimited,
            automatic ISL translation — clerk guidance is drawn from validated packs tied to real counter workflows.
          </span>
        </p>
      </Reveal>
    </Section>
  );
}
