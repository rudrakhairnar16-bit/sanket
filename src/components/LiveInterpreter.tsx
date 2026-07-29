"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { classifier, type Landmark } from "@/lib/knn-classifier";
import { speak } from "@/lib/tts";
import { SpeechRecognizer } from "@/lib/speech";
import { MUNICIPAL_SIGNS, SIGN_MAP, getLocalizedName, textToISL, CATEGORY_LABELS, type ISLToken } from "@/data/municipal-signs";

interface ChatMessage {
  role: "citizen" | "clerk";
  text: string;
  time: Date;
  islTokens?: ISLToken[];
}

export default function LiveInterpreter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const [status, setStatus] = useState<"loading" | "ready" | "running" | "error">("loading");
  const [currentSign, setCurrentSign] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [handCount, setHandCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState("");
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [deafDisplay, setDeafDisplay] = useState<string | null>(null);
  const [lastClerkTokens, setLastClerkTokens] = useState<ISLToken[]>([]);
  const [calibrated, setCalibrated] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [lang, setLang] = useState("en");
  const [transcript, setTranscript] = useState("");
  const [clock, setClock] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const lastSignRef = useRef<string | null>(null);
  const stableFramesRef = useRef(0);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  const HANDSHAKE_SIGN = "namaste";
  const STABLE_THRESHOLD = 8;

  useEffect(() => {
    const saved = localStorage.getItem("sanket-knn-samples");
    if (saved && saved.length > 20) {
      classifier.deserialize(saved);
      const hasData = classifier.getSignCount() > 0;
      setCalibrated(hasData);
      if (hasData) setDemoMode(false);
    }
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const addMessage = useCallback((role: "citizen" | "clerk", text: string, islTokens?: ISLToken[]) => {
    setMessages((prev) => [...prev, { role, text, time: new Date(), islTokens }]);
    if (role === "clerk") {
      setDeafDisplay(text);
      setTimeout(() => setDeafDisplay(null), 8000);
    }
  }, []);

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
      setIsListening(false);
      return;
    }
    recognizerRef.current = new SpeechRecognizer(
      (text, final) => {
        if (final) {
          setInputText((prev) => prev + text + " ");
        } else {
          setTranscript(text);
        }
      },
      (status) => {
        setIsListening(status === "listening");
      }
    );
    return () => {
      recognizerRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (recognizerRef.current && isListening) {
      recognizerRef.current.stop();
      recognizerRef.current.start(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  async function loadHandLandmarker() {
    try {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
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

  useEffect(() => {
    if (status !== "ready") return;

    let landmarker: any = null;
    let lastTimestamp = 0;

    async function init() {
      landmarker = await loadHandLandmarker();
      if (!landmarker) { setStatus("error"); return; }
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
            drawLandmarks(ctx, hand, i === 0 ? "#6366f1" : "#8b5cf6");
          });

          if (calibrated && classifier.getSampleCount() > 0) {
            // Use all detected hands; pick the one with best confidence
            let bestResult = { signId: null as string | null, confidence: 0 };
            for (const hand of result.landmarks) {
              const r = classifier.classify(hand);
              if (r.confidence > bestResult.confidence) {
                bestResult = r;
              }
            }
            if (bestResult.signId && bestResult.confidence > 0.5) {
              setCurrentSign(bestResult.signId);
              setConfidence(bestResult.confidence);

              if (bestResult.signId === lastSignRef.current) {
                stableFramesRef.current++;
              } else {
                stableFramesRef.current = 0;
                lastSignRef.current = bestResult.signId;
              }

              if (stableFramesRef.current >= STABLE_THRESHOLD) {
                const entry = SIGN_MAP.get(bestResult.signId);
                if (entry) {
                  const displayName = getLocalizedName(entry, lang);
                  setTranscript(displayName);
                  addMessage("citizen", displayName);
                  speak(displayName, lang);
                  stableFramesRef.current = 0;
                }
              }
            } else {
              setCurrentSign(null);
              setConfidence(0);
            }
          } else {
            // Demo mode: show "Calibrate" overlay
            if (result.landmarks.length >= 2) {
              setTranscript("Two hands detected — calibrate to recognize signs");
            } else {
              setTranscript("Show a sign to camera");
            }
          }
        } else {
          setHandCount(0);
          setCurrentSign(null);
          setConfidence(0);
        }
      }

      animFrameRef.current = requestAnimationFrame(() => processFrame(lm));
    }

    init();
    return () => {
      if (landmarker) landmarker.close();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [status, calibrated, lang, addMessage]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    const tokens = textToISL(text, lang);
    addMessage("clerk", text, tokens);
    setLastClerkTokens(tokens);
    setInputText("");
    setTranscript("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (!recognizerRef.current) {
      recognizerRef.current = new SpeechRecognizer(
        (text, final) => {
          if (final) setInputText((prev) => prev + text + " ");
          else setTranscript(text);
        },
        (status) => setIsListening(status === "listening")
      );
    }
    if (isListening) {
      recognizerRef.current.stop();
    } else {
      recognizerRef.current.start(lang);
    }
  };

  const cycleLang = () => {
    setLang((prev: string) => (prev === "en" ? "hi" : prev === "hi" ? "mr" : "en"));
  };

  const handleDemoSign = (signId: string) => {
    const entry = SIGN_MAP.get(signId);
    if (!entry) return;
    const displayName = getLocalizedName(entry, lang);
    setTranscript(displayName);
    addMessage("citizen", displayName);
    speak(displayName, lang);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800 shrink-0" role="banner">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </div>
          <span className="font-semibold text-sm hidden sm:inline">Live Interpreter</span>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
              demoMode
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                : "bg-primary-500/15 text-primary-400 border border-primary-500/25"
            }`}
            aria-pressed={!demoMode}
            aria-label={`Switch to ${demoMode ? "camera" : "demo"} mode`}
          >
            {demoMode ? "Demo" : "Camera"}
          </button>
          {calibrated && (
            <span className="text-[10px] bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full hidden sm:inline-block" aria-live="polite">
              {classifier.getSignCount()} signs
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleLang}
            className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-[10px] font-medium transition-all"
            aria-label={`Current language: ${lang.toUpperCase()}. Click to change.`}
          >
            {lang === "en" ? "EN" : lang === "hi" ? "HI" : "MR"}
          </button>
          <a
            href="/interpreter/calibrate"
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all hidden sm:inline-block ${
              calibrated
                ? "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-800/40"
                : "bg-amber-900/40 text-amber-400 hover:bg-amber-800/40 animate-pulse"
            }`}
            aria-label={calibrated ? "Open calibration settings" : "Calibrate sign recognition"}
          >
            {calibrated ? "Calibrated" : "Calibrate"}
          </a>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Camera OR Demo Sign Grid */}
        <div className="lg:w-1/2 relative bg-gray-900 flex flex-col min-h-[200px]">
          {/* Camera (hidden in demo mode) */}
          {!demoMode && (
            <div className="absolute inset-0">
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
            </div>
          )}

          {!demoMode && status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-4 border-primary-400 border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">Starting camera...</p>
              </div>
            </div>
          )}

          {!demoMode && status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80">
              <p className="text-sm text-red-400">Camera not available. Switch to Demo mode.</p>
            </div>
          )}

          {/* Camera overlay info */}
          {!demoMode && (
            <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none z-10">
              <span className="px-2 py-1 bg-black/60 text-[10px] rounded-lg backdrop-blur-sm">
                {handCount > 0 ? `${handCount} hand${handCount > 1 ? "s" : ""}` : "No hands"}
              </span>
              {currentSign && confidence > 0 && (
                <span className="px-2 py-1 bg-black/60 text-[10px] rounded-lg backdrop-blur-sm flex items-center gap-1">
                  {SIGN_MAP.get(currentSign)?.icon} {Math.round(confidence * 100)}%
                </span>
              )}
            </div>
          )}

          {!demoMode && transcript && (
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10">
              <div className="bg-primary-600/90 backdrop-blur-sm px-4 py-3 rounded-xl text-center">
                <p className="text-base font-bold">{transcript}</p>
                <p className="text-[10px] text-white/70 mt-0.5">Sign detected</p>
              </div>
            </div>
          )}

          {!demoMode && !calibrated && status === "running" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950/70 pointer-events-none z-10">
              <div className="text-center max-w-xs">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-1.5 0-3-.5-4-2-1 0-2-.5-2.5-1.5-.5 0-1-.5-1-1.5s.5-1.5 1-2c0-.5 0-1-.5-1.5"/></svg>
                </div>
                <p className="text-sm text-gray-300">No sign data loaded</p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Switch to Demo mode to present instantly
                </p>
              </div>
            </div>
          )}

          {/* Demo Mode: Clickable Sign Grid */}
          {demoMode && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  Demo Mode — click signs to simulate citizen input
                </p>
                <span className="text-[10px] text-gray-600">{MUNICIPAL_SIGNS.length} signs</span>
              </div>
              {MUNICIPAL_SIGNS.reduce((groups, sign) => {
                const key = sign.category;
                if (!groups.length || groups[groups.length - 1].category !== key) {
                  groups.push({ category: key, signs: [sign] });
                } else {
                  groups[groups.length - 1].signs.push(sign);
                }
                return groups;
              }, [] as { category: string; signs: typeof MUNICIPAL_SIGNS }[]).map((group) => (
                <div key={group.category}>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2 font-medium">
                    {CATEGORY_LABELS[group.category] || group.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.signs.map((sign) => (
                      <button
                        key={sign.id}
                        onClick={() => handleDemoSign(sign.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-800/80 hover:bg-gray-700 active:bg-primary-700/50 rounded-xl text-xs transition-all border border-gray-700/50 hover:border-primary-500/30"
                        aria-label={`Simulate sign: ${getLocalizedName(sign, lang)}`}
                      >
                        <span className="text-base">{sign.icon}</span>
                        <span className="text-gray-200">{getLocalizedName(sign, lang)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat + Controls */}
        <div className="lg:w-1/2 flex flex-col bg-gray-900">
          {/* Deaf user display */}
          {deafDisplay && (
            <div className="bg-gray-800/80 border-b border-gray-700 p-4 text-center">
              <p className="text-[10px] text-gray-500 mb-1">Clerk says:</p>
              <p className="text-xl sm:text-2xl font-bold text-primary-400 animate-scale-in">
                {deafDisplay}
              </p>
              {lastClerkTokens.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                  {lastClerkTokens.map((tok, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-900 rounded-lg border border-primary-500/25"
                      title={tok.label}
                    >
                      <span className="text-xl leading-none">{tok.symbol}</span>
                      <span className="text-[10px] text-gray-200">{tok.label}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat transcript */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-label="Conversation transcript" aria-live="polite">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </div>
                <p className="text-sm">Conversation will appear here</p>
                <p className="text-[10px] text-gray-600 mt-1">
                  Deaf citizen signs → text appears → clerk speaks/types back
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "clerk" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    msg.role === "clerk"
                      ? "bg-primary-600 text-white rounded-tr-md"
                      : "bg-gray-800 text-gray-200 rounded-tl-md"
                  }`}
                >
                  <p className="text-[10px] opacity-60 mb-0.5">
                    {msg.role === "clerk" ? "Clerk" : "Citizen"}
                  </p>
                  <p className="text-sm">{msg.text}</p>
                  {msg.role === "clerk" && msg.islTokens && msg.islTokens.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.islTokens.map((tok, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-900/60 rounded-lg border border-primary-500/30"
                          title={tok.label}
                        >
                          <span className="text-lg leading-none">{tok.symbol}</span>
                          <span className="text-[10px] text-gray-300">{tok.label}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-gray-800 bg-gray-900/95">
            <div className="flex items-end gap-2">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all shrink-0 ${
                  isListening
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 animate-pulse"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </button>
              <div className="flex-1 relative">
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 border border-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
                  aria-label="Type your reply"
                />
                {isListening && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-red-400 animate-pulse">
                    Listening...
                  </span>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="p-3 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl transition-all shrink-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-[10px] text-gray-600">
                {handCount > 0 ? `${handCount} hand(s) detected` : "No hands"}
              </p>
              <p className="text-[10px] text-gray-600">
                {clock}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
