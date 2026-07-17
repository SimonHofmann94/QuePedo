// Culture content — one file per Spanish-speaking country, consumed by the
// web world map / country pages and the mobile country grid.
//
// Localization: structured per-field {en, de} records (unlike grammar's
// file-per-locale overlay — this is data, not prose documents). `es` UI
// locale falls back to English via ct() until Spanish copy is authored.

export interface LocalizedText {
  en: string
  de: string
}

/** Country-specific slang expression (the star content). */
export interface CultureSlang {
  /** The expression as locals say it, e.g. "¡No manches!" */
  term: string
  meaning: LocalizedText
  /** Optional Spanish example sentence using the term. */
  example?: string
}

/** Country-specific vocabulary — words that differ from "textbook" Spanish. */
export interface CultureVocab {
  es: string
  translation: LocalizedText
  /** e.g. "elsewhere: autobús" */
  note?: LocalizedText
}

export interface CultureSight {
  name: string
  description: LocalizedText
  /** WGS84 coordinates — rendered as pins on the web country map. */
  lat: number
  lng: number
  emoji: string
}

export interface CultureCountry {
  /** ISO 3166-1 alpha-2, lowercase — route id; uppercase it for amCharts. */
  id: string
  flag: string
  name: LocalizedText
  /** Country name in Spanish, shown as flavor subtitle. */
  nameEs: string
  capital: string
  /** Display string, e.g. "130 M" */
  population: string
  intro: LocalizedText
  funFact: LocalizedText
  slang: CultureSlang[]
  vocabulary: CultureVocab[]
  sights: CultureSight[]
}

/** Resolve a localized field for the active app locale (es → en for now). */
export function ct(t: LocalizedText, locale?: string): string {
  return (locale === "de" ? t.de : t.en) || t.en
}
