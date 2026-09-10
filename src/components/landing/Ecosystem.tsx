import {
  ArrowDown,
  BarChart3,
  Camera,
  CircleGauge,
  ClipboardCheck,
  Gauge,
  GraduationCap,
  MonitorCheck,
  ScanSearch,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Reveal, useReducedMotion } from "@/lib/landing-motion";
import { BentoPanel, Section, SectionHead, Tag } from "./LandingUI";
import { cn } from "@/lib/cn";

function SahayakFlow() {
  const steps = [
    { icon: Camera, label: "Camera" },
    { icon: ScanSearch, label: "Recognition" },
    { icon: Gauge, label: "Confidence" },
    { icon: MonitorCheck, label: "Clerk" },
  ];
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3" aria-label="Sahayak flow: camera, recognition, confidence, clerk">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          {i > 0 && (
            <svg width="18" height="10" viewBox="0 0 18 10" className="text-gold-500/70" aria-hidden="true">
              <path d="M0 5h14M11 1.5 14.5 5 11 8.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          )}
          <span className="flex items-center gap-2.5 rounded-xl border border-gold-400/25 bg-gold-400/[0.05] px-4 py-3">
            <s.icon className="h-4.5 w-4.5 text-gold-300" aria-hidden="true" />
            <span className="text-[12px] font-extrabold tracking-wide text-gold-200">{s.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function QuestPanel() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const done = [true, true, true, true, true, false, false];
  return (
    <div className="mt-8 space-y-5">
      <div>
        <div className="mb-2.5 flex items-center justify-between text-[10px] font-extrabold tracking-[0.18em] text-mist-500">
          <span>WEEKLY PRACTICE</span>
          <span className="text-tealx-300">5-DAY STREAK</span>
        </div>
        <div className="flex gap-2" aria-hidden="true">
          {days.map((d, i) => (
            <span
              key={i}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border text-[10px] font-extrabold",
                done[i]
                  ? "border-tealx-400/50 bg-tealx-400/[0.12] text-tealx-300"
                  : "border-white/[0.08] bg-white/[0.02] text-mist-500"
              )}
            >
              {d}
            </span>
          ))}
        </div>
        <p className="sr-only">Practice streak: five of seven days completed this week.</p>
      </div>
      <div>
        <div className="mb-2.5 flex items-center justify-between text-[10px] font-extrabold tracking-[0.18em] text-mist-500">
          <span>SIGN READINESS</span>
          <span className="text-tealx-300">PRACTICING</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]" role="img" aria-label="Illustrative readiness progress bar, partially filled">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-tealx-500 to-tealx-300" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Daily learning", "Practice", "Quizzes", "XP", "Streaks", "Progress"].map((c) => (
          <span key={c} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] font-bold text-mist-300">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MomentHabitScore() {
  return (
    <Section id="ecosystem" labelledBy="eco-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="eco-title"
          eyebrow="The Sanket System"
          eyebrowIcon={Sparkles}
          title={
            <>
              Solve Today. <span className="text-tealx-300">Learn Tomorrow.</span>{" "}
              <span className="text-bluex-300">Measure Progress.</span>
            </>
          }
          sub="One system, three layers — immediate assistance at the counter, continuous readiness for staff, and institutional visibility into accessibility."
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Reveal delay={80} className="lg:col-span-7">
          <BentoPanel className="flex h-full flex-col p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <Tag tone="gold">Moment</Tag>
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-mist-500">AT THE COUNTER</span>
            </div>
            <h3 className="mt-6 text-[26px] font-extrabold tracking-tight text-mist-100">
              Sanket <span className="text-gold-grad">Sahayak</span>
            </h3>
            <p className="mt-3 max-w-md text-[13.5px] leading-[1.75] text-mist-400">
              Communication at the counter. Real-time assisted exchange between citizen and government clerk —
              with confidence standing between recognition and response.
            </p>
            <div className="mt-auto">
              <SahayakFlow />
              <p className="mt-6 text-[10.5px] font-bold tracking-[0.16em] text-mist-500 uppercase">
                Hackathon prototype · supported scope
              </p>
            </div>
          </BentoPanel>
        </Reveal>

        <Reveal delay={180} className="lg:col-span-5">
          <BentoPanel className="flex h-full flex-col p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <Tag tone="teal">Habit</Tag>
              <GraduationCap className="h-4 w-4 text-tealx-300" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-[26px] font-extrabold tracking-tight text-mist-100">
              ISL <span className="text-tealx-300">Quest</span>
            </h3>
            <p className="mt-3 text-[13.5px] leading-[1.75] text-mist-400">
              Build clerk readiness. Short, practical learning loops turn government staff into confident
              sign-aware service providers.
            </p>
            <QuestPanel />
            <p className="mt-auto pt-5 text-[10.5px] font-bold tracking-[0.16em] text-mist-500 uppercase">
              Concept interface · validated sign content only
            </p>
          </BentoPanel>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-12">
          <BentoPanel className="grid grid-cols-1 gap-8 p-7 sm:p-9 md:grid-cols-12 md:items-center">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3">
                <Tag tone="blue">Score</Tag>
              </div>
              <h3 className="mt-6 text-[26px] font-extrabold tracking-tight text-mist-100">
                Sugamya <span className="text-bluex-300">Score</span>
              </h3>
              <p className="mt-3 text-[13.5px] leading-[1.75] text-mist-400">
                Measure accessibility. Institution-level visibility that turns inclusion from intention into
                something observable — and improvable.
              </p>
            </div>
            <div className="flex justify-center md:col-span-3">
              <svg viewBox="0 0 140 140" className="h-36 w-36" role="img" aria-label="Illustrative Sugamya Score gauge arc">
                <circle cx="70" cy="70" r="54" stroke="rgba(255,255,255,0.08)" strokeWidth="9" fill="none" />
                <circle
                  cx="70" cy="70" r="54" stroke="url(#scoreGrad)" strokeWidth="9" fill="none"
                  strokeLinecap="round" strokeDasharray="339.3" strokeDashoffset="110"
                  transform="rotate(-90 70 70)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4A7DE8" />
                    <stop offset="100%" stopColor="#6D9BF5" />
                  </linearGradient>
                </defs>
                <text x="70" y="66" textAnchor="middle" fill="#EDEFF5" fontSize="13" fontWeight="800" letterSpacing="1">SUGAMYA</text>
                <text x="70" y="83" textAnchor="middle" fill="#9AA3B5" fontSize="8" fontWeight="700" letterSpacing="2">SCORE</text>
              </svg>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-5">
              {[
                { icon: CircleGauge, label: "Accessibility readiness" },
                { icon: ClipboardCheck, label: "Staff participation" },
                { icon: BarChart3, label: "Interaction feedback" },
                { icon: TrendingUp, label: "Improvement opportunities" },
              ].map((m) => (
                <li key={m.label} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
                  <m.icon className="h-4 w-4 shrink-0 text-bluex-300" aria-hidden="true" />
                  <span className="text-[13px] font-bold text-mist-300">{m.label}</span>
                </li>
              ))}
            </ul>
          </BentoPanel>
        </Reveal>
      </div>
    </Section>
  );
}

