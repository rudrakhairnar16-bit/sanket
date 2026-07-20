export interface SignEntry {
  id: string;
  name: string;
  description: string;
  hint: string;
  icon: string;
  category: "greeting" | "basic" | "service" | "document" | "civic";
  handCount: 1 | 2;
}

export const MUNICIPAL_SIGNS: SignEntry[] = [
  // Greetings
  { id: "namaste", name: "Namaste", description: "Press both palms together", hint: "Both hands, palms touching, fingers up", icon: "🙏", category: "greeting", handCount: 2 },
  { id: "thank_you", name: "Thank You", description: "Open palm near chin, move outward", hint: "One hand, all fingers open, palm facing camera", icon: "👋", category: "greeting", handCount: 1 },
  { id: "sorry", name: "Sorry", description: "Rub chest in circular motion with fist", hint: "Closed fist rotating on chest", icon: "😔", category: "greeting", handCount: 1 },
  { id: "please", name: "Please", description: "Open palm on chest, move in circle", hint: "Palm facing chest, circular motion", icon: "🤲", category: "greeting", handCount: 1 },

  // Basic
  { id: "yes", name: "Yes", description: "Fist nodding up and down", hint: "Closed fist, thumb on top, nod", icon: "✊", category: "basic", handCount: 1 },
  { id: "no", name: "No", description: "Index and middle finger form V, twist wrist", hint: "Two fingers up, twist side to side", icon: "🙅", category: "basic", handCount: 1 },
  { id: "wait", name: "Wait", description: "Open palm facing outward", hint: "All fingers extended, palm to camera", icon: "✋", category: "basic", handCount: 1 },
  { id: "help", name: "Help", description: "Fist on palm, both hands stacked", hint: "One fist resting on other palm", icon: "🆘", category: "basic", handCount: 2 },
  { id: "understand", name: "Understand", description: "Index finger taps side of head", hint: "Finger to temple, slight nod", icon: "🤔", category: "basic", handCount: 1 },
  { id: "dont_understand", name: "Don't Understand", description: "Head shake + palms up shrug", hint: "Shrug with palms up, shake head", icon: "🤷", category: "basic", handCount: 2 },

  // Services
  { id: "water", name: "Water", description: "W handshape tap on chin", hint: "Three fingers up (W), tap chin", icon: "💧", category: "service", handCount: 1 },
  { id: "tax", name: "Tax", description: "T handshape tap on chest", hint: "Point to chest with thumb up (T)", icon: "💰", category: "service", handCount: 1 },
  { id: "bill", name: "Bill", description: "Open palm slides across other palm", hint: "One palm slides over the other", icon: "🧾", category: "service", handCount: 2 },
  { id: "payment", name: "Payment", description: "Hand passes money to other hand", hint: "Give-and-receive gesture", icon: "💳", category: "service", handCount: 2 },
  { id: "certificate", name: "Certificate", description: "Both hands show rectangular shape", hint: "Both hands outline a rectangle", icon: "📜", category: "document", handCount: 2 },

  // Documents
  { id: "form", name: "Form", description: "Writing motion on palm", hint: "Write on open palm with finger", icon: "📝", category: "document", handCount: 2 },
  { id: "document", name: "Document", description: "Hands show paper size, then part", hint: "Flat hands, open like a book", icon: "📄", category: "document", handCount: 2 },
  { id: "name", name: "Name", description: "N handshape tap on chest", hint: "Index + middle fingers on chest", icon: "🏷️", category: "document", handCount: 1 },
  { id: "address", name: "Address", description: "A handshape moves forward", hint: "Thumb out (A), push forward", icon: "📍", category: "document", handCount: 1 },
  { id: "phone", name: "Phone", description: "Y handshape near ear", hint: "Pinky + thumb out, near ear", icon: "📞", category: "civic", handCount: 1 },

  // Civic
  { id: "number", name: "Number", description: "Both hands show digits", hint: "Show number with fingers", icon: "🔢", category: "civic", handCount: 2 },
  { id: "date", name: "Date", description: "D handshape tap on wrist", hint: "Index finger pointing, tap wrist", icon: "📅", category: "civic", handCount: 1 },
  { id: "time", name: "Time", description: "Point to wrist like watch", hint: "Tap wrist where watch sits", icon: "⏰", category: "civic", handCount: 1 },
  { id: "office", name: "Office", description: "O handshape circle outward", hint: "Circle shape with fingers, push out", icon: "🏢", category: "civic", handCount: 1 },
  { id: "complaint", name: "Complaint", description: "Open palm taps chest twice", hint: "Palm to chest, two taps", icon: "📋", category: "civic", handCount: 1 },
];

export const SIGN_MAP = new Map(MUNICIPAL_SIGNS.map((s) => [s.id, s]));
export const SIGN_IDS = MUNICIPAL_SIGNS.map((s) => s.id);

export const CATEGORY_LABELS: Record<string, string> = {
  greeting: "Greetings",
  basic: "Basic Conversation",
  service: "Services",
  document: "Documents & Forms",
  civic: "Civic & Office",
};
