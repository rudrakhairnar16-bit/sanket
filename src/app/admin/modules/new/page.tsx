"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewModulePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    videoUrl: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    order: 1,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const options = [form.optionA, form.optionB, form.optionC, form.optionD].filter(Boolean);

    if (!options.includes(form.correctAnswer)) {
      setError("Correct answer must be one of the options");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          videoUrl: form.videoUrl,
          question: form.question,
          options,
          correctAnswer: form.correctAnswer,
          order: form.order,
          active: true,
        }),
      });

      if (res.ok) {
        router.push("/admin/modules");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create module");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          New Module
        </h1>
        <p className="text-gray-500 mt-1 dark:text-gray-400">Create a new ISL lesson</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            Lesson Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="e.g., Sign: Thank You"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            Video URL
          </label>
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="https://res.cloudinary.com/.../video.mp4"
            required
          />
          <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
            Upload to Cloudinary and paste the URL
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            Quiz Question
          </label>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="What does this sign mean?"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Option A
            </label>
            <input
              type="text"
              value={form.optionA}
              onChange={(e) => setForm({ ...form, optionA: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Option A"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Option B
            </label>
            <input
              type="text"
              value={form.optionB}
              onChange={(e) => setForm({ ...form, optionB: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Option B"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Option C
            </label>
            <input
              type="text"
              value={form.optionC}
              onChange={(e) => setForm({ ...form, optionC: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Option C (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Option D
            </label>
            <input
              type="text"
              value={form.optionD}
              onChange={(e) => setForm({ ...form, optionD: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Option D (optional)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            Correct Answer
          </label>
          <select
            value={form.correctAnswer}
            onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          >
            <option value="">Select correct answer</option>
            {[form.optionA, form.optionB, form.optionC, form.optionD]
              .filter(Boolean)
              .map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            Display Order
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            min={1}
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl animate-slide-down dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            {loading ? "Creating..." : "Create Module"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all dark:text-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
