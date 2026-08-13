export interface Task {
  id: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
}

export const ONBOARDING_TASKS: Task[] = [
  {
    id: "profile",
    title: "Complete your profile",
    description: "Add your full name and select your department.",
    icon: "👤",
    link: "/dashboard",
  },
  {
    id: "intro",
    title: "Watch the ISL intro video",
    description: "Learn the basics of Indian Sign Language in 3 minutes.",
    icon: "📹",
    link: "/dashboard",
  },
  {
    id: "first-lesson",
    title: "Complete your first lesson",
    description: "Finish today's daily lesson quiz to start your streak.",
    icon: "✅",
    link: "/dashboard",
  },
  {
    id: "practice",
    title: "Try camera sign practice",
    description: "Show one sign to your webcam and get real-time feedback.",
    icon: "📸",
    link: "/dashboard",
  },
  {
    id: "quest",
    title: "Play ISL Quest",
    description: "Earn your first 50 XP in the gamified learning mode.",
    icon: "🎮",
    link: "/learn",
  },
];

export const ONGOING_TASKS: Task[] = [
  {
    id: "daily-lesson",
    title: "Complete today's lesson",
    description: "Keep your streak alive — finish the daily quiz.",
    icon: "📚",
    link: "/dashboard",
  },
  {
    id: "quest-xp",
    title: "Earn 100 XP this week",
    description: "Progress through ISL Quest levels and badges.",
    icon: "🎮",
    link: "/learn",
  },
  {
    id: "interpreter",
    title: "Try the Live Interpreter",
    description: "Experience real-time sign-to-text communication.",
    icon: "🤟",
    link: "/interpreter",
  },
  {
    id: "champion",
    title: "Aim for ISL Champion",
    description: "Complete more signs to earn the 👑 Champion badge.",
    icon: "👑",
    link: "/dashboard/leaderboard",
  },
];

const TASKS_KEY = "sanket-tasks-progress";

interface TaskProgress {
  newUser: boolean;
  completed: Record<string, boolean>;
}

function load(): TaskProgress {
  if (typeof window === "undefined") {
    return { newUser: true, completed: {} };
  }
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw) as TaskProgress;
  } catch {
    // ignore
  }
  const isNew = hasLowActivity();
  return { newUser: isNew, completed: {} };
}

function save(data: TaskProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(data));
}

function hasLowActivity(): boolean {
  try {
    const raw = localStorage.getItem("isl-quest-data");
    if (raw) {
      const g = JSON.parse(raw);
      if (g.xp > 100 || g.completedSigns?.length > 0) return false;
    }
  } catch {
    // ignore
  }
  return true;
}

export function getTasks() {
  const data = load();
  const list = data.newUser ? ONBOARDING_TASKS : ONGOING_TASKS;
  const tasks = list.map((t) => ({ ...t, done: !!data.completed[t.id] }));
  const completedCount = tasks.filter((t) => t.done).length;
  const mandatory = data.newUser;
  return {
    isNewUser: data.newUser,
    mandatory,
    tasks,
    completedCount,
    total: tasks.length,
  };
}

export function completeTask(id: string) {
  const data = load();
  const list = data.newUser ? ONBOARDING_TASKS : ONGOING_TASKS;
  if (!list.find((t) => t.id === id)) return;
  data.completed[id] = true;
  save(data);
}

export function isOnboardingComplete(): boolean {
  const data = load();
  if (!data.newUser) return true;
  return ONBOARDING_TASKS.every((t) => data.completed[t.id]);
}

// Auto-complete tasks when a real user action is detected, so the task
// list reflects genuine progress rather than only manual "Mark done" clicks.
export const TASKS_UPDATED_EVENT = "sanket-tasks-updated";

export function autoCompleteTasks(events: {
  hasProfile?: boolean;
  lessonDone?: boolean;
  practiceDone?: boolean;
  interpreterUsed?: boolean;
  questXp?: number;
}) {
  const data = load();
  const list = data.newUser ? ONBOARDING_TASKS : ONGOING_TASKS;
  for (const t of list) {
    let done = false;
    switch (t.id) {
      case "profile":
        done = !!events.hasProfile;
        break;
      case "first-lesson":
        done = !!events.lessonDone;
        break;
      case "practice":
        done = !!events.practiceDone;
        break;
      case "interpreter":
        done = !!events.interpreterUsed;
        break;
      case "quest":
      case "quest-xp":
        done = (events.questXp ?? 0) >= 50;
        break;
      default:
        done = data.completed[t.id];
    }
    if (done) data.completed[t.id] = true;
  }
  save(data);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(TASKS_UPDATED_EVENT));
  }
}
