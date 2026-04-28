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

import type { GrammarLevel } from './types'
import { grammarA1 } from './a1'
import { grammarA2 } from './a2'
import { grammarB1 } from './b1'
import { grammarB2 } from './b2'
import { grammarC1 } from './c1'
import { grammarC2 } from './c2'

export const grammarLevels: Record<string, GrammarLevel> = {
  a1: grammarA1,
  a2: grammarA2,
  b1: grammarB1,
  b2: grammarB2,
  c1: grammarC1,
  c2: grammarC2,
}

export function getGrammarLevel(level: string): GrammarLevel | null {
  return grammarLevels[level.toLowerCase()] ?? null
}

export function getChapter(level: string, chapterId: number) {
  const data = getGrammarLevel(level)
  return data?.chapters.find((c) => c.id === chapterId) ?? null
}
