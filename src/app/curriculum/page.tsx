import Link from "next/link";

const CURRICULUM = [
  { week: 1, theme: "Greetings & Courtesies", signs: ["Namaste", "Hello", "Good Morning", "How are you?", "Thank You"], goal: "Greet a citizen warmly using ISL" },
  { week: 2, theme: "Basic Introductions", signs: ["My name is...", "I work here", "Please wait", "Come in", "Sit down"], goal: "Introduce yourself and guide a visitor" },
  { week: 3, theme: "Numbers & Counting", signs: ["1-5", "6-10", "How many?", "Number", "Count"], goal: "Count and handle numeric inquiries" },
  { week: 4, theme: "Yes/No & Confirmations", signs: ["Yes", "No", "Correct", "Wrong", "Maybe", "Understand?"], goal: "Confirm information with yes/no responses" },
  { week: 5, theme: "Office & Services", signs: ["Office", "Document", "Form", "Signature", "Stamp", "Copy"], goal: "Guide citizens through common document procedures" },
  { week: 6, theme: "Emergency & Help", signs: ["Help", "Emergency", "Hospital", "Police", "Fire", "Ambulance"], goal: "Respond to emergency situations" },
  { week: 7, theme: "Time & Appointments", signs: ["Today", "Tomorrow", "Yesterday", "Morning", "Evening", "Appointment"], goal: "Schedule and confirm appointments" },
  { week: 8, theme: "Money & Payments", signs: ["Money", "Rupees", "Pay", "Receipt", "Change", "Amount", "Bill"], goal: "Handle payment-related conversations" },
  { week: 9, theme: "Directions & Locations", signs: ["Where?", "Here", "There", "Left", "Right", "Upstairs", "Downstairs"], goal: "Give directions within the office" },
  { week: 10, theme: "Rights & Information", signs: ["Right", "Information", "Help Desk", "Officer", "Waiting", "Queue"], goal: "Inform citizens of their rights and procedures" },
  { week: 11, theme: "Full Conversation Practice", signs: ["Full dialogue: greet → ask → confirm → close"], goal: "Conduct a complete service interaction in ISL" },
  { week: 12, theme: "Assessment & Certification", signs: ["Comprehensive quiz + live webcam practice"], goal: "Demonstrate 80%+ accuracy for certification" },
];

export default function CurriculumPage() {
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
            <span className="text-3xl font-bold text-white">ISL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            12-Week ISL Curriculum for Public Servants
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            A structured, week-by-week programme designed for government clerks.
            Learn one theme per week — 3 minutes a day.
          </p>
        </div>

        <div className="space-y-4">
          {CURRICULUM.map((week) => (
            <details
              key={week.week}
              className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
            >
              <summary className="flex items-center gap-4 p-5 sm:p-6 cursor-pointer list-none">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-lg font-bold text-white">W{week.week}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {week.theme}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {week.signs.length} signs • {week.goal}
                  </p>
                </div>
                <span className="text-2xl text-gray-300 dark:text-gray-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-gray-100 dark:border-gray-700">
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Signs you will learn:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {week.signs.map((sign) => (
                      <span
                        key={sign}
                        className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-medium"
                      >
                        {sign}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">🎯 Goal:</span>
                    <span className="text-gray-600 dark:text-gray-300">{week.goal}</span>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 text-center border border-primary-100 dark:border-gray-700">
          <span className="text-5xl block mb-4">🎓</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to start your journey?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">
            No login needed. Jump straight into Week 1 flashcards and begin learning ISL today.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary-500/25"
          >
            🎮 Start Learning Now
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Curriculum aligned with ISLRTC standards • Rights of Persons with Disabilities Act 2016
          </p>
        </div>
      </div>
    </div>
  );
}
