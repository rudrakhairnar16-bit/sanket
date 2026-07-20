"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { classifier, type Landmark } from "@/lib/knn-classifier";
import { speak } from "@/lib/tts";
import { SpeechRecognizer } from "@/lib/speech";
import {
  MUNICIPAL_SIGNS,
  SIGN_MAP,
  getLocalizedName,
  CATEGORY_LABELS,
} from "@/data/municipal-signs";
import Link from "next/link";

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

  const lastSignRef = useRef<string | null>(null);
  const stableFramesRef = useRef(0);
  const STABLE_THRESHOLD = 6;

  useEffect(() => {
    const saved = localStorage.getItem("sanket-knn-samples");
    if (saved && saved.length > 20) {
      classifier.deserialize(saved);
      setHasSamples(classifier.getSignCount() > 0);
    }
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
      return;
    }
    recognizerRef.current = new SpeechRecognizer(
      (text, final) => {
        if (final) setClerkText((prev) => (prev + " " + text).trim());
        else setClerkText((prev) => prev);
      },
      (s) => setIsListening(s === "listening")
    );
  }, []);

  async function loadHandLandmarker() {
    try {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      return await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
    } catch {
      return null;
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
      if (!ctx) return;

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

          if (hasSamples && classifier.getSampleCount() > 0) {
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
      animFrameRef.current = requestAnimationFrame(() => processFrame(lm));
    }

    init();
    return () => {
      if (landmarker) landmarker.close();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [status, hasSamples, lang]);

  const cycleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : prev === "hi" ? "mr" : "en"));
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
            <Link href="/interpreter" className="text-gray-400 hover:text-white transition-all">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">Deaf ↔ Clerk Interpreter</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cycleLang}
              className="px-3 py-1.5 rounded-xl text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all"
            >
              🌐 {LANG_LABELS[lang]}
            </button>
            <button
              onClick={toggleMic}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              🎤 {isListening ? "Listening" : "Clerk Mic"}
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

            <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6 min-h-[140px] flex flex-col items-center justify-center text-center">
              <p className="text-xs text-slate-500 mb-2">DEAF PERSON IS SIGNING</p>
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
              <p className="text-xs text-white/70 mb-2">CLERK SEES — “Citizen wants to say:”</p>
              <div className="flex-1 flex items-center justify-center text-center">
                {deafDisplay ? (
                  <p className="text-2xl font-bold text-white">{deafDisplay}</p>
                ) : (
                  <p className="text-white/50">Recognized sign meaning appears here</p>
                )}
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-5">
              <p className="text-xs text-slate-500 mb-2">CLERK REPLIES (typed or spoken)</p>
              <textarea
                value={clerkText}
                onChange={(e) => setClerkText(e.target.value)}
                placeholder="Type your reply, or press Clerk Mic to speak…"
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 border border-white/10 focus:border-indigo-500/50 focus:outline-none resize-none"
                rows={3}
              />
              {clerkText && (
                <button
                  onClick={() => speak(clerkText, lang)}
                  className="mt-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-medium transition-all"
                >
                  🔊 Speak to Citizen
                </button>
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
                title={sign.description}
              >
                {sign.icon} {getLocalizedName(sign, lang)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          Two-way accessibility: deaf citizen signs → clerk understands • clerk replies → spoken aloud.
        </p>
      </div>
    </div>
  );
}
