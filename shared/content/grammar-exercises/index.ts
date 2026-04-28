// Loader for baked grammar exercise JSON files. Generated offline by
// scripts/build-grammar-exercises.mjs. Mirrors shared/content/vocab/index.ts.

import a1 from './a1.json'
import a2 from './a2.json'
import b1 from './b1.json'
import b2 from './b2.json'
import c1 from './c1.json'
import c2 from './c2.json'
import type { GrammarQuestion } from '../../grammar/exerciseTypes'

export interface GrammarExerciseSet {
  level: string
  title: string
  source: string
  model: string
  generatedAt: string
  chapters: Record<string, { title: string; exercises: GrammarQuestion[] }>
}

const SETS: Record<string, GrammarExerciseSet> = {
  a1: a1 as GrammarExerciseSet,
  a2: a2 as GrammarExerciseSet,
  b1: b1 as GrammarExerciseSet,
  b2: b2 as GrammarExerciseSet,
  c1: c1 as GrammarExerciseSet,
  c2: c2 as GrammarExerciseSet,
}

/**
 * Get the baked exercises for a given chapter, or null if none exist
 * (e.g. before the script has been run for that chapter).
 */
export function getBakedExercises(level: string, chapterId: number): GrammarQuestion[] | null {
  const set = SETS[level.toLowerCase()]
  if (!set) return null
  const chapter = set.chapters[String(chapterId)]
  return chapter?.exercises ?? null
}

/** Returns true if the JSON has any baked content for this level. */
export function hasBakedExercises(level: string): boolean {
  const set = SETS[level.toLowerCase()]
  if (!set) return false
  return Object.keys(set.chapters).length > 0
}

export const grammarExerciseSets = SETS
