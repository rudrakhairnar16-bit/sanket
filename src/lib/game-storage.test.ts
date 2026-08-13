import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  getDefaultState,
  addXP,
  updateStreak,
  completeSign,
  getLevelProgress,
  getStreakBonus,
  getAccuracy,
  BADGES,
  checkWebcamMilestone,
  type GameState,
} from "./game-storage";

function makeState(overrides: Partial<GameState> = {}): GameState {
  return { ...getDefaultState(), ...overrides };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getDefaultState", () => {
  it("returns correct initial state", () => {
    const state = getDefaultState();
    expect(state.xp).toBe(0);
    expect(state.level).toBe(1);
    expect(state.streak).toBe(0);
    expect(state.lastPracticeDate).toBe("");
    expect(state.completedSigns).toEqual([]);
    expect(state.badges).toEqual([]);
    expect(state.totalCorrect).toBe(0);
    expect(state.totalAttempted).toBe(0);
    expect(state.darkMode).toBe(false);
    expect(state.soundEnabled).toBe(true);
  });
});

describe("addXP", () => {
  it("increases XP and updates level when threshold crossed", () => {
    const state = makeState({ xp: 0, level: 1 });
    const result = addXP(state, 150);
    expect(result.xp).toBe(150);
    expect(result.level).toBeGreaterThanOrEqual(2);
  });

  it("grants level-5 badge at level 5", () => {
    const state = makeState({ xp: 0, level: 1, badges: [] });
    const result = addXP(state, 5000);
    expect(result.level).toBeGreaterThanOrEqual(5);
    expect(result.badges).toContain("level-5");
  });

  it("grants level-10 badge at level 10", () => {
    const state = makeState({ xp: 0, level: 1, badges: [] });
    const result = addXP(state, 30000);
    expect(result.level).toBeGreaterThanOrEqual(10);
    expect(result.badges).toContain("level-10");
  });

  it("does not duplicate badges", () => {
    const state = makeState({ xp: 4900, level: 9, badges: ["level-5"] });
    const result = addXP(state, 100);
    expect(result.badges.filter((b) => b === "level-5").length).toBe(1);
  });
});

describe("updateStreak", () => {
  it("starts a streak of 1 on first practice", () => {
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const state = makeState({ lastPracticeDate: "" });
    const result = updateStreak(state);
    expect(result.streak).toBe(1);
    expect(result.lastPracticeDate).toBe("2026-01-15");
  });

  it("increments streak for consecutive days", () => {
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const state = makeState({ streak: 5, lastPracticeDate: "2026-01-14" });
    const result = updateStreak(state);
    expect(result.streak).toBe(6);
  });

  it("resets streak to 1 when a day is missed", () => {
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const state = makeState({ streak: 10, lastPracticeDate: "2026-01-10" });
    const result = updateStreak(state);
    expect(result.streak).toBe(1);
  });

  it("is idempotent for the same day", () => {
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const state = makeState({ streak: 3, lastPracticeDate: "2026-01-15" });
    const result = updateStreak(state);
    expect(result.streak).toBe(3);
    expect(result.lastPracticeDate).toBe("2026-01-15");
  });

  it("grants streak-3 badge at 3 days", () => {
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const state = makeState({ streak: 2, lastPracticeDate: "2026-01-14", badges: [] });
    const result = updateStreak(state);
    expect(result.streak).toBe(3);
    expect(result.badges).toContain("streak-3");
  });

  it("does not grant streak badge again if already owned", () => {
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const state = makeState({ streak: 2, lastPracticeDate: "2026-01-14", badges: ["streak-3"] });
    const result = updateStreak(state);
    expect(result.badges.filter((b) => b === "streak-3").length).toBe(1);
  });
});

describe("completeSign", () => {
  it("adds sign to completedSigns and calls updateStreak", () => {
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const state = makeState({ completedSigns: [], lastPracticeDate: "" });
    const result = completeSign(state, "namaste");
    expect(result.completedSigns).toContain("namaste");
    expect(result.lastPracticeDate).toBe("2026-01-15");
    expect(result.streak).toBe(1);
  });

  it("does not duplicate a completed sign", () => {
    const state = makeState({ completedSigns: ["namaste"] });
    const result = completeSign(state, "namaste");
    expect(result.completedSigns.filter((s) => s === "namaste").length).toBe(1);
  });

  it("grants first-sign badge on first completion", () => {
    const state = makeState({ completedSigns: [], badges: [] });
    const result = completeSign(state, "thank-you");
    expect(result.badges).toContain("first-sign");
  });
});

describe("getLevelProgress", () => {
  it("returns correct progress at XP=0", () => {
    const progress = getLevelProgress(0);
    expect(progress.current).toBe(0);
    expect(progress.next).toBeGreaterThan(0);
    expect(progress.progress).toBe(0);
  });

  it("returns progress between 0 and 100 for mid-level", () => {
    const progress = getLevelProgress(150);
    expect(progress.progress).toBeGreaterThan(0);
    expect(progress.progress).toBeLessThan(100);
  });
});

describe("getStreakBonus", () => {
  it("returns 0 for streak below first milestone", () => {
    expect(getStreakBonus(0)).toBe(0);
    expect(getStreakBonus(2)).toBe(0);
  });

  it("returns 30 for 3-day streak", () => {
    expect(getStreakBonus(3)).toBe(30);
  });

  it("returns 70 for 7-day streak", () => {
    expect(getStreakBonus(7)).toBe(70);
  });

  it("returns 500 for 30-day streak", () => {
    expect(getStreakBonus(30)).toBe(500);
  });

  it("returns 2000 for 100-day streak", () => {
    expect(getStreakBonus(100)).toBe(2000);
  });
});

describe("getAccuracy", () => {
  it("returns 0 when no attempts", () => {
    const state = makeState({ totalCorrect: 0, totalAttempted: 0 });
    expect(getAccuracy(state)).toBe(0);
  });

  it("returns correct percentage", () => {
    const state = makeState({ totalCorrect: 7, totalAttempted: 10 });
    expect(getAccuracy(state)).toBe(70);
  });

  it("returns 100 for perfect score", () => {
    const state = makeState({ totalCorrect: 5, totalAttempted: 5 });
    expect(getAccuracy(state)).toBe(100);
  });
});

describe("BADGES", () => {
  it("contains expected badges", () => {
    const ids = BADGES.map((b) => b.id);
    expect(ids).toContain("first-sign");
    expect(ids).toContain("streak-3");
    expect(ids).toContain("streak-7");
    expect(ids).toContain("streak-30");
    expect(ids).toContain("level-5");
    expect(ids).toContain("level-10");
    expect(ids).toContain("level-20");
    expect(ids).toContain("all-signs");
    expect(ids).toContain("perfect-quiz");
    expect(ids).toContain("webcam-pro");
    expect(BADGES.length).toBe(10);
  });
});

describe("checkWebcamMilestone", () => {
  it("does not award badge below count 5", () => {
    const state = makeState({ badges: [] });
    const result = checkWebcamMilestone(state, 4);
    expect(result.badges).not.toContain("webcam-pro");
  });

  it("awards webcam-pro badge at count 5", () => {
    const state = makeState({ badges: [] });
    const result = checkWebcamMilestone(state, 5);
    expect(result.badges).toContain("webcam-pro");
  });

  it("does not duplicate the badge", () => {
    const state = makeState({ badges: ["webcam-pro"] });
    const result = checkWebcamMilestone(state, 10);
    expect(result.badges.filter((b) => b === "webcam-pro").length).toBe(1);
  });
});
