"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  classifier,
  type Landmark,
  type ClassificationResult,
} from "@/lib/knn-classifier";

interface SignPracticeProps {
  moduleTitle: string;
  onComplete: (success: boolean) => void;
}

export default function SignPractice({
  moduleTitle,
  onComplete,
}: SignPracticeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "practicing" | "success" | "retry"
  >("loading");
  const [currentSign, setCurrentSign] = useState<ClassificationResult>({
    signId: null,
    confidence: 0,
  });
  const [handCount, setHandCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const correctFrames = useRef(0);
  const totalFrames = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("ready");
    } catch {
      setStatus("retry");
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

  async function loadHandLandmarker() {
    try {
      const { HandLandmarker, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
      );
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      return landmarker;
    } catch {
      return null;
    }
  }

  function drawLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: { x: number; y: number }[],
    color: string
  ) {
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
    ctx.lineWidth = 2;
    for (const [i, j] of connections) {
      ctx.beginPath();
      ctx.moveTo(landmarks[i].x * w, landmarks[i].y * h);
      ctx.lineTo(landmarks[j].x * w, landmarks[j].y * h);
      ctx.stroke();
    }

    ctx.fillStyle = color;
    for (const lm of landmarks) {
      ctx.beginPath();
      ctx.arc(lm.x * w, lm.y * h, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  useEffect(() => {
    if (status !== "ready") return;

    let landmarker: any = null;
    let lastTimestamp = 0;

    async function init() {
      landmarker = await loadHandLandmarker();
      if (!landmarker) {
        setStatus("retry");
        return;
      }
      setStatus("practicing");
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

        if (result.landmarks && result.landmarks.length > 0) {
          setHandCount(result.landmarks.length);

          result.landmarks.forEach((hand: any, i: number) => {
            drawLandmarks(ctx, hand, i === 0 ? "#6366f1" : "#8b5cf6");
          });

          const landmarks = result.landmarks[0] as Landmark[];
          const classification = classifier.classify(landmarks);

          setCurrentSign(classification);

          totalFrames.current += 1;
          if (classification.signId === moduleTitle && classification.confidence > 0.6) {
            correctFrames.current += 1;
          } else if (totalFrames.current > 10) {
            correctFrames.current = Math.max(0, correctFrames.current - 1);
          }

          const acc =
            totalFrames.current > 0
              ? Math.round((correctFrames.current / totalFrames.current) * 100)
              : 0;
          setAccuracy(acc);

          if (acc > 60 && totalFrames.current > 20) {
            setStatus("success");
            onComplete(true);
            cancelAnimationFrame(animFrameRef.current);
            return;
          }
        } else {
          setHandCount(0);
        }
      }

      animFrameRef.current = requestAnimationFrame(() => processFrame(lm));
    }

    init();

    return () => {
      if (landmarker) landmarker.close();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [status, moduleTitle, onComplete]);

  function retry() {
    correctFrames.current = 0;
    totalFrames.current = 0;
    setAccuracy(0);
    setStatus("ready");
    startCamera();
  }

  function skip() {
    onComplete(false);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Practice Sign: {moduleTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Show the sign to your camera
            </p>
          </div>
        </div>

        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full scale-x-[-1]"
          />

          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
                <p className="text-white/80 text-sm">Starting camera...</p>
              </div>
            </div>
          )}

          {status === "retry" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
              <div className="text-center">
                <p className="text-white/80 mb-3">
                  Camera not available or model failed to load
                </p>
                <button
                  onClick={retry}
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {status === "practicing" && (
            <div className="absolute top-3 left-3 right-3 flex justify-between">
              <span className="px-3 py-1.5 bg-black/50 text-white text-xs rounded-xl backdrop-blur">
                {handCount > 0
                  ? `${handCount} hand${handCount > 1 ? "s" : ""} detected`
                  : "No hand detected"}
              </span>
              {currentSign.signId && (
                <span className="px-3 py-1.5 bg-black/50 text-white text-xs rounded-xl backdrop-blur flex items-center gap-1">
                  {currentSign.signId === moduleTitle ? "✅" : "⏳"}{" "}
                  {currentSign.signId}
                </span>
              )}
            </div>
          )}
        </div>

        {status === "practicing" && (
          <div className="mt-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 bg-gray-100 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(accuracy, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                {accuracy}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show the sign clearly to your camera
              </p>
              <div className="flex gap-2">
                <button
                  onClick={skip}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-4 text-center animate-scale-in">
            <span className="text-3xl block mb-2">🎉</span>
            <p className="text-green-700 dark:text-green-300 font-semibold">
              Sign recognized! Great job!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
