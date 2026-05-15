import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitcher } from "@/components/LangSwitcher";
import { getDict, getLocale } from "@/lib/i18n/server";

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
  title: {
    default: "GovPulse India — Public data, made useful",
    template: "%s · GovPulse India",
  },
  description:
    "Free civic-tech tools built on India's open government data. Air quality, river health, rainfall anomaly, and rooftop solar ROI.",
  applicationName: "GovPulse India",
  authors: [{ name: "GovPulse India" }],
  keywords: ["India", "AQI", "rainfall", "solar", "open data", "data.gov.in", "CPCB", "IMD", "MNRE"],
  openGraph: {
    title: "GovPulse India",
    description:
      "Free civic-tech tools built on India's open government data.",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1411" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const t = await getDict();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <Link href="/" className="flex items-baseline gap-1.5 font-heading text-lg tracking-tight">
                <span className="inline-block size-2 rounded-full bg-primary" aria-hidden />
                <span>GovPulse</span>
                <span className="text-muted-foreground italic text-base">{t.brand.suffix}</span>
              </Link>
              <nav className="flex items-center gap-2 text-sm text-muted-foreground sm:gap-3">
                <Link href="/about" className="hidden hover:text-foreground sm:inline">{t.nav.about}</Link>
                <LangSwitcher initial={locale} />
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </main>
          <footer className="border-t">
            <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
              {t.footer.attribution}{" "}
              <a
                href="https://www.data.gov.in/"
                target="_blank"
                rel="noreferrer noopener"
                className="underline hover:text-foreground"
              >
                data.gov.in
              </a>
              . {t.footer.disclaimer}
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
