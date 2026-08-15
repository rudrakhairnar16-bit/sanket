let utterance: SpeechSynthesisUtterance | null = null;
let audioEl: HTMLAudioElement | null = null;

export const SUPPORTED_LANGS = ["en", "hi", "mr", "gu"] as const;
export type LangCode = (typeof SUPPORTED_LANGS)[number];

const LANG_MAP: Record<LangCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  gu: "gu-IN",
};

const TTS_TL: Record<LangCode, string> = {
  en: "en",
  hi: "hi",
  mr: "mr",
  gu: "gu",
};

let voicesCache: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesCache = voices;
    voicesLoaded = true;
  }
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  // Some browsers populate voices asynchronously after the page loads.
  window.speechSynthesis.addEventListener?.("voiceschanged", () => loadVoices());
}

function findVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (!voicesLoaded) loadVoices();
  const code = (LANG_MAP[lang as LangCode] || "en-IN").toLowerCase();
  const base = code.split("-")[0];
  const normalized = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  return (
    voicesCache.find((v) => normalized(v) === code) ||
    voicesCache.find((v) => normalized(v).startsWith(base)) ||
    undefined
  );
}

function speakOnline(text: string, lang: string) {
  if (typeof window === "undefined") return;
  stopOnline();
  const tl = TTS_TL[lang as LangCode] || "en";
  const url = `/api/tts?tl=${tl}&text=${encodeURIComponent(text)}`;
  audioEl = new Audio(url);
  audioEl.play().catch(() => {});
}

function stopOnline() {
  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
    audioEl = null;
  }
}

export function speak(text: string, lang: string = "en") {
  if (typeof window === "undefined") return;
  stopOnline();

  const hasSpeech = "speechSynthesis" in window;
  const voice = hasSpeech ? findVoice(lang) : undefined;

  // No matching local voice (e.g. Hindi/Marathi/Gujarati not installed) —
  // fall back to Google's TTS audio so the phrase is still spoken aloud.
  if (!voice) {
    speakOnline(text, lang);
    return;
  }

  window.speechSynthesis.cancel();
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice.lang;
  utterance.voice = voice;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function isSpeaking(): boolean {
  return window.speechSynthesis?.speaking ?? false;
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  window.speechSynthesis?.cancel();
  stopOnline();
}