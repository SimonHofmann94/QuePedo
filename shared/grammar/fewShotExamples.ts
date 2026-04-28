// Few-shot examples for Gemini grammar-exercise generation.
// One canonical example per question type — used in the system prompt
// to anchor tone, explanation style, and JSON shape. Edit these and
// re-run scripts/build-grammar-exercises.mjs to refine the bake.
//
// Goals:
// - Show the format Gemini must emit (matches Zod schema)
// - Demonstrate good distractors (plausible but wrong)
// - Demonstrate bilingual explanation pattern (English explanation,
//   Spanish examples)
// - Keep at A1/A2 level so they don't confuse the model on harder
//   chapters

import type {
  MultipleChoiceQuestion,
  FillInBlankQuestion,
  SentenceReorderQuestion,
  ErrorCorrectionQuestion,
} from './exerciseTypes'

const multipleChoice: MultipleChoiceQuestion = {
  type: 'multiple_choice',
  prompt: 'Which article correctly completes: "___ ciudad es bonita"?',
  options: ['La', 'El', 'Un', 'Los'],
  correctAnswer: 'La',
  explanation:
    '"Ciudad" ends in -dad, which makes it feminine. The feminine singular definite article is "la".',
}

const fillInBlank: FillInBlankQuestion = {
  type: 'fill_in_blank',
  sentenceWithBlank: 'Yo ___ estudiante de español.',
  correctAnswer: 'soy',
  acceptableAnswers: ['soy'],
  hint: 'First-person singular of "ser"',
  explanation:
    '"Ser" is conjugated "yo soy" in the first person singular. We use "ser" for permanent identity (profession, nationality).',
}

const sentenceReorder: SentenceReorderQuestion = {
  type: 'sentence_reorder',
  correctSentence: 'Mi hermana vive en Madrid.',
  shuffledWords: ['vive', 'Madrid', 'Mi', 'en', 'hermana'],
  hint: 'Subject + verb + place',
  explanation:
    'Spanish word order for simple statements is Subject-Verb-Object/Complement: "Mi hermana (subject) vive (verb) en Madrid (place)".',
}

const errorCorrection: ErrorCorrectionQuestion = {
  type: 'error_correction',
  sentenceWithError: 'La problema es muy grande.',
  errorWord: 'La',
  correctedWord: 'El',
  acceptableCorrections: ['El'],
  explanation:
    '"Problema" is masculine despite ending in -a (Greek-origin nouns ending in -ma are usually masculine: el problema, el tema, el sistema). The correct article is "el".',
}

export const fewShotExamples = {
  multipleChoice,
  fillInBlank,
  sentenceReorder,
  errorCorrection,
}

/**
 * Render the few-shot block as a single JSON-formatted string suitable
 * for embedding in a Gemini prompt. The model sees ALL FOUR types in
 * one go so it learns the exact shape.
 */
export function fewShotPromptBlock(): string {
  return JSON.stringify(
    [multipleChoice, fillInBlank, sentenceReorder, errorCorrection],
    null,
    2,
  )
}
