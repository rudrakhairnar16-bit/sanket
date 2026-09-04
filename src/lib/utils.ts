import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split("T")[0];
}

export function formatIST(date: Date): string {
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

export function calculateLevel(xp: number): number {
  if (xp >= 5000) return 20;
  if (xp >= 4500) return 19;
  if (xp >= 4000) return 18;
  if (xp >= 3500) return 17;
  if (xp >= 3000) return 16;
  if (xp >= 2500) return 15;
  if (xp >= 2000) return 14;
  if (xp >= 1600) return 13;
  if (xp >= 1200) return 12;
  if (xp >= 900) return 11;
  if (xp >= 700) return 10;
  if (xp >= 500) return 9;
  if (xp >= 350) return 8;
  if (xp >= 250) return 7;
  if (xp >= 170) return 6;
  if (xp >= 110) return 5;
  if (xp >= 70) return 4;
  if (xp >= 40) return 3;
  if (xp >= 15) return 2;
  return 1;
}

export function xpForLevel(level: number): number {
  const thresholds = [0, 15, 40, 70, 110, 170, 250, 350, 500, 700, 900, 1200, 1600, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
  return thresholds[level - 1] || 0;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
