"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface ModuleForm {
  title: string;
  videoUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  order: number;
  active: boolean;
}

export default function EditModulePage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState<ModuleForm>({
    title: "",
    videoUrl: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    order: 1,
    active: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/modules/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        const mod = data.module;
        const opts = [...mod.options];
        while (opts.length < 4) opts.push("");
        setForm({
          title: mod.title,
          videoUrl: mod.videoUrl,
          question: mod.question,
          options: opts,
          correctAnswer: mod.correctAnswer,
          order: mod.order,
          active: mod.active,
        });
      })
      .finally(() => setPageLoading(false));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const filtered = form.options.filter(Boolean);

    if (!filtered.includes(form.correctAnswer)) {
      setError("Correct answer must be one of the options");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/modules/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          videoUrl: form.videoUrl,
          question: form.question,
          options: filtered,
          correctAnswer: form.correctAnswer,
          order: form.order,
          active: form.active,
        }),
      });

      if (res.ok) {
        router.push("/admin/modules");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update module");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Edit Module
        </h1>
        <p className="text-gray-500 mt-1">{form.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL
          </label>
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Question
          </label>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {form.options.map((opt, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Option {String.fromCharCode(65 + i)}
              </label>
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const opts = [...form.options];
                  opts[i] = e.target.value;
                  setForm({ ...form, options: opts });
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                placeholder={i < 2 ? `Option ${String.fromCharCode(65 + i)}` : "Optional"}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer
          </label>
          <select
            value={form.correctAnswer}
            onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
            required
          >
            <option value="">Select correct answer</option>
            {form.options.filter(Boolean).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            min={1}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500" />
            <span className="ml-3 text-sm text-gray-700">Active</span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl animate-slide-down">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
