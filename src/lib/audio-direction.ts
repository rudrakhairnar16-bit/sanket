import { speak, stopSpeaking } from './speech';

export function speakCitizenMessage(text: string) {
  speak(text);
}

export function stopAllAudio() {
  stopSpeaking();
}

export function speakClerkResponse(text: string) {
  console.log('[Clerk Response - Visual Only]:', text);
}
