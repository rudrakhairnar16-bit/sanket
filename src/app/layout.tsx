import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanket - ISL for Sarkari Clerks",
  description:
    "A civic tech platform for government clerks to learn Indian Sign Language (ISL)",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Sanket", statusBarStyle: "default" },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icon-192.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var d = JSON.parse(localStorage.getItem("isl-quest-data") || "{}");
                if (d.darkMode) document.documentElement.classList.add("dark");
              } catch(e) {}
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", function() {
                  navigator.serviceWorker.register("/sw.js");
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-btn focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        <AuthProvider>
          <ErrorBoundary>
            <main id="main-content" className="page-enter" role="main">{children}</main>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
