import Link from "next/link";

const PHASES = [
  {
    phase: 1,
    name: "Pilot — Single Municipality",
    timeline: "Months 1-3",
    color: "from-emerald-500 to-teal-600",
    items: [
      "Deploy Sanket in 1 municipal office (e.g., Ahmedabad Municipal Corporation or Pune Municipal Corporation)",
      "Onboard 50-100 clerks from 3 departments (Water Tax, Property Tax, Health)",
      "Daily ISL lessons + streak tracking for all enrolled clerks",
      "Admin dashboard for compliance monitoring",
      "QR code feedback at 5 service desks",
      "Success metric: 70%+ daily lesson completion rate",
    ],
  },
  {
    phase: 2,
    name: "Scale — City-Wide Rollout",
    timeline: "Months 4-6",
    color: "from-blue-500 to-indigo-600",
    items: [
      "Expand to all departments in the pilot municipality (15-20 depts)",
      "Onboard 500+ clerks across 5-10 municipal offices",
      "WhatsApp nudge integration for low-engagement clerks",
      "ISL Champion program: top 10% performers get special recognition",
      "Monthly certificate generation for milestone achievers",
      "Success metric: 50%+ clerks reach 30-day streak",
    ],
  },
  {
    phase: 3,
    name: "Regional Expansion — Tier 2/3 Cities",
    timeline: "Months 7-12",
    color: "from-purple-500 to-violet-600",
    items: [
      "Partner with 5 municipal corporations in Gujarat (Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar) and Maharashtra (Nagpur, Nashik, Aurangabad)",
      "Add regional language support (Marathi → Gujarati → Tamil → Bengali) — starting with Gujarati for AMC/SMC pilot expansion",
      "PWA offline mode for areas with unreliable internet",
      "Department-level leaderboards with inter-city rankings",
      "Train-the-trainer program: identify 1 ISL Champion per office as peer trainer",
      "Success metric: 5,000+ clerks actively learning ISL",
    ],
  },
  {
    phase: 4,
    name: "State-Level Integration",
    timeline: "Year 2",
    color: "from-amber-500 to-orange-600",
    items: [
      "State government MoU for mandatory ISL training across all public offices — Gujarat SRC and Maharashtra SRC as initial partners",
      "Pilot with Gujarat State Rural Development Mission (GSRDM) for district-level clerk training",
      "ISL proficiency certification recognized by state govt",
      "Citizen feedback dashboard shared with district collectors",
      "Annual ISL proficiency awards for top-performing departments",
      "Success metric: 25,000+ clerks certified in basic ISL",
    ],
  },
  {
    phase: 5,
    name: "National Rollout",
    timeline: "Year 3-5",
    color: "from-rose-500 to-pink-600",
    items: [
      "Platform adopted by Department of Empowerment of PwDs (DEPwD)",
      "Integration with ISLRTC for certified content pipeline (10,000+ signs)",
      "All 36 states/UTs onboarded with state-specific admin dashboards",
      "Policy mandate: ISL training as part of annual performance review for public servants",
      "Real-time national accessibility dashboard for Govt of India",
      "Success metric: 500,000+ government staff trained in ISL",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/learn"
          className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex items-center gap-1 mb-8 transition-all"
        >
          ← Back to ISL Quest
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">🗺️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Scalability Roadmap
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            From a single municipal pilot to national adoption — a phased rollout
            plan aligned with the Rights of Persons with Disabilities Act 2016.
          </p>
        </div>

        <div className="space-y-8">
          {PHASES.map((phase) => (
            <div key={phase.phase}>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-md shrink-0`}
                >
                  <span className="text-lg font-bold text-white">{phase.phase}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {phase.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {phase.timeline}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ml-2">
                <ul className="space-y-3">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary-500 dark:text-primary-400 mt-0.5 shrink-0">✓</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl p-8 text-center text-white">
          <span className="text-5xl block mb-4">🇮🇳</span>
          <h2 className="text-2xl font-bold mb-3">
            Making Public Services Truly Accessible
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            Sanket moves beyond measuring training completion to measuring 
            on-ground impact — every QR scan from a citizen tells us whether 
            our clerks are actually using ISL at their desks.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/curriculum"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-medium transition-all"
            >
              📋 View Curriculum
            </Link>
            <Link
              href="/learn"
              className="px-6 py-3 bg-white text-primary-700 rounded-xl font-medium hover:bg-white/90 transition-all"
            >
              🎮 Try ISL Quest
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Aligned with RPwD Act 2016 • Accessible India Campaign • ISLRTC Standards
          </p>
        </div>
      </div>
    </div>
  );
}
