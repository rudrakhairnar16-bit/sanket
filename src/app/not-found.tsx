import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
