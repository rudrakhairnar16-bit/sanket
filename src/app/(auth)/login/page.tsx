"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { DEPARTMENTS } from "@/lib/utils";
import { loadGame, getLevelProgress } from "@/lib/game-storage";
import { loadLang, t as translate } from "@/lib/hi";

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
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="glass rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
                <span className="text-3xl font-bold text-white">सं</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Sanket</h1>
              <p className="text-gray-500 mt-1">
                ISL for Sarkari Clerks
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    isLogin
                      ? "bg-white text-primary-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    !isLogin
                      ? "bg-white text-primary-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Register
                </button>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="Enter username"
                  required
                  aria-label="Username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
                    required
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl animate-slide-down">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Sanket v1.0 — Built for Yuva 6.0 Hackathon
            </p>
          </div>

          <div className="mt-4 text-center space-y-3">
            <Link
              href="/learn"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-amber-400/90 to-yellow-500/90 hover:from-amber-400 hover:to-yellow-500 text-gray-900 rounded-xl text-sm font-bold transition-all shadow-lg"
            >
              <span>🎮</span>
              Play ISL Quest — No Login Needed
            </Link>
            <p className="text-white/40 text-xs">
              Demo accounts:{" "}
              <span className="text-white/60">admin / admin123</span> or{" "}
              <span className="text-white/60">ramesh / admin123</span>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative flex-1 items-center justify-center bg-gradient-to-br from-primary-800 to-primary-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative text-center p-12 animate-fade-in max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur mb-6 border border-white/10">
            <span className="text-5xl">🎮</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            ISL Quest
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed mb-8">
            Your gamified Indian Sign Language learning journey — 
            flashcards, quizzes, webcam practice, and more.
          </p>

          {hasGameData && gameData && progress ? (
            <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-6 border border-white/10">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{gameData.level}</p>
                  <p className="text-xs text-primary-200">Level</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{gameData.xp}</p>
                  <p className="text-xs text-primary-200">XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{gameData.streak}</p>
                  <p className="text-xs text-primary-200">Streak</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <p className="text-xs text-primary-200 mt-2">
                {progress.current} / {progress.next} XP to next level
              </p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-6 border border-white/10">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "🃏", label: "Flashcards" },
                  { icon: "🧠", label: "Quizzes" },
                  { icon: "📸", label: "Webcam" },
                ].map((f) => (
                  <div key={f.label} className="text-center">
                    <span className="text-3xl block mb-1">{f.icon}</span>
                    <p className="text-xs text-primary-200">{f.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { icon: "🌙", label: "Dark Mode" },
                  { icon: "🔊", label: "Sound FX" },
                  { icon: "📖", label: "Dictionary" },
                  { icon: "🏆", label: "Leaderboard" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-sm">{f.icon}</span>
                    <span className="text-xs text-white/70">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/learn"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-500/30"
            >
              <span>🎮</span>
              Play ISL Quest
              <span className="text-sm opacity-60">(Free)</span>
            </Link>
            <Link
              href="/curriculum"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all backdrop-blur border border-white/10"
            >
              <span>📋</span>
              View 12-Week Curriculum
            </Link>
            <p className="text-xs text-primary-300/60">
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
