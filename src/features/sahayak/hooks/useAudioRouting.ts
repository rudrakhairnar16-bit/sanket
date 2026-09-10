'use client';
import { useCallback } from 'react';
import { speak, stopSpeaking } from '@/lib/speech';

export function useAudioRouting() {
  const playForRecipient = useCallback(async (recipient: 'clerk' | 'citizen', text: string, lang?: string) => {
    if (recipient === 'clerk') {
      await speak(text, lang || 'en');
    }
  }, []);

  const stopAll = useCallback(() => {
    stopSpeaking();
  }, []);

  return { playForRecipient, stopAll };
}
