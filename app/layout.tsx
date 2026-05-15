import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "GovPulse India — Public data, made useful",
  description:
    "Free civic-tech tools built on India's open government data. Air quality, river health, rainfall anomaly, and rooftop solar ROI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
              <Link href="/" className="font-semibold tracking-tight">
                GovPulse <span className="text-muted-foreground">India</span>
              </Link>
              <nav className="flex items-center gap-3 text-sm text-muted-foreground">
                <Link href="/about" className="hover:text-foreground">About</Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </main>
          <footer className="border-t">
            <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
              Data from CPCB, IMD, and MNRE via{" "}
              <a
                href="https://www.data.gov.in/"
                target="_blank"
                rel="noreferrer noopener"
                className="underline hover:text-foreground"
              >
                data.gov.in
              </a>
              . Informational use only — not for emergencies.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