const LOOP = [
  ["Citizen", "Interaction"],
  ["Sanket", "Sahayak"],
  ["Feedback", ""],
  ["Sugamya", "Score"],
  ["Identify", "Gaps"],
  ["ISL", "Quest"],
  ["Clerk", "Readiness"],
  ["Better", "Interaction"],
  ["Better", "Experience"],
];

function FlywheelDiagram() {
  const reduced = useReducedMotion();
  const cx = 310;
  const cy = 300;
  const rDot = 168;
  const rLab = 226;

  return (
    <div className="relative mx-auto max-w-[640px]" role="img" aria-label="The Sanket flywheel: citizen interaction flows through Sanket Sahayak, feedback, Sugamya Score, gap identification, ISL Quest, clerk readiness, better interaction, and a better citizen experience — then loops back to the citizen.">
      <svg viewBox="0 0 620 600" className="h-auto w-full" aria-hidden="true">
        <defs>
          <radialGradient id="loopGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EAB653" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#EAB653" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r="252" fill="url(#loopGlow)" />
        <circle
          id="loopRing" cx={cx} cy={cy} r={rDot} fill="none"
          stroke="rgba(234,182,83,0.4)" strokeWidth="1.4" strokeDasharray="4 9"
          className={reduced ? undefined : "spin-slower"}
        />
        {!reduced && (
          <circle r="4" fill="#F5CD74" className="packet-glow">
            <animateMotion dur="11s" repeatCount="indefinite" rotate="auto">
              <mpath href="#loopRing" />
            </animateMotion>
          </circle>
        )}

        <circle cx={cx} cy={cy} r="58" fill="rgba(11,15,26,0.9)" stroke="rgba(234,182,83,0.45)" strokeWidth="1.2" />
        <circle cx={cx} cy={cy} r="70" fill="none" stroke="rgba(234,182,83,0.18)" strokeWidth="1" strokeDasharray="2 7" className={reduced ? undefined : "spin-rev"} />
        <text x={cx} y={cy - 12} textAnchor="middle" fill="#F5CD74" fontSize="9" fontWeight="800" letterSpacing="2.4">EVERY</text>
        <text x={cx} y={cy + 2} textAnchor="middle" fill="#F5CD74" fontSize="9" fontWeight="800" letterSpacing="2.4">INTERACTION</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="#9AA3B5" fontSize="8" fontWeight="700" letterSpacing="2">IMPROVES</text>
        <text x={cx} y={cy + 30} textAnchor="middle" fill="#9AA3B5" fontSize="8" fontWeight="700" letterSpacing="2">ACCESS</text>

        {LOOP.map((label, i) => {
          const a = ((-90 + i * 40) * Math.PI) / 180;
          const dx = cx + rDot * Math.cos(a);
          const dy = cy + rDot * Math.sin(a);
          const lx = cx + rLab * Math.cos(a);
          const ly = cy + rLab * Math.sin(a);
          const key = label.join(" ");
          const isProduct = key === "Sanket Sahayak" || key === "Sugamya Score" || key === "ISL Quest";
          return (
            <g key={key}>
              <circle cx={dx} cy={dy} r={isProduct ? 7 : 5} fill="#05070D" stroke={isProduct ? "#EAB653" : "rgba(234,182,83,0.55)"} strokeWidth="1.6" />
              {isProduct && <circle cx={dx} cy={dy} r="2.6" fill="#F5CD74" />}
              <text
                x={lx}
                y={label[1] ? ly - 5 : ly + 3.5}
                textAnchor="middle"
                fill={isProduct ? "#F5CD74" : "#AEB6C6"}
                fontSize="10.5"
                fontWeight="800"
                letterSpacing="1.8"
                style={{ textTransform: "uppercase" }}
              >
                {label[0].toUpperCase()}
              </text>
              {label[1] && (
                <text x={lx} y={ly + 9} textAnchor="middle" fill={isProduct ? "#F5CD74" : "#AEB6C6"} fontSize="10.5" fontWeight="800" letterSpacing="1.8">
                  {label[1].toUpperCase()}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Flywheel() {
  return (
    <Section labelledBy="fly-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="fly-title"
          align="center"
          eyebrow="The Flywheel"
          eyebrowIcon={Target}
          title="Accessibility That Improves With Every Interaction."
          sub="Assistance generates feedback. Feedback reveals gaps. Gaps drive learning. Learning raises readiness. Readiness makes the next interaction better."
        />
      </Reveal>

      <Reveal delay={140}>
        <div className="hidden md:block">
          <FlywheelDiagram />
        </div>
      </Reveal>

      <ol className="mx-auto mt-10 max-w-md space-y-2.5 md:hidden" aria-label="Flywheel steps">
        {LOOP.map((l, i) => (
          <li key={l.join(" ")} className="flex flex-col items-center">
            {i > 0 && <ArrowDown className="mb-2.5 h-3.5 w-3.5 text-gold-500/60" aria-hidden="true" />}
            <span className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-3 text-center text-[13px] font-extrabold tracking-[0.14em] text-mist-200 uppercase">
              {l.join(" ")}
            </span>
          </li>
        ))}
        <li className="flex flex-col items-center">
          <ArrowDown className="mb-2.5 h-3.5 w-3.5 text-gold-500/60" aria-hidden="true" />
          <span className="w-full rounded-xl border border-gold-400/30 bg-gold-400/[0.06] px-5 py-3 text-center text-[12px] font-extrabold tracking-[0.14em] text-gold-300 uppercase">
            Back to Citizen Interaction
          </span>
        </li>
      </ol>
    </Section>
  );
}
