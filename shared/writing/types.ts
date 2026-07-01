// Writing exercise — shared types (interfaces only, no logic, no I/O).

/** A prompt inviting the learner to write a short Spanish text, seeded from a grammar chapter. */
export interface WritingPrompt {
  /** Stable id, e.g. `a1-3`. */
  id: string
  /** CEFR level slug: `a1`…`c2`. */
  level: string
  /** Source grammar chapter id. */
  chapterId: number
  /** Source chapter title (shown as context). */
  chapterTitle: string
  /** Spanish instruction inviting the user to write. */
  prompt: string
  /** Minimum words we nudge the learner to reach. */
  minWords: number
  /** Short Mexican-Spanish hints to guide the writing. */
  guidance: string[]
}

/** A single correction the grader (AI or fallback) suggests. */
export interface WritingCorrection {
  /** The learner's text fragment that was off. */
  wrong: string
  /** The corrected Spanish. */
  correct: string
  /** Why — short, friendly explanation. */
  explanation: string
}

/** Structured grading of a piece of writing. */
export interface WritingFeedback {
  /** Overall score 0–100. */
  score: number
  /** Encouraging Mexican-Spanish note. */
  note: string
  /** Concrete corrections (may be empty when the text is solid). */
  corrections: WritingCorrection[]
  /** Things the learner did well (may be empty). */
  strengths: string[]
}

/** A completed writing attempt, passed from play → results. */
export interface WritingResult {
  prompt: WritingPrompt
  text: string
  feedback: WritingFeedback
}
