let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {}
}

export function playCorrect() {
  playTone(523.25, 0.15, "sine", 0.2);
  setTimeout(() => playTone(659.25, 0.15, "sine", 0.2), 100);
  setTimeout(() => playTone(783.99, 0.2, "sine", 0.2), 200);
}

export function playIncorrect() {
  playTone(330, 0.3, "sawtooth", 0.15);
  setTimeout(() => playTone(262, 0.4, "sawtooth", 0.15), 200);
}

export function playLevelUp() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, "sine", 0.2), i * 120);
  });
}

export function playClick() {
  playTone(800, 0.05, "sine", 0.1);
}

export function playNotification() {
  playTone(880, 0.1, "sine", 0.15);
  setTimeout(() => playTone(1100, 0.15, "sine", 0.15), 100);
}
