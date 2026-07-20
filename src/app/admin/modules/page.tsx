"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Module {
  _id: string;
  title: string;
  videoUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  active: boolean;
  order: number;
}

export default function AdminModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/modules")
      .then((r) => r.json())
      .then((data) => setModules(data.modules || []))
      .catch(() => setError("Failed to load modules"))
      .finally(() => setLoading(false));
  }, []);

  async function toggleActive(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/modules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !current }),
      });
      if (!res.ok) throw new Error();
      setModules((prev) =>
        prev.map((m) => (m._id === id ? { ...m, active: !current } : m))
      );
    } catch {
      setError("Failed to update module");
    }
  }

  async function deleteModule(id: string) {
    if (!window.confirm("Delete this module?")) return;
    try {
      const res = await fetch(`/api/modules/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setModules((prev) => prev.filter((m) => m._id !== id));
    } catch {
      setError("Failed to delete module");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Content Management
          </h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            {modules.length} module{modules.length !== 1 && "s"}
          </p>
        </div>
        <Link
          href="/admin/modules/new"
          className="px-5 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary-500/20"
        >
          + New Module
        </Link>
      </div>

      {modules.length > 0 ? (
        <div className="grid gap-4">
          {modules.map((mod, i) => (
            <div
              key={mod._id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold ${
                      mod.active
                        ? "bg-primary-100 text-primary-600"
                        : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{mod.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 dark:text-gray-400">
                      {mod.question}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          mod.active
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {mod.active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {mod.options.length} options
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/modules/${mod._id}/edit`}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-all dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleActive(mod._id, mod.active)}
                    className={`px-3 py-2 text-sm rounded-xl transition-all ${
                      mod.active
                        ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    }`}
                  >
                    {mod.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteModule(mod._id)}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
            No Modules Yet
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Create your first ISL lesson module
          </p>
          <Link
            href="/admin/modules/new"
            className="inline-flex px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all"
          >
            Create Module
          </Link>
        </div>
      )}
    </div>
  );
}
