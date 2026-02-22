export interface ReadAloudExercise {
  type: 'read_aloud'
  spanishText: string
  translation: string
  explanation?: string
}

export interface TranslateSpeakExercise {
  type: 'translate_speak'
  promptText: string
  expectedSpanish: string
  acceptableVariations?: string[]
  explanation?: string
}

export interface ListenRepeatExercise {
  type: 'listen_repeat'
  spanishText: string
  translation: string
  explanation?: string
}

export type SpeakingExercise = ReadAloudExercise | TranslateSpeakExercise | ListenRepeatExercise

export interface WordResult {
  word: string
  status: 'correct' | 'incorrect' | 'missing' | 'extra'
  expected?: string
}

export interface SpeakingResult {
  exercise: SpeakingExercise
  transcription: string
  expectedText: string
  correct: boolean
  wordResults: WordResult[]
  aiFeedback?: string
}
