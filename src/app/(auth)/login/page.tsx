"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { DEPARTMENTS } from "@/lib/utils";
import { loadGame, getLevelProgress } from "@/lib/game-storage";

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none" className="shrink-0">
      <rect x="4" y="4" width="56" height="56" rx="16" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary-400"/>
      <path d="M20 28c4-6 12-6 16 0s4 10 0 14M28 28c-2-3-6-3-8 0s-2 5 0 7M36 28c2-3 6-3 8 0s2 5 0 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary-300"/>
      <path d="M24 42c2 4 6 6 10 6s8-2 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent-400"/>
    </svg>
  );
}

function GamepadIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12h4m-2-2v4m7-2h.01M17 10h.01M4 18h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>; }
function BookIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>; }
function RocketIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>; }
function TargetIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; }
function SunIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>; }
function VolumeIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>; }

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState<ReturnType<typeof loadGame> | null>(null);
  const { login, register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const saved = loadGame();
    setGameData(saved);
  }, []);

  const hasGameData = gameData && gameData.xp > 0;
  const progress = gameData ? getLevelProgress(gameData.xp) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password, name, department);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-surface-950">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-surface-950 to-primary-950" />
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />

      <div className="relative flex-1 flex items-center justify-center p-4 lg:p-8 z-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="glass p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand mb-4 shadow-glow-primary animate-glow-pulse">
                <span className="text-2xl font-bold text-white">सं</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Sanket</h1>
              <p className="text-surface-400 mt-1 text-sm">
                ISL for Government Clerks
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 lg:hidden">
                {[
                  { icon: "🃏", label: "Flashcards" },
                  { icon: "🧠", label: "Quizzes" },
                  { icon: "📸", label: "Webcam" },
                  { icon: "🌙", label: "Dark Mode" },
                ].map((f) => (
                  <span
                    key={f.label}
                    className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-surface-300"
                  >
                    <span>{f.icon}</span>
                    {f.label}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex gap-1 bg-white/5 p-1 rounded-btn mb-4 border border-white/5" role="tablist" aria-label="Authentication mode">
                <div
                  className={`absolute top-1 bottom-1 rounded-[9px] bg-primary-500 shadow-btn transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isLogin ? "left-1" : "left-[calc(50%+0px)]"
                  }`}
                  style={{ width: "calc(50% - 4px)" }}
                />
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`relative flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 z-10 ${
                    isLogin
                      ? "text-white"
                      : "text-surface-400 hover:text-surface-200"
                  }`}
                  role="tab"
                  aria-selected={isLogin}
                  aria-label="Sign in to existing account"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`relative flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 z-10 ${
                    !isLogin
                      ? "text-white"
                      : "text-surface-400 hover:text-surface-200"
                  }`}
                  role="tab"
                  aria-selected={!isLogin}
                  aria-label="Create new account"
                >
                  Register
                </button>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="Enter username"
                  required
                  aria-label="Username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter password"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="input-field appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiLz48L3N2Zz4=')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat"
                    required
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-btn animate-slide-down">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-xs text-surface-500 mt-6">
              Sanket v1.0 — Team KPGU · KPGU University · Inter-University Round
            </p>
          </div>

<div className="glass mt-4 p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shrink-0 shadow-glow-accent">
                <TargetIcon />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  The Problem
                </h3>
                <p className="text-xs leading-relaxed text-surface-400">
                  18 million hearing-impaired Indians are excluded from basic
                  services every day — because almost no public-facing staff
                  know Indian Sign Language. Sanket closes that gap.
                </p>
                <Link
                  href="/problem-statement"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-accent-400 hover:text-accent-300 hover:underline"
                >
                  Read the full problem statement
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7M21 12H3" /></svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Link
              href="/learn"
              className="btn-secondary w-full justify-center text-sm"
            >
              <GamepadIcon />
              Play ISL Quest — No Login Needed
            </Link>
            <p className="text-surface-600 text-xs text-center">
              Demo accounts: <span className="text-surface-400">admin / Admin123</span> or <span className="text-surface-400">ramesh / admin123</span>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative flex-1 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-primary-950" />
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />
        <div className="relative text-center p-12 animate-fade-in max-w-lg z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 backdrop-blur mb-5 border border-white/5">
            <GamepadIcon />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            ISL Quest
          </h2>
          <p className="text-surface-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            Your gamified Indian Sign Language learning journey — 
            flashcards, quizzes, webcam practice, and more.
          </p>

          {hasGameData && gameData && progress ? (
            <div className="bg-white/5 backdrop-blur rounded-card p-6 mb-6 border border-white/5 max-w-sm mx-auto">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{gameData.level}</p>
                  <p className="text-xs text-surface-400">Level</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{gameData.xp}</p>
                  <p className="text-xs text-surface-400">XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{gameData.streak}</p>
                  <p className="text-xs text-surface-400">Streak</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-400 to-accent-300 rounded-full transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <p className="text-xs text-surface-500 mt-2">
                {progress.current} / {progress.next} XP to next level
              </p>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur rounded-card p-6 mb-6 border border-white/5 max-w-sm mx-auto">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { icon: "🃏", label: "Flashcards" },
                  { icon: "🧠", label: "Quizzes" },
                  { icon: "📸", label: "Webcam" },
                ].map((f) => (
                  <div key={f.label} className="text-center">
                    <span className="text-2xl block mb-1">{f.icon}</span>
                    <p className="text-xs text-surface-400">{f.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: SunIcon, label: "Dark Mode" },
                  { icon: VolumeIcon, label: "Sound FX" },
                  { icon: BookIcon, label: "Dictionary" },
                  { icon: TargetIcon, label: "Leaderboard" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 bg-white/5 rounded-btn px-3 py-2">
                    <f.icon />
                    <span className="text-xs text-surface-400">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 max-w-sm mx-auto">
            <Link
              href="/learn"
              className="btn-accent w-full justify-center py-3.5 text-sm font-bold"
            >
              <GamepadIcon />
              Play ISL Quest
              <span className="text-xs opacity-60">(Free)</span>
            </Link>
            <Link
              href="/curriculum"
              className="btn-secondary w-full justify-center text-sm"
            >
              <BookIcon />
              View 12-Week Curriculum
            </Link>
            <p className="text-xs text-surface-600">
              {hasGameData
                ? "Continue your learning journey — no login needed"
                : "Start learning in seconds. No account required."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
