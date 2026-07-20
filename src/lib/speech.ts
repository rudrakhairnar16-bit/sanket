type SpeechCallback = (text: string, final: boolean) => void;
type StatusCallback = (status: "idle" | "listening" | "error" | "not-supported") => void;

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
  private retryCount = 0;
  private maxRetries = 3;

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

        this.recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            this.onStatus("not-supported");
            this.isRunning = false;
          } else if (event.error === "no-speech") {
            // Don't stop on no-speech, just ignore
          } else if (event.error === "network" && this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(() => this.start(), 1000);
          } else {
            this.onStatus("error");
          }
        };

        this.recognition.onend = () => {
          if (this.isRunning) {
            try { this.recognition.start(); } catch (e) {
              console.warn("Failed to restart recognition:", e);
              this.onStatus("idle");
            }
          } else {
            this.onStatus("idle");
          }
        };

        this.recognition.onstart = () => {
          this.retryCount = 0;
          console.log("Speech recognition started");
        };
      }
    }
  }

  isSupported(): boolean {
    if (typeof window === "undefined") return false;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    return !!SpeechRecognition;
  }

  start(lang: string = "en") {
    if (!this.recognition) {
      this.onStatus("not-supported");
      return;
    }
    if (this.isRunning) return;
    this.isRunning = true;
    this.recognition.lang = LANG_MAP[lang] || "en-IN";
    try { this.recognition.start(); } catch (e) {
      console.error("Failed to start speech recognition:", e);
      this.isRunning = false;
      this.onStatus("error");
    }
    this.onStatus("listening");
  }

  stop() {
    this.isRunning = false;
    try { this.recognition?.stop(); } catch {}
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
