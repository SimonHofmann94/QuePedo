// Listening ("Escucha") exercise types — shared between web and mobile.
// The app speaks `spanish` aloud via TTS (platform-specific, NOT in shared);
// the learner picks the correct meaning from `options`.

export interface ListeningItem {
  /** Stable id within a generated set. */
  id: string
  /** Spanish sentence spoken aloud via TTS (lang es-ES). */
  spanish: string
  /** Correct meaning (English — sourced from grammar example pairs). */
  answer: string
  /** Multiple-choice options (shuffled, includes `answer`). */
  options: string[]
  /** CEFR level the item came from, e.g. "a1". */
  level: string
}

export interface ListeningResult {
  item: ListeningItem
  /** Option the learner picked (empty string if skipped). */
  selected: string
  correct: boolean
}
