export interface MultipleChoiceQuestion {
  type: 'multiple_choice'
  prompt: string
  options: [string, string, string, string]
  correctAnswer: string
  explanation?: string
}

export interface FillInBlankQuestion {
  type: 'fill_in_blank'
  sentenceWithBlank: string
  correctAnswer: string
  acceptableAnswers?: string[]
  hint?: string
  explanation?: string
}

export type GrammarQuestion = MultipleChoiceQuestion | FillInBlankQuestion

export interface GrammarTestResult {
  question: GrammarQuestion
  userAnswer: string
  correct: boolean
}
