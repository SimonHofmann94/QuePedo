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

/** NEW — a CC-licensed photo from Wikimedia Commons. See spec §4. */
export interface CultureImage {
  /** Thumbnail URL on upload.wikimedia.org. Allowlisted width, no query string. */
  url: string
  /** The Commons `File:` description page — where the license lives. */
  sourcePage: string
  /** Plain-text author/photographer, HTML stripped. Rendered in the credit line. */
  author: string
  /** e.g. "CC BY-SA 4.0", "CC BY 2.0", "CC0", "Public domain". */
  license: string
  /** Pixel dimensions OF THE THUMBNAIL — next/image and RN <Image> need both. */
  width: number
  height: number
  alt: LocalizedText
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
  /** NEW — optional in the schema, required by culture.check.ts. */
  image?: CultureImage
}

/** NEW — a dish worth ordering by name. */
export interface CultureDish {
  /** Spanish/local name as you would say it to a waiter, e.g. "el mole negro". */
  name: string
  description: LocalizedText
  image?: CultureImage
}

/** NEW — a festival a learner could actually plan a trip around. */
export interface CultureFestival {
  /** Local name, e.g. "Día de Muertos". */
  name: string
  /** Short when-string, localized: "1–2 November" / "1.–2. November". */
  when: LocalizedText
  description: LocalizedText
  image?: CultureImage
}

/** NEW — one social norm, phrased as advice. */
export interface CultureEtiquette {
  /** Short Spanish label used as the card heading, e.g. "El saludo". */
  title: string
  text: LocalizedText
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
  /** NEW — one-line deck over the hero photo and on the country card. */
  tagline?: LocalizedText
  /** NEW — full-bleed hero photo. Landscape. */
  heroImage?: CultureImage
  intro: LocalizedText
  funFact: LocalizedText
  slang: CultureSlang[]
  vocabulary: CultureVocab[]
  sights: CultureSight[]
  /** NEW */
  food?: CultureDish[]
  /** NEW */
  festivals?: CultureFestival[]
  /** NEW */
  etiquette?: CultureEtiquette[]
}

/** Resolve a localized field for the active app locale (es → en for now). */
export function ct(t: LocalizedText, locale?: string): string {
  return (locale === "de" ? t.de : t.en) || t.en
}
