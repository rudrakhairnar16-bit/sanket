"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import { SignSequence } from "@/components/ui/SignSequence";
import { SessionSummary } from "@/components/sahayak/SessionSummary";
import { stopSpeaking } from "@/lib/speech";
import { playCorrect, playIncorrect, playNotification, playLevelUp } from "@/lib/sound";
import { municipalSigns, getSignsByIds } from "@/data/signs/municipal-signs";
import { defaultServicePacks, getServicePackById } from "@/data/service-packs/default-packs";
import { getRecognitionEngine, destroyRecognitionEngine } from "@/lib/recognition";
import type { RecognitionEngine, RecognitionResult } from "@/lib/recognition/types";
import { getConfidenceState } from "@/lib/recognition/confidence";
import { speakCitizenMessage, stopAllAudio } from "@/lib/audio-direction";
import { getSignGuidance, getSignsForReply } from "@/lib/sign-guidance";
import { textToSigns } from "@/lib/text-to-sign";
import { createMessage } from "@/types/message";
import type { Message } from "@/types/message";
import { logAudit } from "@/lib/audit";
import { useSahayakCamera } from "@/features/sahayak/hooks/useSahayakCamera";
import { useSahayakSession } from "@/features/sahayak/hooks/useSahayakSession";
import { useAudioRouting } from "@/features/sahayak/hooks/useAudioRouting";
import type { ConfidenceState as SahayakConfidenceState } from "@/features/sahayak/types";
import type { ConfidenceState } from "@/types";
import { calculateFeedbackImpact } from "@/lib/feedback-to-score";
import { getEmojiMessage } from "@/lib/emoji-message";

const CLERK_REPLIES: { text: string; textHi: string; category: string; icon: string }[] = [
  { text: "Please wait a moment.", textHi: "कृपया एक पल प्रतीक्षा करें।", category: "general", icon: "⏳" },
  { text: "Hello! How can I help you?", textHi: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?", category: "general", icon: "👋" },
  { text: "Please show your bill.", textHi: "कृपया अपना बिल दिखाएं।", category: "documents", icon: "📄" },
  { text: "Please show your document.", textHi: "कृपया अपना दस्तावेज़ दिखाएं।", category: "documents", icon: "📋" },
  { text: "Please sign here.", textHi: "कृपया यहाँ साइन करें।", category: "documents", icon: "✍️" },
  { text: "Please enter your phone number.", textHi: "कृपया अपना फ़ोन नंबर दर्ज करें।", category: "documents", icon: "📱" },
  { text: "Please enter your name.", textHi: "कृपया अपना नाम दर्ज करें।", category: "documents", icon: "📛" },
  { text: "Your application is being checked.", textHi: "आपका आवेदन जांचा जा रहा है।", category: "service", icon: "🔍" },
  { text: "Your payment is received.", textHi: "आपका भुगतान प्राप्त हो गया है।", category: "service", icon: "💳" },
  { text: "Thank you.", textHi: "धन्यवाद।", category: "general", icon: "🙏" },
  { text: "I understand.", textHi: "मैं समझता हूँ।", category: "general", icon: "💡" },
  { text: "Please repeat.", textHi: "कृपया दोहराएं।", category: "general", icon: "🔄" },
  { text: "I will call an interpreter.", textHi: "मैं दुभाषिया बुलाऊंगा।", category: "escalation", icon: "📞" },
  { text: "Please take a seat.", textHi: "कृपया बैठ जाइए।", category: "general", icon: "🪑" },
];

const CATEGORY_COLORS: Record<string, string> = {
  general: "text-white/60",
  documents: "text-blue-400",
  service: "text-teal-400",
  escalation: "text-red-400",
};

const PACK_ICONS: Record<string, string> = {
  "water-tax": "💧",
  "property-tax": "🏠",
  "birth-certificate": "📜",
  complaint: "📢",
  "general-help": "ℹ️",
};

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

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return "";
  }
}

