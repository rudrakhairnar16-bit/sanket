export function speak(text: string, lang: string = "en-US"): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      mr: "mr-IN",
      gu: "gu-IN",
    };
    utterance.lang = langMap[lang] || lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function speakClerkReply(text: string, lang: string = "en") {
  return speak(text, lang);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getVoicesForLang(lang: string): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  const voices = window.speechSynthesis.getVoices();
  const langMap: Record<string, string> = {
    en: "en",
    hi: "hi",
    mr: "mr",
    gu: "gu",
  };
  return voices.filter((v) => v.lang.startsWith(langMap[lang] || lang));
}
