export interface SignData {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  nameGu: string;
  category: string;
  description: string;
  handHint: string;
  handCount: 1 | 2;
  keywords: string[];
  symbol: string;
  image?: string;
  source: string;
  sourceUrl: string;
  reviewStatus: "approved" | "under-review" | "draft";
  version: number;
}

export const municipalSigns: SignData[] = [
  // Greetings
  { id: "namaste", name: "Namaste", nameHi: "नमस्ते", nameMr: "नमस्कार", nameGu: "નમસ્તે", category: "Greetings", description: "Traditional Indian greeting with palms together", handHint: "Palms together, slight bow", handCount: 2, keywords: ["hello", "greeting", "namaste", "namaskar"], symbol: "🙏", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "thank-you", name: "Thank You", nameHi: "धन्यवाद", nameMr: "धन्यवाद", nameGu: "આભાર", category: "Greetings", description: "Touch forehead with fingertips, move hand forward", handHint: "Fingertips to forehead, move forward", handCount: 1, keywords: ["thanks", "thank you", "shukriya", "dhanyavaad"], symbol: "🙏", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "sorry", name: "Sorry", nameHi: "माफ़ कीजिए", nameMr: "माफ करा", nameGu: "માફ કરશો", category: "Greetings", description: "Make a circle on chest with fist", handHint: "Fist circling on chest", handCount: 1, keywords: ["sorry", "apologize", "maaf", "kshama"], symbol: "😔", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "please", name: "Please", nameHi: "कृपया", nameMr: "कृपया", nameGu: "કૃપા કરી", category: "Greetings", description: "Rub palm in circular motion on chest", handHint: "Open palm, circular motion on chest", handCount: 1, keywords: ["please", "request", "kripya", "daya"], symbol: "🤲", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  // Basic
  { id: "yes", name: "Yes", nameHi: "हाँ", nameMr: "होय", nameGu: "હા", category: "Basic", description: "Make a fist and nod it up and down", handHint: "Fist nodding up and down", handCount: 1, keywords: ["yes", "haan", "ho", "ha"], symbol: "👍", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "no", name: "No", nameHi: "नहीं", nameMr: "नाही", nameGu: "ના", category: "Basic", description: "Index and middle finger extend, snap down", handHint: "Two fingers snapping down", handCount: 1, keywords: ["no", "nahi", "nahin", "na"], symbol: "👎", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "wait", name: "Wait", nameHi: "प्रतीक्षा", nameMr: "थांबा", nameGu: "રાહ જુઓ", category: "Basic", description: "Hold hand up, palm facing forward", handHint: "Open palm facing forward, hold steady", handCount: 1, keywords: ["wait", "hold", "pause", "ruko", "thamba"], symbol: "✋", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "help", name: "Help", nameHi: "मदद", nameMr: "मदत", nameGu: "મદદ", category: "Basic", description: "Fist on open palm, push forward", handHint: "Right fist on left palm, push forward", handCount: 2, keywords: ["help", "assist", "madad", "madat", "sahayata"], symbol: "🆘", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "understand", name: "Understand", nameHi: "समझना", nameMr: "समजणे", nameGu: "સમજવું", category: "Basic", description: "Index finger touches forehead, then fist closes", handHint: "Point to forehead, then close fist", handCount: 1, keywords: ["understand", "samajh", "samajhna"], symbol: "💡", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "dont-understand", name: "Don't Understand", nameHi: "नहीं समझा", nameMr: "समजलं नाही", nameGu: "સમજાયું નથી", category: "Basic", description: "Index finger near forehead, wave side to side", handHint: "Index finger waving near forehead", handCount: 1, keywords: ["don't understand", "confused", "nahi samajh"], symbol: "😕", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "toilet", name: "Toilet", nameHi: "शौचालय", nameMr: "शौचालय", nameGu: "શૌચાલય", category: "Basic", description: "Make T-shape with index fingers", handHint: "Two index fingers forming T", handCount: 2, keywords: ["toilet", "washroom", "bathroom", "shauchalay"], symbol: "🚻", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  // Services
  { id: "water", name: "Water", nameHi: "पानी", nameMr: "पाणी", nameGu: "પાણી", category: "Services", description: "Wiggle fingers downward like flowing water", handHint: "Fingers wiggling downward", handCount: 1, keywords: ["water", "paani", "pani", "jal"], symbol: "💧", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "tax", name: "Tax", nameHi: "कर", nameMr: "कर", nameGu: "કર", category: "Services", description: "T-shape with hands, tap twice", handHint: "T-shape tapping motion", handCount: 2, keywords: ["tax", "kar", "bhugtan"], symbol: "💰", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "bill", name: "Bill", nameHi: "बिल", nameMr: "बिल", nameGu: "બિલ", category: "Services", description: "Flat palm, draw rectangle in air", handHint: "Draw rectangle in air with flat hand", handCount: 1, keywords: ["bill", "bill receipt", "invoice", "bil"], symbol: "📄", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "payment", name: "Payment", nameHi: "भुगतान", nameMr: "पेमेंट", nameGu: "ચુકવણી", category: "Services", description: "One hand flat, other hand slides across", handHint: "Right hand slides across left palm", handCount: 2, keywords: ["payment", "pay", "bhugtan", "dena"], symbol: "💳", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "bank", name: "Bank", nameHi: "बैंक", nameMr: "बँक", nameGu: "બેંક", category: "Services", description: "Make building shape with hands", handHint: "Hands forming building shape", handCount: 2, keywords: ["bank", "banking", "finance"], symbol: "🏦", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  // Documents
  { id: "certificate", name: "Certificate", nameHi: "प्रमाणपत्र", nameMr: "प्रमाणपत्र", nameGu: "પ્રમાણપત્ર", category: "Documents", description: "Make rectangular shape with both hands", handHint: "Both hands forming rectangle", handCount: 2, keywords: ["certificate", "pramanpatra", "document"], symbol: "📜", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "form", name: "Form", nameHi: "फॉर्म", nameMr: "फॉर्म", nameGu: "ફોર્મ", category: "Documents", description: "Draw horizontal lines in air", handHint: "Drawing lines in air like writing", handCount: 1, keywords: ["form", "application", "patra", "arj"], symbol: "📝", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "document", name: "Document", nameHi: "दस्तावेज़", nameMr: "दस्तऐवज", nameGu: "દસ્તાવેજ", category: "Documents", description: "Hold hands apart like holding paper", handHint: "Both hands holding imaginary paper", handCount: 2, keywords: ["document", "dastavej", "kagaz", "patra"], symbol: "📋", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "name", name: "Name", nameHi: "नाम", nameMr: "नाव", nameGu: "નામ", category: "Documents", description: "Tap chest with index finger twice", handHint: "Index finger tapping chest", handCount: 1, keywords: ["name", "naam", "naav"], symbol: "📛", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "address", name: "Address", nameHi: "पता", nameMr: "पत्ता", nameGu: "સરનામું", category: "Documents", description: "Draw house shape then point down", handHint: "Drawing house shape then pointing down", handCount: 1, keywords: ["address", "pata", "patta", "ghar"], symbol: "📍", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  // Civic
  { id: "phone", name: "Phone", nameHi: "फ़ोन", nameMr: "फोन", nameGu: "ફોન", category: "Civic", description: "Make phone shape with hand", handHint: "Little finger and thumb extended", handCount: 1, keywords: ["phone", "mobile", "call", "fono"], symbol: "📱", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "number", name: "Number", nameHi: "संख्या", nameMr: "संख्या", nameGu: "સંખ્યા", category: "Civic", description: "Tap index finger on open palm", handHint: "Index finger tapping open palm", handCount: 2, keywords: ["number", "digit", "sankhya", "ank"], symbol: "🔢", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "date", name: "Date", nameHi: "तिथि", nameMr: "तारीख", nameGu: "તારીખ", category: "Civic", description: "Write date shape in air", handHint: "Drawing calendar shape in air", handCount: 1, keywords: ["date", "tithi", "tarikh", "din"], symbol: "📅", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "time", name: "Time", nameHi: "समय", nameMr: "वेळ", nameGu: "સમય", category: "Civic", description: "Tap wrist like pointing to watch", handHint: "Tap wrist where watch would be", handCount: 1, keywords: ["time", "samay", "vel", "waqt"], symbol: "⏰", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "office", name: "Office", nameHi: "कार्यालय", nameMr: "कार्यालय", nameGu: "કાર્યાલય", category: "Civic", description: "Make roof shape with hands", handHint: "Hands forming roof shape", handCount: 2, keywords: ["office", "karyalay", "karyalaya"], symbol: "🏢", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "complaint", name: "Complaint", nameHi: "शिकायत", nameMr: "तक्रार", nameGu: "ફરિયાદ", category: "Civic", description: "Wavy hand near head, frowning gesture", handHint: "Hand waving near head with frown", handCount: 1, keywords: ["complaint", "shikayat", "takrar", "fariyaad"], symbol: "📢", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "hospital", name: "Hospital", nameHi: "अस्पताल", nameMr: "रुग्णालय", nameGu: "હોસ્પિટલ", category: "Civic", description: "Draw cross shape on arm", handHint: "Drawing cross on upper arm", handCount: 1, keywords: ["hospital", "aspatal", "rugnalay"], symbol: "🏥", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "police", name: "Police", nameHi: "पुलिस", nameMr: "पोलीस", nameGu: "પોલીસ", category: "Civic", description: "Make badge shape on chest", handHint: "Drawing badge shape on chest", handCount: 1, keywords: ["police", "thana", "kotham"], symbol: "🚔", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "school", name: "School", nameHi: "विद्यालय", nameMr: "शाळा", nameGu: "શાળા", category: "Civic", description: "Clap hands twice, then open palms", handHint: "Two claps then open palms", handCount: 2, keywords: ["school", "vidyalaya", "shala"], symbol: "🏫", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "emergency", name: "Emergency", nameHi: "आपातकाल", nameMr: "आणीबाणी", nameGu: "આંતરીય", category: "Civic", description: "Wave both hands rapidly", handHint: "Both hands waving rapidly", handCount: 2, keywords: ["emergency", "urgent", "aapatkal", "aaniibaaNii"], symbol: "🚨", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  // Daily Life
  { id: "drink", name: "Drink", nameHi: "पीना", nameMr: "पिणे", nameGu: "પીવું", category: "Daily Life", description: "Make cup shape, bring to mouth", handHint: "Cupped hand bringing to mouth", handCount: 1, keywords: ["drink", "water", "peena", "pine"], symbol: "🥤", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "eat", name: "Eat", nameHi: "खाना", nameMr: "खाणे", nameGu: "ખાવું", category: "Daily Life", description: "Bring fingers to mouth repeatedly", handHint: "Fingertips bringing to mouth", handCount: 1, keywords: ["eat", "food", "khana", "khane"], symbol: "🍽️", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
  { id: "sick", name: "Sick", nameHi: "बीमार", nameMr: "आजारी", nameGu: "બીમાર", category: "Daily Life", description: "Hand on forehead, sway slightly", handHint: "Hand on forehead with slight sway", handCount: 1, keywords: ["sick", "ill", "bimar", "aajaari"], symbol: "🤒", source: "Sanket prototype reference — ISLRTC validation pending", sourceUrl: "https://islrtc.nic.in", reviewStatus: "under-review", version: 1 },
];

export const signCategories = [
  { id: "greetings", name: "Greetings", nameHi: "अभिवादन", icon: "🙏", count: 4 },
  { id: "basic", name: "Basic", nameHi: "बुनियादी", icon: "✋", count: 7 },
  { id: "services", name: "Services", nameHi: "सेवाएं", icon: "🏢", count: 5 },
  { id: "documents", name: "Documents", nameHi: "दस्तावेज़", icon: "📄", count: 5 },
  { id: "civic", name: "Civic", nameHi: "नागरिक", icon: "🏛️", count: 10 },
  { id: "daily-life", name: "Daily Life", nameHi: "दैनिक जीवन", icon: "🏠", count: 3 },
];

export function getSignById(id: string): SignData | undefined {
  return municipalSigns.find((s) => s.id === id);
}

export function getSignsByCategory(category: string): SignData[] {
  return municipalSigns.filter((s) => s.category.toLowerCase() === category.toLowerCase());
}

export function searchSigns(query: string): SignData[] {
  const q = query.toLowerCase();
  return municipalSigns.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.nameHi.includes(q) ||
      s.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

export function getSignsByIds(ids: string[]): SignData[] {
  return municipalSigns.filter((s) => ids.includes(s.id));
}
