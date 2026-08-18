"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { classifier, type Landmark } from "@/lib/knn-classifier";
import { speak, stopSpeaking, SUPPORTED_LANGS } from "@/lib/tts";
import {
  MUNICIPAL_SIGNS,
  SIGN_MAP,
  getLocalizedName,
  textToISL,
  type ISLToken,
} from "@/data/municipal-signs";
import { loadGame, saveGame, addXP } from "@/lib/game-storage";

interface ChatMessage {
  role: "citizen" | "clerk" | "system";
  text: string;
  time: Date;
  islTokens?: ISLToken[];
}

interface ClerkPhrase {
  id: string;
  en: string;
  hi: string;
  mr: string;
  gu: string;
  tokens: string[];
}

const CLERK_PHRASES: ClerkPhrase[] = [
  { id: "namaste", en: "Namaste", hi: "नमस्ते", mr: "नमस्कार", gu: "નમસ્તે", tokens: ["namaste"] },
  { id: "yes_please", en: "Yes, of course", hi: "हाँ, बिल्कुल", mr: "होय, नक्कीच", gu: "હા, ચોક્કસ", tokens: ["yes", "please"] },
  { id: "please_wait", en: "Please wait", hi: "कृपया रुकिए", mr: "कृपया थांबा", gu: "કૃપા કરીને રાહ જુઓ", tokens: ["please", "wait"] },
  { id: "fill_form", en: "Please fill this form", hi: "कृपया यह फ़ॉर्म भरिए", mr: "कृपया हा फॉर्म भरा", gu: "કૃપા કરીને આ ફોર્મ ભરો", tokens: ["please", "form"] },
  { id: "need_name", en: "I need your name", hi: "आपका नाम चाहिए", mr: "तुमचे नाव हवे", gu: "તમારું નામ જોઈએ", tokens: ["name"] },
  { id: "need_address", en: "I need your address", hi: "आपका पता चाहिए", mr: "तुमचा पत्ता हवा", gu: "તમારું સરનામું જોઈએ", tokens: ["address"] },
  { id: "show_document", en: "Please show your document", hi: "कृपया अपना दस्तावेज़ दिखाइए", mr: "कृपया तुमचा दस्तऐवज दाखवा", gu: "કૃપા કરીને તમારો દસ્તાવેજ બતાવો", tokens: ["please", "document"] },
  { id: "bill_payment", en: "Bill payment is over here", hi: "बिल का भुगतान यहाँ पर है", mr: "बिलचे देयक इथे आहे", gu: "બિલની ચુકવણી અહીં છે", tokens: ["bill", "payment"] },
  { id: "complaint_registered", en: "Your complaint is registered", hi: "आपकी शिकायत दर्ज हो गई", mr: "तुमची तक्रार नोंद झाली", gu: "તમારી ફરિયાદ નોંધાઈ ગઈ છે", tokens: ["complaint"] },
  { id: "understand", en: "Do you understand?", hi: "क्या आप समझ गए?", mr: "तुम्हाला समजलं का?", gu: "શું તમને સમજાયું?", tokens: ["understand"] },
  { id: "sorry_wait", en: "Sorry, I didn't understand", hi: "माफ़ कीजिए, समझ नहीं आया", mr: "माफ करा, समजलं नाही", gu: "માફ કરશો, સમજાયું નહીં", tokens: ["sorry", "dont_understand"] },
  { id: "water_there", en: "Water is over there", hi: "पानी उधर है", mr: "पाणी तिकडे आहे", gu: "પાણી ત્યાં છે", tokens: ["water"] },
  { id: "office_time", en: "Office time is up", hi: "कार्यालय का समय हो गया", mr: "कार्यालयाची वेळ झाली", gu: "કાર્યાલયનો સમય પૂરો થયો", tokens: ["office", "time"] },
  { id: "thanks", en: "Thank you!", hi: "धन्यवाद!", mr: "धन्यवाद!", gu: "ધન્યવાદ!", tokens: ["thank_you"] },
];

const GREETING: Record<string, string> = {
  en: "Namaste, I am Sanket Sahayak. How can I help you today?",
  hi: "नमस्ते, मैं संकेत सहायक हूँ। आज मैं आपकी कैसे मदद करूँ?",
  mr: "नमस्कार, मी संकेत सहायक आहे. आज मी तुमची कशी मदत करू?",
  gu: "નમસ્તે, હું સંકેત સહાયક છું. આજે હું તમારી કેવી રીતે મદદ કરી શકું?",
};

