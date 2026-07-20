// In-memory store for per-user mock data used when MongoDB Atlas is
// unreachable (e.g. local dev where the network blocks Atlas connections).
// On Vercel the app uses real Atlas, so this is only a demo fallback.

interface MockGame {
  islXp: number;
  islLevel: number;
  islStreak: number;
  islBadges: string[];
  islSignsCompleted: string[];
}

interface MockStreak {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  lastCompletedDate: string | null;
}

const gameStore = new Map<string, MockGame>();
const streakStore = new Map<string, MockStreak>();

export function getMockGame(userId: string): MockGame | undefined {
  return gameStore.get(userId);
}

export function setMockGame(
  userId: string,
  data: MockGame
): void {
  gameStore.set(userId, data);
}

export function getMockStreak(userId: string): MockStreak | undefined {
  return streakStore.get(userId);
}

export function setMockStreak(
  userId: string,
  data: MockStreak
): void {
  streakStore.set(userId, data);
}
