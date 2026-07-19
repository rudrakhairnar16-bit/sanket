export interface ISLSign {
  id: string;
  name: string;
  meaning: string;
  icon: string;
  category: string;
  hint?: string;
  webcamSupported?: boolean;
}

export interface ISLCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: ISLCategory[] = [
  { id: "greetings", name: "Greetings", icon: "👋", description: "Everyday greetings and polite expressions" },
  { id: "office", name: "Office & Services", icon: "🏛️", description: "Common interactions at government offices" },
  { id: "emergency", name: "Emergency & Help", icon: "🆘", description: "Essential signs for urgent situations" },
  { id: "daily", name: "Daily Life", icon: "☀️", description: "Everyday needs and activities" },
  { id: "numbers", name: "Numbers & Counting", icon: "🔢", description: "Count and indicate quantities" },
  { id: "questions", name: "Question Words", icon: "❓", description: "Ask questions using sign language" },
];

export const ALL_SIGNS: ISLSign[] = [
  { id: "namaste", name: "Namaste", meaning: "Greeting with folded hands", icon: "🙏", category: "greetings", hint: "Bring both palms together in front of chest", webcamSupported: true },
  { id: "thank-you", name: "Thank You", meaning: "Express gratitude", icon: "👋", category: "greetings", hint: "Open palm near chin, move outward slightly", webcamSupported: true },
  { id: "sorry", name: "Sorry", meaning: "Apologize", icon: "😔", category: "greetings", hint: "Rub chest in circular motion with fist" },
  { id: "please", name: "Please", meaning: "Politely request", icon: "🤲", category: "greetings", hint: "Open palm on chest, move in circle" },
  { id: "welcome", name: "Welcome", meaning: "Greet someone arriving", icon: "🤗", category: "greetings", hint: "Open both palms facing inward, move toward chest" },
  { id: "yes", name: "Yes", meaning: "Affirmative response", icon: "✊", category: "greetings", hint: "Make a fist and nod slightly", webcamSupported: true },
  { id: "no", name: "No", meaning: "Negative response", icon: "☝️", category: "greetings", hint: "Point index finger up, wag side to side", webcamSupported: true },
  { id: "wait", name: "Wait", meaning: "Please wait a moment", icon: "✋", category: "office", hint: "Open palm facing outward, fingers together", webcamSupported: true },
  { id: "sign-here", name: "Sign Here", meaning: "Please sign this document", icon: "✍️", category: "office", hint: "Mimic signing motion with dominant hand" },
  { id: "submit", name: "Submit", meaning: "Submit an application", icon: "📋", category: "office", hint: "Push both palms forward as if presenting" },
  { id: "water-bill", name: "Water Bill", meaning: "Referring to water tax or bill", icon: "💧", category: "office", hint: "Tap index finger on other palm" },
  { id: "form", name: "Form", meaning: "An application or form to fill", icon: "📄", category: "office", hint: "Draw a rectangle shape with both hands" },
  { id: "payment", name: "Payment", meaning: "Pay a fee or bill", icon: "💳", category: "office", hint: "Tap open palm with other hand" },
  { id: "help", name: "Help", meaning: "Request assistance", icon: "🆘", category: "emergency", hint: "Raise one hand with open palm" },
  { id: "police", name: "Police", meaning: "Law enforcement", icon: "👮", category: "emergency", hint: "Tap chest with open hand (badge gesture)" },
  { id: "hospital", name: "Hospital", meaning: "Medical facility", icon: "🏥", category: "emergency", hint: "Draw a cross on forehead with index finger" },
  { id: "emergency", name: "Emergency", meaning: "Urgent situation", icon: "🚨", category: "emergency", hint: "Wave both hands side to side" },
  { id: "doctor", name: "Doctor", meaning: "Medical professional", icon: "🩺", category: "emergency", hint: "Tap wrist as if checking pulse" },
  { id: "water", name: "Water", meaning: "Need drinking water", icon: "💧", category: "daily", hint: "Form a 'W' shape with fingers near mouth" },
  { id: "food", name: "Food", meaning: "Want to eat or hungry", icon: "🍽️", category: "daily", hint: "Bring cupped hand toward mouth" },
  { id: "toilet", name: "Toilet", meaning: "Restroom location", icon: "🚻", category: "daily", hint: "Shake hand side to side at waist level" },
  { id: "medicine", name: "Medicine", meaning: "Need medical supply", icon: "💊", category: "daily", hint: "Tap palm with index finger (pill gesture)" },
  { id: "sleep", name: "Sleep", meaning: "Tired or want to rest", icon: "😴", category: "daily", hint: "Bring both palms together near ear" },
  { id: "home", name: "Home", meaning: "Go home or residence", icon: "🏠", category: "daily", hint: "Make a triangle shape with both hands above head" },
  { id: "one", name: "One", meaning: "The number 1", icon: "1️⃣", category: "numbers", hint: "Index finger up, other fingers closed" },
  { id: "two", name: "Two", meaning: "The number 2", icon: "2️⃣", category: "numbers", hint: "Index and middle fingers up" },
  { id: "three", name: "Three", meaning: "The number 3", icon: "3️⃣", category: "numbers", hint: "Thumb, index, middle fingers out" },
  { id: "four", name: "Four", meaning: "The number 4", icon: "4️⃣", category: "numbers", hint: "Four fingers up, thumb folded across palm" },
  { id: "five", name: "Five", meaning: "The number 5", icon: "5️⃣", category: "numbers", hint: "Open palm, all fingers spread" },
  { id: "what", name: "What", meaning: "Asking 'what?'", icon: "🤷", category: "questions", hint: "Shrug with both palms up" },
  { id: "who", name: "Who", meaning: "Asking 'who?'", icon: "🙋", category: "questions", hint: "Point index finger in circle near mouth" },
  { id: "where", name: "Where", meaning: "Asking 'where?'", icon: "📍", category: "questions", hint: "Look around with open palm" },
  { id: "when", name: "When", meaning: "Asking 'when?'", icon: "⏰", category: "questions", hint: "Tap wrist with index finger" },
  { id: "why", name: "Why", meaning: "Asking 'why?'", icon: "🤔", category: "questions", hint: "Tap forehead with index finger" },
  { id: "how", name: "How", meaning: "Asking 'how?'", icon: "❓", category: "questions", hint: "Rotate open palms alternately" },
];

export const WEBCAM_SIGNS = ALL_SIGNS.filter((s) => s.webcamSupported).map((s) => s.name);

export function getSignsByCategory(categoryId: string): ISLSign[] {
  return ALL_SIGNS.filter((s) => s.category === categoryId);
}

export function getRandomSign(excludeIds?: string[]): ISLSign {
  const pool = excludeIds ? ALL_SIGNS.filter((s) => !excludeIds.includes(s.id)) : ALL_SIGNS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getQuizForCategory(categoryId: string): { sign: ISLSign; options: string[] }[] {
  const signs = getSignsByCategory(categoryId);
  if (signs.length < 4) return [];

  const allMeanings = ALL_SIGNS.map((s) => s.meaning);

  return signs.map((sign) => {
    const wrongOptions = allMeanings
      .filter((m) => m !== sign.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [sign.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
    return { sign, options };
  });
}

export function getAllQuizData(): { sign: ISLSign; options: string[] }[] {
  return ALL_SIGNS.map((sign) => {
    const wrongOptions = ALL_SIGNS
      .filter((s) => s.id !== sign.id)
      .map((s) => s.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [sign.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
    return { sign, options };
  });
}
