const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

function shouldLog(level: LogLevel): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("sanket-log-level");
    if (!stored) return level !== "debug";
    const idx = LOG_LEVELS.indexOf(level);
    const storedIdx = LOG_LEVELS.indexOf(stored as LogLevel);
    return idx >= storedIdx;
  } catch {
    return level !== "debug";
  }
}

function formatError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}\n${err.stack || ""}`;
  return String(err);
}

export const logger = {
  debug(...args: unknown[]) {
    if (!shouldLog("debug")) return;
    console.debug("[Sanket]", ...args);
  },

  info(...args: unknown[]) {
    if (!shouldLog("info")) return;
    console.info("[Sanket]", ...args);
  },

  warn(...args: unknown[]) {
    if (!shouldLog("warn")) return;
    console.warn("[Sanket]", ...args);
  },

  error(...args: unknown[]) {
    if (!shouldLog("error")) return;
    console.error("[Sanket]", ...args);
    // Persist errors to localStorage for debugging
    try {
      const errors = JSON.parse(
        localStorage.getItem("sanket-errors") || "[]"
      ) as string[];
      errors.push(
        JSON.stringify({
          time: new Date().toISOString(),
          msg: args.map((a) => (typeof a === "string" ? a : formatError(a))).join(" "),
        })
      );
      if (errors.length > 50) errors.splice(0, errors.length - 50);
      localStorage.setItem("sanket-errors", JSON.stringify(errors));
    } catch {}
  },

  /** Call once at app root to capture unhandled errors */
  init() {
    if (typeof window === "undefined") return;
    window.addEventListener("error", (e) => {
      this.error("Uncaught error:", e.error || e.message);
    });
    window.addEventListener("unhandledrejection", (e) => {
      this.error("Unhandled rejection:", e.reason);
    });
  },
};
