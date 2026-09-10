import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";

export const metadata: Metadata = {
  title: "Sanket 2.0 — संकेत | Government Clerk Accessibility Platform",
  description:
    "AI-assisted accessibility platform helping government clerks serve Deaf citizens through real-time ISL assistance, guided learning, and measurable accessibility insights.",
  keywords: [
    "Indian Sign Language",
    "ISL",
    "accessibility",
    "government services",
    "civic tech",
    "disability inclusion",
    "Sanket",
  ],
  authors: [{ name: "Team Beyond Words — KPGU University" }],
  openGraph: {
    title: "Sanket 2.0 — संकेत",
    description:
      "Make every government counter more accessible. AI-assisted ISL platform for government clerks.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1120",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b1120" />
        <link rel="icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen bg-navy-900 text-white antialiased">
        <OfflineIndicator />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold-400 focus:text-navy-900 focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        <Providers>
          <div id="main-content">{children}</div>
        </Providers>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        ` }} />
      </body>
    </html>
  );
}
