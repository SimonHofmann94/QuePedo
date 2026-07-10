import { en } from "./en"

/**
 * Supported UI locales. `es` mirrors the app's current Spanish-first copy;
 * `de` and `en` are the added options.
 */
export const LOCALES = ["de", "en", "es"] as const
export type Locale = (typeof LOCALES)[number]

/**
 * Default UI locale. Kept at `es` while the de/en catalogs are still being
 * filled in Phase 3 (es == the complete, current app → zero regression).
 * Flip to `de` for the German-speaking target audience once catalogs are done.
 */
export const DEFAULT_LOCALE: Locale = "es"

/** Native names for the language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
}

/** Shape every catalog must satisfy — derived from the English source of truth. */
export type Messages = typeof en

export function isLocale(value: string | null | undefined): value is Locale {
  return value != null && (LOCALES as readonly string[]).includes(value)
}

/** Coerce any input (cookie, header, profile field) to a valid Locale. */
export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}
