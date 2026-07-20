"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { classifier, type Landmark } from "@/lib/knn-classifier";
import { MUNICIPAL_SIGNS, SIGN_MAP, CATEGORY_LABELS } from "@/data/municipal-signs";
import Link from "next/link";

export default function CalibratePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recorded, setRecorded] = useState<Record<string, number>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isQuickTraining, setIsQuickTraining] = useState(false);
  const [handCount, setHandCount] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);
  const landmarkBuffer = useRef<Landmark[][]>([]);

  const currentSign = MUNICIPAL_SIGNS[currentIdx];
  const isComplete = currentIdx >= MUNICIPAL_SIGNS.length;

  useEffect(() => {
    const saved = localStorage.getItem("sanket-knn-samples");
    if (saved) {
      classifier.deserialize(saved);
      const counts: Record<string, number> = {};
      for (const id of Object.keys(JSON.parse(saved))) {
        counts[id] = 1;
      }
      setRecorded(counts);
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
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
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [startCamera]);

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
      if (!landmarker) { setStatus("error"); return; }
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
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2;
      for (const [i, j] of connections) {
        ctx.beginPath();
        ctx.moveTo(landmarks[i].x * w, landmarks[i].y * h);
        ctx.lineTo(landmarks[j].x * w, landmarks[j].y * h);
        ctx.stroke();
      }
      ctx.fillStyle = "#6366f1";
      for (const lm of landmarks) {
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, 3, 0, 2 * Math.PI);
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
      if (now - lastTimestamp > 80) {
        lastTimestamp = now;
        const result = lm.detectForVideo(video, now);

        if (result.landmarks && result.landmarks.length > 0) {
          setHandCount(result.landmarks.length);
          result.landmarks.forEach((hand: Landmark[], i: number) => {
            drawLandmarks(ctx, hand, i === 0 ? "#6366f1" : "#8b5cf6");
          });

          if (isRecording) {
            // Only record frames with the correct hand count for this sign
            if (result.landmarks.length === currentSign.handCount) {
              for (const hand of result.landmarks) {
                landmarkBuffer.current.push(hand);
              }
              setSampleCount((prev) => prev + result.landmarks.length);
            }
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
  }, [status, isRecording]);

  const startRecording = () => {
    landmarkBuffer.current = [];
    setSampleCount(0);
    setIsRecording(true);
    setTimeout(() => stopRecording(), 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Only save samples that match the expected hand count for this sign
    const validSamples = landmarkBuffer.current.filter((hand) => {
      // We don't know which hand is which, so we check if the total
      // landmarks in buffer per frame matches expected handCount
      // Simpler: if sign needs 2 hands, ensure we have enough samples
      return true; // We'll filter by hand count at frame level instead
    });
    
    // Count frames with correct hand count
    let validFrameCount = 0;
    // We can't easily separate frames here, so use a different approach
    // Just check total samples and if we got enough
    if (landmarkBuffer.current.length > 30) {
      classifier.addMultipleSamples(currentSign.id, landmarkBuffer.current);
      localStorage.setItem("sanket-knn-samples", classifier.serialize());
      setRecorded((prev) => ({ ...prev, [currentSign.id]: (prev[currentSign.id] || 0) + 1 }));
    }
    setSampleCount(0);
  };

  const skipSign = () => {
    setCurrentIdx((prev) => prev + 1);
    setSampleCount(0);
  };

  const resetAll = () => {
    classifier.reset();
    localStorage.removeItem("sanket-knn-samples");
    setRecorded({});
    setCurrentIdx(0);
  };

  const exportData = () => {
    const data = classifier.serialize();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sanket-signs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        classifier.deserialize(text);
        localStorage.setItem("sanket-knn-samples", classifier.serialize());
        const counts: Record<string, number> = {};
        try {
          const parsed = JSON.parse(text);
          for (const id of Object.keys(parsed)) counts[id] = 1;
        } catch {}
        setRecorded(counts);
        setCurrentIdx(MUNICIPAL_SIGNS.length);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const startQuickTrain = () => {
    if (handCount === 0) return;
    setIsQuickTraining(true);
    let idx = 0;
    const tick = () => {
      if (idx >= MUNICIPAL_SIGNS.length) {
        setIsQuickTraining(false);
        setCurrentIdx(MUNICIPAL_SIGNS.length);
        return;
      }
      const signId = MUNICIPAL_SIGNS[idx].id;
      setCurrentIdx(idx);
      setSampleCount(0);
      landmarkBuffer.current = [];
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        if (landmarkBuffer.current.length > 15) {
          classifier.addMultipleSamples(signId, landmarkBuffer.current);
          localStorage.setItem("sanket-knn-samples", classifier.serialize());
          setRecorded((prev) => ({ ...prev, [signId]: 1 }));
        }
        setSampleCount(0);
        idx++;
        setTimeout(tick, 300);
      }, 2500);
    };
    tick();
  };

  const progress = Object.keys(recorded).length;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center border border-gray-700 shadow-xl">
          <span className="text-5xl block mb-4">🎉</span>
          <h1 className="text-2xl font-bold text-white mb-2">Calibration Complete!</h1>
          <p className="text-gray-400 mb-2">
            {MUNICIPAL_SIGNS.length} signs recorded with {classifier.getSampleCount()} total samples.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Saved to browser storage. Recalibrate anytime if recognition accuracy drops.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/interpreter"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-all"
            >
              🚀 Start Interpreting
            </Link>
            <button
              onClick={resetAll}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition-all"
            >
              Redo All
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/interpreter" className="text-gray-400 hover:text-white transition-all">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">Calibrate Signs</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {progress}/{MUNICIPAL_SIGNS.length} done
            </span>
            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${(progress / MUNICIPAL_SIGNS.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={exportData}
              disabled={progress === 0}
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg text-xs transition-all"
              title="Export trained data"
            >
              📤 Export
            </button>
            <button
              onClick={importData}
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs transition-all"
              title="Import trained data"
            >
              📥 Import
            </button>
            <button
              onClick={startQuickTrain}
              disabled={handCount === 0 || isQuickTraining}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isQuickTraining
                  ? "bg-red-900/50 text-red-400 animate-pulse"
                  : handCount > 0
                  ? "bg-amber-700/50 text-amber-300 hover:bg-amber-700/70"
                  : "bg-gray-800 text-gray-600"
              }`}
              title="Auto-record all signs in sequence (3s each)"
            >
              {isQuickTraining ? "⏳ Training..." : "⚡ Quick Train All"}
            </button>
            {progress > 0 && (
              <button
                onClick={resetAll}
                className="px-2.5 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-xs transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Category: <span className="text-primary-400">{CATEGORY_LABELS[currentSign.category]}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: camera */}
          <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
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
                <div className="w-8 h-8 rounded-full border-3 border-primary-400 border-t-transparent animate-spin" />
              </div>
            )}

            {status === "error" && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                <p className="text-sm text-red-400">Camera not available</p>
              </div>
            )}

            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-black/60 text-xs rounded-lg backdrop-blur">
                {handCount > 0 ? `${handCount} hands` : "No hands"}
              </span>
            </div>

            {isRecording && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-red-600/80 text-xs rounded-lg animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Recording {sampleCount} frames
                </span>
              </div>
            )}
          </div>

          {/* Right: sign info + controls */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{currentSign.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold">{currentSign.name}</h2>
                  <p className="text-gray-400 text-sm">{currentSign.description}</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
                <p className="text-xs text-gray-500 mb-1">💡 Hint</p>
                <p className="text-sm text-gray-300">{currentSign.hint}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Uses {currentSign.handCount} hand{currentSign.handCount > 1 ? "s" : ""}
                </p>
              </div>

              {isRecording ? (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-yellow-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Hold the sign still... {sampleCount} samples collected
                  </p>
                  <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full animate-pulse"
                      style={{ width: `${Math.min((sampleCount / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ) : recorded[currentSign.id] ? (
                <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-800">
                  <p className="text-sm text-emerald-400">✓ Already recorded</p>
                  <p className="text-xs text-emerald-600">Re-record if needed</p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {!isRecording ? (
                <>
                  <button
                    onClick={startRecording}
                    disabled={handCount === 0}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                      handCount > 0
                        ? "bg-red-600 hover:bg-red-500 text-white"
                        : "bg-gray-800 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {handCount === 0
                      ? "Show hands to record"
                      : recorded[currentSign.id]
                      ? "🔄 Re-record"
                      : "🔴 Hold 3 seconds to record"}
                  </button>
                  <button
                    onClick={skipSign}
                    className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl text-sm transition-all"
                  >
                    Skip →
                  </button>
                </>
              ) : (
                <div className="flex-1 px-6 py-3 bg-gray-800 text-gray-400 rounded-xl text-sm text-center">
                  Hold still... auto-stops in 3s
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress grid */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-3">All signs</p>
          <div className="flex flex-wrap gap-1.5">
            {MUNICIPAL_SIGNS.map((sign, i) => (
              <button
                key={sign.id}
                onClick={() => setCurrentIdx(i)}
                className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                  i === currentIdx
                    ? "ring-2 ring-primary-500 bg-primary-900/30"
                    : recorded[sign.id]
                    ? "bg-emerald-900/50 opacity-80"
                    : "bg-gray-800 opacity-50 hover:opacity-80"
                }`}
                title={sign.name}
              >
                {recorded[sign.id] ? "✓" : sign.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Training Tips */}
        <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🧠</span>
            <h3 className="font-semibold text-sm text-gray-200">Training Tips for Best Accuracy</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-400">
            <div className="flex gap-2">
              <span className="text-primary-400 shrink-0">1.</span>
              <p><strong className="text-gray-300">Good lighting:</strong> Ensure your hand is well-lit — shadows reduce landmark accuracy.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-400 shrink-0">2.</span>
              <p><strong className="text-gray-300">Consistent distance:</strong> Keep your hand 30-50cm from camera, similar to how a citizen would sign at a desk.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-400 shrink-0">3.</span>
              <p><strong className="text-gray-300">Record 5+ samples:</strong> Use "Re-record" to add more variations — different angles, slightly different hand positions.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-400 shrink-0">4.</span>
              <p><strong className="text-gray-300">Export & share:</strong> One person calibrates → exports JSON → shares with team → they import it. Saves everyone time.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-400 shrink-0">5.</span>
              <p><strong className="text-gray-300">Quick Train:</strong> Use the "Quick Train All" button above to record all 25 signs in ~90 seconds.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-primary-400 shrink-0">6.</span>
              <p><strong className="text-gray-300">For production:</strong> Train a TensorFlow.js MLP on the saved feature vectors for 3× better accuracy than k-NN.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
