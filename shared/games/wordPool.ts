import type { VocabWord } from '../content/vocab/types'
import { getDisplayTranslation, normalizeAnswer } from '../utils/quiz'
import type { SessionWord } from './types'

// ── Inputs ───────────────────────────────────────────────────────────────

/** A user_vocabulary row, optionally joined with its user_word_progress. */
export interface UserWordInput {
  id: string
  term: string
  translations: Record<string, string>
  progress?: {
    box_level?: number
    next_review_at?: string | null
  } | null
}

// ── Weighting ────────────────────────────────────────────────────────────

function srsWeight(w: UserWordInput, now: Date): number {
  const p = w.progress
  if (!p) return 1
  if (p.next_review_at && new Date(p.next_review_at) <= now) return 3 // due
  if ((p.box_level ?? 5) <= 2) return 2 // weak
  return 1
}

/** Weighted sample without replacement — higher srsWeight surfaces earlier. */
function weightedShuffle(pool: SessionWord[]): SessionWord[] {
  // Efraimidis–Spirakis: sort by random^(1/weight), descending.
  return pool
    .map((w) => ({ w, key: Math.pow(Math.random(), 1 / w.srsWeight) }))
    .sort((a, b) => b.key - a.key)
    .map((x) => x.w)
}

// ── Normalization ────────────────────────────────────────────────────────

function fromUserWord(w: UserWordInput, locale: string | undefined, now: Date): SessionWord | null {
  const display = getDisplayTranslation(w.translations, locale)
  if (!w.term?.trim() || !display) return null
  return { id: w.id, es: w.term.trim(), display, srsWeight: srsWeight(w, now) }
}

function fromCurated(w: VocabWord, locale: string | undefined): SessionWord | null {
  const translations: Record<string, string> = { de: w.de }
  if (w.en) translations.en = w.en
  const display = getDisplayTranslation(translations, locale)
  if (!w.es?.trim() || !display) return null
  return { id: `curated:${w.es}`, es: w.es.trim(), display, pos: w.pos, srsWeight: 1 }
}

// ── Public API ───────────────────────────────────────────────────────────

/**
 * Build a session word pool: SRS-weighted-shuffled user vocabulary, topped up
 * from the curated fallback until at least `minCount` words are available.
 * Pure — callers fetch the inputs; no DB access here. Deduped by Spanish term
 * (user words win over curated).
 */
export function buildSessionPool(opts: {
  userWords: UserWordInput[]
  curatedFallback: VocabWord[]
  minCount: number
  locale?: string
  now?: Date
}): SessionWord[] {
  const now = opts.now ?? new Date()

  const seen = new Set<string>()
  const userPool: SessionWord[] = []
  for (const w of opts.userWords) {
    const sw = fromUserWord(w, opts.locale, now)
    if (!sw || seen.has(sw.es.toLowerCase())) continue
    seen.add(sw.es.toLowerCase())
    userPool.push(sw)
  }

  const pool = weightedShuffle(userPool)

  if (pool.length < opts.minCount) {
    for (const w of opts.curatedFallback) {
      if (pool.length >= opts.minCount) break
      const sw = fromCurated(w, opts.locale)
      if (!sw || seen.has(sw.es.toLowerCase())) continue
      seen.add(sw.es.toLowerCase())
      pool.push(sw)
    }
  }

  return pool
}

/**
 * Pick `n` distractors from the pool: never the correct word, and never a word
 * whose displayed translation reads the same as the correct answer.
 */
export function pickDistractors(pool: SessionWord[], correct: SessionWord, n: number): SessionWord[] {
  const target = normalizeAnswer(correct.display)
  const candidates = pool.filter(
    (w) => w.es !== correct.es && normalizeAnswer(w.display) !== target,
  )
  // Plain shuffle — distractors shouldn't be SRS-biased.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }
  return candidates.slice(0, n)
}
