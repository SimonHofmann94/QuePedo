// Writing prompts — pure logic. Seeds a writing task from grammar chapters.
// No AI, no I/O: prompts are derived deterministically from shared grammar content.

import { getChapter, getGrammarLevel } from '../grammar'
import type { WritingPrompt } from './types'

/** Words we nudge the learner to reach, by CEFR level. Longer as level rises. */
const MIN_WORDS: Record<string, number> = {
  a1: 25,
  a2: 35,
  b1: 50,
  b2: 70,
  c1: 90,
  c2: 110,
}

export function minWordsForLevel(level: string): number {
  return MIN_WORDS[level.toLowerCase()] ?? 40
}

/**
 * Build a writing prompt for a grammar chapter. Pure & deterministic.
 * Returns null if the level/chapter is unknown.
 */
export function buildWritingPrompt(level: string, chapterId: number): WritingPrompt | null {
  const chapter = getChapter(level, chapterId)
  if (!chapter) return null

  const lvl = level.toLowerCase()
  const minWords = minWordsForLevel(lvl)

  return {
    id: `${lvl}-${chapterId}`,
    level: lvl,
    chapterId,
    chapterTitle: chapter.title,
    prompt: `Escribe un texto corto en español practicando «${chapter.title}». Usa al menos ${minWords} palabras y aplica lo que viste en este capítulo.`,
    minWords,
    guidance: [
      `Enfócate en «${chapter.title}» — es lo que estamos practicando.`,
      'Frases completas, no listas sueltas.',
      'No te claves en ser perfecto — escribe y luego revisamos juntos.',
    ],
  }
}

/** All writing prompts available for a level (one per chapter). Pure. */
export function listWritingPrompts(level: string): WritingPrompt[] {
  const data = getGrammarLevel(level)
  if (!data) return []
  return data.chapters
    .map((c) => buildWritingPrompt(level, c.id))
    .filter((p): p is WritingPrompt => p !== null)
}
