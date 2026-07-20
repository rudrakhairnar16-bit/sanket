export interface SignEntry {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  description: string;
  hint: string;
  icon: string;
  category: "greeting" | "basic" | "service" | "document" | "civic";
  handCount: 1 | 2;
}

export const MUNICIPAL_SIGNS: SignEntry[] = [
  // Greetings
  { id: "namaste", name: "Namaste", nameHi: "नमस्ते", nameMr: "नमस्कार", description: "Press both palms together", hint: "Both hands, palms touching, fingers up", icon: "🙏", category: "greeting", handCount: 2 },
  { id: "thank_you", name: "Thank You", nameHi: "धन्यवाद", nameMr: "धन्यवाद", description: "Open palm near chin, move outward", hint: "One hand, all fingers open, palm facing camera", icon: "👋", category: "greeting", handCount: 1 },
  { id: "sorry", name: "Sorry", nameHi: "माफ़ कीजिए", nameMr: "माफ करा", description: "Rub chest in circular motion with fist", hint: "Closed fist rotating on chest", icon: "😔", category: "greeting", handCount: 1 },
  { id: "please", name: "Please", nameHi: "कृपया", nameMr: "कृपया", description: "Open palm on chest, move in circle", hint: "Palm facing chest, circular motion", icon: "🤲", category: "greeting", handCount: 1 },

  // Basic
  { id: "yes", name: "Yes", nameHi: "हाँ", nameMr: "होय", description: "Fist nodding up and down", hint: "Closed fist, thumb on top, nod", icon: "✊", category: "basic", handCount: 1 },
  { id: "no", name: "No", nameHi: "नहीं", nameMr: "नाही", description: "Index and middle finger form V, twist wrist", hint: "Two fingers up, twist side to side", icon: "🙅", category: "basic", handCount: 1 },
  { id: "wait", name: "Wait", nameHi: "रुको", nameMr: "थांबा", description: "Open palm facing outward", hint: "All fingers extended, palm to camera", icon: "✋", category: "basic", handCount: 1 },
  { id: "help", name: "Help", nameHi: "मदद", nameMr: "मदत", description: "Fist on palm, both hands stacked", hint: "One fist resting on other palm", icon: "🆘", category: "basic", handCount: 2 },
  { id: "understand", name: "Understand", nameHi: "समझ गया", nameMr: "समजलं", description: "Index finger taps side of head", hint: "Finger to temple, slight nod", icon: "🤔", category: "basic", handCount: 1 },
  { id: "dont_understand", name: "Don't Understand", nameHi: "समझ नहीं आया", nameMr: "समजलं नाही", description: "Head shake + palms up shrug", hint: "Shrug with palms up, shake head", icon: "🤷", category: "basic", handCount: 2 },

  // Services
  { id: "water", name: "Water", nameHi: "पानी", nameMr: "पाणी", description: "W handshape tap on chin", hint: "Three fingers up (W), tap chin", icon: "💧", category: "service", handCount: 1 },
  { id: "tax", name: "Tax", nameHi: "टैक्स", nameMr: "कर", description: "T handshape tap on chest", hint: "Point to chest with thumb up (T)", icon: "💰", category: "service", handCount: 1 },
  { id: "bill", name: "Bill", nameHi: "बिल", nameMr: "बिल", description: "Open palm slides across other palm", hint: "One palm slides over the other", icon: "🧾", category: "service", handCount: 2 },
  { id: "payment", name: "Payment", nameHi: "भुगतान", nameMr: "देयक", description: "Hand passes money to other hand", hint: "Give-and-receive gesture", icon: "💳", category: "service", handCount: 2 },
  { id: "certificate", name: "Certificate", nameHi: "प्रमाणपत्र", nameMr: "प्रमाणपत्र", description: "Both hands show rectangular shape", hint: "Both hands outline a rectangle", icon: "📜", category: "document", handCount: 2 },

  // Documents
  { id: "form", name: "Form", nameHi: "फ़ॉर्म", nameMr: "फॉर्म", description: "Writing motion on palm", hint: "Write on open palm with finger", icon: "📝", category: "document", handCount: 2 },
  { id: "document", name: "Document", nameHi: "दस्तावेज़", nameMr: "दस्तऐवज", description: "Hands show paper size, then part", hint: "Flat hands, open like a book", icon: "📄", category: "document", handCount: 2 },
  { id: "name", name: "Name", nameHi: "नाम", nameMr: "नाव", description: "N handshape tap on chest", hint: "Index + middle fingers on chest", icon: "🏷️", category: "document", handCount: 1 },
  { id: "address", name: "Address", nameHi: "पता", nameMr: "पत्ता", description: "A handshape moves forward", hint: "Thumb out (A), push forward", icon: "📍", category: "document", handCount: 1 },
  { id: "phone", name: "Phone", nameHi: "फ़ोन", nameMr: "फोन", description: "Y handshape near ear", hint: "Pinky + thumb out, near ear", icon: "📞", category: "civic", handCount: 1 },

  // Civic
  { id: "number", name: "Number", nameHi: "नंबर", nameMr: "क्रमांक", description: "Both hands show digits", hint: "Show number with fingers", icon: "🔢", category: "civic", handCount: 2 },
  { id: "date", name: "Date", nameHi: "तारीख़", nameMr: "तारीख", description: "D handshape tap on wrist", hint: "Index finger pointing, tap wrist", icon: "📅", category: "civic", handCount: 1 },
  { id: "time", name: "Time", nameHi: "समय", nameMr: "वेळ", description: "Point to wrist like watch", hint: "Tap wrist where watch sits", icon: "⏰", category: "civic", handCount: 1 },
  { id: "office", name: "Office", nameHi: "कार्यालय", nameMr: "कार्यालय", description: "O handshape circle outward", hint: "Circle shape with fingers, push out", icon: "🏢", category: "civic", handCount: 1 },
  { id: "complaint", name: "Complaint", nameHi: "शिकायत", nameMr: "तक्रार", description: "Open palm taps chest twice", hint: "Palm to chest, two taps", icon: "📋", category: "civic", handCount: 1 },
];

export const SIGN_MAP = new Map(MUNICIPAL_SIGNS.map((s) => [s.id, s]));
export const SIGN_IDS = MUNICIPAL_SIGNS.map((s) => s.id);

export function getLocalizedName(sign: SignEntry, lang: string): string {
  if (lang === "hi") return sign.nameHi;
  if (lang === "mr") return sign.nameMr;
  return sign.name;
}

export const CATEGORY_LABELS: Record<string, string> = {
  greeting: "Greetings",
  basic: "Basic Conversation",
  service: "Services",
  document: "Documents & Forms",
  civic: "Civic & Office",
};
