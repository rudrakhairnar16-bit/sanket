import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function LimitationsPage() {
  return (
    <div className="min-h-screen bg-navy-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <Link href="/" className="text-gold-400 hover:text-gold-300 text-sm mb-4 block">← Back to Sanket</Link>
          <h1 className="text-4xl font-bold text-white mb-3">
            <span className="gradient-text">Current Capabilities & Limitations</span>
          </h1>
          <p className="text-white/50">Transparency about what Sanket 2.0 can and cannot do</p>
          <p className="text-white/30 text-sm mt-2">Last updated: September 2026</p>
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gold-400 mb-4">Supported Sign Vocabulary</h2>
            <p className="text-white/70 mb-3">Sanket 2.0 supports recognition of 34 Indian Sign Language signs across 6 categories:</p>
            <ul className="list-disc list-inside text-white/60 space-y-1 mb-4">
              <li>Greetings: Namaste, Thank You, Sorry, Please (4 signs)</li>
              <li>Basic: Yes, No, Wait, Help, Understand, Don&apos;t Understand, Toilet (7 signs)</li>
              <li>Services: Water, Tax, Bill, Payment, Bank (5 signs)</li>
              <li>Documents: Certificate, Form, Document, Name, Address (5 signs)</li>
              <li>Civic: Phone, Number, Date, Time, Office, Complaint, Hospital, Police, School, Emergency (10 signs)</li>
              <li>Daily Life: Drink, Eat, Sick (3 signs)</li>
            </ul>
            <p className="text-white/50 text-sm">The sign vocabulary and descriptions are prototype references; visual assets are marked as placeholders and require validation against authoritative ISL resources before production use.</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gold-400 mb-4">Recognition Engine</h2>
            <p className="text-white/70 mb-3">Sanket uses a browser-based MediaPipe hand-landmark pipeline with a conservative kNN prototype classifier. It is not a production-grade ISL translation model.</p>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>The repository includes a small synthetic baseline; real-camera samples can be captured in the Recognition Lab</li>
              <li>Recognition is vocabulary-limited and should be treated as assistive, not authoritative</li>
              <li>Recognition runs entirely in the browser — no camera data is sent to any server</li>
              <li>Field accuracy has not been established; the Recognition Lab provides holdout diagnostics, threshold calibration, confusion matrices, and negative-frame testing</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gold-400 mb-4">Confidence Behavior</h2>
            <p className="text-white/70 mb-3">Every recognition result includes a confidence state:</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10">
                <span className="text-green-400">✓ HIGH (82%+)</span>
                <span className="text-white/60">Eligible for automatic presentation to the clerk</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gold-500/10">
                <span className="text-gold-400">! MEDIUM (62-81%)</span>
                <span className="text-white/60">Not auto-committed — confirmation/retry is encouraged</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10">
                <span className="text-red-400">× LOW (45-61%)</span>
                <span className="text-white/60">Not auto-committed — interpreter/retry path is available</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                <span className="text-white/40">? UNKNOWN (&lt;45%)</span>
                <span className="text-white/60">No sign is committed — retry or escalation is available</span>
              </div>
            </div>
            <p className="text-white/50 text-sm">Sanket never fabricates a result when confidence is low. The human interpreter safety net is available in the prototype flow; live interpreter transport is not yet production-connected.</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gold-400 mb-4">Interpreter Safety Net</h2>
            <p className="text-white/70 mb-3">When AI confidence is low, Sanket can escalate to a human interpreter.</p>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>Demo mode simulates interpreter connections</li>
              <li>Architecture supports future WebRTC or external interpreter integration</li>
              <li>Real-time video relay is not yet implemented</li>
              <li>Interpreter sessions are logged for quality tracking</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gold-400 mb-4">Text-to-ISL Limitations</h2>
            <p className="text-white/70 mb-3">Sanket does NOT support unlimited text-to-ISL translation.</p>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>Clerk responses are displayed as text and visual guidance for supported signs</li>
              <li>ISL sequence generation from arbitrary text is not supported</li>
              <li>For unsupported responses, the system recommends interpreter assistance</li>
              <li>This is an honest limitation, not a missing feature</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gold-400 mb-4">Browser &amp; Device Requirements</h2>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>Chrome 90+, Edge 90+, Firefox 90+ recommended</li>
              <li>Safari has limited MediaPipe support</li>
              <li>Camera access required for sign recognition features</li>
              <li>Works on mobile, tablet, and desktop</li>
              <li>Reduced motion is supported for users with motion sensitivity</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gold-400 mb-4">Demo Mode</h2>
            <p className="text-white/70 mb-3">This application runs in demo mode with fictional data.</p>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>All user data is fictional — no real government employees</li>
              <li>Recognition results are simulated</li>
              <li>Interpreter connections are simulated</li>
              <li>Analytics use demonstration data</li>
              <li>No real government statistics are claimed</li>
              <li>Supamya Score uses demonstration metrics</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gold-400 mb-4">Privacy</h2>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>All recognition runs in the browser — no camera data sent to servers</li>
              <li>No camera footage is stored</li>
              <li>Session data is stored locally or in the demonstration database</li>
              <li>No personal data is shared with third parties</li>
            </ul>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm mb-4">Sanket 2.0 — Built by Team Beyond Words, KPGU University</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn-primary">Back to Home</Link>
            <Link href="/login" className="btn-secondary">Try Demo</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
