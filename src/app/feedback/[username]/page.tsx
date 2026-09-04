"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

export default function FeedbackPage() {
  const params = useParams();
  const username = params.username as string;
  const [attempted, setAttempted] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const clerkDisplayName = username
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const handleSubmit = async () => {
    if (attempted === null) return;
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: username,
          clerkName: clerkDisplayName,
          department: "Unknown",
          attempted,
          rating: rating || undefined,
          comment: comment || undefined,
        }),
      });
    } catch {}
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="glass-card">
            <div className="text-6xl mb-6">🙏</div>
            <h2 className="text-2xl font-bold text-white mb-3">Thank You!</h2>
            <p className="text-white/50 mb-2">
              Your feedback for <span className="text-gold-400 font-semibold">{clerkDisplayName}</span> has been recorded.
            </p>
            <p className="text-white/30 text-sm">
              Every piece of feedback helps improve accessibility services for Deaf citizens.
            </p>
            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-xs text-white/20">You can close this page now.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6 sm:p-8">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs text-gold-400 mb-4">
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
            Public Feedback Portal
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Rate Your Experience</h1>
          <p className="text-white/40 text-sm">
            Feedback for <span className="text-gold-400 font-medium">{clerkDisplayName}</span>
          </p>
        </div>

        <div className="glass-card space-y-6">
          {/* Communication Toggle */}
          <div>
            <p className="text-sm text-white/60 mb-3 font-medium">
              Did the clerk try to communicate accessibly?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAttempted(true)}
                className={`flex-1 p-4 rounded-xl border text-center transition-all duration-200 ${
                  attempted === true
                    ? "bg-green-500/20 border-green-500/30 text-green-400 shadow-lg shadow-green-500/10"
                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <span className="text-2xl block mb-1">👍</span>
                <span className="text-sm font-medium">Yes, they tried</span>
              </button>
              <button
                onClick={() => setAttempted(false)}
                className={`flex-1 p-4 rounded-xl border text-center transition-all duration-200 ${
                  attempted === false
                    ? "bg-red-500/20 border-red-500/30 text-red-400 shadow-lg shadow-red-500/10"
                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <span className="text-2xl block mb-1">👎</span>
                <span className="text-sm font-medium">No attempt</span>
              </button>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <p className="text-sm text-white/60 mb-3 font-medium">How was your experience?</p>
            <div className="flex gap-1.5 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-all duration-150 hover:scale-110 ${
                    star <= rating ? "text-gold-400 drop-shadow-[0_0_8px_rgba(201,169,97,0.5)]" : "text-white/15 hover:text-white/30"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-xs text-white/30 mt-2">
                {rating === 1 && "Poor experience"}
                {rating === 2 && "Below expectations"}
                {rating === 3 && "Average experience"}
                {rating === 4 && "Good experience"}
                {rating === 5 && "Excellent experience"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <p className="text-sm text-white/60 mb-2 font-medium">Any comments? <span className="text-white/25">(optional)</span></p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field min-h-[100px] resize-none"
              placeholder="Share details about your experience..."
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={attempted === null || loading}
            className="btn-primary w-full py-3 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Your feedback is anonymous and helps improve government services.
        </p>
      </div>
    </div>
  );
}
