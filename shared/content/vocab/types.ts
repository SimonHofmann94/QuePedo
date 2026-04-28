// Core vocabulary list types — used for the CEFR-bucketed base vocab lists
// (A1–C2) bundled with the app and surfaced in the vocabulary feature.

export interface VocabWord {
  /** Spanish lemma (canonical form) */
  es: string
  /** German translation */
  de: string
  /** English translation (optional) */
  en?: string
  /** Part of speech: n (noun), v (verb), adj, adv, pron, prep, conj, num, etc. */
  pos: string
  /** Frequency rank in the source corpus (1 = most frequent) */
  rank: number
  /** Optional gender hint for nouns: m | f | mf */
  gender?: "m" | "f" | "mf"
  /** Optional example sentence */
  example?: string
  /** Optional tags */
  tags?: string[]
}

export interface VocabList {
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  title: string
  source: string
  /** ISO date string when this list was last regenerated */
  generatedAt: string
  wordCount: number
  words: VocabWord[]
}
