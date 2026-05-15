"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS, type Locale, isLocale } from "@/lib/i18n/locales";

const COOKIE = "gp_locale";

function readCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^|; )${COOKIE}=([^;]+)`));
  const v = m?.[2];
  return isLocale(v) ? v : null;
}

function writeCookie(locale: Locale) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE}=${locale}; path=/; max-age=${oneYear}; samesite=lax`;
}

export function LangSwitcher({ initial }: { initial: Locale }) {
  const [locale, setLocale] = useState<Locale>(initial);

  useEffect(() => {
    const fromCookie = readCookie();
    if (fromCookie && fromCookie !== locale) setLocale(fromCookie);
  }, [locale]);

  return (
    <div className="relative inline-flex items-center rounded-full border border-border bg-background pl-2 pr-1 text-sm hover:border-foreground/20">
      <Globe className="pointer-events-none size-3.5 text-muted-foreground" aria-hidden />
      <select
        aria-label="Language"
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          writeCookie(next);
          setLocale(next);
          window.location.reload();
        }}
        className="cursor-pointer appearance-none border-0 bg-transparent py-1 pl-1.5 pr-5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 9px) 50%, calc(100% - 5px) 50%",
          backgroundSize: "4px 4px, 4px 4px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
