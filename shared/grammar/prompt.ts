// The one Gemini prompt for grammar-exercise generation.
//
// Lifted out of scripts/build-grammar-exercises.mjs so the offline bake, the
// admin generator (web/src/actions/grammarPool.ts) and any future caller emit
// the SAME exercises in the same shape. Editing the wording here changes all
// of them at once — that is the point.
import { fewShotPromptBlock } from './fewShotExamples'

/** Cheapest first; callers walk the ladder on 429/5xx. Mirrors build-vocab.mjs. */
export const GRAMMAR_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
] as const

/** One batch = 12, i.e. 3 per type. Also the RPC's practical ceiling (16). */
export const EXERCISES_PER_GENERATION = 12

export function buildGrammarPrompt(
  level: string,
  chapterTitle: string,
  serializedChapter: string,
  count: number = EXERCISES_PER_GENERATION,
): string {
  const perType = Math.max(1, Math.floor(count / 4))
  const total = perType * 4
  return `You generate Spanish grammar exercises for a CEFR-graded language-learning app.

OUTPUT FORMAT — return ONLY a JSON array of exactly ${total} objects matching one of these shapes:
- multiple_choice:    { "type": "multiple_choice", "prompt": "…", "options": ["A","B","C","D"], "correctAnswer": "A", "explanation": "…" }
- fill_in_blank:      { "type": "fill_in_blank", "sentenceWithBlank": "… ___ …", "correctAnswer": "…", "acceptableAnswers": ["…"], "hint": "…", "explanation": "…" }
- sentence_reorder:   { "type": "sentence_reorder", "correctSentence": "…", "shuffledWords": ["…"], "hint": "…", "explanation": "…" }
- error_correction:   { "type": "error_correction", "sentenceWithError": "…", "errorWord": "…", "correctedWord": "…", "acceptableCorrections": ["…"], "explanation": "…" }

CONSTRAINTS:
- Generate EXACTLY ${perType} of each type. Total exactly ${total} exercises.
- Difficulty must match the CEFR level given below.
- Examples must be in Spanish; explanations in English.
- Distractors (wrong options) must be plausible for a learner at this level.
- Use ONLY grammar covered in the chapter content below.
- For sentence_reorder: shuffledWords must contain the exact tokens of correctSentence in a random order.
- For error_correction: errorWord must appear verbatim in sentenceWithError.
- For fill_in_blank: sentenceWithBlank MUST contain the substring "___" (three underscores) where the blank goes.

Here is one example of the desired tone for each type:

${fewShotPromptBlock()}

(End of examples — do NOT repeat them. Generate fresh exercises for the chapter below.)

CEFR LEVEL: ${level.toUpperCase()}
CHAPTER TITLE: ${chapterTitle}

CHAPTER CONTENT:
${serializedChapter}

Generate ${total} exercises now. Return ONLY the JSON array.`
}
