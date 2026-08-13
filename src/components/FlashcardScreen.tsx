"use client";

import { useState } from "react";
import { CATEGORIES, getSignsByCategory } from "@/lib/isl-data";
import {
  addXP,
  completeSign,
  recordAnswer,
  type GameState,
} from "@/lib/game-storage";
import { t } from "@/lib/hi";

export function FlashcardScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [signIndex, setSignIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  const category = CATEGORIES[categoryIndex];
  const signs = getSignsByCategory(category.id);
  const currentSign = signs[signIndex];

  function markKnown() {
    if (!currentSign) return;
    onUpdate((prev) => {
      let state = addXP(prev, 15);
      state = completeSign(state, currentSign.id);
      state = recordAnswer(state, true);
      return state;
    });
    setKnownCount((c) => c + 1);

    setTimeout(() => {
      if (signIndex + 1 < signs.length) {
        setSignIndex((i) => i + 1);
        setFlipped(false);
      } else if (categoryIndex + 1 < CATEGORIES.length) {
        setCategoryIndex((i) => i + 1);
        setSignIndex(0);
        setFlipped(false);
      } else {
        onUpdate((prev) => addXP(prev, 50));
        onBack();
      }
    }, 400);
  }

  function skipSign() {
    if (signIndex + 1 < signs.length) {
      setSignIndex((i) => i + 1);
      setFlipped(false);
    } else if (categoryIndex + 1 < CATEGORIES.length) {
      setCategoryIndex((i) => i + 1);
      setSignIndex(0);
      setFlipped(false);
    } else {
      onBack();
    }
  }

  const allDone =
    signs.length === 0 || (signIndex + 1 > signs.length && categoryIndex + 1 >= CATEGORIES.length);

  if (!currentSign || allDone) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="surface-card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
            {t("All Categories Done!")}
          </h2>
          <p className="text-surface-500 text-sm mb-5">
            {t("You reviewed")} {knownCount} {t("signs. Keep practicing daily!")}
          </p>
          <button onClick={onBack} className="btn-primary">{t("Back to Home")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="btn-ghost text-xs" aria-label={t("Exit")}>← {t("Exit")}</button>
        <span className="text-[10px] text-surface-500" role="status" aria-label={`${t(category.name)} ${t("category")}, card ${signIndex + 1} of ${signs.length}`}>
          {t(category.name)} • {signIndex + 1}/{signs.length}
        </span>
      </div>

      <div
        className="cursor-pointer perspective-[1000px] mb-5"
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(!flipped); } }}
        aria-label={flipped ? currentSign.meaning : currentSign.name}
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "300px",
          }}
        >
          <div className="absolute inset-0 surface-card p-6 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden" }}>
            <span className="text-6xl mb-3">{currentSign.icon}</span>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">{currentSign.name}</h2>
            <p className="text-surface-500 text-xs">{t("Tap to reveal meaning")}</p>
          </div>

          <div className="surface-card p-6 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", minHeight: "300px" }}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/20 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <h2 className="text-xl font-bold text-accent-300 mb-1">{currentSign.meaning}</h2>
            {currentSign.hint && <p className="text-surface-500 text-xs mt-1">{currentSign.hint}</p>}
            {currentSign.webcamSupported && (
              <span className="mt-2 px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-[10px] rounded-lg font-medium">
                {t("Webcam practice available")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={skipSign} className="btn-secondary flex-1 text-xs">{t("Skip")}</button>
        <button onClick={markKnown} className="btn-primary flex-1 text-xs">✓ {t("I Know This")}</button>
      </div>

      <div className="mt-3 flex justify-center gap-1">
        {signs.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === signIndex ? "bg-primary-500 w-3" : i < signIndex ? "bg-emerald-500" : "bg-surface-300 dark:bg-surface-700"}`} />
        ))}
      </div>

      <p className="text-[10px] text-surface-500 text-center mt-3">+15 XP per sign • Tap card to flip</p>
    </div>
  );
}
