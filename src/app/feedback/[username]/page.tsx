"use client";

import { useState, useEffect } from "react";

export default function CitizenFeedbackPage({
  params,
}: {
  params: { username: string };
}) {
  const [attempted, setAttempted] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (attempted === null) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkUsername: params.username,
          attempted,
          comment,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Submission failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 max-w-md w-full text-center animate-scale-in">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Your feedback helps us make public services more accessible for
            everyone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">सं</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Citizen Feedback
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Help us improve accessibility
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Providing feedback for</p>
          <p className="font-semibold text-gray-900 dark:text-white mt-1">
            Desk: {params.username}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              Did this staff member try to communicate using sign language?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttempted(true)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  attempted === true
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md"
                    : "border-gray-200 dark:border-gray-600 hover:border-green-200 dark:hover:border-green-700"
                }`}
              >
                <span className="text-3xl block mb-1">👍</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Yes</span>
              </button>
              <button
                type="button"
                onClick={() => setAttempted(false)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  attempted === false
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30 shadow-md"
                    : "border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-700"
                }`}
              >
                <span className="text-3xl block mb-1">👎</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">No</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
              rows={3}
              placeholder="Share your experience..."
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl animate-slide-down">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={attempted === null || loading}
            className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-primary-500/20"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Powered by Sanket — ISL for Sarkari Clerks
        </p>
      </div>
    </div>
  );
}
