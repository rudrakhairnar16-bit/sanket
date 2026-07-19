"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
        <div className="text-6xl mb-4">😞</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-6">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
