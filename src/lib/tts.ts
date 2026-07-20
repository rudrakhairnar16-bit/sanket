let utterance: SpeechSynthesisUtterance | null = null;

const LANG_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export function speak(text: string, lang: string = "en") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_MAP[lang] || "en-IN";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function isSpeaking(): boolean {
  return window.speechSynthesis?.speaking ?? false;
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
