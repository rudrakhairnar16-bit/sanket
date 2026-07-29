"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_SIGNS } from "@/lib/isl-data";
import {
  addXP,
  completeSign,
  checkWebcamMilestone,
  type GameState,
} from "@/lib/game-storage";
import { t, loadLang, setLang } from "@/lib/hi";
import { classifier, type Landmark } from "@/lib/knn-classifier";

const WEBCAM_SIGNS = ALL_SIGNS.filter((s) => s.webcamSupported);

export function PracticeScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const [status, setStatus] = useState<"loading" | "ready" | "running" | "error">("loading");
  const [targetSign, setTargetSign] = useState(WEBCAM_SIGNS[0].name);
  const [recognized, setRecognized] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [practiceCount, setPracticeCount] = useState(0);

  const currentSign = WEBCAM_SIGNS.find((s) => s.name === targetSign) ?? WEBCAM_SIGNS[0];

  useEffect(() => {
    setLang(loadLang());
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus("ready");
    } catch { setStatus("error"); }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [startCamera]);

  useEffect(() => {
    if (status !== "ready") return;
    let landmarker: any = null;
    let lastTimestamp = 0;

    async function init() {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      setStatus("running");
      processFrame(landmarker);
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
        if (result.landmarks?.[0]) {
          const cls = classifier.classify(result.landmarks[0]);
          if (cls.signId && cls.confidence > 0.5) {
            setRecognized(cls.signId);
            if (cls.signId === currentSign.id && cls.confidence > 0.65 && !success) {
              setSuccess(t("Sign Recognized!"));
              onUpdate((prev) => {
                let state = addXP(prev, 30);
                state = completeSign(state, currentSign.id);
                state = checkWebcamMilestone(state, practiceCount + 1);
                return state;
              });
              setPracticeCount((c) => c + 1);
              setTimeout(() => { setSuccess(null); setRecognized(null); }, 2000);
            }
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(() => processFrame(lm));
    }

    init();
    return () => { if (landmarker) landmarker.close(); cancelAnimationFrame(animFrameRef.current); };
  }, [status, currentSign, success, onUpdate]);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="btn-ghost text-xs">← {t("Back to Home")}</button>
        <span className="text-[10px] text-surface-500">{practiceCount} {t("practiced")}</span>
      </div>

      <div className="relative aspect-video bg-surface-900 rounded-3xl overflow-hidden border border-white/10 mb-4">
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full scale-x-[-1]" />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-950/80">
            <div className="w-8 h-8 rounded-full border-4 border-primary-400 border-t-transparent animate-spin" />
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-950/80">
            <p className="text-sm text-red-400">{t("Camera access denied")}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {WEBCAM_SIGNS.map((s) => (
          <button key={s.id} onClick={() => { setTargetSign(s.name); setRecognized(null); setSuccess(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              targetSign === s.name ? "bg-primary-500 text-white border-primary-400" : "bg-surface-100 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300"
            }`}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      <div className="surface-card p-5 text-center">
        <p className="text-xs text-surface-500 mb-1">{t("Show the sign to your camera")}</p>
        <p className="text-lg font-bold text-surface-900 dark:text-white">{currentSign.icon} {t(currentSign.name)}</p>
        {recognized && <p className="text-xs text-emerald-400 mt-1">{t("Sign Recognized!")} ({recognized})</p>}
      </div>

      {success && (
        <div className="mt-3 glass border-emerald-500/20 p-4 text-center animate-scale-in">
          <p className="text-emerald-400 font-semibold text-sm">{success}</p>
          <p className="text-[10px] text-surface-500 mt-0.5">+30 XP</p>
        </div>
      )}
    </div>
  );
}
