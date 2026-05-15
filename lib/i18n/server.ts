import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";
import { DICTS, type Dict } from "./dict";

export const LOCALE_COOKIE = "gp_locale";

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get(LOCALE_COOKIE)?.value;
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

export async function getDict(): Promise<Dict> {
  const locale = await getLocale();
  return DICTS[locale];
}