const COUNTER_KEY = "sanket-assist-count";
const ASSIST_XP = 25;

export default function AssistMode() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const lastSignRef = useRef<string | null>(null);
  const stableFramesRef = useRef(0);

  const [camEnabled, setCamEnabled] = useState(false);
  const [camStatus, setCamStatus] = useState<"idle" | "loading" | "ready" | "running" | "error">("idle");
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [signedText, setSignedText] = useState("");
  const [inputText, setInputText] = useState("");
  const [currentSign, setCurrentSign] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [handCount, setHandCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [assistCount, setAssistCount] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(false);
  const STABLE_THRESHOLD = 8;

  useEffect(() => {
    const count = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10) || 0;
    setAssistCount(count);
    const savedLang = localStorage.getItem("sanket-lang");
    if (savedLang && (SUPPORTED_LANGS as readonly string[]).includes(savedLang)) {
      setLanguage(savedLang);
    }
    const savedSamples = localStorage.getItem("sanket-knn-samples");
    if (savedSamples && savedSamples.length > 20) {
      classifier.deserialize(savedSamples);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const greet = useCallback((lang: string) => {
    speak(GREETING[lang], lang);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => greet(language), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const cycleLang = () => {
    setLanguage((prev) => {
      const next = prev === "en" ? "hi" : prev === "hi" ? "mr" : prev === "mr" ? "gu" : "en";
      localStorage.setItem("sanket-lang", next);
      return next;
    });
  };

  const addMessage = useCallback((role: "citizen" | "clerk" | "system", text: string, islTokens?: ISLToken[]) => {
    setMessages((prev) => [...prev, { role, text, time: new Date(), islTokens }]);
    if (role === "system") {
      speak(text, language);
    }
  }, [language]);

  const startCamera = useCallback(async () => {
    setCamStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamStatus("ready");
      setCamEnabled(true);
    } catch {
      setCamStatus("error");
    }
  }, []);

  const toggleCamera = () => {
    if (camEnabled) {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      setCamEnabled(false);
      setCamStatus("idle");
      return;
    }
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(animFrameRef.current);
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (camEnabled && streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [camEnabled, camStatus]);

  async function loadHandLandmarker() {
    const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    const opts = {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
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
    if (camStatus !== "ready") return;

    let landmarker: any = null;
    let lastTimestamp = 0;

    async function init() {
      landmarker = await loadHandLandmarker();
      if (!landmarker) { setCamStatus("error"); return; }
      setCamStatus("running");
      processFrame();
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

    function processFrame() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const now = performance.now();
        if (now - lastTimestamp > 100) {
          lastTimestamp = now;
          const result = landmarker.detectForVideo(video, now);

          if (result.landmarks && result.landmarks.length > 0) {
            setHandCount(result.landmarks.length);
            result.landmarks.forEach((hand: Landmark[], i: number) => {
              drawLandmarks(ctx, hand, i === 0 ? "#6366f1" : "#8b5cf6");
            });

            if (classifier.getSampleCount() > 0) {
              let bestResult = { signId: null as string | null, confidence: 0 };
              for (const hand of result.landmarks) {
                const r = classifier.classify(hand);
                if (r.confidence > bestResult.confidence) bestResult = r;
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
                    const displayName = getLocalizedName(entry, language);
                    setSignedText(displayName);
                    addMessage("citizen", displayName);
                    speak(displayName, language);
                    stableFramesRef.current = 0;
                  }
                }
              } else {
                setCurrentSign(null);
                setConfidence(0);
              }
            } else {
              setSignedText("No sign samples loaded — switch to Demo mode");
            }
          } else {
            setHandCount(0);
            setCurrentSign(null);
            setConfidence(0);
          }
        }
      } catch {
        // keep loop alive even if a frame fails
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    }

    init();
    return () => {
      if (landmarker) landmarker.close();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [camStatus, language, addMessage]);

  const handleDemoSign = (signId: string) => {
    const entry = SIGN_MAP.get(signId);
    if (!entry) return;
    const displayName = getLocalizedName(entry, language);
    setSignedText(displayName);
    addMessage("citizen", displayName);
    speak(displayName, language);
  };

  const handleReply = (phrase: ClerkPhrase) => {
    const text = phrase[language as "en"] ?? phrase.en;
    const tokens = phrase.tokens
      .map((id) => SIGN_MAP.get(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => ({
        signId: s.id,
        symbol: s.islSymbol,
        label: getLocalizedName(s, language),
      }));
    addMessage("clerk", text, tokens);
  };

  const handleFreeTextReply = () => {
    const text = inputText.trim();
    if (!text) return;
    const tokens = textToISL(text, language);
    addMessage("clerk", text, tokens);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFreeTextReply();
    }
  };

  const finishSession = () => {
    const count = assistCount + 1;
    localStorage.setItem(COUNTER_KEY, String(count));
    setAssistCount(count);
    if (!xpAwarded) {
      const game = addXP(loadGame(), ASSIST_XP);
      saveGame(game);
      setXpAwarded(true);
    }
    setSessionDone(true);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  };

  const restartSession = () => {
    setSessionDone(false);
    setXpAwarded(false);
    setMessages([]);
    setSignedText("");
    setCamEnabled(false);
    setCamStatus("idle");
    speak(GREETING[language], language);
  };

  // ---- Done screen ----
  if (sessionDone) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2" role="heading" aria-level={2}>
            {language === "hi"
              ? "आज आपने एक नागरिक की मदद की 💙"
              : language === "mr"
                ? "आज तुम्ही एका नागरिकाला मदत केलीत 💙"
                : language === "gu"
                  ? "આજે તમે એક નાગરિકને મદદ કરી 💙"
                  : "You helped a citizen today 💙"}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {language === "hi"
              ? "संकेत ने सुनने व बोलने के बीच का अंतर मिटा दिया।"
              : language === "mr"
                ? "संकेतने ऐकणे आणि बोलणे यातील अंतर मिटवले."
                : language === "gu"
                  ? "સંકેતે સાંભળવા અને બોલવા વચ્ચેનું અંતર દૂર કર્યું."
                  : "Sanket turned every sign into service."}
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-gray-800/70 rounded-2xl p-4">
              <p className="text-3xl font-bold text-primary-400">{assistCount}</p>
              <p className="text-[11px] text-gray-400 mt-1">Citizens assisted</p>
            </div>
            <div className="bg-gray-800/70 rounded-2xl p-4">
              <p className="text-3xl font-bold text-amber-400">+{ASSIST_XP} XP</p>
              <p className="text-[11px] text-gray-400 mt-1">Earned this session</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={restartSession}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all"
            >
              {language === "hi" ? "एक और नागरिक की मदद करें" : language === "mr" ? "आणखी एका नागरिकाला मदत करा" : language === "gu" ? "બીજા નાગરિકને મદદ કરો" : "Help another citizen"}
            </button>
            <a
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-gray-700/60 hover:bg-gray-700 text-gray-200 text-sm font-semibold transition-all"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* LEFT: Citizen screen — welcome banner + camera/demo sign input */}
      <div className="lg:w-1/2 flex flex-col surface-card p-5 lg:min-h-[600px]">
        {/* Welcome banner — the app speaks first */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/10 border border-primary-500/25 p-4 mb-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl" aria-hidden="true">🙏</span>
            <p className="text-sm font-bold text-primary-400">
              {language === "hi" ? "स्वागत है 🙏" : language === "mr" ? "स्वागत आहे 🙏" : language === "gu" ? "સ્વાગત છે 🙏" : "Welcome 🙏"}
            </p>
            <button
              onClick={() => greet(language)}
              className="ml-auto px-2.5 py-1 rounded-lg bg-primary-500/15 hover:bg-primary-500/30 text-primary-400 text-[10px] font-medium transition-all"
              aria-label="Play greeting aloud"
            >
              🔊 Play
            </button>
          </div>
          <p className="text-base font-semibold text-gray-100">{GREETING[language]}</p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(["namaste", "help", "wait"] as string[]).map((signId) => {
              const sign = SIGN_MAP.get(signId);
              if (!sign) return null;
              return (
                <span key={signId} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-900/80 rounded-lg border border-primary-500/25">
                  <span>{sign.islSymbol}</span>
                  <span className="text-[11px] text-gray-300">{getLocalizedName(sign, language)}</span>
                </span>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-gray-400 mb-2">
          {language === "hi"
            ? "नागरिक — अपना संकेत दिखाइए:"
            : language === "mr"
              ? "नागरिक — तुमचे संकेत दाखवा:"
              : language === "gu"
                ? "નાગરિક — તમારો સંકેત બતાવો:"
                : "Citizen — show your sign:"}
        </p>

        {/* Camera toggle */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={toggleCamera}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
              camEnabled
                ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/30"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:border-primary-500/40"
            }`}
            aria-pressed={camEnabled}
          >
            {camEnabled ? "📷 Camera on" : "📷 Use camera"}
          </button>
          {!camEnabled && (
            <span className="text-[10px] text-gray-500">
              {language === "hi" ? "या नीचे संकेत पर क्लिक करें (डेमो)" : language === "mr" ? "किंवा खाली संकेतावर क्लिक करा (डेमो)" : language === "gu" ? "અથવા નીચે સંકેત પર ક્લિક કરો (ડેમો)" : "or click a sign below (demo)"}
            </span>
          )}
        </div>

        {camEnabled && (
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-700/60 mb-3 min-h-[220px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] ${
                camStatus === "loading" ? "hidden" : ""
              }`}
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full scale-x-[-1] ${
                camStatus === "running" ? "" : "hidden"
              }`}
            />
            {camStatus === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full border-4 border-primary-400 border-t-transparent animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Starting camera...</p>
                </div>
              </div>
            )}
            {camStatus === "ready" && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950/50">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full border-4 border-primary-400 border-t-transparent animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Preparing sign recognition...</p>
                </div>
              </div>
            )}
            {camStatus === "error" && (
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent">
                <p className="text-xs text-red-400 px-4 py-3 text-center">
                  Recognition unavailable — camera feed is live. Use the demo grid below or calibrate signs.
                </p>
              </div>
            )}
            {camStatus === "running" && (
              <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between pointer-events-none">
                <span className="px-2 py-1 bg-black/60 text-[10px] rounded-full backdrop-blur-sm text-gray-200">
                  {handCount > 0 ? `${handCount} hand${handCount > 1 ? "s" : ""}` : "No hands"}
                </span>
                {currentSign && confidence > 0 && (
                  <span className="px-2 py-1 bg-black/60 text-[10px] rounded-full backdrop-blur-sm flex items-center gap-1 text-gray-200">
                    {SIGN_MAP.get(currentSign)?.icon} {Math.round(confidence * 100)}%
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {signedText && (
          <div className="mb-3 rounded-xl bg-primary-600/15 border border-primary-500/30 px-4 py-3 text-center animate-scale-in">
            <p className="text-xl font-bold text-primary-400">{signedText}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {language === "hi" ? "संकेत पहचाना गया" : language === "mr" ? "संकेत ओळखला गेला" : language === "gu" ? "સંકેત ઓળખાયો" : "Sign recognized"}
            </p>
          </div>
        )}

        {/* Demo sign grid */}
        {!camEnabled && (
          <div className="flex-1 overflow-y-auto pr-1 max-h-[320px]">
            {Array.from(
              MUNICIPAL_SIGNS.reduce((map, sign) => {
                const arr = map.get(sign.category);
                if (arr) arr.push(sign);
                else map.set(sign.category, [sign]);
                return map;
              }, new Map<string, typeof MUNICIPAL_SIGNS>())
            ).map(([category, signs]) => (
              <div key={category} className="mb-3">
                <p className="text-[9px] uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {signs.map((sign) => (
                    <button
                      key={sign.id}
                      onClick={() => handleDemoSign(sign.id)}
                      className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-100 dark:bg-gray-800/80 hover:bg-primary-500/10 active:bg-primary-700/30 rounded-xl text-[11px] transition-all border border-gray-200 dark:border-gray-700/60 hover:border-primary-500/30"
                      aria-label={`Simulate sign: ${getLocalizedName(sign, language)}`}
                    >
                      <span>{sign.icon}</span>
                      <span className="text-gray-800 dark:text-gray-200">{getLocalizedName(sign, language)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Clerk workspace — chat + quick replies */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="surface-card p-5 flex flex-col flex-1 lg:min-h-[600px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 01-2 2H6l-4 4V4a2 2 0 012-2h8a2 2 0 012 2v5z"/><path d="M18 9h2a2 2 0 012 2v11l-4-4h-6a2 2 0 01-2-2v-1"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-surface-900 dark:text-white">Clerk desk</p>
                <p className="text-[10px] text-surface-500">
                  {language === "hi" ? "नागरिक के संकेत यहाँ दिखेंगे" : language === "mr" ? "नागरिकांचे संकेत इथे दिसतील" : language === "gu" ? "નાગરિકના સંકેત અહીં દેખાશે" : "Citizen signs appear here"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cycleLang}
                className="px-2.5 py-1.5 bg-surface-100 dark:bg-gray-800 hover:bg-primary-500/10 rounded-lg text-[10px] font-medium transition-all"
                aria-label={`Current language: ${language.toUpperCase()}. Click to change.`}
              >
                {language === "en" ? "EN" : language === "hi" ? "HI" : language === "mr" ? "MR" : "GU"}
              </button>
              <button
                onClick={finishSession}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-[11px] font-semibold transition-all"
              >
                {language === "hi" ? "सत्र समाप्त करें ✓" : language === "mr" ? "सत्र संपवा ✓" : language === "gu" ? "સત્ર સમાપ્ત કરો ✓" : "Finish session ✓"}
              </button>
            </div>
          </div>

          {/* Chat log */}
          <div ref={chatRef} className="flex-1 overflow-y-auto space-y-2.5 mb-4 max-h-[340px] pr-1" aria-live="polite">
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-gray-400">
                  {language === "hi"
                    ? "नागरिक के संकेत का इंतज़ार करें…"
                    : language === "mr"
                      ? "नागरिकाच्या संकेताची वाट पाहा…"
                      : language === "gu"
                        ? "નાગરિકના સંકેતની રાહ જુઓ…"
                        : "Waiting for the citizen's sign…"}
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "citizen" ? "justify-start" : msg.role === "clerk" ? "justify-end" : "justify-center"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === "citizen"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60"
                        : msg.role === "clerk"
                          ? "bg-gradient-to-br from-primary-500/25 to-accent-500/10 border border-primary-500/30"
                          : "bg-amber-500/10 border border-amber-500/25"
                    }`}
                  >
                    <p className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">
                      {msg.role === "citizen"
                        ? "Citizen"
                        : msg.role === "clerk"
                          ? "Clerk"
                          : "System"}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">{msg.text}</p>
                    {msg.islTokens && msg.islTokens.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.islTokens.map((tok, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-900/80 border border-primary-500/25 text-[11px] text-gray-300"
                          >
                            <span>{tok.symbol}</span>
                            <span>{tok.label}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick reply phrases */}
          <p className="text-[10px] font-semibold uppercase tracking-wider text-surface-400 mb-2">
            {language === "hi" ? "एक टैप रिप्लाई" : language === "mr" ? "एक टॅप उत्तर" : language === "gu" ? "એક ટેપ જવાબ" : "One-tap replies"}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {CLERK_PHRASES.map((phrase) => (
              <button
                key={phrase.id}
                onClick={() => handleReply(phrase)}
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/80 hover:bg-primary-500/10 active:bg-primary-700/20 text-[11px] text-gray-700 dark:text-gray-300 transition-all border border-gray-200 dark:border-gray-700/60 hover:border-primary-500/30"
              >
                {phrase[language as "en"] ?? phrase.en}
              </button>
            ))}
          </div>

          {/* Free text reply */}
          <div>
            {inputText.trim() && (
              <div className="mb-2 flex flex-wrap gap-1.5 items-center px-3 py-2 bg-surface-50 dark:bg-gray-800/80 border border-primary-500/20 rounded-xl" aria-live="polite">
                <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium mr-1">ISL:</span>
                {textToISL(inputText, language).length > 0 ? (
                  textToISL(inputText, language).map((tok, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-900/70 rounded-lg text-xs"
                      title={tok.label}
                    >
                      <span className="text-base leading-none">{tok.symbol}</span>
                      <span className="text-[10px] text-gray-300">{tok.label}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-gray-500">No matching signs</span>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === "hi" ? "अपना उत्तर टाइप करें…" : language === "mr" ? "तुमचे उत्तर टाइप करा…" : language === "gu" ? "તમારો જવાબ ટાઈપ કરો…" : "Type your reply…"}
                className="flex-1 bg-surface-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                aria-label={language === "hi" ? "अपना उत्तर टाइप करें" : language === "mr" ? "तुमचे उत्तर टाइप करा" : language === "gu" ? "તમારો જવાબ ટાઈપ કરો" : "Type your reply"}
              />
              <button
                onClick={handleFreeTextReply}
                className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all shadow-glow-primary"
                aria-label="Send reply"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}