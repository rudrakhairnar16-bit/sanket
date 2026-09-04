import { municipalSigns } from '@/data/signs/municipal-signs';

export interface SignGuidance {
  signId: string;
  name: string;
  nameHi: string;
  description: string;
  handHint: string;
  handCount: number;
  symbol: string;
  category: string;
}

export function getSignGuidance(signId: string): SignGuidance | null {
  const sign = municipalSigns.find(s => s.id === signId);
  if (!sign) return null;
  return {
    signId: sign.id,
    name: sign.name,
    nameHi: sign.nameHi,
    description: sign.description,
    handHint: sign.handHint,
    handCount: sign.handCount,
    symbol: sign.symbol,
    category: sign.category,
  };
}

export function getSignsForReply(replyText: string): SignGuidance[] {
  const lower = replyText.toLowerCase();
  return municipalSigns
    .filter(sign => sign.keywords.some(kw => lower.includes(kw)))
    .slice(0, 3)
    .map(sign => ({
      signId: sign.id,
      name: sign.name,
      nameHi: sign.nameHi,
      description: sign.description,
      handHint: sign.handHint,
      handCount: sign.handCount,
      symbol: sign.symbol,
      category: sign.category,
    }));
}