function formatDuration(startIso: string, endIso?: string): string {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const secs = Math.max(0, Math.floor((end - start) / 1000));
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

export default function AssistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [replyFilter, setReplyFilter] = useState("all");
  const [engineReady, setEngineReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [showInterpreterOption, setShowInterpreterOption] = useState(false);
  const [replySignGuidance, setReplySignGuidance] = useState<ReturnType<typeof getSignsForReply>>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showSignSequence, setShowSignSequence] = useState<null | { signIds: string[]; phrase: string }>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [customReply, setCustomReply] = useState("");
  const [lastEmojiReply, setLastEmojiReply] = useState<{ text: string; emoji: string } | null>(null);

  const conversationEndRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<RecognitionEngine | null>(null);
  const sessionIdRef = useRef(`session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
  const sessionStartRef = useRef<string>("");
  const lastRecognizedSignRef = useRef<string | null>(null);
  const cooldownActiveRef = useRef(false);
  const stableCountRef = useRef(0);
  const lastRecognitionTimeRef = useRef(0);
  const recognitionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionBusyRef = useRef(false);
  const stableSignCountRef = useRef(0);
  const stableSignIdRef = useRef<string | null>(null);
  const [liveResult, setLiveResult] = useState<RecognitionResult | null>(null);
  const [lastRecognizedSign, setLastRecognizedSign] = useState<string | null>(null);

  const camera = useSahayakCamera();
  const videoRef = camera.videoRef;
  const audio = useAudioRouting();
  const [scoreNotification, setScoreNotification] = useState<string | null>(null);

  const pack = selectedPack ? getServicePackById(selectedPack) : null;
  const supportedSigns = pack ? getSignsByIds(pack.supportedSigns) : [];

  // Service-pack vocabulary is a hard recognition boundary. A water-tax session
  // should not auto-accept an unrelated sign such as "school".
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine?.setAllowedSignIds) return;
    engine.setAllowedSignIds(pack?.supportedSigns ?? null);
  }, [pack?.id]);

  const addLocalMessage = useCallback(
    (
      sender: Message["sender"],
      receiver: Message["receiver"],
      direction: Message["direction"],
      channel: Message["channel"],
      content: string,
      confidence?: number,
      signId?: string
    ) => {
      const msg = createMessage(
        sessionIdRef.current,
        sender,
        receiver,
        direction,
        channel,
        content,
        confidence,
        signId
      );
      setLocalMessages((prev) => [...prev, msg]);
      return msg;
    },
    []
  );

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

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
      stopAllAudio();
      camera.stopCamera();
    };
  }, []);

  const captureAndRecognize = useCallback(async () => {
    if (!engineRef.current || !sessionActive) return;
    if (camera.cameraState !== "running") return;
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    if (recognitionBusyRef.current) return;
    recognitionBusyRef.current = true;

    try {
      const result = await engineRef.current.recognize(video);
      setLiveResult(result);

      if (!result.signId || !result.confidence) {
        stableSignCountRef.current = 0;
        return;
      }
      if (result.confidence < 0.40) {
        stableSignCountRef.current = 0;
        return;
      }

      const signId = result.signId;

      // Never allow a classifier result outside the active service pack.
      if (pack && !pack.supportedSigns.includes(signId)) {
        stableSignCountRef.current = 0;
        return;
      }

      if (signId === stableSignIdRef.current) {
        stableSignCountRef.current += 1;
      } else {
        stableSignIdRef.current = signId;
        stableSignCountRef.current = 1;
      }

      if (stableSignCountRef.current < 3) return;

      const now = Date.now();
      if (now - lastRecognitionTimeRef.current < 3000) return;
      if (signId === lastRecognizedSignRef.current) return;

      lastRecognizedSignRef.current = signId;
      lastRecognitionTimeRef.current = now;
      setLastRecognizedSign(signId);
      stableSignCountRef.current = 0;

      const confidence = result.confidence;
      const state = getConfidenceState(confidence);
      const sign = municipalSigns.find((s) => s.id === signId);

      if (state === "HIGH") {
        cooldownActiveRef.current = true;
        setTimeout(() => { cooldownActiveRef.current = false; }, 3000);
        addLocalMessage("citizen", "clerk", "citizen_to_clerk", "isl", sign ? `${sign.symbol} ${sign.name}` : signId, confidence, signId);
        playCorrect();
        if (sign) speakCitizenMessage(sign.name);
        setSessionXP((p) => p + 1);
        await logAudit({ userId: user?._id || "unknown", username: user?.username || "unknown", role: user?.role || "clerk", action: "sign_recognized", details: `Sign ${signId} auto-recognized at HIGH confidence`, metadata: { signId, confidence, state: "high", sessionId: sessionIdRef.current } });
        setTimeout(() => { lastRecognizedSignRef.current = null; }, 3000);
      } else if (state === "MEDIUM") {
        // Medium confidence is deliberately NOT committed. The clerk can use
        // manual sign selection/interpreter escalation instead of accepting a guess.
        setShowInterpreterOption(false);
        setTimeout(() => { lastRecognizedSignRef.current = null; }, 1200);
      } else {
        stableSignCountRef.current = 0;
        setShowInterpreterOption(true);
        setTimeout(() => { lastRecognizedSignRef.current = null; }, 1200);
      }
    } catch {
      // recognition failed silently
    } finally {
      recognitionBusyRef.current = false;
    }
  }, [camera.cameraState, sessionActive, addLocalMessage, user, videoRef]);

  useEffect(() => {
    if (camera.cameraState === "running" && sessionActive && engineReady) {
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
  }, [camera.cameraState, sessionActive, engineReady, captureAndRecognize]);

  const startSession = useCallback(async () => {
    sessionIdRef.current = `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    sessionStartRef.current = new Date().toISOString();
    setLocalMessages([]);
    setSessionXP(0);
    setSessionActive(true);
    setShowInterpreterOption(false);
    setReplySignGuidance([]);
    setShowSummary(false);

    addLocalMessage(
      "system",
      "clerk",
      "citizen_to_clerk",
      "text",
      "Session started. Citizen can now sign or you can tap signs on their behalf."
    );

    await logAudit({
      userId: user?._id || "unknown",
      username: user?.username || "unknown",
      role: user?.role || "clerk",
      action: "session_start",
      details: `Assist session started for pack ${selectedPack || "unknown"}`,
      metadata: { servicePackId: selectedPack || "", sessionId: sessionIdRef.current },
    });
  }, [addLocalMessage, user, selectedPack]);

  const endSession = useCallback(async () => {
    stopAllAudio();
    camera.stopCamera();

    await logAudit({
      userId: user?._id || "unknown",
      username: user?.username || "unknown",
      role: user?.role || "clerk",
      action: "session_end",
      details: `Assist session ended with ${localMessages.length} messages, +${sessionXP} XP`,
      metadata: {
        sessionId: sessionIdRef.current,
        messageCount: localMessages.length,
        xpEarned: sessionXP,
        servicePackId: selectedPack || "",
      },
    });

    setSessionActive(false);
    setShowInterpreterOption(false);
    setReplySignGuidance([]);
    addLocalMessage(
      "system",
      "clerk",
      "citizen_to_clerk",
      "text",
      `Session completed. +${sessionXP} XP earned!`
    );
    playLevelUp();
    setShowSummary(true);
  }, [addLocalMessage, sessionXP, localMessages.length, user, selectedPack, camera]);

  const handleSelectPack = useCallback(
    async (packId: string) => {
      setSelectedPack(packId);
      await camera.requestCamera();
      startSession();
      setTimeout(() => camera.startCamera(), 500);
    },
    [camera, startSession]
  );

  const handleBackToPackSelection = useCallback(() => {
    if (sessionActive) {
      endSession();
    }
    setSelectedPack(null);
    setShowSummary(false);
    setLocalMessages([]);
  }, [sessionActive, endSession]);

  const handleSignTap = useCallback(
    async (signId: string) => {
      if (!sessionActive || isProcessing) return;

      if (Date.now() - lastRecognitionTimeRef.current < 250) return;
      lastRecognitionTimeRef.current = Date.now();

      setIsProcessing(true);
      lastRecognizedSignRef.current = signId;
      setLastRecognizedSign(signId);

      try {
        const sign = municipalSigns.find((s) => s.id === signId);
        const confidence = 1.0;
        const state = getConfidenceState(confidence);

        cooldownActiveRef.current = true;
        setTimeout(() => { cooldownActiveRef.current = false; }, 1500);

        addLocalMessage(
          "citizen",
          "clerk",
          "citizen_to_clerk",
          "isl",
          sign ? `${sign.symbol} ${sign.name}` : signId,
          confidence,
          signId
        );
        playCorrect();
        if (sign) speakCitizenMessage(sign.name);
        setSessionXP((p) => p + 1);
        await logAudit({
          userId: user?._id || "unknown",
          username: user?.username || "unknown",
          role: user?.role || "clerk",
          action: "sign_recognized",
          details: `Sign ${signId} manually tapped`,
          metadata: { signId, confidence: 1.0, state: "high", sessionId: sessionIdRef.current, manual: true },
        });

        setTimeout(() => { lastRecognizedSignRef.current = null; }, 2000);
      } catch {
        addLocalMessage("system", "clerk", "citizen_to_clerk", "text", "Recognition failed. Please try again.");
        playIncorrect();
      } finally {
        setIsProcessing(false);
      }
    },
    [sessionActive, isProcessing, addLocalMessage, user]
  );

  const confirmSign = useCallback(async () => {
    if (!localMessages.length) return;
    const last = localMessages[localMessages.length - 1];
    if (!last.signId) return;

    const sign = municipalSigns.find((s) => s.id === last.signId);
    await audio.playForRecipient("clerk", sign ? sign.name : last.content);
    setSessionXP((p) => p + 5);

    await logAudit({
      userId: user?._id || "unknown",
      username: user?.username || "unknown",
      role: user?.role || "clerk",
      action: "sign_recognized",
      details: `Sign ${last.signId} confirmed by clerk`,
      metadata: { signId: last.signId, confidence: last.confidence || 0, confirmed: true, sessionId: sessionIdRef.current },
    });

    setShowInterpreterOption(false);
    setReplySignGuidance([]);
  }, [localMessages, user, audio]);

  const tryAgain = useCallback(() => {
    setShowInterpreterOption(false);
    setReplySignGuidance([]);
  }, []);

  const handleClerkReply = useCallback(
    async (reply: string) => {
      addLocalMessage("clerk", "citizen", "clerk_to_citizen", "text", reply);
      setLastEmojiReply(getEmojiMessage(reply));
      // Clerk → citizen is intentionally visual-first. Browser TTS must never
      // play the clerk's response into the clerk's own audio channel.
      // A future counter device can route TTS to a citizen-facing speaker. 
      setSessionXP((p) => p + 2);
      const guidance = getSignsForReply(reply);
      setReplySignGuidance(guidance);
      const signMapping = textToSigns(reply);
      if (signMapping) {
        setShowSignSequence({ signIds: signMapping.signIds, phrase: signMapping.phrase });
      } else {
        setShowSignSequence(null);
      }
    },
    [addLocalMessage]
  );

  const handleCustomReply = useCallback(async () => {
    const reply = customReply.trim();
    if (!reply) return;
    await handleClerkReply(reply);
    setCustomReply("");
    setLastEmojiReply(null);
  }, [customReply, handleClerkReply]);

  const updateCustomReply = useCallback((value: string) => {
    setCustomReply(value);

  }, []);

  const callInterpreter = useCallback(async () => {
    addLocalMessage("system", "clerk", "citizen_to_clerk", "text", "Interpreter request sent. Connecting...");
    await logAudit({
      userId: user?._id || "unknown",
      username: user?.username || "unknown",
      role: user?.role || "clerk",
      action: "interpreter_escalation",
      details: "Interpreter escalation requested",
      metadata: { sessionId: sessionIdRef.current, servicePackId: selectedPack || "" },
    });
    setTimeout(() => {
      addLocalMessage("interpreter", "clerk", "interpreter_to_clerk", "interpreter", "Hello, I am the interpreter. How can I help?");
      playNotification();
    }, 1600);
  }, [addLocalMessage, user, selectedPack]);

  const handleSummaryFeedback = useCallback(async (rating: 'yes' | 'partially' | 'no') => {
    const recognitionCount = localMessages.filter((m) => m.channel === "isl").length;
    const highConfidenceCount = localMessages.filter((m) => m.confidenceState === "high").length;
    const confirmedCount = localMessages.filter((m) => m.channel === "isl" && m.confidenceState === "high").length;
    const interpreterUsed = localMessages.some((m) => m.sender === "interpreter");
    const duration = sessionStartRef.current ? (Date.now() - new Date(sessionStartRef.current).getTime()) / 1000 : 0;

    const impact = calculateFeedbackImpact(
      { sessionId: sessionIdRef.current, rating, clerkId: user?._id || '', servicePackId: selectedPack || '' },
      { recognitionCount, highConfidenceCount, confirmedCount, interpreterUsed, duration },
      75
    );

    if (impact.change !== 0) {
      setScoreNotification(`Score updated: ${impact.change > 0 ? '+' : ''}${impact.change} to ${impact.pillar}`);
      setTimeout(() => setScoreNotification(null), 4000);
    }

    await logAudit({
      userId: user?._id || "unknown",
      username: user?.username || "unknown",
      role: user?.role || "clerk",
      action: "feedback_submitted",
      details: `Session feedback: ${rating}`,
      metadata: { sessionId: sessionIdRef.current, feedback: rating },
    });
    setShowSummary(false);
  }, [user, localMessages, selectedPack, setScoreNotification]);

  const handleSummaryContinue = useCallback(() => {
    setShowSummary(false);
    setSelectedPack(null);
    setLocalMessages([]);
  }, []);

  const handleSummaryGoToLearning = useCallback(() => {
    router.push("/learn");
  }, [router]);

  const customEmoji = getEmojiMessage(customReply).emoji;

  const filteredReplies = replyFilter === "all" ? CLERK_REPLIES : CLERK_REPLIES.filter((r) => r.category === replyFilter);
  const citizenMessages = localMessages.filter((m) => m.sender === "citizen");
  const clerkMessages = localMessages.filter((m) => m.sender === "clerk");
  const interpreterMessages = localMessages.filter((m) => m.sender === "interpreter");
  const hasInterpreter = interpreterMessages.length > 0;

  const lastCitizenMsg = localMessages.filter((m) => m.sender === "citizen").slice(-1)[0];
  const lastConfidence = lastCitizenMsg?.confidence ?? 0;
  const confidenceState: ConfidenceState = lastCitizenMsg?.confidenceState === "high"
    ? "HIGH"
    : lastCitizenMsg?.confidenceState === "medium"
      ? "MEDIUM"
      : lastCitizenMsg?.confidenceState === "low"
        ? "LOW"
        : "UNKNOWN";

  const showConfirmTryAgain = confidenceState === "HIGH" || confidenceState === "MEDIUM";

  return (
    <AppShell>
      <div className="page-container">
        {scoreNotification && (
          <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium animate-slide-down">
            {scoreNotification}
          </div>
        )}
        {!selectedPack ? (
          <>
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-xl">
                  🤟
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    <span className="gradient-text">Sanket Sahayak</span>
                  </h1>
                  <p className="text-white/50 text-sm">Clerk Accessibility Platform</p>
                </div>
              </div>
              <p className="text-white/40 text-sm mt-1 ml-[52px]">Select a service pack to begin assisting a citizen</p>
            </div>

            {showSummary && sessionStartRef.current && (
              <div className="mb-6 animate-fade-in">
                <SessionSummary
                  duration={formatDuration(sessionStartRef.current)}
                  recognitionCount={localMessages.filter((m) => m.channel === "isl").length}
                  highConfidenceCount={localMessages.filter((m) => m.confidenceState === "high").length}
                  confirmedCount={localMessages.filter((m) => m.channel === "isl" && m.confidenceState === "high").length}
                  interpreterUsed={localMessages.some((m) => m.sender === "interpreter")}
                  servicePackName={pack?.serviceName || "General"}
                  onFeedback={handleSummaryFeedback}
                  onContinue={handleSummaryContinue}
                  onGoToLearning={handleSummaryGoToLearning}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultServicePacks.filter((p) => p.active).map((sp, idx) => (
                <div key={sp.id} className="animate-slide-up" style={{ animationDelay: `${idx * 80}ms` } as React.CSSProperties}>
                  <Card variant="spatial" hover onClick={() => handleSelectPack(sp.id)} className="cursor-pointer">
                    <div className="text-3xl mb-3">{PACK_ICONS[sp.id] || "📋"}</div>
                    <h3 className="font-bold text-white mb-1">{sp.serviceName}</h3>
                    <p className="text-xs text-gold-400 mb-2">{sp.serviceNameHi}</p>
                    <p className="text-sm text-white/50 mb-3">{sp.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30">{sp.supportedSigns.length} signs</span>
                      <Badge variant="teal">{sp.department}</Badge>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {!engineReady && (
              <Card className="mt-6 border-blue-500/30 bg-blue-500/5 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Initializing Recognition Engine</p>
                    <p className="text-xs text-white/40">Loading sign recognition models...</p>
                  </div>
                </div>
              </Card>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToPackSelection}
                  className="text-white/40 hover:text-white transition-colors text-lg"
                >
                  ←
                </button>
                <div className="w-10 h-10 rounded-xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-xl">
                  {PACK_ICONS[selectedPack] || "📋"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{pack?.serviceName}</h2>
                  <p className="text-xs text-white/40">{pack?.serviceNameHi} · {pack?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {sessionActive && (
                  <Badge variant="green">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block mr-1" />
                    Active
                  </Badge>
                )}
                {hasInterpreter && (
                  <Badge variant="teal">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full inline-block mr-1" />
                    Interpreter
                  </Badge>
                )}
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gold-400/10 border border-gold-400/20">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-bold text-gold-400">{sessionXP} XP</span>
                </div>
                <Button variant="danger" size="sm" onClick={endSession}>
                  End Session
                </Button>
              </div>
            </div>

            <div className="p-3 rounded-xl glass border border-white/10 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    camera.cameraState === "running" ? "bg-green-400 animate-pulse" :
                    camera.cameraState === "ready" ? "bg-blue-400" :
                    camera.cameraState === "requesting" ? "bg-yellow-400 animate-pulse" :
                    camera.cameraState === "denied" || camera.cameraState === "unsupported" || camera.cameraState === "error" ? "bg-red-400" :
                    "bg-white/20"
                  }`} />
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
                      <Button variant="ghost" size="sm" onClick={camera.pauseCamera}>Pause</Button>
                      <Button variant="ghost" size="sm" onClick={camera.stopCamera}>Stop</Button>
                    </>
                  )}
                  {camera.cameraState === "paused" && (
                    <Button variant="primary" size="sm" onClick={camera.resumeCamera}>Resume</Button>
                  )}
                  {(camera.cameraState === "denied" || camera.cameraState === "unsupported" || camera.cameraState === "error") && (
                    <Button variant="secondary" size="sm" onClick={() => {}}>
                      Use Demo Sign Grid
                    </Button>
                  )}
                  {camera.cameraState === "requesting" && (
                    <span className="text-[10px] text-white/30 animate-pulse">Waiting for permission...</span>
                  )}
                </div>
              </div>
              {camera.cameraState === "denied" && (
                <p className="text-[10px] text-red-400/80 mb-1">Camera access was denied. You can still use the demo sign grid below.</p>
              )}
              {camera.cameraState === "unsupported" && (
                <p className="text-[10px] text-red-400/80 mb-1">Camera is not supported on this device. Use the demo sign grid below.</p>
              )}
              <p className="text-[10px] text-white/30">Camera processing happens on this device. Raw footage is not stored.</p>
              {camera.cameraState === "running" && (
                <div className="text-[10px] text-white/30 flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  On-device processing · Raw footage not stored
                </div>
              )}
              <div className={`relative mt-2 rounded-lg overflow-hidden bg-navy-950 ${camera.cameraState === "idle" || camera.cameraState === "denied" || camera.cameraState === "unsupported" || camera.cameraState === "error" ? "h-0" : "aspect-square w-full max-w-[320px] mx-auto"}`}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full rounded-lg object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                {camera.cameraState === "running" && (
                  <>
                    <div className="absolute inset-5 rounded-2xl border border-white/30 pointer-events-none" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
                      {liveResult?.handDetected ? "Hand detected · hold steady" : "Place one hand inside the frame"}
                    </div>
                  </>
                )}
                {camera.cameraState === "running" && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white font-medium">LIVE</span>
                  </div>
                )}
                {liveResult && liveResult.signId && liveResult.confidence >= 0.30 && camera.cameraState === "running" && (() => {
                  const liveSign = municipalSigns.find(s => s.id === liveResult.signId);
                  return (
                    <div className="absolute bottom-2 left-2 right-2 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{liveSign?.symbol || "🤟"}</span>
                          <div>
                            <p className="text-xs text-white font-medium">{liveResult.label || liveResult.signId}</p>
                            {liveSign && <p className="text-[10px] text-gold-400/80">{liveSign.nameHi}</p>}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          liveResult.confidence >= 0.85 ? "bg-green-500/30 text-green-400" :
                          liveResult.confidence >= 0.60 ? "bg-yellow-500/30 text-yellow-400" :
                          "bg-red-500/30 text-red-400"
                        }`}>
                          {liveResult.confidence >= 0.85 ? "HIGH" : liveResult.confidence >= 0.60 ? "MEDIUM" : "LOW"} {Math.round(liveResult.confidence * 100)}%
                        </span>
                      </div>
                      {liveSign && (
                        <p className="text-[9px] text-white/40 mt-1">{liveSign.description}</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap animate-fade-in">
              <ConfidenceIndicator state={confidenceState} confidence={lastConfidence} />
              {engineReady && (
                <Badge variant="blue">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full inline-block mr-1" />
                  Engine Ready
                </Badge>
              )}
              {engineReady && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-yellow-400 font-medium">DEMO MODE — Simulated Recognition</span>
                </div>
              )}
              {replySignGuidance.length > 0 && (
                <Badge variant="teal">ISL Guidance Available</Badge>
              )}
            </div>

            {showConfirmTryAgain && (
              <div className="flex gap-3 animate-slide-up">
                <Button onClick={confirmSign} className="flex-1">
                  ✓ Confirm Sign
                </Button>
                <Button variant="secondary" onClick={tryAgain}>
                  Try Again
                </Button>
              </div>
            )}

            {lastEmojiReply && (
              <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/15 animate-slide-up">
                <p className="text-[10px] text-gold-400/70 uppercase tracking-wider mb-2">Citizen Visual Cue</p>
                <p className="text-xs text-white/60 mb-2">{lastEmojiReply.text}</p>
                <div className="text-4xl tracking-widest" aria-label={`Visual emoji cue: ${lastEmojiReply.emoji}`}>
                  {lastEmojiReply.emoji}
                </div>
                <p className="mt-2 text-[9px] text-white/25">
                  Visual aid only — use validated ISL guidance when available.
                </p>
              </div>
            )}

            {showSignSequence && (
              <div className="animate-slide-up">
                <SignSequence
                  signIds={showSignSequence.signIds}
                  phrase={showSignSequence.phrase}
                />
              </div>
            )}
            {!showSignSequence && clerkMessages.length > 0 && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 animate-slide-up">
                <p className="text-xs text-white/40">Validated sign guidance is not available for this response.</p>
              </div>
            )}

            {showInterpreterOption && (
              <Card className="border-yellow-500/30 bg-yellow-500/5 animate-slide-up">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl shrink-0">
                    ⚠️
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-400 font-medium mb-1">Low Confidence Detection</p>
                    <p className="text-xs text-white/50 mb-3">
                      AI confidence is low. A trained human interpreter can help bridge the communication gap.
                    </p>
                    <Button variant="danger" size="sm" onClick={callInterpreter}>
                      📞 Call Interpreter
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/40 uppercase tracking-wider">Manual Sign Tap (Override)</p>
                <span className="text-[10px] text-white/30">{supportedSigns.length} available</span>
              </div>
              {lastRecognizedSign && (
                <div className="mb-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                  <span className="text-lg">{municipalSigns.find(s => s.id === lastRecognizedSign)?.symbol || "🤟"}</span>
                  <div>
                    <p className="text-xs text-green-400 font-medium">Last recognized: {municipalSigns.find(s => s.id === lastRecognizedSign)?.name || lastRecognizedSign}</p>
                    <p className="text-[10px] text-white/30">Tap below to manually override or correct</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {supportedSigns.map((sign) => {
                  const guidance = getSignGuidance(sign.id);
                  return (
                    <button
                      key={sign.id}
                      onClick={() => handleSignTap(sign.id)}
                      disabled={!sessionActive || isProcessing}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed border ${
                        isProcessing
                          ? "animate-pulse bg-gold-400/10 border-gold-400/30"
                          : "bg-white/5 border-transparent hover:bg-white/10 hover:border-gold-400/20"
                      }`}
                      title={guidance ? `${guidance.name} — ${guidance.handHint}` : sign.name}
                    >
                      <span className="text-2xl">{sign.symbol}</span>
                      <span className="text-[10px] text-white/70 text-center leading-tight">{sign.name}</span>
                      {guidance && (
                        <span className="text-[8px] text-white/30 text-center leading-tight">{guidance.handHint}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            {replySignGuidance.length > 0 && (
              <Card className="border-teal-500/30 bg-teal-500/5 animate-slide-up">
                <p className="text-xs text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-lg">🤟</span>
                  ISL Sign Guidance for Your Reply
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {replySignGuidance.map((g) => (
                    <div key={g.signId} className="p-3 rounded-xl bg-white/5 border border-teal-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{g.symbol}</span>
                        <div>
                          <p className="text-xs text-white font-medium">{g.name}</p>
                          <p className="text-[10px] text-white/40">{g.nameHi}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-teal-400/80">{g.handHint}</p>
                      <p className="text-[10px] text-white/30 mt-1">{g.handCount === 1 ? "1 hand" : "2 hands"} · {g.category}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setReplySignGuidance([])} className="mt-2 text-[10px] text-white/30 hover:text-white/60 transition-colors">
                  Dismiss guidance
                </button>
              </Card>
            )}

            <Card>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Conversation Timeline</p>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {localMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3 opacity-50">🤟</div>
                    <p className="text-white/30 text-sm">No messages yet.</p>
                    <p className="text-white/20 text-xs mt-1">Camera will automatically detect ISL signs, or tap a sign below.</p>
                  </div>
                ) : (
                  localMessages.map((msg) => {
                    const isCitizen = msg.sender === "citizen";
                    const isClerk = msg.sender === "clerk";
                    const isInterpreter = msg.sender === "interpreter";
                    const isSystem = msg.sender === "system";
                    const sign = msg.signId ? municipalSigns.find((s) => s.id === msg.signId) : null;

                    return (
                      <div key={msg.id} className={`flex ${isCitizen ? "justify-start" : isSystem ? "justify-center" : "justify-end"}`}>
                        {isSystem ? (
                          <div className="px-4 py-1.5 rounded-full bg-white/5 text-xs text-white/40">{msg.content}</div>
                        ) : (
                          <div className={`max-w-[80%] p-3 rounded-2xl ${
                            isCitizen
                              ? "bg-white/10 rounded-bl-sm"
                              : isInterpreter
                                ? "bg-teal-500/20 border border-teal-500/30 rounded-br-sm"
                                : "bg-gold-400/20 border border-gold-400/30 rounded-br-sm"
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-[10px] text-white/40">
                                {isCitizen ? "Citizen" : isInterpreter ? "Interpreter" : "Clerk"}
                              </p>
                              {msg.confidence !== undefined && msg.confidenceState && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                  msg.confidenceState === "high"
                                    ? "bg-green-500/20 text-green-400"
                                    : msg.confidenceState === "medium"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-red-500/20 text-red-400"
                                }`}>
                                  {Math.round(msg.confidence * 100)}%
                                </span>
                              )}
                              {msg.channel === "isl" && (
                                <span className="text-[10px] text-teal-400/60">ISL</span>
                              )}
                              {msg.channel === "interpreter" && (
                                <span className="text-[10px] text-teal-400/60">Interpreter</span>
                              )}
                              <span className="text-[10px] text-white/20">{formatTimestamp(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm text-white">
                              {sign ? `${sign.symbol} ${sign.name}` : msg.content}
                            </p>
                            {sign && (
                              <div className="mt-1.5 space-y-0.5">
                                <p className="text-[10px] text-gold-400/80">{sign.nameHi}</p>
                                <p className="text-[10px] text-white/30">{sign.description}</p>
                                <p className="text-[10px] text-teal-400/40">Hand: {sign.handHint}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={conversationEndRef} />
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Clerk → Citizen</p>
                  <div className="mb-4 p-3 rounded-xl bg-teal-500/5 border border-teal-500/15">
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-2">
                      Type a basic English sentence
                    </label>
                    <textarea
                      value={customReply}
                      onChange={(e) => updateCustomReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleCustomReply();
                        }
                      }}
                      placeholder="e.g. Please show your bill."
                      rows={2}
                      className="w-full resize-none rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-teal-400/40"
                    />
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[9px] text-white/30 uppercase tracking-wider block">Visual cue</span>
                        <span className="text-xl" aria-label={`Emoji visual: ${customEmoji}`}>{customEmoji}</span>
                      </div>
                      <Button size="sm" onClick={() => void handleCustomReply()} disabled={!customReply.trim()}>
                        Send to Citizen
                      </Button>
                    </div>
                    <p className="mt-2 text-[9px] text-white/25">
                      Emoji is a visual communication aid; it is not a substitute for validated ISL.
                    </p>
                  </div>

                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Quick Replies</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {["all", "general", "documents", "service", "escalation"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setReplyFilter(cat)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          replyFilter === cat ? "bg-gold-400 text-navy-900" : "bg-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                    {filteredReplies.map((reply, i) => {
                      const guidanceSigns = getSignsForReply(reply.text);
                      return (
                        <button
                          key={i}
                          onClick={() => handleClerkReply(reply.text)}
                          className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-gold-400/10 hover:border-gold-400/20 border border-transparent transition-all group"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-sm mt-0.5">{reply.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white/70 group-hover:text-white truncate">{reply.text}</p>
                              <p className="text-[10px] text-white/30 truncate">{reply.textHi}</p>
                              {guidanceSigns.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {guidanceSigns.map((g) => (
                                    <span key={g.signId} className="text-[10px] text-teal-400/60">
                                      {g.symbol}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Session Info</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Messages</span>
                      <span className="text-sm font-medium text-white">{localMessages.filter((m) => m.sender !== "system").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Citizen Signs</span>
                      <span className="text-sm font-medium text-white">{citizenMessages.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Clerk Replies</span>
                      <span className="text-sm font-medium text-white">{clerkMessages.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Interpreter</span>
                      <span className="text-sm font-medium text-white">{hasInterpreter ? "Yes" : "No"}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Duration</span>
                      <span className="text-xs text-white/60">{sessionStartRef.current ? formatDuration(sessionStartRef.current) : "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Session ID</span>
                      <span className="text-[10px] text-white/20 font-mono">{sessionIdRef.current.slice(0, 16)}...</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Service</span>
                      <span className="text-xs text-white/60">{pack?.serviceName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">Department</span>
                      <span className="text-xs text-white/60">{pack?.department || "N/A"}</span>
                    </div>
                  </div>
                </Card>

                {sessionXP > 0 && (
                  <Card className="text-center border-gold-400/30 bg-gradient-to-br from-gold-400/10 to-transparent animate-scale-in">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-2xl font-bold text-gold-400">+{sessionXP} XP</p>
                    <p className="text-xs text-white/50">Session XP earned</p>
                  </Card>
                )}

                <Card className="border-white/5">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Engine Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${engineReady ? "bg-green-400" : "bg-red-400 animate-pulse"}`} />
                      <span className="text-xs text-white/50">{engineReady ? "Recognition engine online" : "Loading engine..."}</span>
                    </div>
                    {engineReady && (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-xs text-white/50">{engineRef.current?.getModelInfo().name || "Recognition Engine"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          <span className="text-xs text-white/50">{engineRef.current?.getSupportedSigns().length || 0} signs trained</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${sessionActive ? "bg-gold-400" : "bg-white/20"}`} />
                      <span className="text-xs text-white/50">{sessionActive ? "Session active" : "No active session"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        camera.cameraState === "running" ? "bg-green-400" :
                        camera.cameraState === "denied" || camera.cameraState === "unsupported" || camera.cameraState === "error" ? "bg-red-400" :
                        "bg-white/20"
                      }`} />
                      <span className="text-xs text-white/50">{CAM_STATE_LABELS[camera.cameraState]}</span>
                    </div>
                    {liveResult && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs text-white/50">Last: {liveResult.signId} ({Math.round(liveResult.confidence * 100)}%)</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
