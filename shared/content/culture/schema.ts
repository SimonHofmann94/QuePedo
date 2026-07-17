// Zod schema for culture content — the server-side write gate for the CMS.
// Mirrors types.ts exactly; keep both in sync (schema validates, interfaces
// type the bundled JSON and the app code).
import { z } from 'zod'

const localizedText = z.object({
  en: z.string().trim().min(1),
  de: z.string().trim().min(1),
})

export const cultureCountrySchema = z.object({
  id: z.string().regex(/^[a-z]{2}$/),
  flag: z.string().trim().min(1),
  name: localizedText,
  nameEs: z.string().trim().min(1),
  capital: z.string().trim().min(1),
  population: z.string().trim().min(1),
  intro: localizedText,
  funFact: localizedText,
  slang: z
    .array(
      z.object({
        term: z.string().trim().min(1),
        meaning: localizedText,
        example: z.string().optional(),
      }),
    )
    .min(1),
  vocabulary: z
    .array(
      z.object({
        es: z.string().trim().min(1),
        translation: localizedText,
        note: localizedText.optional(),
      }),
    )
    .min(1),
  sights: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        description: localizedText,
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        emoji: z.string().trim().min(1),
      }),
    )
    .min(1),
})

export type CultureCountryInput = z.infer<typeof cultureCountrySchema>
