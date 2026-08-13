"use client";

interface SugamyaScoreProps {
  compliance: number;
  satisfactionRate: number;
  totalCompletions: number;
}

export function SugamyaScore({
  compliance,
  satisfactionRate,
  totalCompletions,
}: SugamyaScoreProps) {
  const participation =
    Math.min(totalCompletions / 50, 1) * 10; // 50 completions → full participation weight
  const raw =
    compliance * 0.5 + satisfactionRate * 0.35 + participation * 0.15;
  const score = Math.round(raw);

  const grade =
    score >= 80
      ? { g: "A", label: "Advanced", color: "text-emerald-400" }
      : score >= 60
        ? { g: "B", label: "Progressive", color: "text-primary-400" }
        : score >= 40
          ? { g: "C", label: "Developing", color: "text-amber-400" }
          : { g: "D", label: "Starting", color: "text-red-400" };

  return (
    <div className="glass border-primary-500/15 p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500">
          Sugamya Score
        </p>
        <span className="text-[9px] text-surface-400">Accessibility Index</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-4xl font-extrabold ${grade.color}`}>{score}</p>
          <p className="text-[11px] text-surface-500 mt-0.5">
            Grade {grade.g} · {grade.label}
          </p>
        </div>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      </div>
      <div className="mt-3 h-1.5 bg-surface-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <p className="text-[9px] text-surface-400 mt-2">
        Compliance {Math.round(compliance)}% · Citizen satisfaction{" "}
        {Math.round(satisfactionRate)}%
      </p>
    </div>
  );
}