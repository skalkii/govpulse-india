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
    <label className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1 text-sm text-muted-foreground hover:text-foreground">
      <Globe className="size-3.5" aria-hidden />
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          writeCookie(next);
          setLocale(next);
          window.location.reload();
        }}
        className="appearance-none bg-transparent pr-1 text-sm focus:outline-none"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>{LOCALE_LABELS[l]}</option>
        ))}
      </select>
    </label>
  );
}
