"use client";

interface FeedbackStats {
  total: number;
  positive: number;
  negative: number;
  satisfactionRate: number;
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "primary" | "blue" | "green" | "purple";
}) {
  const icons = {
    primary: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    blue: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    green: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    purple: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  };

  const colors = {
    primary: "border-primary-500/20",
    blue: "border-blue-500/20",
    green: "border-emerald-500/20",
    purple: "border-purple-500/20",
  };

  const iconColors = {
    primary: "text-primary-400",
    blue: "text-blue-400",
    green: "text-emerald-400",
    purple: "text-purple-400",
  };

  return (
    <div className={`surface-card border ${colors[color]} p-5`}>
      <div
        className={`w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-3 ${iconColors[color]}`}
      >
        {icons[color]}
      </div>
      <p className="text-2xl font-bold text-surface-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-surface-500">{label}</p>
    </div>
  );
}

export function FeedbackSection({
  feedback,
}: {
  feedback: FeedbackStats;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard label="Citizen Feedback" value={feedback.total} color="primary" />
      <StatCard label="Positive Responses" value={feedback.positive} color="green" />
      <StatCard
        label="Satisfaction Rate"
        value={`${feedback.satisfactionRate}%`}
        color="blue"
      />
    </div>
  );
}
