const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;

export function checkRateLimit(key: string, maxAttempts = MAX_ATTEMPTS): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= maxAttempts) return false;

  entry.count++;
  return true;
}

export function getRateLimitRemaining(key: string): number {
  const entry = attempts.get(key);
  if (!entry) return MAX_ATTEMPTS;
  if (Date.now() > entry.resetAt) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - entry.count);
}
