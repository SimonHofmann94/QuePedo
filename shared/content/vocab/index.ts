// Base CEFR vocabulary lists — bundled with the app, behind a paywall.
// Source: doozan/spanish_data (CC-BY-4.0) + hand curation.
// Run scripts/build-vocab.mjs to expand B1–C2 from the frequency corpus.

import a1 from './a1.json'
import a2 from './a2.json'
import b1 from './b1.json'
import b2 from './b2.json'
import c1 from './c1.json'
import c2 from './c2.json'
import type { VocabList, VocabWord } from './types'

export type { VocabList, VocabWord }

export const vocabLists: Record<string, VocabList> = {
  a1: a1 as VocabList,
  a2: a2 as VocabList,
  b1: b1 as VocabList,
  b2: b2 as VocabList,
  c1: c1 as VocabList,
  c2: c2 as VocabList,
}

export function getVocabList(level: string): VocabList | null {
  return vocabLists[level.toLowerCase()] ?? null
}

export function getAllVocabLevels(): VocabList[] {
  return Object.values(vocabLists)
}
