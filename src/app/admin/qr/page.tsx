"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface Learner {
  _id: string;
  username: string;
  name: string;
  department: string;
}

export default function AdminQRPage() {
  const { user } = useAuth();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setLearners(data.users || []);
      })
      .catch(() => setError("Failed to load learners"))
      .finally(() => setLoading(false));
  }, []);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  function getQRUrl(username: string) {
    return `${baseUrl}/feedback/${username}`;
  }

  function downloadQR(username: string) {
    const url = getQRUrl(username);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `sanket-qr-${username}.png`;
      a.click();
    };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  const filtered = user?.role === "superadmin"
    ? learners
    : learners.filter((l) => l.department === user?.department);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          QR Code Generator
        </h1>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          Generate citizen feedback QR codes for each desk
        </p>
      </div>

      <div className="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-200 rounded-3xl p-6 dark:from-gray-800 dark:to-gray-800 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h3 className="font-semibold text-primary-800 dark:text-primary-300">How it works</h3>
            <p className="text-primary-600 text-sm mt-1 dark:text-primary-400">
              Print these QR codes and place them at each desk. Citizens scan
              with their phone to answer: &ldquo;Did this staff member try to
              use sign language?&rdquo;
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? filtered.map((learner) => (
          <div
            key={learner._id}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden dark:bg-gray-700">
              {selected === learner.username ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getQRUrl(learner.username))}`}
                  alt={`QR for ${learner.name}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <span className="text-3xl block">📱</span>
                  <span className="text-xs mt-1 block">
                    Click to preview
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{learner.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{learner.department}</p>
            <div className="flex gap-2 mt-3 justify-center">
              <button
                onClick={() =>
                  setSelected(
                    selected === learner.username ? null : learner.username
                  )
                }
                className="px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-xl transition-all dark:hover:bg-primary-900/20"
              >
                {selected === learner.username ? "Hide" : "Preview"}
              </button>
              <button
                onClick={() => downloadQR(learner.username)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-all dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Download
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-500">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-500 dark:text-gray-400">No learners found</p>
          </div>
        )}
      </div>
    </div>
  );
}
