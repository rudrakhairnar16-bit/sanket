"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LevelData {
  id: number;
  title: string;
  description: string;
  icon: string;
  signs: { sign: string; meaning: string }[];
  quiz: { question: string; options: string[]; answer: string }[];
}

const LEVELS: LevelData[] = [
  {
    id: 1,
    title: "Basic Greetings",
    description: "Learn common greetings used in daily interactions",
    icon: "👋",
    signs: [
      { sign: "Namaste", meaning: "Greeting with folded hands" },
      { sign: "Thank You", meaning: "Express gratitude" },
      { sign: "Sorry", meaning: "Apologize" },
      { sign: "Please", meaning: "Politely request" },
    ],
    quiz: [
      { question: "How do you greet someone in ISL?", options: ["Namaste", "Thank You", "Sorry", "Please"], answer: "Namaste" },
      { question: "Which sign shows gratitude?", options: ["Please", "Sorry", "Thank You", "Hello"], answer: "Thank You" },
    ],
  },
  {
    id: 2,
    title: "Numbers 1-10",
    description: "Count using Indian Sign Language",
    icon: "🔢",
    signs: [
      { sign: "One", meaning: "Index finger up" },
      { sign: "Two", meaning: "Index and middle fingers up" },
      { sign: "Three", meaning: "Thumb, index, middle fingers out" },
      { sign: "Five", meaning: "Open palm facing forward" },
    ],
    quiz: [
      { question: "Which number uses an open palm?", options: ["One", "Three", "Five", "Two"], answer: "Five" },
      { question: "How many fingers for 'Two'?", options: ["One", "Two", "Three", "Five"], answer: "Two" },
    ],
  },
  {
    id: 3,
    title: "Common Phrases",
    description: "Everyday phrases used in conversations",
    icon: "💬",
    signs: [
      { sign: "How are you?", meaning: "Checking on someone's well-being" },
      { sign: "I'm fine", meaning: "Responding positively" },
      { sign: "What is your name?", meaning: "Asking someone's name" },
      { sign: "Nice to meet you", meaning: "First meeting greeting" },
    ],
    quiz: [
      { question: "How do you ask someone's name?", options: ["How are you?", "What is your name?", "I'm fine", "Nice to meet you"], answer: "What is your name?" },
      { question: "Which phrase checks on someone's well-being?", options: ["I'm fine", "Nice to meet you", "How are you?", "Thank You"], answer: "How are you?" },
    ],
  },
  {
    id: 4,
    title: "At the Office",
    description: "Essential signs for government office interactions",
    icon: "🏛️",
    signs: [
      { sign: "Sign Here", meaning: "Request to sign a document" },
      { sign: "Please Wait", meaning: "Ask someone to wait" },
      { sign: "Water Bill", meaning: "Referring to water tax/bill" },
      { sign: "Submit", meaning: "Submit an application" },
    ],
    quiz: [
      { question: "Which sign asks someone to wait?", options: ["Sign Here", "Submit", "Please Wait", "Water Bill"], answer: "Please Wait" },
      { question: "What does 'Sign Here' mean?", options: ["Pay here", "Sign the document", "Wait here", "Stand here"], answer: "Sign the document" },
    ],
  },
  {
    id: 5,
    title: "Emergency & Help",
    description: "Know how to ask for help in emergency situations",
    icon: "🆘",
    signs: [
      { sign: "Help", meaning: "Request assistance" },
      { sign: "Emergency", meaning: "Urgent situation" },
      { sign: "Hospital", meaning: "Medical facility" },
      { sign: "Police", meaning: "Law enforcement" },
    ],
    quiz: [
      { question: "Which sign requests assistance?", options: ["Emergency", "Help", "Hospital", "Police"], answer: "Help" },
      { question: "Where would you go for medical help?", options: ["Police", "Hospital", "Office", "Bank"], answer: "Hospital" },
    ],
  },
  {
    id: 6,
    title: "Food & Daily Needs",
    description: "Signs for food and everyday requirements",
    icon: "🍽️",
    signs: [
      { sign: "Water", meaning: "Need drinking water" },
      { sign: "Food", meaning: "Want to eat" },
      { sign: "Toilet", meaning: "Restroom location" },
      { sign: "Medicine", meaning: "Need medical supply" },
    ],
    quiz: [
      { question: "Which sign means you're hungry?", options: ["Water", "Food", "Medicine", "Toilet"], answer: "Food" },
      { question: "How do you ask for drinking water?", options: ["Food", "Medicine", "Water", "Help"], answer: "Water" },
    ],
  },
];

const STORAGE_KEY = "sanket-learn-progress";

