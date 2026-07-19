"use client";

import { useState } from "react";

interface CertificateProps {
  name: string;
  department: string;
  streak: number;
  onClose: () => void;
}

export default function CertificateGenerator({
  name,
  department,
  streak,
  onClose,
}: CertificateProps) {
  const [generating, setGenerating] = useState(false);

  async function generatePDF() {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const w = doc.internal.pageSize.getWidth();
      const h = doc.internal.pageSize.getHeight();

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, w, h, "F");

      const borderX = 10;
      const borderY = 10;
      const borderW = w - 20;
      const borderH = h - 20;

      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(2);
      doc.rect(borderX, borderY, borderW, borderH);

      doc.setDrawColor(139, 92, 246);
      doc.setLineWidth(0.5);
      doc.rect(borderX + 4, borderY + 4, borderW - 8, borderH - 8);

      doc.setFontSize(14);
      doc.setTextColor(167, 139, 250);
      doc.text("SANKET", w / 2, 45, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text("Indian Sign Language Training Program", w / 2, 55, {
        align: "center",
      });

      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text("Certificate of Achievement", w / 2, 80, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(148, 163, 184);
      doc.text("This is to certify that", w / 2, 100, { align: "center" });

      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text(name, w / 2, 118, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(148, 163, 184);
      doc.text(`Department of ${department}`, w / 2, 132, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(167, 139, 250);
      doc.text(
        `has successfully completed a ${streak}-day learning streak`,
        w / 2,
        155,
        { align: "center" }
      );

      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "in the Sanket Indian Sign Language (ISL) training program,",
        w / 2,
        168,
        { align: "center" }
      );
      doc.text(
        "demonstrating commitment to accessible public services.",
        w / 2,
        178,
        { align: "center" }
      );

      const today = new Date();
      const dateStr = today.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Date: ${dateStr}`, 30, h - 30);
      doc.text(
        "Content sourced from ISLRTC (Indian Sign Language",
        30,
        h - 22
      );
      doc.text(
        "Research and Training Centre), Ministry of Social Justice",
        30,
        h - 16
      );
      doc.text("& Empowerment, Government of India.", 30, h - 10);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("Sanket v1.0", w - 30, h - 16, { align: "right" });
      doc.text("Yuva 6.0 Hackathon", w - 30, h - 10, { align: "right" });

      doc.save(`sanket-certificate-${streak}-day-streak.pdf`);
    } finally {
      setGenerating(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {streak}-Day Milestone!
        </h2>
        <p className="text-gray-500 mb-6">
          Congratulations {name}! You&apos;ve earned a certificate for your{" "}
          {streak}-day learning streak.
        </p>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-xl">{streak} Day Streak</span>
          </div>
          <p className="text-amber-600 text-sm mt-1">{department}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            disabled={generating}
            className="flex-1 gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            {generating ? "Generating..." : "Download Certificate"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Content attribution: ISLRTC, Ministry of Social Justice &
          Empowerment, Govt. of India
        </p>
      </div>
    </div>
  );
}
