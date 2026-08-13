"use client";

import { useState } from "react";
import { t } from "@/lib/hi";
import { playCorrect, playIncorrect } from "@/lib/sound";

interface ModuleData {
  _id: string;
  title: string;
  videoUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  order: number;
  isReview?: boolean;
}

function VideoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

export function DailyLesson({
  module,
  onComplete,
}: {
  module: ModuleData;
  onComplete: (correct: boolean) => Promise<void>;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; milestone: number | null } | null>(null);

  const isCorrectRound =
    result !== null
      ? result.correct
      : selectedAnswer === module.correctAnswer;

  async function handleSubmit() {
    if (!selectedAnswer || submitting) return;
    setSubmitting(true);
    const correct = selectedAnswer === module.correctAnswer;
    if (correct) playCorrect();
    else playIncorrect();
    await onComplete(correct);
    setResult({ correct, milestone: null });
    setSubmitting(false);
  }

  const options = module.options || [];

  return (
    <div className="surface-card p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
          <VideoIcon />
        </div>
        <div>
          <p className="text-[10px] text-primary-400 uppercase tracking-wider font-medium">{t("Daily Lesson")}</p>
          <h2 className="text-sm font-bold text-surface-900 dark:text-white">
            {module.title}
          </h2>
        </div>
        {module.isReview && (
          <span className="ml-auto text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
            {t("Review")}
          </span>
        )}
      </div>

      {module.videoUrl && (
        <div className="aspect-video bg-gradient-to-br from-surface-800 to-surface-900 rounded-2xl overflow-hidden mb-4 relative group">
          {module.videoUrl.includes("youtube.com/embed") ? (
            <iframe
              key={module._id}
              src={module.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={module.title}
            />
          ) : (
            <video
              key={module._id}
              src={module.videoUrl}
              controls
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLVideoElement).style.display = "none"; }}
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none video-fallback">
            <div className="w-16 h-16 rounded-full bg-primary-500/20 backdrop-blur-sm flex items-center justify-center mb-3 ring-1 ring-primary-400/30">
              <svg className="w-7 h-7 text-primary-400 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <p className="text-white/70 text-sm font-medium">{module.title}</p>
            <p className="text-white/40 text-[10px] mt-0.5">Content from ISLRTC, Govt. of India</p>
          </div>
        </div>
      )}

      <p className="text-sm font-medium text-surface-900 dark:text-white mb-3">
        {module.question || `${t("What does this sign mean?")}`}
      </p>

      <div className="space-y-2">
        {options.map((option, i) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOpt = option === module.correctAnswer;
          const showResult = result !== null;

          return (
            <button
              key={i}
              onClick={() => { if (!showResult) setSelectedAnswer(option); }}
              disabled={showResult || !module.videoUrl}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                showResult
                  ? isCorrectOpt
                    ? "border-emerald-500 bg-emerald-500/10"
                    : isSelected
                    ? "border-red-500 bg-red-500/10"
                    : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 opacity-50"
                  : isSelected
                  ? "border-primary-400 bg-primary-500/10 ring-1 ring-primary-500/30"
                  : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 hover:border-surface-300 dark:hover:border-surface-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  showResult
                    ? isCorrectOpt
                      ? "bg-emerald-500 text-white"
                      : isSelected
                      ? "bg-red-500 text-white"
                      : "bg-surface-200 dark:bg-surface-700 text-surface-500"
                    : isSelected
                    ? "bg-primary-500 text-white"
                    : "bg-surface-200 dark:bg-surface-700 text-surface-500"
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className={`text-sm font-medium ${
                  showResult && isCorrectOpt
                    ? "text-emerald-600 dark:text-emerald-400"
                    : showResult && isSelected
                    ? "text-red-600 dark:text-red-400"
                    : "text-surface-700 dark:text-surface-300"
                }`}>
                  {option}
                </span>
                {showResult && isCorrectOpt && <span className="ml-auto text-emerald-400 text-xs">✓</span>}
                {showResult && isSelected && !isCorrectOpt && <span className="ml-auto text-red-400 text-xs">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      {!result ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || submitting}
          className="btn-primary w-full mt-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? `${t("Submitting")}...` : t("Submit Answer")}
        </button>
      ) : (
        <div className={`mt-4 ${result.correct ? "glass border-emerald-500/20" : "glass border-red-500/20"} rounded-xl p-4 text-center`}>
          <p className={`font-semibold text-sm ${result.correct ? "text-emerald-400" : "text-red-400"}`}>
            {result.correct ? `✓ ${t("Correct")}!` : `✗ ${t("Incorrect")}`}
          </p>
          <p className="text-[10px] text-surface-500 mt-1">
            {result.correct
              ? `${t("Keep up your streak")}!`
              : `${t("The correct answer was")}: ${module.correctAnswer}`}
          </p>
        </div>
      )}
    </div>
  );
}
