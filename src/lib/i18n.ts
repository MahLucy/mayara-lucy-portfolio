export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

/** A value available in every supported locale. */
export type Localized<T = string> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/** Base path for a locale: PT-BR lives at the root, EN under /en. */
export function localePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

export const htmlLang: Localized = { pt: "pt-BR", en: "en" };
export const ogLocale: Localized = { pt: "pt_BR", en: "en_US" };
