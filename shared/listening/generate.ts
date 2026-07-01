// Listening ("Escucha") item generation + grading — pure logic, no UI/TTS.
// Items are built from EXISTING shared grammar example sentences ({ es, en }
// pairs) — no AI call. The learner hears `es` and picks the meaning.

import { getGrammarLevel } from '../grammar'
import { normalizeAnswer } from '../utils/quiz'
import type { ListeningItem } from './types'

interface Pair {
  es: string
  en: string
}

/** Collect every { es, en } example pair from a level's grammar chapters. */
function collectPairs(level: string): Pair[] {
  const data = getGrammarLevel(level)
  if (!data) return []
  const pairs: Pair[] = []
  for (const chapter of data.chapters) {
    for (const section of chapter.sections) {
      for (const block of section.blocks) {
        if (block.type === 'examples' && block.examples) {
          for (const ex of block.examples) {
            if (ex.es?.trim() && ex.en?.trim()) pairs.push({ es: ex.es, en: ex.en })
          }
        }
      }
    }
  }
  return pairs
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Generate `count` multiple-choice listening items for a CEFR level.
 * Each item: hear the Spanish sentence, pick its English meaning from 4 options.
 * Distractors are drawn from the whole level's pool and deduped by normalized text.
 */
export function generateListeningItems(level: string, count = 6): ListeningItem[] {
  const pairs = collectPairs(level)
  if (pairs.length === 0) return []

  // Unique meanings across the level, for distractor selection.
  const pool = Array.from(new Set(pairs.map((p) => p.en)))

  const chosen = shuffle(pairs).slice(0, Math.min(count, pairs.length))

  return chosen.map((pair, i) => {
    const answerKey = normalizeAnswer(pair.en)
    const distractors: string[] = []
    const seen = new Set<string>([answerKey])
    for (const candidate of shuffle(pool)) {
      const key = normalizeAnswer(candidate)
      if (seen.has(key)) continue
      seen.add(key)
      distractors.push(candidate)
      if (distractors.length === 3) break
    }
    const options = shuffle([pair.en, ...distractors])
    return {
      id: `${level}-${i}`,
      spanish: pair.es,
      answer: pair.en,
      options,
      level,
    }
  })
}

/**
 * Grade a listening answer. Fixed-option MC, so we require an exact (normalized)
 * match against the correct meaning.
 * ponytail: NOT `checkAnswer` from quiz utils — its substring rule
 * (`correct.includes(user)`) marks partial options correct, e.g. picking
 * "to be" when the answer is "to be (essence)". Exact compare is required here.
 */
export function gradeListening(selected: string, answer: string): boolean {
  return normalizeAnswer(selected) === normalizeAnswer(answer)
}
