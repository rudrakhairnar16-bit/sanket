type SpeechCallback = (text: string, final: boolean) => void;
type StatusCallback = (status: "idle" | "listening" | "error") => void;

const LANG_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export class SpeechRecognizer {
  private recognition: any = null;
  private isRunning = false;
  private onResult: SpeechCallback;
  private onStatus: StatusCallback;

  constructor(onResult: SpeechCallback, onStatus: StatusCallback) {
    this.onResult = onResult;
    this.onStatus = onStatus;
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "en-IN";

        this.recognition.onresult = (event: any) => {
          let finalText = "";
          let interimText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalText += transcript;
            } else {
              interimText += transcript;
            }
          }
          if (finalText) this.onResult(finalText, true);
          if (interimText) this.onResult(interimText, false);
        };

        this.recognition.onerror = () => {
          this.isRunning = false;
          this.onStatus("error");
        };

        this.recognition.onend = () => {
          if (this.isRunning) {
            try { this.recognition.start(); } catch {}
          } else {
            this.onStatus("idle");
          }
        };
      }
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  start(lang: string = "en") {
    if (!this.recognition || this.isRunning) return;
    this.isRunning = true;
    this.recognition.lang = LANG_MAP[lang] || "en-IN";
    try { this.recognition.start(); } catch {}
    this.onStatus("listening");
  }

  stop() {
    this.isRunning = false;
    try { this.recognition.stop(); } catch {}
    this.onStatus("idle");
  }

  toggle(lang?: string) {
    if (this.isRunning) this.stop();
    else this.start(lang);
  }

  get running(): boolean {
    return this.isRunning;
  }
}
