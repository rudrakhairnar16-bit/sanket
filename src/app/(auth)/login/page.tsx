"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DEPARTMENTS } from "@/lib/utils";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

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

          <div className="mt-4 text-center">
            <p className="text-white/60 text-sm">
              Demo accounts:{" "}
              <span className="text-white/80">admin / admin123</span> or{" "}
              <span className="text-white/80">ramesh / admin123</span>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative flex-1 items-center justify-center bg-gradient-to-br from-primary-800 to-primary-950">
        <div className="text-center p-12 animate-fade-in">
          <div className="text-8xl mb-6">🤝</div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Learn ISL. Serve Better.
          </h2>
          <p className="text-primary-200 text-lg max-w-md mx-auto leading-relaxed">
            Empowering government clerks with Indian Sign Language skills to
            make public services truly accessible for everyone.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {DEPARTMENTS.map((dept) => (
              <span
                key={dept}
                className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
