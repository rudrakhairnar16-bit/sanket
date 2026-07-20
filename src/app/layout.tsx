import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanket - ISL for Sarkari Clerks",
  description:
    "A civic tech platform for government clerks to learn Indian Sign Language (ISL)",
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
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
