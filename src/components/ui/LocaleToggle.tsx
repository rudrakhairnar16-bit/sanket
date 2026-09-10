'use client';
import React from 'react';
import { getLocale, setLocale } from '@/lib/i18n';

export function LocaleToggle() {
  const locale = getLocale();
  
  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60 hover:bg-white/10 transition-all"
    >
      {locale === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
}
