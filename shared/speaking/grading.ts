// Pure grading / text-compare logic for speaking exercises.
// No platform deps: callers feed in the expected string and the recognized
// (STT) string and get back a word-by-word diff + correctness.

import type { WordResult } from './types'

/** Normalize text for comparison: lowercase, strip punctuation, collapse spaces. */
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?¿¡'";\-:()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Longest Common Subsequence of two string arrays (for word alignment). */
function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const result: string[] = []
  let i = m
  let j = n
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return result
}

/**
 * Compare expected and transcribed texts word by word using LCS alignment.
 * Returns per-word results and an overall `isCorrect` boolean.
 */
export function compareTexts(
  expected: string,
  transcribed: string,
): { wordResults: WordResult[]; isCorrect: boolean } {
  const expectedWords = normalizeForComparison(expected).split(' ').filter(Boolean)
  const transcribedWords = normalizeForComparison(transcribed).split(' ').filter(Boolean)

  const results: WordResult[] = []
  const lcs = computeLCS(expectedWords, transcribedWords)

  let ei = 0
  let ti = 0
  let li = 0

  while (ei < expectedWords.length || ti < transcribedWords.length) {
    if (li < lcs.length && ei < expectedWords.length && ti < transcribedWords.length
        && expectedWords[ei] === lcs[li] && transcribedWords[ti] === lcs[li]) {
      results.push({ word: transcribedWords[ti], status: 'correct' })
      ei++
      ti++
      li++
    } else if (li < lcs.length && ei < expectedWords.length && expectedWords[ei] !== lcs[li]) {
      results.push({ word: expectedWords[ei], status: 'missing' })
      ei++
    } else if (ti < transcribedWords.length && (li >= lcs.length || transcribedWords[ti] !== lcs[li])) {
      if (ei < expectedWords.length && li < lcs.length) {
        results.push({ word: transcribedWords[ti], status: 'incorrect', expected: expectedWords[ei] })
        ei++
      } else {
        results.push({ word: transcribedWords[ti], status: 'extra' })
      }
      ti++
    } else if (ei < expectedWords.length) {
      results.push({ word: expectedWords[ei], status: 'missing' })
      ei++
    } else {
      break
    }
  }

  const incorrectCount = results.filter((r) => r.status !== 'correct').length
  return { wordResults: results, isCorrect: incorrectCount === 0 }
}

/**
 * Grade a spoken answer against the expected text, honoring acceptable
 * variations (used by translate_speak, where several phrasings are valid).
 * Returns the best-matching word diff: the variation that grades as correct
 * if any, otherwise the comparison against the primary expected text.
 */
export function evaluateSpeaking(
  expected: string,
  transcribed: string,
  acceptableVariations?: string[],
): { wordResults: WordResult[]; isCorrect: boolean } {
  let comparison = compareTexts(expected, transcribed)

  if (!comparison.isCorrect && acceptableVariations) {
    for (const variation of acceptableVariations) {
      const alt = compareTexts(variation, transcribed)
      if (alt.isCorrect) {
        comparison = alt
        break
      }
    }
  }

  return comparison
}
