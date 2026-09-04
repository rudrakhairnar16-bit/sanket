import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck,
  ClipboardList,
  ContactRound,
  Droplets,
  FileBadge,
  FileText,
  GraduationCap,
  HandHelping,
  HeartHandshake,
  IndianRupee,
  Info,
  Landmark,
  MessageSquareWarning,
  PackageOpen,
  Route,
  Store,
  Ticket,
} from "lucide-react";
import { Reveal } from "@/lib/landing-motion";
import { BentoPanel, Section, SectionHead, Tag } from "./LandingUI";
import { cn } from "@/lib/cn";

const MUNICIPAL = [
  { icon: Droplets, label: "Water" },
  { icon: Building2, label: "Property" },
  { icon: FileBadge, label: "Certificates" },
  { icon: MessageSquareWarning, label: "Complaints" },
  { icon: IndianRupee, label: "Payments" },
  { icon: Info, label: "Public information" },
];

const ASSISTANCE = [
  { icon: FileText, label: "Documents" },
  { icon: ClipboardList, label: "Application status" },
  { icon: CalendarCheck, label: "Appointments" },
  { icon: Ticket, label: "Queue / Token" },
  { icon: Route, label: "Department routing" },
  { icon: HandHelping, label: "General assistance" },
];

function PackPanel({
  title,
  tone,
  items,
  desc,
}: {
  title: string;
  tone: "gold" | "blue";
  desc: string;
  items: { icon: typeof Info; label: string }[];
}) {
  const gold = tone === "gold";
  return (
    <BentoPanel className="p-7 sm:p-9">
      <p className={cn("text-[11px] font-extrabold tracking-[0.24em]", gold ? "text-gold-400" : "text-bluex-400")}>{title}</p>
      <p className="mt-3 text-[13px] leading-relaxed text-mist-400">{desc}</p>
      <ul className="mt-7 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {items.map((it) => (
          <li
            key={it.label}
            className={cn(
              "flex items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-colors duration-300",
              gold
                ? "border-white/[0.07] bg-white/[0.02] hover:border-gold-400/30"
                : "border-white/[0.07] bg-white/[0.02] hover:border-bluex-400/30"
            )}
          >
            <it.icon className={cn("h-[18px] w-[18px] shrink-0", gold ? "text-gold-300" : "text-bluex-300")} aria-hidden="true" />
            <span className="text-[13.5px] font-bold text-mist-200">{it.label}</span>
          </li>
        ))}
      </ul>
    </BentoPanel>
  );
}

export function ServicePacks() {
  return (
    <Section labelledBy="packs-title" className="pt-24 sm:pt-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            id="packs-title"
            eyebrow="Service Packs"
            eyebrowIcon={PackageOpen}
            title="Built Around the Services People Actually Need."
            sub="Sanket is designed around modular Service Packs — focused sign vocabulary and response flows per department — rather than pretending to solve every government service at once."
          />
          <Tag tone="muted">Service Pack concepts · supported prototype scope</Tag>
        </div>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal delay={100}>
          <PackPanel
            title="MUNICIPAL SERVICES"
            tone="gold"
            desc="Civic interactions at the municipal counter — scoped to the requests citizens make most."
            items={MUNICIPAL}
          />
        </Reveal>
        <Reveal delay={200}>
          <PackPanel
            title="CITIZEN ASSISTANCE"
            tone="blue"
            desc="Wayfinding and administrative support — the questions that stall a queue when communication fails."
            items={ASSISTANCE}
          />
        </Reveal>
      </div>
    </Section>
  );
}

const SCALE = [
  { name: "Counter", note: "Where accessibility is felt first", w: "w-[38%]" },
  { name: "Department", note: "Shared packs across service lines", w: "w-[46%]" },
  { name: "Institution", note: "Readiness measured with Sugamya Score", w: "w-[54%]" },
  { name: "City", note: "Common accessibility standards", w: "w-[64%]" },
  { name: "State", note: "Cross-institution insight", w: "w-[76%]" },
  { name: "National Accessibility Network", note: "Designed-for vision", w: "w-[92%]" },
];

export function Scale() {
  return (
    <Section labelledBy="scale-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="scale-title"
          eyebrow="Designed Scale"
          title={
            <>
              Designed for One Counter.
              <br />
              <span className="text-gold-grad">Built for a System.</span>
            </>
          }
          sub="The architecture starts at a single desk and is deliberately designed to scale outward — the same interaction model, the same feedback loop, widening concentric reach."
        />
      </Reveal>

      <Reveal delay={140}>
        <div className="mt-14 space-y-3" role="list" aria-label="Scale progression: counter, department, institution, city, state, national accessibility network">
          {SCALE.map((s, i) => (
            <div
              key={s.name}
              role="listitem"
              className={cn(
                "group flex items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-all duration-500 hover:translate-x-1 sm:px-7",
                s.w,
                "min-w-fit",
                i === SCALE.length - 1
                  ? "border-gold-400/40 bg-gradient-to-r from-gold-400/[0.12] to-gold-400/[0.02]"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-gold-400/25"
              )}
            >
              <span className="flex items-baseline gap-4 whitespace-nowrap">
                <span className={cn("text-[15px] font-extrabold tracking-tight", i === SCALE.length - 1 ? "text-gold-grad" : "text-mist-100")}>
                  {s.name}
                </span>
                <span className="hidden text-[11.5px] font-semibold text-mist-500 md:inline">{s.note}</span>
              </span>
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-mist-500">0{i + 1}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={220}>
        <p className="mt-7 text-[12px] font-semibold tracking-[0.1em] text-mist-500">
          DESIGNED SCALABILITY — A ROADMAP OF INTENT, NOT A DEPLOYMENT CLAIM.
        </p>
      </Reveal>
    </Section>
  );
}

const IMPACT = [
  { icon: ContactRound, label: "Citizen" },
  { icon: HandHelping, label: "Government Clerk" },
  { icon: Store, label: "Service Counter" },
  { icon: Building2, label: "Department" },
  { icon: Landmark, label: "Institution" },
  { icon: BarChart3, label: "Accessibility Insights" },
  { icon: GraduationCap, label: "Staff Readiness" },
  { icon: HeartHandshake, label: "Better Public Service" },
];

export function NationalImpact() {
  return (
    <Section id="impact" labelledBy="impact-title" className="pt-24 sm:pt-32">
      <Reveal>
        <SectionHead
          id="impact-title"
          eyebrow="National Impact"
          eyebrowIcon={Landmark}
          title="Beyond One Interaction."
          sub="Designed to connect the smallest moment of service to the largest question of governance: can every citizen be served with equal dignity?"
        />
      </Reveal>

      <Reveal delay={140}>
        <BentoPanel hover={false} className="mt-14 p-7 sm:p-10">
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {IMPACT.map((n, i) => (
              <li key={n.label} className="group relative flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4.5 transition-colors duration-300 hover:border-gold-400/25">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/[0.05] text-gold-300">
                  <n.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[9.5px] font-extrabold tracking-[0.22em] text-mist-500">STEP {String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[14px] font-extrabold text-mist-100">{n.label}</span>
                </span>
                {i < IMPACT.length - 1 && (
                  <ArrowRight className="ml-auto hidden h-3.5 w-3.5 text-mist-500 xl:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t border-white/[0.06] pt-6 text-center text-[13px] leading-relaxed text-mist-400">
            <span className="font-semibold text-gold-300">Designed for</span> national impact — where every counter
            interaction becomes insight, and every insight becomes readiness.
          </p>
        </BentoPanel>
      </Reveal>
    </Section>
  );
}
