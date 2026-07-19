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
  const [clerkName, setClerkName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setClerkName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center animate-scale-in">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-gray-500">
            Your feedback helps us make public services more accessible for
            everyone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">सं</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Citizen Feedback
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Help us improve accessibility
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500">Providing feedback for</p>
          <p className="font-semibold text-gray-900 mt-1">
            Desk: {params.username}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Did this staff member try to communicate using sign language?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttempted(true)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  attempted === true
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-200"
                }`}
              >
                <span className="text-3xl block mb-1">👍</span>
                <span className="text-sm font-medium text-gray-700">Yes</span>
              </button>
              <button
                type="button"
                onClick={() => setAttempted(false)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  attempted === false
                    ? "border-red-500 bg-red-50 shadow-md"
                    : "border-gray-200 hover:border-red-200"
                }`}
              >
                <span className="text-3xl block mb-1">👎</span>
                <span className="text-sm font-medium text-gray-700">No</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
              rows={3}
              placeholder="Share your experience..."
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl animate-slide-down">
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

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by Sanket — ISL for Sarkari Clerks
        </p>
      </div>
    </div>
  );
}
