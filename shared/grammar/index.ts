// Grammar content + exercises — shared between web and mobile.
export * from './types'
export * from './exerciseTypes'
export { grammarA1 } from './a1'
export { grammarA2 } from './a2'
export { grammarB1 } from './b1'
export { grammarB2 } from './b2'
export { grammarC1 } from './c1'
export { grammarC2 } from './c2'
export { getChapterExercises } from './exercises'
export { serializeChapterContent } from './serialize'
export { getBakedExercises, hasBakedExercises } from '../content/grammar-exercises'
export { fewShotExamples, fewShotPromptBlock } from './fewShotExamples'

import type { GrammarLevel } from './types'
import { grammarA1 } from './a1'
import { grammarA2 } from './a2'
import { grammarB1 } from './b1'
import { grammarB2 } from './b2'
import { grammarC1 } from './c1'
import { grammarC2 } from './c2'
import { grammarA1De } from './a1.de'

// Base content = English explanations + Spanish examples. Used for en/es and as
// the fallback for any locale whose translated file doesn't exist yet.
export const grammarLevels: Record<string, GrammarLevel> = {
  a1: grammarA1,
  a2: grammarA2,
  b1: grammarB1,
  b2: grammarB2,
  c1: grammarC1,
  c2: grammarC2,
}

// Per-locale overrides. Add a1.de/a2.de/… files here as they are authored.
// Files may be PARTIAL — a locale file only needs the chapters that have been
// translated; the rest fall back to English base (see merge in getGrammarLevel).
const grammarLevelsByLocale: Record<string, Record<string, GrammarLevel>> = {
  de: { a1: grammarA1De },
}

// Returns base (English) content overlaid with any translated chapters for the
// locale. Keeps the full base chapter set so a partial locale file never hides
// existing chapters — untranslated chapters render in English until authored.
export function getGrammarLevel(level: string, locale?: string): GrammarLevel | null {
  const key = level.toLowerCase()
  const base = grammarLevels[key] ?? null
  const localized = locale ? grammarLevelsByLocale[locale]?.[key] : undefined
  if (!localized) return base
  if (!base) return localized
  return {
    ...localized,
    chapters: base.chapters.map(
      (ch) => localized.chapters.find((c) => c.id === ch.id) ?? ch,
    ),
  }
}

export function getChapter(level: string, chapterId: number, locale?: string) {
  const data = getGrammarLevel(level, locale)
  return data?.chapters.find((c) => c.id === chapterId) ?? null
}
