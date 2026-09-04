/**
 * Converts simple clerk-facing English into a visual emoji summary.
 *
 * This is intentionally local and deterministic: it does not pretend that
 * emojis are ISL. The original English sentence remains visible alongside
 * the visual summary.
 */

const WORD_EMOJI: Record<string, string> = {
  hello: "👋",
  hi: "👋",
  please: "🙏",
  thank: "🙏",
  thanks: "🙏",
  you: "👉",
  wait: "⏳",
  moment: "⏱️",
  help: "🆘",
  show: "👀",
  see: "👀",
  bill: "📄",
  receipt: "🧾",
  document: "📋",
  documents: "📋",
  form: "📝",
  application: "📝",
  sign: "✍️",
  here: "👇",
  enter: "⌨️",
  type: "⌨️",
  phone: "📱",
  number: "🔢",
  name: "📛",
  address: "📍",
  payment: "💳",
  paid: "💳",
  received: "✅",
  checked: "🔍",
  checking: "🔍",
  check: "🔍",
  water: "💧",
  tax: "💰",
  property: "🏠",
  certificate: "📜",
  complaint: "📢",
  police: "👮",
  hospital: "🏥",
  emergency: "🚨",
  interpreter: "🧑‍🏫",
  call: "📞",
  seat: "🪑",
  sit: "🪑",
  understand: "💡",
  repeat: "🔄",
  yes: "✅",
  no: "❌",
  good: "👍",
  sorry: "🙏",
  your: "👉",
  my: "🙋",
  I: "🙋",
};

const PHRASES: Array<[RegExp, string]> = [
  [/how can i help/i, "👋 🆘"],
  [/please wait/i, "🙏 ⏳"],
  [/show (your )?bill/i, "👀 📄"],
  [/show (your )?document/i, "👀 📋"],
  [/sign here/i, "✍️ 👇"],
  [/enter (your )?phone number/i, "📱 🔢"],
  [/enter (your )?name/i, "📛 ⌨️"],
  [/application .*check/i, "📝 🔍"],
  [/payment .*received/i, "💳 ✅"],
  [/call an interpreter/i, "📞 🧑‍🏫"],
  [/take a seat/i, "🪑"],
];

function cleanWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "");
}

export function sentenceToEmoji(sentence: string): string {
  const text = sentence.trim();
  if (!text) return "💬";

  for (const [pattern, emoji] of PHRASES) {
    if (pattern.test(text)) return emoji;
  }

  const tokens = text.split(/\s+/).map(cleanWord).filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const token of tokens) {
    const icon = WORD_EMOJI[token];
    if (icon && !seen.has(icon)) {
      seen.add(icon);
      result.push(icon);
    }
  }

  return result.length ? result.join(" ") : "💬";
}

export function getEmojiMessage(sentence: string): { text: string; emoji: string } {
  return { text: sentence.trim(), emoji: sentenceToEmoji(sentence) };
}
