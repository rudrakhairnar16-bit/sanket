interface SignMapping {
  phrase: string;
  signIds: string[];
  reviewStatus: 'validated' | 'draft';
}

const PHRASE_MAP: Record<string, string[]> = {
  'please': ['please'],
  'hello': ['hello'],
  'thank you': ['thank-you'],
  'thanks': ['thank-you'],
  'help': ['help'],
  'wait': ['wait'],
  'yes': ['yes'],
  'no': ['no'],
  'document': ['document'],
  'bill': ['bill'],
  'payment': ['payment'],
  'receipt': ['receipt'],
  'application': ['application'],
  'name': ['name'],
  'address': ['address'],
  'water': ['water-tax'],
  'tax': ['property-tax'],
  'property': ['property-tax'],
  'certificate': ['birth-certificate'],
  'birth': ['birth-certificate'],
  'complaint': ['complaint'],
  'please show your document': ['please', 'document'],
  'please show your bill': ['please', 'bill'],
  'please show your receipt': ['please', 'receipt'],
  'please sign here': ['please'],
  'please wait': ['please', 'wait'],
  'your payment is being checked': ['payment'],
  'do you need interpreter assistance': ['help'],
  'your application is being checked': ['application'],
};

export function textToSigns(text: string): SignMapping | null {
  const lower = text.toLowerCase().trim();
  
  if (PHRASE_MAP[lower]) {
    return { phrase: text, signIds: PHRASE_MAP[lower], reviewStatus: 'draft' };
  }
  
  let bestMatch: { key: string; signIds: string[] } | null = null;
  for (const [phrase, signIds] of Object.entries(PHRASE_MAP)) {
    if (lower.includes(phrase) && (!bestMatch || phrase.length > bestMatch.key.length)) {
      bestMatch = { key: phrase, signIds };
    }
  }
  
  if (bestMatch) {
    return { phrase: text, signIds: bestMatch.signIds, reviewStatus: 'draft' };
  }
  
  return null;
}

export function hasSignMapping(text: string): boolean {
  return textToSigns(text) !== null;
}

export function getSupportedPhrases(): string[] {
  return Object.keys(PHRASE_MAP);
}
