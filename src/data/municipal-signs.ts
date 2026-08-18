export interface SignEntry {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  nameGu: string;
  description: string;
  hint: string;
  icon: string;
  islSymbol: string;
  category: "greeting" | "basic" | "service" | "document" | "civic";
  handCount: 1 | 2;
}

export const MUNICIPAL_SIGNS: SignEntry[] = [
  // Greetings
  { id: "namaste", name: "Namaste", nameHi: "नमस्ते", nameMr: "नमस्कार", nameGu: "નમસ્તે", description: "Press both palms together", hint: "Both hands, palms touching, fingers up", icon: "🙏", islSymbol: "🙏", category: "greeting", handCount: 2 },
  { id: "thank_you", name: "Thank You", nameHi: "धन्यवाद", nameMr: "धन्यवाद", nameGu: "ધન્યવાદ", description: "Open palm near chin, move outward", hint: "One hand, all fingers open, palm facing camera", icon: "👋", islSymbol: "👋", category: "greeting", handCount: 1 },
  { id: "sorry", name: "Sorry", nameHi: "माफ़ कीजिए", nameMr: "माफ करा", nameGu: "માફ કરશો", description: "Rub chest in circular motion with fist", hint: "Closed fist rotating on chest", icon: "😔", islSymbol: "😔", category: "greeting", handCount: 1 },
  { id: "please", name: "Please", nameHi: "कृपया", nameMr: "कृपया", nameGu: "કૃપા કરીને", description: "Open palm on chest, move in circle", hint: "Palm facing chest, circular motion", icon: "🤲", islSymbol: "🤲", category: "greeting", handCount: 1 },

  // Basic
  { id: "yes", name: "Yes", nameHi: "हाँ", nameMr: "होय", nameGu: "હા", description: "Fist nodding up and down", hint: "Closed fist, thumb on top, nod", icon: "✊", islSymbol: "✊", category: "basic", handCount: 1 },
  { id: "no", name: "No", nameHi: "नहीं", nameMr: "नाही", nameGu: "ના", description: "Index and middle finger form V, twist wrist", hint: "Two fingers up, twist side to side", icon: "🙅", islSymbol: "🙅", category: "basic", handCount: 1 },
  { id: "wait", name: "Wait", nameHi: "रुको", nameMr: "थांबा", nameGu: "રાહ જુઓ", description: "Open palm facing outward", hint: "All fingers extended, palm to camera", icon: "✋", islSymbol: "✋", category: "basic", handCount: 1 },
  { id: "help", name: "Help", nameHi: "मदद", nameMr: "मदत", nameGu: "મદદ", description: "Fist on palm, both hands stacked", hint: "One fist resting on other palm", icon: "🆘", islSymbol: "🆘", category: "basic", handCount: 2 },
  { id: "understand", name: "Understand", nameHi: "समझ गया", nameMr: "समजलं", nameGu: "સમજાયું", description: "Index finger taps side of head", hint: "Finger to temple, slight nod", icon: "🤔", islSymbol: "🤔", category: "basic", handCount: 1 },
  { id: "dont_understand", name: "Don't Understand", nameHi: "समझ नहीं आया", nameMr: "समजलं नाही", nameGu: "સમજાયું નહીં", description: "Head shake + palms up shrug", hint: "Shrug with palms up, shake head", icon: "🤷", islSymbol: "🤷", category: "basic", handCount: 2 },

  // Services
  { id: "water", name: "Water", nameHi: "पानी", nameMr: "पाणी", nameGu: "પાણી", description: "W handshape tap on chin", hint: "Three fingers up (W), tap chin", icon: "💧", islSymbol: "💧", category: "service", handCount: 1 },
  { id: "tax", name: "Tax", nameHi: "टैक्स", nameMr: "कर", nameGu: "કર", description: "T handshape tap on chest", hint: "Point to chest with thumb up (T)", icon: "💰", islSymbol: "💰", category: "service", handCount: 1 },
  { id: "bill", name: "Bill", nameHi: "बिल", nameMr: "बिल", nameGu: "બિલ", description: "Open palm slides across other palm", hint: "One palm slides over the other", icon: "🧾", islSymbol: "🧾", category: "service", handCount: 2 },
  { id: "payment", name: "Payment", nameHi: "भुगतान", nameMr: "देयक", nameGu: "ચુકવણી", description: "Hand passes money to other hand", hint: "Give-and-receive gesture", icon: "💳", islSymbol: "💳", category: "service", handCount: 2 },
  { id: "certificate", name: "Certificate", nameHi: "प्रमाणपत्र", nameMr: "प्रमाणपत्र", nameGu: "પ્રમાણપત્ર", description: "Both hands show rectangular shape", hint: "Both hands outline a rectangle", icon: "📜", islSymbol: "📜", category: "document", handCount: 2 },

  // Documents
  { id: "form", name: "Form", nameHi: "फ़ॉर्म", nameMr: "फॉर्म", nameGu: "ફોર્મ", description: "Writing motion on palm", hint: "Write on open palm with finger", icon: "📝", islSymbol: "📝", category: "document", handCount: 2 },
  { id: "document", name: "Document", nameHi: "दस्तावेज़", nameMr: "दस्तऐवज", nameGu: "દસ્તાવેજ", description: "Hands show paper size, then part", hint: "Flat hands, open like a book", icon: "📄", islSymbol: "📄", category: "document", handCount: 2 },
  { id: "name", name: "Name", nameHi: "नाम", nameMr: "नाव", nameGu: "નામ", description: "N handshape tap on chest", hint: "Index + middle fingers on chest", icon: "🏷️", islSymbol: "🏷️", category: "document", handCount: 1 },
  { id: "address", name: "Address", nameHi: "पता", nameMr: "पत्ता", nameGu: "સરનામું", description: "A handshape moves forward", hint: "Thumb out (A), push forward", icon: "📍", islSymbol: "📍", category: "document", handCount: 1 },
  { id: "phone", name: "Phone", nameHi: "फ़ोन", nameMr: "फोन", nameGu: "ફોન", description: "Y handshape near ear", hint: "Pinky + thumb out, near ear", icon: "📞", islSymbol: "📞", category: "civic", handCount: 1 },

  // Civic
  { id: "number", name: "Number", nameHi: "नंबर", nameMr: "क्रमांक", nameGu: "નંબર", description: "Both hands show digits", hint: "Show number with fingers", icon: "🔢", islSymbol: "🔢", category: "civic", handCount: 2 },
  { id: "date", name: "Date", nameHi: "तारीख़", nameMr: "तारीख", nameGu: "તારીખ", description: "D handshape tap on wrist", hint: "Index finger pointing, tap wrist", icon: "📅", islSymbol: "📅", category: "civic", handCount: 1 },
  { id: "time", name: "Time", nameHi: "समय", nameMr: "वेळ", nameGu: "સમય", description: "Point to wrist like watch", hint: "Tap wrist where watch sits", icon: "⏰", islSymbol: "⏰", category: "civic", handCount: 1 },
  { id: "office", name: "Office", nameHi: "कार्यालय", nameMr: "कार्यालय", nameGu: "કાર્યાલય", description: "O handshape circle outward", hint: "Circle shape with fingers, push out", icon: "🏢", islSymbol: "🏢", category: "civic", handCount: 1 },
  { id: "complaint", name: "Complaint", nameHi: "शिकायत", nameMr: "तक्रार", nameGu: "ફરિયાદ", description: "Open palm taps chest twice", hint: "Palm to chest, two taps", icon: "📋", islSymbol: "📋", category: "civic", handCount: 1 },
  { id: "hospital", name: "Hospital", nameHi: "अस्पताल", nameMr: "रुग्णालय", nameGu: "હોસ્પિટલ", description: "Cross on forehead with index finger", hint: "Draw cross on forehead", icon: "🏥", islSymbol: "🏥", category: "civic", handCount: 1 },
  { id: "police", name: "Police", nameHi: "पुलिस", nameMr: "पोलिस", nameGu: "પોલીસ", description: "Salute motion from forehead", hint: "Hand to forehead in salute", icon: "👮", islSymbol: "👮", category: "civic", handCount: 1 },
  { id: "school", name: "School", nameHi: "स्कूल", nameMr: "शाळा", nameGu: "શાળા", description: "Clap hands then open like book", hint: "Clap once, open palms", icon: "🏫", islSymbol: "🏫", category: "civic", handCount: 2 },
  { id: "bank", name: "Bank", nameHi: "बैंक", nameMr: "बँक", nameGu: "બેંક", description: "B handshape circle on palm", hint: "Form B, circle on other palm", icon: "🏦", islSymbol: "🏦", category: "service", handCount: 2 },
  { id: "emergency", name: "Emergency", nameHi: "आपातकाल", nameMr: "आणीबाणी", nameGu: "કટોકટી", description: "Both fists shake above head", hint: "Two fists shaking overhead", icon: "🚨", islSymbol: "🚨", category: "civic", handCount: 2 },
  { id: "toilet", name: "Toilet", nameHi: "शौचालय", nameMr: "स्वच्छतागृह", nameGu: "શૌચાલય", description: "T handshape shakes side to side", hint: "T hand, twist wrist", icon: "🚻", islSymbol: "🚻", category: "basic", handCount: 1 },
  { id: "drink", name: "Drink", nameHi: "पीना", nameMr: "पिणे", nameGu: "પીવું", description: "C handshape tilts toward mouth", hint: "C shape hand, tilt to mouth", icon: "🥤", islSymbol: "🥤", category: "basic", handCount: 1 },
  { id: "eat", name: "Eat", nameHi: "खाना", nameMr: "खाणे", nameGu: "ખાવું", description: "Pinched fingers move toward mouth", hint: "Fingers pinched, move to mouth", icon: "🍽️", islSymbol: "🍽️", category: "basic", handCount: 1 },
  { id: "sick", name: "Sick", nameHi: "बीमार", nameMr: "आजारी", nameGu: "બીમાર", description: "Palm on forehead, lean back", hint: "Palm to forehead, slight lean", icon: "🤒", islSymbol: "🤒", category: "basic", handCount: 1 },
];

