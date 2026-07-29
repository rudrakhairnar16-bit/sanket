"use client";

import { useState, useCallback } from "react";
import LiveInterpreter from "@/components/LiveInterpreter";
import { useInterpreterSocket } from "@/lib/use-interpreter-socket";
import { useAuth } from "@/lib/auth-context";

type View = "home" | "live" | "rating";

interface ClerkInfo {
  id: string;
  name: string;
  department: string;
  averageRating: number;
  completedSessions: number;
}

export default function InterpreterHub() {
  const { user } = useAuth();
  const [view, setView] = useState<View>("home");
  const [role, setRole] = useState<"deaf" | "clerk">("deaf");
  const [language, setLanguage] = useState("en");
  const [preferredLevel, setPreferredLevel] = useState<string>("intermediate");
  const [matchedClerk, setMatchedClerk] = useState<ClerkInfo | null>(null);
  const [sessionRating, setSessionRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const {
    connected,
    session,
    waiting,
    activeSessions,
    findInterpreter,
    markAvailable,
    endSession,
    rateSession,
  } = useInterpreterSocket(user?.username || "guest");

  const handleFindInterpreter = useCallback(async () => {
    try {
      const res = await fetch("/api/interpreter/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, preferredLevel }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.match) setMatchedClerk(data.match);
      }
    } catch {}
    findInterpreter(language);
    setView("live");
  }, [findInterpreter, language, preferredLevel]);

  const handleMarkAvailable = useCallback(() => {
    markAvailable([language]);
    setView("live");
  }, [markAvailable, language]);

  const handleEndSession = useCallback(() => {
    if (session?.sessionId) endSession(session.sessionId);
    setView("rating");
  }, [session, endSession]);

  const handleSubmitRating = useCallback(async () => {
    if (!sessionRating || !matchedClerk) return;
    try {
      await fetch("/api/interpreter/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session?.sessionId || "demo",
          clerkId: matchedClerk.id,
          clerkName: matchedClerk.name,
          clerkDepartment: matchedClerk.department,
          rating: sessionRating,
          comment: "",
        }),
      });
    } catch {}
    rateSession(session?.sessionId || "demo", sessionRating);
    setRatingSubmitted(true);
  }, [sessionRating, matchedClerk, session, rateSession]);

  if (view === "live") {
    return (
      <div className="relative">
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-[10px] text-gray-400">
            {connected ? "Socket connected" : "Demo mode"}
          </span>
          {session?.status === "active" && (
            <button
              onClick={handleEndSession}
              className="px-2 py-0.5 bg-red-600/80 hover:bg-red-600 text-white text-[10px] rounded-lg transition-all"
            >
              End Session
            </button>
          )}
          <button
            onClick={() => setView("home")}
            className="px-2 py-0.5 bg-gray-800/80 hover:bg-gray-800 text-gray-300 text-[10px] rounded-lg transition-all"
          >
            ← Back
          </button>
        </div>
        <LiveInterpreter />
      </div>
    );
  }

  if (view === "rating") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-gray-900 rounded-3xl p-8 text-center border border-gray-800">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h2 className="text-lg font-bold mb-1">Session Complete</h2>
          <p className="text-sm text-gray-400 mb-6">How was your interpreter experience?</p>

          {matchedClerk && (
            <div className="bg-gray-800 rounded-xl p-3 mb-5 text-left">
              <p className="text-xs text-gray-400 mb-1">Interpreter</p>
              <p className="font-medium text-sm">{matchedClerk.name}</p>
              <p className="text-[10px] text-gray-500">{matchedClerk.department}</p>
            </div>
          )}

          {!ratingSubmitted ? (
            <>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSessionRating(star)}
                    className={`p-2 rounded-xl transition-all ${
                      star <= sessionRating ? "text-accent-400 scale-110" : "text-gray-600"
                    }`}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= sessionRating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmitRating}
                disabled={!sessionRating}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:bg-gray-800 disabled:text-gray-600 font-medium text-sm transition-all"
              >
                Submit Rating
              </button>
            </>
          ) : (
            <div className="text-center animate-scale-in">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-emerald-400 font-medium text-sm">Thank you for your feedback!</p>
              <button
                onClick={() => { setView("home"); setRatingSubmitted(false); setSessionRating(0); }}
                className="mt-4 text-xs text-gray-400 hover:text-white transition-all"
              >
                Back to interpreter
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-500/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Live ISL Interpreter</h1>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Connect deaf citizens with trained government clerks for real-time sign language interpretation.
          </p>
        </div>

        <div className="space-y-3">
          {/* Role selection */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5">
            <label className="text-xs text-gray-400 font-medium block mb-3 uppercase tracking-wider">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRole("deaf")}
                className={`p-4 rounded-xl border text-center transition-all ${
                  role === "deaf" ? "bg-primary-600/20 border-primary-500/50 text-primary-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="text-2xl mb-1">🧏</div>
                <p className="text-xs font-medium">Deaf Citizen</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Need an interpreter</p>
              </button>
              <button
                onClick={() => setRole("clerk")}
                className={`p-4 rounded-xl border text-center transition-all ${
                  role === "clerk" ? "bg-primary-600/20 border-primary-500/50 text-primary-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="text-2xl mb-1">👨‍💼</div>
                <p className="text-xs font-medium">Government Clerk</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Provide interpretation</p>
              </button>
            </div>
          </div>

          {/* Language + level preferences */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5">
            <div className="mb-4">
              <label className="text-xs text-gray-400 font-medium block mb-2 uppercase tracking-wider">Language</label>
              <div className="flex gap-2">
                {[
                  { code: "en", label: "English" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "mr", label: "मराठी" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                      language === l.code ? "bg-primary-600/20 border-primary-500/50 text-primary-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {role === "deaf" && (
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-2 uppercase tracking-wider">Preferred Interpreter Level</label>
                <div className="flex gap-2">
                  {[
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "advanced", label: "Advanced" },
                  ].map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setPreferredLevel(l.value)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        preferredLevel === l.value ? "bg-primary-600/20 border-primary-500/50 text-primary-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status info */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900/30 rounded-xl border border-gray-800/50">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="text-[10px] text-gray-500">{connected ? "Connected" : "Offline (Demo)"}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span>{waiting} waiting</span>
              <span>{activeSessions} active</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={role === "deaf" ? handleFindInterpreter : handleMarkAvailable}
            className="w-full py-4 rounded-2xl bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white font-semibold text-base transition-all shadow-lg shadow-primary-600/20"
          >
            {role === "deaf" ? "Find an Interpreter" : "Mark Yourself Available"}
          </button>

          {role === "deaf" && matchedClerk && (
            <div className="bg-gray-900/70 border border-primary-500/20 rounded-2xl p-5 animate-fade-in">
              <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">Best Match</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-lg">
                  {matchedClerk.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{matchedClerk.name}</p>
                  <p className="text-[10px] text-gray-500">{matchedClerk.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {matchedClerk.averageRating}
                </span>
                <span>{matchedClerk.completedSessions} sessions</span>
              </div>
            </div>
          )}

          {!connected && (
            <p className="text-[10px] text-amber-400 text-center">
              Socket server not running — the interpreter will work in Demo mode.
              Run <code className="bg-gray-800 px-1 py-0.5 rounded">npm run socket</code> for real-time matching.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
