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

const YOUTUBE_EMBED_RE = /(?:youtube(?:-nocookie)?\.com)\/(?:embed|watch)\/([A-Za-z0-9_-]{11})/;

function isYouTubeEmbed(url: string) {
  return YOUTUBE_EMBED_RE.test(url);
}

function youtubeWatchUrl(url: string) {
  const m = url.match(YOUTUBE_EMBED_RE);
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : url;
}

export function DailyLesson({
  module,
  onComplete,
}: {
  module: ModuleData;
  onComplete: (correct: boolean, answer?: string) => Promise<void>;
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
    await onComplete(correct, selectedAnswer);
    setResult({ correct, milestone: null });
    setSubmitting(false);
  }

  const options = module.options || [];

  return (
    <div className="p-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
          <VideoIcon />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-primary-500 dark:text-primary-400 uppercase tracking-wider font-semibold">{t("Daily Lesson")}</p>
          <h2 className="text-base font-bold text-surface-900 dark:text-white truncate">
            {module.title}
          </h2>
        </div>
        {module.isReview && (
          <span className="ml-auto text-[10px] bg-accent-500/10 text-accent-600 dark:text-accent-400 px-2 py-0.5 rounded-full border border-accent-500/20">
            {t("Review")}
          </span>
        )}
      </div>

      {module.videoUrl && (
        <div className="mb-4">
          <div className="aspect-video bg-gradient-to-br from-surface-800 to-surface-900 rounded-2xl overflow-hidden relative shadow-inner-soft">
            {isYouTubeEmbed(module.videoUrl) ? (
              <iframe
                key={module._id}
                src={module.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
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
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1">
            <p className="text-[10px] text-surface-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-primary-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span className="text-surface-500">{module.title}</span>
              <span className="text-surface-300 dark:text-surface-600">·</span>
              <span>Content from ISLRTC, Govt. of India</span>
            </p>
            {isYouTubeEmbed(module.videoUrl) && (
              <a
                href={youtubeWatchUrl(module.videoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-primary-500 dark:text-primary-400 hover:text-primary-600 hover:underline"
              >
                Watch on YouTube
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7M21 12H3" /></svg>
              </a>
            )}
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
              className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                showResult
                  ? isCorrectOpt
                    ? "border-success-500 bg-success-500/10 shadow-[0_0_16px_rgba(16,185,129,0.15)]"
                    : isSelected
                    ? "border-danger-500 bg-danger-500/10"
                    : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 opacity-50"
                  : isSelected
                  ? "border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.01]"
                  : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 hover:border-primary-300 dark:hover:border-primary-600 hover:-translate-y-0.5 hover:shadow-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  showResult
                    ? isCorrectOpt
                      ? "bg-success-500 text-white"
                      : isSelected
                      ? "bg-danger-500 text-white"
                      : "bg-surface-200 dark:bg-surface-700 text-surface-500"
                    : isSelected
                    ? "bg-primary-500 text-white"
                    : "bg-surface-200 dark:bg-surface-700 text-surface-500 group-hover:bg-primary-500/10"
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className={`text-sm font-medium ${
                  showResult && isCorrectOpt
                    ? "text-success-600 dark:text-success-400"
                    : showResult && isSelected
                    ? "text-danger-600 dark:text-danger-400"
                    : "text-surface-700 dark:text-surface-200"
                }`}>
                  {option}
                </span>
                {showResult && isCorrectOpt && <span className="ml-auto text-success-500 text-sm animate-pop-in">✓</span>}
                {showResult && isSelected && !isCorrectOpt && <span className="ml-auto text-danger-400 text-sm animate-pop-in">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      {!result ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || submitting}
          className="btn-primary w-full mt-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          {submitting ? `${t("Submitting")}...` : t("Submit Answer")}
          {submitting && (
            <span className="absolute inset-0 shimmer-loading" />
          )}
        </button>
      ) : (
        <div className={`mt-4 ${result.correct ? "glass border-success-500/30" : "glass border-danger-500/30"} rounded-xl p-4 text-center animate-pop-in`}>
          <p className={`font-semibold text-sm ${result.correct ? "text-success-500" : "text-danger-500"}`}>
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