export const SIGN_MAP = new Map(MUNICIPAL_SIGNS.map((s) => [s.id, s]));
export const SIGN_IDS = MUNICIPAL_SIGNS.map((s) => s.id);

export function getLocalizedName(sign: SignEntry, lang: string): string {
  if (lang === "hi") return sign.nameHi;
  if (lang === "mr") return sign.nameMr;
  if (lang === "gu") return sign.nameGu;
  return sign.name;
}

export function resolveSignIdFromModuleTitle(title: string): string {
  const lower = " " + title.toLowerCase() + " ";
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.signId;
    }
  }
  return "";
}

const KEYWORD_MAP: { keywords: string[]; signId: string }[] = [
  { keywords: ["namaste", "namaskar", "hello", "hi ", "greet"], signId: "namaste" },
  { keywords: ["thank", "dhanyavaad", "धन्यवाद", "thanks"], signId: "thank_you" },
  { keywords: ["sorry", "maaf", "माफ"], signId: "sorry" },
  { keywords: ["please", "kripaya", "कृपया"], signId: "please" },
  { keywords: ["yes", "haan", "हाँ", "होय"], signId: "yes" },
  { keywords: ["no", "nahi", "नहीं", "नाही"], signId: "no" },
  { keywords: ["wait", "ruko", "थांबा", "stop"], signId: "wait" },
  { keywords: ["help", "madad", "मदद", "मदत"], signId: "help" },
  { keywords: ["understand", "samaj", "समझ"], signId: "understand" },
  { keywords: ["dont understand", "नहीं आया", "नाही", "samjla nahi"], signId: "dont_understand" },
  { keywords: ["water", "pani", "पानी", "पाणी", "drink"], signId: "water" },
  { keywords: ["tax", "कर", "kar"], signId: "tax" },
  { keywords: ["bill", "बिल", "बिल"], signId: "bill" },
  { keywords: ["payment", "bhugtan", "भुगतान", "देयक", "pay"], signId: "payment" },
  { keywords: ["certificate", "प्रमाणपत्र", "प्रमाण"], signId: "certificate" },
  { keywords: ["form", "फॉर्म", "फ़ॉर्म", "form"], signId: "form" },
  { keywords: ["document", "dastavez", "दस्तावेज", "दस्तऐवज", "paper", "docs"], signId: "document" },
  { keywords: ["name", "naam", "नाम", "नाव"], signId: "name" },
  { keywords: ["address", "pata", "पता", "पत्ता"], signId: "address" },
  { keywords: ["phone", "fon", "फोन", "call", "बोल"], signId: "phone" },
  { keywords: ["number", "numbar", "नंबर", "क्रमांक", "mobile"], signId: "number" },
  { keywords: ["date", "tarikh", "तारीख", "तारीख"], signId: "date" },
  { keywords: ["time", "samay", "समय", "वेळ"], signId: "time" },
  { keywords: ["office", "karyalay", "कार्यालय", "department"], signId: "office" },
  { keywords: ["complaint", "shikayat", "शिकायत", "तक्रार", "problem", "issue"], signId: "complaint" },
];

export interface ISLToken {
  signId: string;
  symbol: string;
  label: string;
}

export function textToISL(text: string, lang: string = "en"): ISLToken[] {
  const lower = " " + text.toLowerCase() + " ";
  const tokens: ISLToken[] = [];
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      const sign = SIGN_MAP.get(entry.signId);
      if (sign) {
        tokens.push({
          signId: sign.id,
          symbol: sign.islSymbol,
          label: getLocalizedName(sign, lang),
        });
      }
    }
  }
  return tokens;
}


export const CATEGORY_LABELS: Record<string, string> = {
  greeting: "Greetings",
  basic: "Basic Conversation",
  service: "Services",
  document: "Documents & Forms",
  civic: "Civic & Office",
};
