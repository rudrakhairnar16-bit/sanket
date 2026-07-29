const STORAGE_KEY = "isl-quest-data";

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastPracticeDate: string;
  completedSigns: string[];
  badges: string[];
  totalCorrect: number;
  totalAttempted: number;
  darkMode: boolean;
  soundEnabled: boolean;
}

export const BADGES = [
  { id: "first-sign", name: "First Sign", icon: "🌟", requirement: "Complete your first sign" },
  { id: "streak-3", name: "3-Day Streak", icon: "🔥", requirement: "Practice 3 days in a row" },
  { id: "streak-7", name: "Week Warrior", icon: "📅", requirement: "Practice 7 days in a row" },
  { id: "streak-30", name: "Monthly Master", icon: "💪", requirement: "Practice 30 days in a row" },
  { id: "level-5", name: "Eager Learner", icon: "📚", requirement: "Reach level 5" },
  { id: "level-10", name: "Sign Scholar", icon: "🎓", requirement: "Reach level 10" },
  { id: "level-20", name: "ISL Expert", icon: "🏆", requirement: "Reach level 20" },
  { id: "all-signs", name: "Sign Collector", icon: "🃏", requirement: "Complete all signs" },
  { id: "perfect-quiz", name: "Perfect Score", icon: "💯", requirement: "Get 100% on a quiz" },
  { id: "webcam-pro", name: "Webcam Pro", icon: "📸", requirement: "Practice with webcam 5 times" },
];

export function getXPForLevel(level: number): number {
  return level * 100 + level * (level - 1) * 25;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (getXPForLevel(level) <= xp) level++;
  return level;
}

export function getLevelProgress(xp: number): { current: number; next: number; progress: number } {
  const level = getLevelFromXP(xp);
  const currentXP = getXPForLevel(level - 1);
  const nextXP = getXPForLevel(level);
  return {
    current: xp - currentXP,
    next: nextXP - currentXP,
    progress: ((xp - currentXP) / (nextXP - currentXP)) * 100,
  };
}

export function getDefaultState(): GameState {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastPracticeDate: "",
    completedSigns: [],
    badges: [],
    totalCorrect: 0,
    totalAttempted: 0,
    darkMode: false,
    soundEnabled: true,
  };
}

export function loadGame(): GameState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultState();
    return JSON.parse(saved) as GameState;
  } catch {
    return getDefaultState();
  }
}

export function saveGame(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addXP(state: GameState, amount: number): GameState {
  const newXP = state.xp + amount;
  const oldLevel = state.level;
  const newLevel = getLevelFromXP(newXP);
  const newBadges = [...state.badges];

  if (newLevel > oldLevel) {
    import("./notify").then((m) =>
      m.notify(`Level ${newLevel} reached!`, { body: `You advanced from Level ${oldLevel} to Level ${newLevel}. Keep learning!` })
    );
  }

  if (newLevel >= 5 && !newBadges.includes("level-5")) newBadges.push("level-5");
  if (newLevel >= 10 && !newBadges.includes("level-10")) newBadges.push("level-10");
  if (newLevel >= 20 && !newBadges.includes("level-20")) newBadges.push("level-20");

  return { ...state, xp: newXP, level: newLevel, badges: newBadges };
}

export function updateStreak(state: GameState): GameState {
  const today = new Date().toISOString().split("T")[0];
  if (state.lastPracticeDate === today) {
    const streakXP = state.streak >= 2 ? Math.min(state.streak * 2, 50) : 0;
    if (streakXP <= 0) return state;
    const result = addXP(state, streakXP);
    return { ...result, streak: state.streak, lastPracticeDate: state.lastPracticeDate };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = state.lastPracticeDate === yesterday ? state.streak + 1 : 1;
  let newBadges = [...state.badges];

  const bonus = getStreakBonus(newStreak);
  let xpGain = newStreak * 2;
  if (bonus > 0) xpGain += bonus;

  if (newStreak > state.streak && newStreak >= 2) {
    import("./notify").then((m) =>
      m.notify(`${newStreak}-day streak!`, { body: bonus > 0 ? `Bonus +${bonus} XP earned!` : `Come back tomorrow to keep your streak alive!` })
    );
  }

  if (newStreak >= 3 && !newBadges.includes("streak-3")) newBadges.push("streak-3");
  if (newStreak >= 7 && !newBadges.includes("streak-7")) newBadges.push("streak-7");
  if (newStreak >= 30 && !newBadges.includes("streak-30")) newBadges.push("streak-30");

  let stateWithXp: GameState = { ...state, streak: newStreak, lastPracticeDate: today, badges: newBadges };
  stateWithXp = addXP(stateWithXp, xpGain);
  return stateWithXp;
}

export function completeSign(state: GameState, signId: string): GameState {
  const alreadyDone = state.completedSigns.includes(signId);
  const newCompleted = alreadyDone ? state.completedSigns : [...state.completedSigns, signId];
  const newBadges = [...state.badges];

  if (!alreadyDone) {
    const oldLen = state.completedSigns.length;
    if (oldLen === 0) {
      import("./notify").then((m) =>
        m.notify("First sign completed!", { body: "You learned your first ISL sign. Keep going!" })
      );
    }
    if (newCompleted.length >= ALL_SIGNS_COUNT) {
      import("./notify").then((m) =>
        m.notify("All signs collected!", { body: "You completed every sign. Amazing dedication!" })
      );
    }
  }

  if (newCompleted.length >= 1 && !newBadges.includes("first-sign")) newBadges.push("first-sign");
  if (newCompleted.length >= ALL_SIGNS_COUNT && !newBadges.includes("all-signs")) newBadges.push("all-signs");

  return { ...state, completedSigns: newCompleted, badges: newBadges };
}

export function recordAnswer(state: GameState, correct: boolean): GameState {
  return {
    ...state,
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
    totalAttempted: state.totalAttempted + 1,
  };
}

export function checkPerfectQuiz(state: GameState): GameState {
  const newBadges = [...state.badges];
  if (!newBadges.includes("perfect-quiz")) newBadges.push("perfect-quiz");
  return { ...state, badges: newBadges };
}

export function checkWebcamMilestone(state: GameState, count: number): GameState {
  const newBadges = [...state.badges];
  if (count >= 5 && !newBadges.includes("webcam-pro")) newBadges.push("webcam-pro");
  return { ...state, badges: newBadges };
}

const ALL_SIGNS_COUNT = 35;

export function getAccuracy(state: GameState): number {
  if (state.totalAttempted === 0) return 0;
  return Math.round((state.totalCorrect / state.totalAttempted) * 100);
}

const STREAK_MILESTONES = [
  { streak: 3, bonus: 30, badge: "streak-3" },
  { streak: 7, bonus: 70, badge: "streak-7" },
  { streak: 14, bonus: 150, badge: null },
  { streak: 21, bonus: 250, badge: null },
  { streak: 30, bonus: 500, badge: "streak-30" },
  { streak: 60, bonus: 1000, badge: null },
  { streak: 100, bonus: 2000, badge: null },
];

export function getStreakBonus(streak: number): number {
  for (let i = STREAK_MILESTONES.length - 1; i >= 0; i--) {
    if (streak >= STREAK_MILESTONES[i].streak) return STREAK_MILESTONES[i].bonus;
  }
  return 0;
}

export function getNextStreakMilestone(streak: number): { next: number; bonus: number } | null {
  for (const m of STREAK_MILESTONES) {
    if (streak < m.streak) return { next: m.streak, bonus: m.bonus };
  }
  return null;
}
