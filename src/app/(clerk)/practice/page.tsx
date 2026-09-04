"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import { StatCard } from "@/components/ui/StatCard";
import { municipalSigns } from "@/data/signs/municipal-signs";
import { getRecognitionEngine, destroyRecognitionEngine } from "@/lib/recognition";
import type { RecognitionEngine, RecognitionResult } from "@/lib/recognition/types";
import { getConfidenceState } from "@/lib/recognition/confidence";
import { createDefaultCard, updateCard } from "@/lib/learning/srs";
import { playCorrect, playIncorrect, playLevelUp } from "@/lib/sound";
import { useSahayakCamera } from "@/features/sahayak/hooks/useSahayakCamera";
import type { ConfidenceState } from "@/types";

interface Attempt {
  sign: string;
  correct: boolean;
  confidence: number;
  timestamp: number;
  expectedSign: string;
}

const CAM_STATE_LABELS: Record<string, string> = {
  idle: "Camera off",
  requesting: "Requesting camera access...",
  ready: "Camera ready",
  running: "Live — hand detection active",
  paused: "Camera paused",
  denied: "Camera access denied",
  unsupported: "Camera not supported",
  error: "Camera error",
};

export default function PracticePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"demo" | "camera">("demo");
  const [engineReady, setEngineReady] = useState(false);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<RecognitionResult | null>(null);
  const [confidenceState, setConfidenceState] = useState<ConfidenceState>("UNKNOWN");
  const [confidence, setConfidence] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const engineRef = useRef<RecognitionEngine | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastScoredAtRef = useRef(0);
  const lastScoredSignRef = useRef<string | null>(null);

  const camera = useSahayakCamera({ externalVideoRef: videoRef });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    getRecognitionEngine()
      .then((eng) => {
        engineRef.current = eng;
        setEngineReady(true);
      })
      .catch(() => setEngineReady(false));
    return () => {
      destroyRecognitionEngine();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      camera.stopCamera();
      if (recognitionTimerRef.current) {
        clearInterval(recognitionTimerRef.current);
      }
    };
  }, []);

  const captureAndRecognize = useCallback(async () => {
    if (!engineRef.current || !videoRef.current) return;
    if (camera.cameraState !== "running") return;

    try {
      const result = await engineRef.current.recognize(videoRef.current);
      setLastResult(result);
      const state = getConfidenceState(result.confidence);
      setConfidence(result.confidence);
      setConfidenceState(state === "HIGH" ? "HIGH" : state === "MEDIUM" ? "MEDIUM" : state === "LOW" ? "LOW" : "UNKNOWN");
      // Live camera results are scored only against the sign the clerk selected.
      // Never turn an arbitrary classifier prediction into a "correct" attempt.
      if (!selectedSign || !result.signId || result.state === "unknown" || result.state === "processing") return;

      const now = Date.now();
      if (now - lastScoredAtRef.current < 1400) return;
      if (result.signId === lastScoredSignRef.current && now - lastScoredAtRef.current < 2600) return;

      const correct = result.signId === selectedSign && (result.state === "high" || result.state === "medium");
      const attempt: Attempt = {
        sign: result.signId,
        correct,
        confidence: result.confidence,
        timestamp: now,
        expectedSign: selectedSign,
      };
      setAttempts((prev) => [...prev, attempt]);
      lastScoredAtRef.current = now;
      lastScoredSignRef.current = result.signId;
      if (correct) playCorrect();
      else playIncorrect();
    } catch {
      // recognition failed silently
    }
  }, [camera.cameraState, selectedSign]);

  useEffect(() => {
    if (camera.cameraState === "running" && mode === "camera" && sessionActive && engineReady) {
      recognitionTimerRef.current = setInterval(() => {
        void captureAndRecognize();
      }, 140);
    }
    return () => {
      if (recognitionTimerRef.current) {
        clearInterval(recognitionTimerRef.current);
        recognitionTimerRef.current = null;
      }
    };
  }, [camera.cameraState, mode, sessionActive, engineReady, captureAndRecognize]);

  const handleModeToggle = useCallback(
    async (newMode: "demo" | "camera") => {
      setMode(newMode);
      setLastResult(null);
      setConfidenceState("UNKNOWN");
      setConfidence(0);
      if (newMode === "camera") {
        await camera.requestCamera();
      } else {
        camera.stopCamera();
        if (recognitionTimerRef.current) {
          clearInterval(recognitionTimerRef.current);
          recognitionTimerRef.current = null;
        }
      }
    },
    [camera]
  );

  const startSession = useCallback(() => {
    setSessionActive(true);
    setAttempts([]);
    setShowSummary(false);
    setLastResult(null);
    setConfidenceState("UNKNOWN");
    setConfidence(0);
    if (mode === "camera" && camera.cameraState !== "running") {
      camera.requestCamera();
    }
  }, [mode, camera]);

  const endSession = useCallback(() => {
    setSessionActive(false);
    setShowSummary(true);
    if (mode === "camera") {
      camera.stopCamera();
    }
    if (recognitionTimerRef.current) {
      clearInterval(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }
    playLevelUp();
  }, [mode, camera]);

  const handleSignTap = useCallback(
    async (signId: string) => {
      if (!sessionActive || isProcessing || !engineRef.current) return;
      setIsProcessing(true);
      setConfidenceState("PROCESSING");
      setConfidence(0);
      setSelectedSign(signId);
      lastScoredAtRef.current = 0;
      lastScoredSignRef.current = null;

      try {
        let result: RecognitionResult;
        if (mode === "camera" && camera.cameraState === "running" && videoRef.current) {
          result = await engineRef.current.recognize(videoRef.current);
        } else {
          // Explicit demo mode: keep the existing predictable practice UX without
          // pretending that a 1x1 ImageData frame is a real camera observation.
          result = {
            signId,
            label: municipalSigns.find((s) => s.id === signId)?.name || signId,
            confidence: 0.92,
            state: "high",
            timestamp: new Date().toISOString(),
            modelVersion: "sanket-demo-practice-v2",
            handDetected: true,
          };
        }

        setLastResult(result);
        const state = getConfidenceState(result.confidence);
        const mappedState: ConfidenceState = state === "HIGH" ? "HIGH" : state === "MEDIUM" ? "MEDIUM" : state === "LOW" ? "LOW" : "UNKNOWN";
        setConfidence(result.confidence);
        setConfidenceState(mappedState);

        const attempt: Attempt = {
          sign: signId,
          correct: mappedState === "HIGH" || mappedState === "MEDIUM",
          confidence: result.confidence,
          timestamp: Date.now(),
          expectedSign: signId,
        };
        setAttempts((prev) => [...prev, attempt]);

        if (mappedState === "HIGH" || mappedState === "MEDIUM") {
          playCorrect();
        } else {
          playIncorrect();
        }
      } catch {
        setConfidenceState("UNKNOWN");
        playIncorrect();
      } finally {
        setIsProcessing(false);
      }
    },
    [sessionActive, isProcessing, mode, camera.cameraState]
  );

  const updateSRSCards = useCallback(() => {
    const signAttempts = attempts.reduce<Record<string, { correct: number; total: number }>>((acc, a) => {
      if (!acc[a.expectedSign]) acc[a.expectedSign] = { correct: 0, total: 0 };
      acc[a.expectedSign].total++;
      if (a.correct) acc[a.expectedSign].correct++;
      return acc;
    }, {});

    const cards = JSON.parse(localStorage.getItem("srs-cards") || "{}");

    Object.entries(signAttempts).forEach(([signId, stats]) => {
      const quality = Math.round((stats.correct / stats.total) * 5);
      const existing = cards[signId] || createDefaultCard(signId);
      cards[signId] = updateCard(existing, quality);
    });

    localStorage.setItem("srs-cards", JSON.stringify(cards));
  }, [attempts]);

  const handleEndSession = useCallback(() => {
    updateSRSCards();
    endSession();
  }, [updateSRSCards, endSession]);

  if (loading || !user) return null;

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.correct).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const signsPracticed = new Set(attempts.map((a) => a.expectedSign)).size;
  const recentAttempts = attempts.slice(-10);

  return (
    <AppShell>
      <div className="page-container">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-white/40 hover:text-white transition-colors text-lg">
              ←
            </button>
            <div className="w-10 h-10 rounded-xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-xl">
              ✋
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="gradient-text">Sign Practice</span>
              </h1>
              <p className="text-white/50 text-sm">Practice ISL signs with real recognition</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleModeToggle("demo")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === "demo" ? "bg-gold-400 text-navy-900" : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              Demo Mode
            </button>
            <button
              onClick={() => handleModeToggle("camera")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === "camera" ? "bg-gold-400 text-navy-900" : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              Camera Mode
            </button>
          </div>
        </div>

        {showSummary && (
          <Card className="mb-6 border-gold-400/30 bg-gradient-to-br from-gold-400/10 to-transparent animate-fade-in">
            <p className="text-xs text-gold-400 uppercase tracking-wider mb-3">Practice Session Summary</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-400">{totalAttempts}</p>
                <p className="text-[10px] text-white/40">Total Attempts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-400">{correctAttempts}</p>
                <p className="text-[10px] text-white/40">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-400">{accuracy}%</p>
                <p className="text-[10px] text-white/40">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-400">{signsPracticed}</p>
                <p className="text-[10px] text-white/40">Signs Practiced</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/40 mb-3">SRS cards have been updated</p>
              <Button
                size="sm"
                onClick={() => {
                  setShowSummary(false);
                  setAttempts([]);
                }}
              >
                Start New Session
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Attempts" value={totalAttempts} icon="🎯" />
          <StatCard label="Correct" value={correctAttempts} icon="✓" />
          <StatCard label="Accuracy" value={`${accuracy}%`} icon="📊" />
          <StatCard label="Signs Practiced" value={signsPracticed} icon="✋" />
        </div>

        {mode === "camera" && (
          <Card className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    camera.cameraState === "running"
                      ? "bg-green-400 animate-pulse"
                      : camera.cameraState === "ready"
                        ? "bg-blue-400"
                        : camera.cameraState === "requesting"
                          ? "bg-yellow-400 animate-pulse"
                          : camera.cameraState === "denied" || camera.cameraState === "unsupported" || camera.cameraState === "error"
                            ? "bg-red-400"
                            : "bg-white/20"
                  }`}
                />
                <span className="text-xs text-white/60 font-medium">{CAM_STATE_LABELS[camera.cameraState]}</span>
              </div>
              <div className="flex items-center gap-2">
                {camera.cameraState === "idle" && (
                  <Button variant="primary" size="sm" onClick={camera.requestCamera}>
                    Start Camera
                  </Button>
                )}
                {camera.cameraState === "ready" && (
                  <Button variant="primary" size="sm" onClick={camera.startCamera}>
                    Go Live
                  </Button>
                )}
                {camera.cameraState === "running" && (
                  <>
                    <Button variant="ghost" size="sm" onClick={camera.pauseCamera}>
                      Pause
                    </Button>
                    <Button variant="ghost" size="sm" onClick={camera.stopCamera}>
                      Stop
                    </Button>
                  </>
                )}
                {camera.cameraState === "paused" && (
                  <Button variant="primary" size="sm" onClick={camera.resumeCamera}>
                    Resume
                  </Button>
                )}
              </div>
            </div>
            {camera.cameraState === "denied" && (
              <p className="text-[10px] text-red-400/80 mb-1">Camera access was denied. Switch to demo mode.</p>
            )}
            {camera.cameraState === "unsupported" && (
              <p className="text-[10px] text-red-400/80 mb-1">Camera is not supported on this device. Switch to demo mode.</p>
            )}
            <p className="text-[10px] text-white/30">Camera processing happens on this device. Raw footage is not stored.</p>
            <div
              className={`relative mt-2 rounded-lg overflow-hidden bg-navy-950 ${camera.cameraState === "idle" || camera.cameraState === "denied" || camera.cameraState === "unsupported" || camera.cameraState === "error" ? "h-0" : "aspect-square w-full max-w-[320px] mx-auto"}`}
            >
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full rounded-lg object-cover" style={{ transform: "scaleX(-1)" }} />
              {camera.cameraState === "running" && (
                <>
                  <div className="absolute inset-5 rounded-2xl border border-white/30 pointer-events-none" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
                    {lastResult?.handDetected ? "Hand detected · hold steady" : "Place one hand inside the frame"}
                  </div>
                </>
              )}
              {camera.cameraState === "running" && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-white font-medium">LIVE</span>
                </div>
              )}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="min-h-[320px] flex flex-col items-center justify-center animate-scale-in">
              {!sessionActive ? (
                <div className="text-center">
                  <span className="text-5xl block mb-4">✋</span>
                  <p className="text-lg font-medium text-white mb-2">Start a Practice Session</p>
                  <p className="text-sm text-white/40 mb-4">Practice ISL signs and track your progress</p>
                  <Button onClick={startSession}>Begin Practice</Button>
                </div>
              ) : selectedSign ? (
                (() => {
                  const sign = municipalSigns.find((s) => s.id === selectedSign);
                  if (!sign) return null;
                  return (
                    <>
                      <span className="text-6xl mb-4 block">{sign.symbol}</span>
                      <h2 className="text-2xl font-bold text-white mb-1">{sign.name}</h2>
                      <p className="text-sm text-white/40 mb-1">{sign.nameHi}</p>
                      <p className="text-xs text-white/30 mb-4 max-w-xs text-center">{sign.description}</p>
                      <div className="w-full max-w-xs p-3 rounded-xl bg-white/5 mb-4">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Hand Hint</p>
                        <p className="text-sm text-white/80">{sign.handHint}</p>
                      </div>
                      <ConfidenceIndicator state={confidenceState} confidence={confidence} />
                      {lastResult && (
                        <div className="mt-3 text-xs text-white/30">
                          Detected: {lastResult.label} ({Math.round(lastResult.confidence * 100)}%)
                        </div>
                      )}
                      <div className="flex gap-3 mt-4">
                        <Button onClick={() => handleSignTap(selectedSign)} disabled={isProcessing}>
                          {isProcessing ? "Recognizing..." : "Try Again"}
                        </Button>
                        <Button variant="ghost" onClick={() => { setSelectedSign(null); setConfidenceState("UNKNOWN"); setLastResult(null); }}>
                          Choose Different Sign
                        </Button>
                      </div>
                    </>
                  );
                })()
              ) : (
                <div className="text-center">
                  <span className="text-5xl block mb-4">🔍</span>
                  <p className="text-lg font-medium text-white mb-2">Select a Sign to Practice</p>
                  <p className="text-sm text-white/40">Choose from the grid on the right</p>
                </div>
              )}
            </Card>

            {recentAttempts.length > 0 && (
              <Card>
                <h3 className="font-bold text-white mb-3">Recent Attempts</h3>
                <div className="space-y-2">
                  {recentAttempts.map((attempt, i) => {
                    const s = municipalSigns.find((ms) => ms.id === attempt.expectedSign);
                    return (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              attempt.correct ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {attempt.correct ? "✓" : "✗"}
                          </div>
                          <span className="text-xs text-white/60">
                            {s?.symbol} {s?.name}
                          </span>
                        </div>
                        <span className="text-xs text-white/40">{Math.round(attempt.confidence * 100)}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {attempts.length > 0 && (
              <Card>
                <h3 className="font-bold text-white mb-3">Attempt History</h3>
                <div className="flex flex-wrap gap-1.5">
                  {attempts.slice(-20).map((attempt, i) => {
                    const s = municipalSigns.find((ms) => ms.id === attempt.expectedSign);
                    return (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                          attempt.correct ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                        title={`${s?.name || attempt.expectedSign} — ${Math.round(attempt.confidence * 100)}%`}
                      >
                        {s?.symbol || "?"}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          <Card className="h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Practice Signs</h3>
              {sessionActive && (
                <Button variant="danger" size="sm" onClick={handleEndSession}>
                  End Session
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {municipalSigns.map((s) => {
                const signAttempts = attempts.filter((a) => a.expectedSign === s.id);
                const signAccuracy =
                  signAttempts.length > 0 ? Math.round((signAttempts.filter((a) => a.correct).length / signAttempts.length) * 100) : null;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSignTap(s.id)}
                    disabled={!sessionActive || isProcessing}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all border ${
                      selectedSign === s.id
                        ? "bg-gold-400/10 border-gold-400/30 shadow-lg shadow-gold-400/10"
                        : "bg-white/5 hover:bg-white/8 border-transparent hover:border-white/10"
                    } disabled:opacity-50`}
                  >
                    <span className="text-xl">{s.symbol}</span>
                    <span className="text-[10px] text-white/70 font-medium">{s.name}</span>
                    <span className="text-[10px] text-white/40">{s.nameHi}</span>
                    {signAccuracy !== null && (
                      <span className={`text-[10px] font-bold ${signAccuracy >= 70 ? "text-green-400" : "text-red-400"}`}>
                        {signAccuracy}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {!engineReady && (
              <Card className="mt-4 border-blue-500/30 bg-blue-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Initializing Engine</p>
                    <p className="text-xs text-white/40">Loading recognition models...</p>
                  </div>
                </div>
              </Card>
            )}
            {engineReady && (
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-white/50">Engine ready</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
