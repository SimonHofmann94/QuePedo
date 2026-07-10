import { de } from "./de"
import { en } from "./en"
import { es } from "./es"
import type { Locale, Messages } from "./types"

export * from "./types"

/** All catalogs keyed by locale — the single source both platforms consume. */
export const messages: Record<Locale, Messages> = { de, en, es }

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
