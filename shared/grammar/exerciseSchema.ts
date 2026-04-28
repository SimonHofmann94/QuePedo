// Zod schema for the GrammarQuestion discriminated union.
// Used by build-grammar-exercises.mjs to validate Gemini output, and
// available for any future runtime validation (server actions, etc.).
//
// The compile-time _Assert below pins the Zod-inferred type to the
// existing TS union in `exerciseTypes.ts` so they can never drift.

import { z } from 'zod'
import type { GrammarQuestion } from './exerciseTypes'

const multipleChoiceSchema = z.object({
  type: z.literal('multiple_choice'),
  prompt: z.string().min(1),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
})

const fillInBlankSchema = z.object({
  type: z.literal('fill_in_blank'),
  sentenceWithBlank: z.string().includes('___'),
  correctAnswer: z.string().min(1),
  acceptableAnswers: z.array(z.string()).optional(),
  hint: z.string().optional(),
  explanation: z.string().optional(),
})

const sentenceReorderSchema = z.object({
  type: z.literal('sentence_reorder'),
  correctSentence: z.string().min(1),
  shuffledWords: z.array(z.string()).min(2),
  hint: z.string().optional(),
  explanation: z.string().optional(),
})

const errorCorrectionSchema = z.object({
  type: z.literal('error_correction'),
  sentenceWithError: z.string().min(1),
  errorWord: z.string().min(1),
  correctedWord: z.string().min(1),
  acceptableCorrections: z.array(z.string()).optional(),
  explanation: z.string().optional(),
})

export const grammarQuestionSchema = z.discriminatedUnion('type', [
  multipleChoiceSchema,
  fillInBlankSchema,
  sentenceReorderSchema,
  errorCorrectionSchema,
])

export const grammarQuestionsArraySchema = z.array(grammarQuestionSchema)

// JSON Schema (OpenAPI-3.0 subset) for Gemini's responseSchema.
// Inline to avoid pulling extra dependencies. Keep in sync with the
// Zod schema above.
export const grammarQuestionsResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['multiple_choice', 'fill_in_blank', 'sentence_reorder', 'error_correction'],
      },
      // multiple_choice
      prompt: { type: 'string' },
      options: { type: 'array', items: { type: 'string' } },
      correctAnswer: { type: 'string' },
      // fill_in_blank
      sentenceWithBlank: { type: 'string' },
      acceptableAnswers: { type: 'array', items: { type: 'string' } },
      hint: { type: 'string' },
      // sentence_reorder
      correctSentence: { type: 'string' },
      shuffledWords: { type: 'array', items: { type: 'string' } },
      // error_correction
      sentenceWithError: { type: 'string' },
      errorWord: { type: 'string' },
      correctedWord: { type: 'string' },
      acceptableCorrections: { type: 'array', items: { type: 'string' } },
      // common
      explanation: { type: 'string' },
    },
    required: ['type'],
  },
} as const

// Compile-time assert: Zod inference matches the TS union exactly.
type ZodInferred = z.infer<typeof grammarQuestionSchema>
type _Assert1 = GrammarQuestion extends ZodInferred ? true : never
type _Assert2 = ZodInferred extends GrammarQuestion ? true : never
const _a: _Assert1 = true
const _b: _Assert2 = true
void _a
void _b
