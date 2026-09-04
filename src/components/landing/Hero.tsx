import { useEffect, useRef } from "react";
import { ArrowDown, GraduationCap, Headset, ShieldCheck } from "lucide-react";
import { LoginButton, Tag } from "./LandingUI";
import { useReducedMotion } from "@/lib/landing-motion";

function SpatialDiagram() {
  const motion = !useReducedMotion();

  return (
    <div className="hero-visual relative" role="img" aria-label="Infrastructure diagram: a citizen signs in Indian Sign Language; Sanket's assisted communication layer captures and recognizes the sign, evaluates its confidence, and delivers text to the government clerk. When confidence is low, the flow escalates to a human interpreter and the service continues.">
      <svg viewBox="0 0 980 660" fill="none" className="h-auto w-full" aria-hidden="true">
        <defs>
          <radialGradient id="gGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EAB653" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#EAB653" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3EC6B8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3EC6B8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6D9BF5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6D9BF5" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F9DDB0" />
            <stop offset="55%" stopColor="#EAB653" />
            <stop offset="100%" stopColor="#B57F26" />
          </linearGradient>
          <linearGradient id="slabGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#151C30" />
            <stop offset="100%" stopColor="#0A0F1C" />
          </linearGradient>
          <pattern id="gridp" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M42 0H0V42" stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
          </pattern>
          <radialGradient id="fadeMask" cx="50%" cy="52%" r="58%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridMask">
            <rect width="980" height="660" fill="url(#fadeMask)" />
          </mask>
          <filter id="pathGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="980" height="660" fill="url(#gridp)" mask="url(#gridMask)" />
        <ellipse cx="490" cy="596" rx="430" ry="68" fill="url(#bGlow)" opacity="0.12" />

        <ellipse cx="490" cy="552" rx="262" ry="30" fill="#000" opacity="0.45" />
        <polygon points="348,468 632,468 688,516 292,516" fill="url(#slabGrad)" stroke="rgba(234,182,83,0.28)" strokeWidth="1" />
        <polygon points="292,516 688,516 676,542 304,542" fill="#0A0E19" stroke="rgba(255,255,255,0.06)" />
        <line x1="372" y1="492" x2="608" y2="492" stroke="rgba(234,182,83,0.35)" strokeWidth="1" strokeDasharray="2 6" />
        <text x="490" y="497" textAnchor="middle" fill="rgba(154,163,181,0.55)" fontSize="8" letterSpacing="3" fontWeight="700">
          SERVICE COUNTER
        </text>

        <path id="pA" d="M187 240 C 300 148 372 150 449 193" stroke="#EAB653" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="4 8" className="flow-path dash-flow" />
        <path id="pB" d="M531 193 C 608 150 680 148 793 240" stroke="#6D9BF5" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="4 8" className="flow-path dash-flow" />
        <path id="pC" d="M490 288 C 490 330 490 356 490 404" stroke="#E8863C" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="4 8" className="flow-path dash-flow" />
        <path id="pD" d="M588 428 C 648 428 672 440 711 458" stroke="#E8863C" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="4 8" className="flow-path dash-flow" />
        <path id="pE" d="M756 445 C 800 392 820 332 828 278" stroke="#3EC6B8" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="4 8" className="flow-path dash-flow" />
        <path id="pF" d="M800 270 C 720 372 262 372 182 274" stroke="#3EC6B8" strokeOpacity="0.18" strokeWidth="1.2" strokeDasharray="2 9" className="flow-path dash-flow-slow" />

        {motion && (
          <g>
            <circle r="3.4" fill="#F5CD74" className="packet-glow">
              <animateMotion dur="2.8s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pA" />
              </animateMotion>
            </circle>
            <circle r="3.4" fill="#9DBCF7" className="packet-glow">
              <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pB" />
              </animateMotion>
            </circle>
            <circle r="3.2" fill="#F2A768" className="packet-glow">
              <animateMotion dur="3.4s" begin="0.5s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pD" />
              </animateMotion>
            </circle>
            <circle r="3.2" fill="#7EE0D2" className="packet-glow">
              <animateMotion dur="3s" begin="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pE" />
              </animateMotion>
            </circle>
          </g>
        )}

        <rect x="484.5" y="340.5" width="11" height="11" transform="rotate(45 490 346)" fill="#05070D" stroke="#F2A768" strokeWidth="1.4" className="pulse-soft" />

        <g>
          <circle cx="150" cy="240" r="66" fill="url(#tGlow)" className="node-glow" opacity="0.35" />
          <circle cx="150" cy="240" r="37" fill="rgba(11,15,26,0.82)" stroke="#3EC6B8" strokeOpacity="0.55" strokeWidth="1.4" />
          <circle cx="150" cy="240" r="46" stroke="#3EC6B8" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 8" className="spin-slower" />
          <g transform="translate(136.5,226.5) scale(1.12)" stroke="#7EE0D2" strokeWidth="1.9" strokeLinecap="round" fill="none">
            <circle cx="12" cy="7.5" r="3.6" />
            <path d="M4.8 20.5v-1.6a6 6 0 0 1 6-6h2.4a6 6 0 0 1 6 6v1.6" />
          </g>
          <text x="150" y="298" textAnchor="middle" fill="#AEB6C6" fontSize="10.5" letterSpacing="3.2" fontWeight="800">CITIZEN</text>
          <text x="150" y="313" textAnchor="middle" fill="#647089" fontSize="7.6" letterSpacing="2.4" fontWeight="700">SIGNS IN ISL</text>
        </g>

        <g>
          <circle cx="830" cy="240" r="66" fill="url(#bGlow)" className="node-glow" opacity="0.35" />
          <circle cx="830" cy="240" r="37" fill="rgba(11,15,26,0.82)" stroke="#6D9BF5" strokeOpacity="0.55" strokeWidth="1.4" />
          <circle cx="830" cy="240" r="46" stroke="#6D9BF5" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 8" className="spin-rev" />
          <g transform="translate(816.5,226.5) scale(1.12)" stroke="#9DBCF7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M3 21.5h18" />
            <path d="M5.5 21.5v-9M9.75 21.5v-9M14.25 21.5v-9M18.5 21.5v-9" transform="translate(0 -1.5)" />
            <path d="M3 7.5l9-4.5 9 4.5z" />
          </g>
          <text x="830" y="298" textAnchor="middle" fill="#AEB6C6" fontSize="10.5" letterSpacing="3" fontWeight="800">GOVT CLERK</text>
          <text x="830" y="313" textAnchor="middle" fill="#647089" fontSize="7.6" letterSpacing="2.4" fontWeight="700">AT THE COUNTER</text>
        </g>

        <g>
          <circle cx="490" cy="232" r="110" fill="url(#gGlow)" className="node-glow" opacity="0.4" />
          <circle cx="490" cy="232" r="80" stroke="#EAB653" strokeOpacity="0.3" strokeWidth="1.4" strokeDasharray="3 11" className="spin-slower" />
          <circle cx="490" cy="232" r="61" stroke="#EAB653" strokeOpacity="0.38" strokeWidth="1" />
          <circle cx="490" cy="232" r="35" fill="url(#coreGrad)" stroke="#F9DDB0" strokeOpacity="0.5" strokeWidth="1" />
          <g transform="translate(476.5,218.5) scale(1.12)" stroke="#05070D" strokeWidth="2.1" strokeLinecap="round" fill="none">
            <path d="M7.6 8.6a4.4 4.4 0 0 1 8.8 0" />
            <path d="M4.4 11.6a7.6 7.6 0 0 1 15.2 0" opacity="0.65" />
            <path d="M10.6 12.4a1.4 1.4 0 0 1 2.8 0" />
            <circle cx="12" cy="16.2" r="1.3" fill="#05070D" stroke="none" />
          </g>
          <text x="490" y="342" textAnchor="middle" fill="#F0CC82" fontSize="11.5" letterSpacing="4" fontWeight="800">SANKET</text>
          <text x="490" y="357" textAnchor="middle" fill="#8A93A8" fontSize="7.4" letterSpacing="2.6" fontWeight="700">ASSISTED COMMUNICATION LAYER</text>
        </g>

        <g>
          <rect x="393" y="405" width="194" height="46" rx="23" fill="rgba(232,134,60,0.10)" stroke="#E8863C" strokeOpacity="0.5" strokeWidth="1.2" />
          <g transform="translate(411,415) scale(1.1)" stroke="#F2A768" strokeWidth="1.9" strokeLinecap="round" fill="none">
            <path d="M12 3.5 21.5 20h-19z" strokeLinejoin="round" />
            <path d="M12 9.5v4.4" />
            <circle cx="12" cy="17" r="0.4" fill="#F2A768" />
          </g>
          <text x="466" y="433" textAnchor="middle" fill="#F2A768" fontSize="9.5" letterSpacing="2.2" fontWeight="800">LOW CONFIDENCE</text>
        </g>

        <g>
          <circle cx="745" cy="470" r="54" fill="url(#tGlow)" className="node-glow" opacity="0.3" />
          <circle cx="745" cy="470" r="31" fill="rgba(11,15,26,0.85)" stroke="#3EC6B8" strokeOpacity="0.55" strokeWidth="1.3" />
          <g transform="translate(733.5,458.5) scale(0.96)" stroke="#7EE0D2" strokeWidth="1.9" strokeLinecap="round" fill="none">
            <path d="M15.5 20v-1.8a4 4 0 0 0-4-4h-5a4 4 0 0 0-4 4V20" />
            <circle cx="9" cy="7.6" r="3.4" />
            <path d="M21.5 20v-1.8a4 4 0 0 0-3-3.9" />
            <path d="M15 4.4a3.4 3.4 0 0 1 0 6.4" />
          </g>
          <text x="745" y="530" textAnchor="middle" fill="#AEB6C6" fontSize="9.5" letterSpacing="2.6" fontWeight="800">HUMAN INTERPRETER</text>
          <text x="745" y="544" textAnchor="middle" fill="#647089" fontSize="7.2" letterSpacing="2.2" fontWeight="700">THE SAFETY NET</text>
        </g>

        <g className={motion ? "anim-float-slow" : undefined}>
          <rect x="596" y="116" width="182" height="46" rx="14" fill="rgba(10,14,23,0.85)" stroke="rgba(255,255,255,0.1)" />
          <text x="611" y="136" fill="#9AA3B5" fontSize="8" letterSpacing="2" fontWeight="800">CONFIDENCE</text>
          <rect x="611" y="143" width="24" height="6" rx="3" fill="#4CC38A" />
          <rect x="641" y="143" width="24" height="6" rx="3" fill="#4CC38A" />
          <rect x="671" y="143" width="24" height="6" rx="3" fill="#4CC38A" />
          <rect x="701" y="143" width="24" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
          <text x="767" y="150" textAnchor="end" fill="#4CC38A" fontSize="10" letterSpacing="1.6" fontWeight="800">CLEAR</text>
        </g>
        <g className={motion ? "anim-float" : undefined}>
          <rect x="34" y="58" width="212" height="40" rx="20" fill="rgba(62,198,184,0.07)" stroke="rgba(62,198,184,0.35)" />
          <circle cx="56" cy="78" r="3.5" fill="#3EC6B8" className="pulse-soft" />
          <text x="70" y="82" fill="#7EE0D2" fontSize="8.6" letterSpacing="1.8" fontWeight="800">LIVE ASSIST · SUPPORTED SIGNS</text>
        </g>
      </svg>

      <p className="sr-only">
        Flow detail: Citizen signs, the camera captures, recognition runs with a confidence check. High confidence
        delivers text to the clerk. Low confidence routes to a human interpreter, then back to the clerk so the
        service continues.
      </p>
    </div>
  );
}

function MobileDiagram() {
  return (
    <div className="md:hidden" role="img" aria-label="Simplified flow: citizen, Sanket assisted communication layer, government clerk. A low-confidence branch leads to a human interpreter.">
      <div className="glass mx-auto flex max-w-[340px] flex-col items-center gap-1.5 rounded-2xl px-5 py-6" aria-hidden="true">
        {[
          { label: "CITIZEN", sub: "Signs in ISL", tone: "text-tealx-300 border-tealx-400/40" },
          { label: "SANKET", sub: "Assisted layer", tone: "text-gold-300 border-gold-400/50" },
          { label: "GOVT CLERK", sub: "At the counter", tone: "text-bluex-300 border-bluex-400/40" },
        ].map((n, i) => (
          <div key={n.label} className="flex w-full flex-col items-center">
            {i > 0 && (
              <svg width="10" height="18" viewBox="0 0 10 18" className="my-1 text-mist-500">
                <path d="M5 0v13M1.5 9.5 5 13l3.5-3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
            )}
            <div className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-center ${n.tone}`}>
              <p className="text-[12px] font-extrabold tracking-[0.2em]">{n.label}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-mist-500 tracking-wide">{n.sub}</p>
            </div>
          </div>
        ))}
        <div className="mt-3 flex w-full items-center justify-center gap-2">
          <span className="rounded-full border border-orangex-400/40 bg-orangex-400/10 px-3 py-1.5 text-[9px] font-extrabold tracking-[0.14em] text-orangex-300">
            LOW CONFIDENCE
          </span>
          <svg width="16" height="10" viewBox="0 0 16 10" className="text-mist-500">
            <path d="M0 5h12M9 1.5 12.5 5 9 8.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </svg>
          <span className="rounded-full border border-tealx-400/40 bg-tealx-400/10 px-3 py-1.5 text-[9px] font-extrabold tracking-[0.14em] text-tealx-300">
            HUMAN INTERPRETER
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const depthRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        depthRef.current?.style.setProperty("--hero-shift", `${y * 0.07}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="relative overflow-hidden pt-[72px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-320px] h-[640px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/[0.07] blur-[130px]" />
        <div className="absolute right-[-200px] top-[380px] h-[420px] w-[520px] rounded-full bg-bluex-500/[0.06] blur-[110px]" />
        <div className="absolute left-[-220px] top-[560px] h-[420px] w-[480px] rounded-full bg-tealx-500/[0.05] blur-[110px]" />
      </div>

      <section
        aria-labelledby="hero-title"
        className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-10 lg:pb-24 lg:pt-20"
      >
        <div className="lg:col-span-6 xl:col-span-6">
          <div className="mb-7 flex flex-wrap items-center gap-2.5">
            <Tag tone="gold">YI Future 6.0</Tag>
            <Tag tone="muted">National-Level Hackathon</Tag>
          </div>

          <h1
            id="hero-title"
            className="text-balance text-[clamp(2.5rem,6.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.028em] text-mist-100"
          >
            Making Every{" "}
            <span className="text-gold-grad">Government&nbsp;Counter</span>{" "}
            More Accessible.
          </h1>

          <p className="mt-7 max-w-[540px] text-[15.5px] leading-[1.75] text-mist-400 sm:text-[17px]">
            Sanket is an AI-assisted accessibility infrastructure designed to help government clerks communicate
            with <span className="font-semibold text-mist-200">Deaf and hard-of-hearing citizens</span> — while
            keeping human support in the loop when AI is uncertain.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <LoginButton size="lg" />
            <p className="max-w-[240px] text-[11.5px] leading-relaxed text-mist-500">
              Real-time assistance at the counter.
              <br />
              Human certainty behind it.
            </p>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3" aria-label="Key capabilities">
            {[
              { icon: ShieldCheck, label: "Confidence-aware AI" },
              { icon: Headset, label: "Human-in-the-loop" },
              { icon: GraduationCap, label: "Clerk readiness" },
            ].map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-[12px] font-bold tracking-wide text-mist-400">
                <c.icon className="h-4 w-4 text-gold-400" aria-hidden="true" />
                {c.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 xl:col-span-6">
          <div ref={depthRef} className="hero-depth hidden md:block">
            <SpatialDiagram />
          </div>
          <MobileDiagram />
          <div className="mt-5 hidden text-center md:block">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-mist-500 uppercase">
              Citizen → Sanket → Clerk <span className="mx-1.5 text-gold-500">·</span> Low confidence → Human interpreter
            </p>
            <p className="mt-1.5 text-[9.5px] font-bold tracking-[0.22em] text-mist-500/70 uppercase">
              Prototype interface concept · supported signs only
            </p>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="relative mx-auto hidden w-fit flex-col items-center gap-2 pb-10 text-mist-500 lg:flex">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown className="anim-float h-4 w-4" />
      </div>
    </div>
  );
}