function loadProgress(): Record<number, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<number, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export default function LearnPage() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [quizState, setQuizState] = useState<{
    levelId: number;
    questionIndex: number;
    selected: string | null;
    score: number;
    finished: boolean;
  } | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function startLevel(level: LevelData) {
    setCurrentLevel(level.id);
    setQuizState({
      levelId: level.id,
      questionIndex: 0,
      selected: null,
      score: 0,
      finished: false,
    });
  }

  function answerQuestion(option: string) {
    if (!quizState) return;
    setQuizState({ ...quizState, selected: option });
  }

  function nextQuestion() {
    if (!quizState) return;
    const level = LEVELS.find((l) => l.id === quizState.levelId);
    if (!level) return;

    const correct = quizState.selected === level.quiz[quizState.questionIndex].answer;
    const newScore = correct ? quizState.score + 1 : quizState.score;
    const nextIndex = quizState.questionIndex + 1;

    if (nextIndex >= level.quiz.length) {
      const passed = newScore >= level.quiz.length * 0.5;
      const newProgress = { ...progress, [quizState.levelId]: passed };
      setProgress(newProgress);
      saveProgress(newProgress);
      setQuizState({ ...quizState, score: newScore, finished: true });
    } else {
      setQuizState({
        ...quizState,
        questionIndex: nextIndex,
        selected: null,
        score: newScore,
      });
    }
  }

  function backToLevels() {
    setCurrentLevel(null);
    setQuizState(null);
  }

  const level = currentLevel ? LEVELS.find((l) => l.id === currentLevel) : null;

  if (level && quizState && !quizState.finished) {
    const q = level.quiz[quizState.questionIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={backToLevels}
            className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition-all"
          >
            ← Back to Levels
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-sm text-gray-400">
                  Level {level.id} • Question {quizState.questionIndex + 1} of{" "}
                  {level.quiz.length}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  {q.question}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-2xl">{level.icon}</span>
                <p className="text-xs text-gray-400 mt-1">Score: {quizState.score}</p>
              </div>
            </div>

            <div className="space-y-3">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => answerQuestion(option)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    quizState.selected === option
                      ? "border-primary-500 bg-primary-50 text-primary-700 shadow-md"
                      : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                        quizState.selected === option
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {quizState.selected && (
              <button
                onClick={nextQuestion}
                className="w-full mt-6 gradient-primary text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary-500/20"
              >
                {quizState.questionIndex + 1 >= level.quiz.length
                  ? "See Results"
                  : "Next Question"}
              </button>
            )}
          </div>

          <div className="mt-4 p-4 bg-white/60 backdrop-blur rounded-2xl border border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Content sourced from ISLRTC, Ministry of Social Justice & Empowerment, Govt. of India
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (quizState?.finished && level) {
    const passed = quizState.score >= level.quiz.length * 0.5;
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={backToLevels}
            className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition-all"
          >
            ← Back to Levels
          </button>

          <div className={`rounded-3xl p-8 text-center animate-scale-in ${
            passed
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
              : "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200"
          }`}>
            <div className="text-6xl mb-4">{passed ? "🎉" : "😅"}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {passed ? "Level Complete!" : "Keep Trying!"}
            </h2>
            <p className="text-gray-500 mb-2">
              You scored {quizState.score} out of {level.quiz.length}
            </p>
            {passed && (
              <p className="text-green-600 text-sm font-medium">
                Level {level.id} unlocked! 🏆
              </p>
            )}
            <button
              onClick={passed ? backToLevels : () => startLevel(level)}
              className="mt-6 px-8 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
            >
              {passed ? "Next Level" : "Try Again"}
            </button>
          </div>

          <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Signs in this level</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {level.signs.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
                    {s.sign.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{s.sign}</p>
                    <p className="text-xs text-gray-500">{s.meaning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition-all"
            >
              ← Back to Login
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              Learn Indian Sign Language
            </h1>
            <p className="text-gray-500 mt-1">
              For citizens, by citizens. No login required.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">
              {completedCount}/{LEVELS.length}
            </div>
            <p className="text-xs text-gray-400">levels completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEVELS.map((level) => {
            const unlocked =
              level.id === 1 || progress[level.id - 1];
            const completed = progress[level.id];

            return (
              <div
                key={level.id}
                className={`bg-white rounded-3xl shadow-sm border p-6 transition-all ${
                  unlocked && !completed
                    ? "border-primary-200 hover:shadow-md hover:scale-[1.02] cursor-pointer"
                    : completed
                    ? "border-green-200"
                    : "border-gray-100 opacity-60"
                }`}
                onClick={() => unlocked && !completed && startLevel(level)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{level.icon}</span>
                  {completed && (
                    <span className="text-green-500 text-xl">✅</span>
                  )}
                  {!unlocked && (
                    <span className="text-gray-300 text-xl">🔒</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900">{level.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {level.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {level.signs.length} signs • {level.quiz.length} questions
                </p>
                {unlocked && !completed && (
                  <div className="mt-3">
                    <span className="text-xs text-primary-600 font-medium">
                      Click to start →
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {completedCount === LEVELS.length && (
          <div className="mt-8 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-8 text-center animate-scale-in">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">
              You completed all levels!
            </h2>
            <p className="text-amber-600 mb-4">
              You now know basic Indian Sign Language. Share with your friends
              and help make public services accessible for everyone.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setProgress({});
              }}
              className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-all shadow-lg"
            >
              Start Over
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-white/60 backdrop-blur rounded-2xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Content sourced from ISLRTC, Ministry of Social Justice & Empowerment, Govt. of India
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Sanket — Making public services accessible, 3 minutes at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
