"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { classifier, type Landmark } from "@/lib/knn-classifier";
import { speak } from "@/lib/tts";
import { SpeechRecognizer } from "@/lib/speech";
import {
  MUNICIPAL_SIGNS,
  SIGN_MAP,
  getLocalizedName,
  textToISL,
} from "@/data/municipal-signs";
import Link from "next/link";
import { t, loadLang, setLang } from "@/lib/hi";

const LANG_LABELS: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
};

export default function TwoWayInterpreterPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "running" | "error">("loading");
  const [currentSign, setCurrentSign] = useState<string | null>(null);
  const [handCount, setHandCount] = useState(0);
  const [clerkText, setClerkText] = useState("");
  const [deafDisplay, setDeafDisplay] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState("en");
  const [hasSamples, setHasSamples] = useState(false);
  const [trainMode, setTrainMode] = useState(false);
  const [trainSignId, setTrainSignId] = useState<string | null>(null);
  const [trainCount, setTrainCount] = useState(0);
  const [micSupported, setMicSupported] = useState(true);

  const lastSignRef = useRef<string | null>(null);
  const stableFramesRef = useRef(0);
  const STABLE_THRESHOLD = 6;
  const trainBufferRef = useRef<Landmark[][]>([]);
  const trainActiveRef = useRef(false);
  const trainModeRef = useRef(false);
  const trainSignIdRef = useRef<string | null>(null);

  useEffect(() => {
    const saved = loadLang();
    setLang(saved);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sanket-knn-samples");
    if (saved && saved.length > 20) {
      classifier.deserialize(saved);
    }
    setHasSamples(classifier.getSignCount() > 0);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [startCamera]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setMicSupported(false);
      return;
    }
    recognizerRef.current = new SpeechRecognizer(
      (text, final) => {
        if (final) setClerkText((prev) => (prev + " " + text).trim());
      },
      (s) => setIsListening(s === "listening")
    );
  }, []);

  useEffect(() => {
    trainModeRef.current = trainMode;
    trainSignIdRef.current = trainSignId;
    if (!trainMode || !trainSignId) {
      trainActiveRef.current = false;
      trainBufferRef.current = [];
    }
  }, [trainMode, trainSignId]);

  async function loadHandLandmarker() {
    const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(
      "/wasm"
    );
    const opts = {
      baseOptions: {
        modelAssetPath:
          "/models/hand_landmarker.task",
      },
      runningMode: "VIDEO" as const,
      numHands: 2,
    };
    try {
      return await HandLandmarker.createFromOptions(vision, {
        ...opts,
        baseOptions: { ...opts.baseOptions, delegate: "CPU" },
      });
    } catch {
      try {
        return await HandLandmarker.createFromOptions(vision, {
          ...opts,
          baseOptions: { ...opts.baseOptions, delegate: "GPU" },
        });
      } catch {
        return null;
      }
    }
  }

  useEffect(() => {
    if (status !== "ready") return;

    let landmarker: any = null;
    let lastTimestamp = 0;

    async function init() {
      landmarker = await loadHandLandmarker();
      if (!landmarker) {
        setStatus("error");
        return;
      }
      setStatus("running");
      processFrame(landmarker);
    }

    function drawLandmarks(ctx: CanvasRenderingContext2D, landmarks: Landmark[], color: string) {
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [5, 9], [9, 10], [10, 11], [11, 12],
        [9, 13], [13, 14], [14, 15], [15, 16],
        [13, 17], [17, 18], [18, 19], [19, 20],
        [0, 17],
      ];
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const [i, j] of connections) {
        ctx.beginPath();
        ctx.moveTo(landmarks[i].x * w, landmarks[i].y * h);
        ctx.lineTo(landmarks[j].x * w, landmarks[j].y * h);
        ctx.stroke();
      }
      ctx.fillStyle = color;
      for (const lm of landmarks) {
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    function processFrame(lm: any) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(() => processFrame(lm));
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(() => processFrame(lm));
        return;
      }

      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const now = performance.now();
        if (now - lastTimestamp > 100) {
          lastTimestamp = now;
          const result = lm.detectForVideo(video, now);

          if (result.landmarks && result.landmarks.length > 0) {
            setHandCount(result.landmarks.length);
            result.landmarks.forEach((hand: Landmark[], i: number) => {
              drawLandmarks(ctx, hand, i === 0 ? "#6366f1" : "#f472b6");
            });

            if (trainModeRef.current && trainSignIdRef.current) {
              for (const hand of result.landmarks) {
                trainBufferRef.current.push(hand);
              }
              if (!trainActiveRef.current && trainBufferRef.current.length > 0) {
                trainActiveRef.current = true;
                const captureId = trainSignIdRef.current;
                setTimeout(() => {
                  if (trainBufferRef.current.length > 15) {
                    classifier.addMultipleSamples(captureId, trainBufferRef.current);
                    localStorage.setItem("sanket-knn-samples", classifier.serialize());
                    setHasSamples(classifier.getSignCount() > 0);
                    setTrainCount((c) => c + 1);
                  }
                  trainBufferRef.current = [];
                  trainActiveRef.current = false;
                }, 1500);
              }
            } else if (hasSamples && classifier.getSampleCount() > 0) {
              let best = { signId: null as string | null, confidence: 0 };
              for (const hand of result.landmarks) {
                const r = classifier.classify(hand);
                if (r.confidence > best.confidence) best = r;
              }
              if (best.signId && best.confidence > 0.5) {
                setCurrentSign(best.signId);
                if (best.signId === lastSignRef.current) {
                  stableFramesRef.current++;
                } else {
                  stableFramesRef.current = 0;
                  lastSignRef.current = best.signId;
                }
                if (stableFramesRef.current >= STABLE_THRESHOLD) {
                  const entry = SIGN_MAP.get(best.signId);
                  if (entry) {
                    const meaning = getLocalizedName(entry, lang);
                    setDeafDisplay(meaning);
                    speak(meaning, lang);
                    stableFramesRef.current = 0;
                  }
                }
              } else {
                setCurrentSign(null);
              }
            }
          } else {
            setHandCount(0);
            setCurrentSign(null);
          }
        }
      } catch {
        // keep loop alive even if a frame fails
      }
      animFrameRef.current = requestAnimationFrame(() => processFrame(lm));
    }

    init();
    return () => {
      if (landmarker) landmarker.close();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [status, hasSamples, lang]);

  const cycleLang = () => {
    const next = lang === "en" ? "hi" : lang === "hi" ? "mr" : "en";
    setLang(next);
  };

  const toggleMic = () => {
    if (!recognizerRef.current) return;
    if (isListening) recognizerRef.current.stop();
    else recognizerRef.current.start(lang);
  };

  const currentName = currentSign ? getLocalizedName(SIGN_MAP.get(currentSign)!, lang) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/interpreter" className="text-gray-400 hover:text-white transition-all" aria-label="Back to interpreter">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">Deaf ↔ Clerk Interpreter</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cycleLang}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 transition-all flex items-center gap-1.5"
              aria-label={`Current language: ${LANG_LABELS[lang]}. Click to change.`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              {LANG_LABELS[lang]}
            </button>
            <button
              onClick={toggleMic}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              aria-label={isListening ? "Stop listening" : "Start microphone"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              {isListening ? "Listening" : "Clerk Mic"}
            </button>
            <button
              onClick={() => {
                setTrainMode((v) => !v);
                setTrainSignId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                trainMode
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              aria-pressed={trainMode}
              aria-label={`${trainMode ? "Disable" : "Enable"} training mode`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              {trainMode ? "Training ON" : "Train Model"}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Deaf person side: camera + recognized meaning */}
          <div className="space-y-4">
            <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-white/10">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full scale-x-[-1]" />
              {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
                  <div className="w-8 h-8 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
                </div>
              )}
              {status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-center p-4">
                  <p className="text-sm text-red-400">Camera not available. Allow camera access to begin.</p>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-black/60 text-xs rounded-lg backdrop-blur">
                  {handCount > 0 ? `${handCount} hand${handCount > 1 ? "s" : ""}` : "No hands"}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6 min-h-[140px] flex flex-col items-center justify-center text-center" role="status" aria-live="polite">
              <p className="text-xs text-slate-500 mb-2">{t("DEAF PERSON IS SIGNING")}</p>
              {currentName ? (
                <>
                  <p className="text-3xl font-bold text-indigo-300">{currentName}</p>
                  <p className="text-sm text-slate-400 mt-1">{currentSign && SIGN_MAP.get(currentSign)?.description}</p>
                </>
              ) : (
                <p className="text-slate-500">Show a sign to the camera…</p>
              )}
              {!hasSamples && (
                <p className="text-xs text-amber-400 mt-3">
                  No trained signs yet — use Demo signs below or train on the main interpreter page.
                </p>
              )}
            </div>
          </div>

          {/* Clerk side: what deaf person wants + clerk reply */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 min-h-[200px] flex flex-col">
              <p className="text-xs text-white/70 mb-2">{t("CLERK SEES")}</p>
              <div className="flex-1 flex items-center justify-center text-center">
                {deafDisplay ? (
                  <p className="text-2xl font-bold text-white">{deafDisplay}</p>
                ) : (
                  <p className="text-white/50">Recognized sign meaning appears here</p>
                )}
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-5">
              <p className="text-xs text-slate-500 mb-2">{t("CLERK REPLIES")}</p>
              <textarea
                value={clerkText}
                onChange={(e) => setClerkText(e.target.value)}
                placeholder="Type your reply — it converts to ISL signs live…"
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 border border-white/10 focus:border-indigo-500/50 focus:outline-none resize-none"
                rows={3}
              />
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <button
                  onClick={() => speak(clerkText, lang)}
                  disabled={!clerkText.trim()}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
                  Speak to Citizen
                </button>
                {!micSupported && (
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    Mic unavailable in this browser — type your reply instead.
                  </span>
                )}
              </div>
              {clerkText.trim() && (
                <div className="mt-4 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-400/25 rounded-xl p-4">
                  <p className="text-[10px] text-purple-200 mb-2 flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    SHOWN TO DEAF CITIZEN (ISL Signs)
                  </p>
                  {textToISL(clerkText, lang).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {textToISL(clerkText, lang).map((t, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/70 rounded-xl border border-white/10"
                          title={t.label}
                        >
                          <span className="text-2xl">{t.symbol}</span>
                          <span className="text-xs text-slate-300">{t.label}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No matching ISL signs yet. Try words like water, bill, tax, help, wait, name, address…
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo sign palette */}
        <div className="mt-8">
          <p className="text-sm text-slate-400 mb-3">Demo signs (click to simulate citizen input)</p>
          <div className="flex flex-wrap gap-2">
            {MUNICIPAL_SIGNS.map((sign) => (
              <button
                key={sign.id}
                onClick={() => {
                  const meaning = getLocalizedName(sign, lang);
                  setDeafDisplay(meaning);
                  speak(meaning, lang);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-sm transition-all"
                aria-label={`Demo sign: ${getLocalizedName(sign, lang)} - ${sign.description}`}
              >
                {sign.icon} {getLocalizedName(sign, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Train Mode panel */}
        {trainMode && (
          <div className="mt-8 bg-emerald-900/15 border border-emerald-500/25 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-emerald-300 text-sm flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  Train Sign Model
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pick a sign, then hold it to the camera for ~1.5s.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300">
                {classifier.getSignCount()} signs • {trainCount} captures
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-2">
              {trainSignId ? (
                <>Capturing <strong className="text-emerald-300">{getLocalizedName(SIGN_MAP.get(trainSignId)!, lang)}</strong> — hold the sign to camera…</>
              ) : (
                "Select a sign to train:"
              )}
            </p>
            <p className="text-xs text-amber-400 mb-2">
              Need {classifier.getMinSamplesPerSign()}+ samples per sign before recognition works
            </p>
            <div className="flex flex-wrap gap-2">
              {MUNICIPAL_SIGNS.map((sign) => {
                const samplesPerSign = classifier.getSamplesPerSign();
                const count = samplesPerSign[sign.id] || 0;
                const minSamples = classifier.getMinSamplesPerSign();
                const progress = Math.min(count / minSamples, 1);
                const isReady = count >= minSamples;
                return (
                  <button
                    key={sign.id}
                    onClick={() => setTrainSignId(sign.id)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all border flex flex-col items-center gap-1 ${
                      trainSignId === sign.id
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : isReady
                        ? "bg-emerald-900/30 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-300"
                    }`}
                    aria-label={`${isReady ? "Trained" : "Train"} sign: ${getLocalizedName(sign, lang)} (${count} of ${minSamples} samples)`}
                    aria-pressed={trainSignId === sign.id}
                  >
                    <div className="flex items-center gap-1">
                      {sign.icon} {getLocalizedName(sign, lang)}
                      {isReady && <span className="text-xs">✓</span>}
                    </div>
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isReady ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {count}/{minSamples}
                    </span>
                  </button>
                );
              })}
            </div>

            {trainCount > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const json = classifier.serialize();
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "sanket-knn-model.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 rounded-lg text-xs transition-all flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Export Model
                </button>
                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Import Model
                  <input
                    type="file"
                    accept=".json"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          classifier.deserialize(ev.target?.result as string);
                          localStorage.setItem("sanket-knn-samples", classifier.serialize());
                          setHasSamples(classifier.getSignCount() > 0);
                          setTrainCount(classifier.getSampleCount());
                        } catch {
                          alert("Invalid model file");
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  onClick={() => {
                    classifier.reset();
                    localStorage.removeItem("sanket-knn-samples");
                    setHasSamples(false);
                    setTrainCount(0);
                    setTrainSignId(null);
                  }}
                  className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg text-xs transition-all"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-slate-600 mt-8">
          Two-way accessibility: deaf citizen signs → clerk understands • clerk replies → spoken aloud.
        </p>
      </div>
    </div>
  );
}
