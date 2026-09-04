"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { LocaleToggle } from "@/components/ui/LocaleToggle";

const demoUsers = [
  { username: "ramesh", name: "Ramesh Patel", role: "Clerk", department: "Water Services", avatar: "👨‍💼", color: "gold" },
  { username: "sita", name: "Sita Sharma", role: "Clerk", department: "Citizen Certificates", avatar: "👩‍💼", color: "teal" },
  { username: "amit", name: "Amit Shah", role: "Clerk", department: "Property Services", avatar: "👨‍💻", color: "blue" },
  { username: "neha", name: "Neha Joshi", role: "Clerk", department: "Water Services", avatar: "👩‍🔬", color: "green" },
  { username: "admin", name: "Super Admin", role: "Super Admin", department: "All Departments", avatar: "👩‍💻", color: "red" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        const result = await register({ username, password, name, department: "General Services" });
        if (result.success) {
          setSuccess("Account created! Redirecting...");
          setTimeout(() => router.push("/dashboard"), 800);
        } else {
          setError(result.error || "Registration failed");
        }
      } else {
        const result = await login(username, password);
        if (result.success) {
          router.push("/dashboard");
        } else {
          setError(result.error || "Login failed");
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (demoUsername: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    const result = await login(demoUsername, "demo123");
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError("Demo login failed. Please try again.");
    }
    setLoading(false);
  };

  const fillDemo = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword("demo123");
    setIsRegister(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Problem Statement */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,169,97,0.08),transparent_70%)]" />
        <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px]" />

        <div className="relative max-w-md text-center">
          <div className="text-7xl mb-8">🤟</div>
          <h2 className="text-4xl font-black text-white mb-2">Sanket 2.0</h2>
          <p className="text-gold-400 text-2xl font-bold mb-6">संकेत</p>

          <div className="glass-card p-6 mb-8 text-left">
            <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold mb-3">The Problem at the Counter</p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Deaf and hard-of-hearing citizens can face a communication barrier at public-service counters when staff are not prepared to communicate in Indian Sign Language. Sanket is designed to support that interaction at the point of service.
            </p>
            <p className="text-white/40 text-sm leading-relaxed">
              Sanket combines counter assistance, clerk learning, confidence-aware recognition, human escalation, and institutional readiness metrics in one prototype.
            </p>
          </div>

          <div className="glass-card p-6 mb-8 text-left">
            <p className="text-xs text-teal-400 uppercase tracking-wider font-semibold mb-3">Sanket&apos;s Solution</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🤝</span>
                <p className="text-white/60 text-sm">Real-time ISL recognition and response chips at the counter</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📚</span>
                <p className="text-white/60 text-sm">3-minute daily micro-learning to build ISL confidence</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📊</span>
                <p className="text-white/60 text-sm">Measurable accessibility scores for every counter</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["MOMENT", "HABIT", "SCORE"].map((pill) => (
              <div key={pill} className="py-2 text-center rounded-lg bg-white/5 border border-white/5">
                <p className="text-[10px] font-black text-gold-400 tracking-widest">{pill}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 overflow-y-auto relative">
        <div className="absolute top-6 right-6 z-10">
          <LocaleToggle />
        </div>
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            ← Back to Home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 lg:hidden">
              <span className="text-3xl">🤟</span>
              <span className="text-xl font-bold text-white">Sanket <span className="text-gold-400">2.0</span></span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isRegister ? "Create Account" : "Government Clerk Login"}
            </h1>
            <p className="text-white/40 text-sm">
              Every citizen deserves to be understood.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm text-white/50 mb-1.5 font-medium">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm text-white/50 mb-1.5 font-medium">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-white/50 mb-1.5 font-medium">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm" role="status">
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(""); setSuccess(""); }}
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              {isRegister ? "Already have an account? Sign In" : "Don't have an account? Create one"}
            </button>
          </div>

          {/* Demo Access */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-white/25 text-center mb-4 uppercase tracking-wider font-semibold">Quick Demo Access</p>
            <p className="text-[10px] text-white/20 text-center mb-3">Click to fill credentials, then sign in</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {demoUsers.map((demo) => (
                <button
                  key={demo.username}
                  onClick={() => fillDemo(demo.username)}
                  disabled={loading}
                  className="glass-card text-center py-4 px-2 hover:border-gold-400/30 transition-all duration-200 disabled:opacity-50 group"
                >
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{demo.avatar}</span>
                  <p className="text-white text-xs font-semibold mb-0.5">{demo.name}</p>
                  <p className={`text-[10px] font-medium badge-${demo.color}`}>{demo.role}</p>
                  <p className="text-white/25 text-[10px] mt-1 truncate">{demo.department}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
