export const HI: Record<string, string> = {
  "Learn Indian Sign Language": "भारतीय सांकेतिक भाषा सीखें",
  "For citizens, by citizens. No login required.": "नागरिकों के लिए, नागरिकों द्वारा। लॉगिन आवश्यक नहीं।",
  "levels completed": "स्तर पूर्ण",
  "Flashcards": "फ्लैशकार्ड",
  "Flip cards to learn signs and their meanings": "संकेत और उनके अर्थ जानने के लिए कार्ड पलटें",
  "Quiz Challenge": "प्रश्नोत्तरी चुनौती",
  "Test your knowledge with quick quizzes": "त्वरित प्रश्नोत्तरी से अपने ज्ञान का परीक्षण करें",
  "Use your camera to practice real signs": "वास्तविक संकेतों का अभ्यास करने के लिए अपने कैमरे का उपयोग करें",
  "View All Badges": "सभी बैज देखें",
  "Level": "स्तर",
  "Day Streak": "दैनिक क्रम",
  "Accuracy": "सटीकता",
  "Badges": "बैज",
  "Learned": "सीखा",
  "Back to Home": "होम पर वापस",
  "Exit": "बाहर",
  "Skip": "छोड़ें",
  "I Know This": "मुझे यह आता है",
  "Tap to reveal meaning": "अर्थ जानने के लिए टैप करें",
  "What does this sign mean?": "इस संकेत का क्या अर्थ है?",
  "Sign": "संकेत",
  "Correct": "सही",
  "Incorrect": "गलत",
  "Next Question": "अगला प्रश्न",
  "See Final Results": "अंतिम परिणाम देखें",
  "Start Camera": "कैमरा शुरू करें",
  "Choose a sign to practice": "अभ्यास के लिए एक संकेत चुनें",
  "Show the sign to your camera": "अपने कैमरे को संकेत दिखाएं",
  "Webcam Practice": "वेबकैम अभ्यास",
  "Practice Again": "फिर से अभ्यास करें",
  "Done": "पूर्ण",
  "Failed to load AI model": "AI मॉडल लोड करने में विफल",
  "Camera access denied": "कैमरा एक्सेस अस्वीकृत",
  "Achievements": "उपलब्धियां",
  "unlocked": "अनलॉक",
  "of": "में से",
  "Search signs...": "संकेत खोजें...",
  "All Categories": "सभी श्रेणियां",
  "Greetings": "अभिवादन",
  "Office & Services": "कार्यालय और सेवाएं",
  "Emergency & Help": "आपातकाल और सहायता",
  "Daily Life": "दैनिक जीवन",
  "Numbers & Counting": "संख्याएं और गिनती",
  "Question Words": "प्रश्न शब्द",
  "Dark Mode": "डार्क मोड",
  "Sound": "ध्वनि",
  "Leaderboard": "लीडरबोर्ड",
  "Rank": "रैंक",
  "Name": "नाम",
  "XP": "एक्सपी",
  "No results found": "कोई परिणाम नहीं मिला",
  "Content sourced from ISLRTC": "सामग्री ISLRTC से ली गई है",
  "Making public services accessible": "सार्वजनिक सेवाओं को सुलभ बनाना",
  "Learn ISL. Serve Better.": "ISL सीखें। बेहतर सेवा दें।",
  "Login": "लॉगिन",
  "Clerk Dashboard": "क्लर्क डैशबोर्ड",
  "Your Streak": "आपका क्रम",
  "Best": "सर्वश्रेष्ठ",
  "Total": "कुल",
  "Today's Lesson": "आज का पाठ",
  "Great work today!": "आज का काम शानदार!",
  "Submit Answer": "उत्तर जमा करें",
  "Submitting": "जमा हो रहा है",
  "Correct!": "सही!",
  "Not quite right": "बिल्कुल सही नहीं",
  "Your Stats": "आपके आंकड़े",
  "Current Streak": "वर्तमान क्रम",
  "Longest Streak": "सबसे लंबा क्रम",
  "Total Lessons": "कुल पाठ",
  "Open Camera Practice": "कैमरा अभ्यास खोलें",
  "Sign practice completed!": "संकेत अभ्यास पूर्ण!",
  "Download Certificate": "प्रमाणपत्र डाउनलोड करें",
  "No Lessons Available": "कोई पाठ उपलब्ध नहीं",
  "Your admin hasn't added any modules yet.": "आपके प्रशासक ने अभी तक कोई मॉड्यूल नहीं जोड़ा है।",
  "DEAF PERSON IS SIGNING": "बधिर व्यक्ति संकेत कर रहा है",
  "CLERK SEES": "क्लर्क देखता है - नागरिक कहना चाहता है:",
  "CLERK REPLIES": "क्लर्क जवाब देता है",
};

import { MR } from "./mr";

export type Lang = "en" | "hi" | "mr";

let currentLang: Lang = "en";

export function setLang(lang: Lang) {
  currentLang = lang;
  if (typeof window !== "undefined") {
    localStorage.setItem("isl-lang", lang);
  }
}

export function loadLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("isl-lang") as Lang | null;
  if (saved === "hi" || saved === "mr") return saved;
  return "en";
}

export function t(key: string): string {
  if (currentLang === "hi" && HI[key]) return HI[key];
  if (currentLang === "mr" && MR[key]) return MR[key];
  return key;
}
