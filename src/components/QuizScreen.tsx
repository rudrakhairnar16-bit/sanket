"use client";

import { useState, useRef } from "react";
import { CATEGORIES, getQuizForCategory } from "@/lib/isl-data";
import {
  addXP,
  completeSign,
  recordAnswer,
  checkPerfectQuiz,
  type GameState,
} from "@/lib/game-storage";
import { t } from "@/lib/hi";
import { playCorrect, playIncorrect } from "@/lib/sound";

export function QuizScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const lastAnswerRef = useRef<boolean | null>(null);

  const category = CATEGORIES[categoryIndex];
  const quizData = getQuizForCategory(category.id);
  const totalQuestions = CATEGORIES.reduce(
    (sum, cat) => sum + getQuizForCategory(cat.id).length,
    0
  );
  const q = quizData[questionIndex];
  const isCorrect = selected === q?.sign.meaning;

  function handleAnswer(option: string) {
    if (selected) return;
    setSelected(option);
    const correct = option === q.sign.meaning;
    lastAnswerRef.current = correct;
    if (correct) { playCorrect(); } else { playIncorrect(); }
  }

  function nextQuestion() {
    const correct = lastAnswerRef.current === true;
    onUpdate((prev) => {
      let state = recordAnswer(prev, correct);
      state = addXP(state, correct ? 20 : 5);
      state = completeSign(state, q.sign.id);
      return state;
    });
    if (correct) setScore((s) => s + 20);
    if (correct) setCorrectCount((c) => c + 1);
    setSelected(null);
    lastAnswerRef.current = null;

    if (questionIndex + 1 >= quizData.length) {
      if (categoryIndex + 1 < CATEGORIES.length) {
        setCategoryIndex((i) => i + 1);
        setQuestionIndex(0);
      } else {
        const total = Math.max(totalQuestions, 1);
        const pct = ((correctCount + (correct ? 1 : 0)) / total) * 100;
        if (pct === 100) onUpdate((prev) => checkPerfectQuiz(prev));
        onUpdate((prev) => addXP(prev, 30));
        setFinished(true);
      }
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }

  if (finished) {
    const total = Math.max(totalQuestions, 1);
    const pct = Math.round((correctCount / total) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="surface-card p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-glow ${pct >= 80 ? "gradient-primary" : pct >= 50 ? "gradient-accent" : "bg-surface-100 dark:bg-surface-800"}`}>
            {pct >= 80 ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : pct >= 50 ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-500"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            )}
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">{t(pct >= 80 ? "Outstanding!" : pct >= 50 ? "Good Effort!" : "Keep Practicing!")}</h2>
          <p className="text-surface-500 text-sm mb-4">{t("You scored")} {correctCount}/{total} {t("across")} {CATEGORIES.length} {t("categories")}</p>
          <p className="text-2xl font-bold text-primary-400 mb-2">{pct}% Accuracy</p>
          <p className="text-xs text-surface-500 mb-5">+{score} XP earned</p>
          <button onClick={onBack} className="btn-primary">Back to Home</button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in text-center">
        <p className="text-surface-500 text-sm mb-3">Not enough signs in this category.</p>
        <button onClick={onBack} className="btn-ghost text-xs">← Go back</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="btn-ghost text-xs" aria-label={t("Exit")}>← {t("Exit")}</button>
        <span className="text-[10px] text-surface-500">{t(category.name)} • Q{questionIndex + 1}/{quizData.length}</span>
      </div>

      <div className="surface-card p-5 mb-3" role="region" aria-label={t("Question")}>
        <div className="text-center mb-5">
          <span className="text-5xl block mb-2" role="img" aria-label={q.sign.name}>{q.sign.icon}</span>
          <h2 className="text-base font-bold text-surface-900 dark:text-white">{t("What does this sign mean?")}</h2>
          <p className="text-xs text-surface-500 mt-0.5">{t("Sign")}: {q.sign.name}</p>
        </div>

        <div className="space-y-2" role="group" aria-label={t("Answer options")}>
          {q.options.map((option, i) => (
            <button key={i} onClick={() => handleAnswer(option)} disabled={!!selected}
              aria-pressed={selected === option}
              aria-label={`${t("Option")} ${String.fromCharCode(65 + i)}: ${option}`}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                selected === option
                  ? option === q.sign.meaning ? "border-emerald-500 bg-emerald-500/10 shadow-glow" : "border-red-500 bg-red-500/10"
                  : selected ? (option === q.sign.meaning ? "border-emerald-400 bg-emerald-500/5" : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 opacity-50")
                  : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 hover:border-surface-300 dark:hover:border-surface-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  selected === option ? (option === q.sign.meaning ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-surface-200 dark:bg-surface-700 text-surface-500"
                }`}>{String.fromCharCode(65 + i)}</div>
                <span className="font-medium text-sm text-surface-700 dark:text-surface-300">{option}</span>
                {selected && option === q.sign.meaning && <span className="ml-auto text-emerald-400 text-xs font-medium">✓</span>}
                {selected === option && option !== q.sign.meaning && <span className="ml-auto text-red-400 text-xs font-medium">✗</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="animate-slide-up space-y-3" role="alert" aria-live="assertive">
          <div className={`rounded-xl p-3.5 text-center ${isCorrect ? "glass border-emerald-500/20" : "glass border-red-500/20"}`}>
            <p className={`font-medium text-sm ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
              {isCorrect ? "✓ " + t("Correct") + "! +20 XP" : `✗ ${t("The answer was")}: ${q.sign.meaning}`}
            </p>
            <p className="text-[10px] text-surface-500 mt-0.5">{q.sign.hint}</p>
            {q.sign.webcamSupported && <p className="text-[10px] text-emerald-400 mt-0.5">{t("Try with webcam!")}</p>}
          </div>
          <button onClick={nextQuestion} className="btn-primary w-full text-sm">
            {questionIndex + 1 >= quizData.length && categoryIndex + 1 >= CATEGORIES.length ? t("See Final Results") : t("Next Question")}
          </button>
        </div>
      )}

      <div className="flex justify-center gap-1 mt-3" role="progressbar" aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={quizData.length} aria-label={`${t("Question")} ${questionIndex + 1} ${t("of")} ${quizData.length}`}>
        {quizData.slice(0, 5).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === questionIndex ? "bg-primary-500 w-3" : i < questionIndex ? "bg-emerald-500" : "bg-surface-300 dark:bg-surface-700"}`} />
        ))}
      </div>

      <p className="text-[10px] text-surface-500 text-center mt-2" aria-live="polite">Score: {score} XP • {correctCount}/{selected ? questionIndex + 1 : questionIndex} correct</p>
    </div>
  );
}
