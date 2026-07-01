// Writing grader — pure, offline fallback. No AI, no I/O.
// Used directly as the graceful-degradation path when the AI grader is unavailable
// (web Gemini call fails, or the mobile `evaluate-writing` edge function is absent).

import type { WritingFeedback, WritingPrompt } from './types'

/** Count words in a free-text answer. */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Heuristic, offline grade of a writing attempt. Deterministic and forgiving:
 * it can't judge grammar, so it scores on effort (length vs. the prompt's target)
 * and always returns an encouraging Mexican-Spanish note with no corrections.
 */
export function evaluateWriting(text: string, prompt: WritingPrompt): WritingFeedback {
  const words = countWords(text)
  const target = Math.max(1, prompt.minWords)
  const ratio = words / target

  let score: number
  let note: string

  if (words === 0) {
    score = 0
    note = '¡Ay, no! No escribiste nada todavía. Dale, échale ganas.'
  } else if (ratio >= 1) {
    score = 85
    note = '¡Órale! Cumpliste con el largo. No pude revisar la gramática a fondo, pero vas chingón — sigue practicando.'
  } else if (ratio >= 0.6) {
    score = 65
    note = 'Vas bien, pero quédate corto te quedaste. Estírate un poquito más la próxima — ¡tú puedes!'
  } else {
    score = 45
    note = 'Buen comienzo, pero escribe más para practicar de verdad. ¡No te rajes!'
  }

  return {
    score,
    note,
    corrections: [],
    strengths: words >= target ? ['Alcanzaste el largo objetivo'] : [],
  }
}
