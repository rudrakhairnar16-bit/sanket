import Link from "next/link";

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export default function ProblemStatementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/login"
          className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex items-center gap-1 mb-8 transition-all"
        >
          ← Back to Sign In
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand mb-4 shadow-glow-primary">
            <span className="text-2xl font-bold text-white">सं</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
            Problem Statement
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Why Sanket exists — the challenge it answers and the outcomes it targets.
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-3 p-6 pb-0">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-glow-primary shrink-0">
                <AlertIcon />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">The Challenge</h2>
            </div>
            <div className="p-6 pt-4 space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              <p>
                India has an estimated <strong className="text-gray-900 dark:text-white">18 million hearing-impaired persons</strong> —
                yet Indian Sign Language remains largely unknown outside the deaf community. Service
                providers in hospitals, banks, courts, and government offices rarely know ISL, and there
                are no ISL interpreters available in most public spaces.
              </p>
              <p>
                The result: hearing-impaired citizens routinely face exclusion from basic services,
                healthcare, and civic life. The RPwD Act 2016 officially recognises ISL — but
                integration into public services is near zero.
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-3 p-6 pb-0">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-gray-900 shadow-glow-accent shrink-0">
                <FlagIcon />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Task</h2>
            </div>
            <div className="p-6 pt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Build a solution that makes ISL learning and usage mainstream across at least one critical
              sector. Design for adoption — make learning ISL as accessible and engaging as learning any
              other skill.
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-3 p-6 pb-0">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-glow-primary shrink-0">
                <ChecklistIcon />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Constraints</h2>
            </div>
            <ul className="p-6 pt-4 space-y-2.5">
              {[
                "Target a defined audience",
                "Easy to adopt with minimal prerequisites",
                "Account for India's linguistic diversity",
                "Include a strategy to reach Tier 2/3 cities and rural areas",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-3 p-6 pb-0">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-gray-900 shadow-glow-accent shrink-0">
                <TargetIcon />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Expected Outcomes</h2>
            </div>
            <ul className="p-6 pt-4 space-y-2.5">
              {[
                "A learning model with a clear adoption pathway",
                "Curriculum outline for the chosen sector",
                "Adoption strategy with partnerships, champions, incentives",
                "Scalability plan from pilot to national rollout",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-accent-500/15 text-accent-600 dark:text-accent-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl overflow-hidden p-8 text-white shadow-glow-primary">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                  <RocketIcon />
                </div>
                <h2 className="text-xl font-bold">The Solution: Sanket</h2>
              </div>
              <p className="text-sm leading-relaxed text-primary-100">
                Sanket is a gamified ISL learning platform for government clerks — flashcards,
                quizzes, webcam sign practice, daily lessons and leaderboards. It turns a
                daunting language into a 3-minutes-a-day habit, targets government services as
                the critical sector, and scales from a pilot in one department to Tier 2/3 cities
                and rural India through the existing training infrastructure.
              </p>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="btn-primary w-full sm:w-auto justify-center px-8 py-3 text-sm"
            >
              Try Sanket Now
            </Link>
            <Link
              href="/learn"
              className="btn-secondary w-full sm:w-auto justify-center px-8 py-3 text-sm"
            >
              Play ISL Quest
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4">
            Sanket v1.0 — Team KPGU · KPGU University · Inter-University Round
          </p>
        </div>
      </div>
    </div>
  );
}