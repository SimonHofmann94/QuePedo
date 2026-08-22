// Zod schema for culture content — the server-side write gate for the CMS.
// Mirrors types.ts exactly; keep both in sync (schema validates, interfaces
// type the bundled JSON and the app code).
//
// EVERY v2 FIELD IS .optional() ON PURPOSE. This schema also parses rows that
// admins saved before v2 existed; a required new field would make those rows
// fail safeParse in lib/culture.ts + services/culture.ts, which silently fall
// back to the bundled JSON — i.e. the admin's edits vanish with no error.
// Editorial floors (sight counts, image presence, lengths) live in
// culture.check.ts, which runs over the bundled JSON only.
import { z } from 'zod'

const localizedText = z.object({
  en: z.string().trim().min(1),
  de: z.string().trim().min(1),
})

// NEW. Deliberately loose: host/width/license correctness is enforced by
// culture.check.ts for bundled content. Here we only stop obvious garbage,
// because an admin fixing a typo must never be blocked from saving.
const cultureImage = z.object({
  url: z.string().url().startsWith('https://upload.wikimedia.org/wikipedia/commons/'),
  sourcePage: z.string().url().startsWith('https://commons.wikimedia.org/wiki/File:'),
  author: z.string().trim().min(1),
  license: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: localizedText,
})

export const cultureCountrySchema = z.object({
  id: z.string().regex(/^[a-z]{2}$/),
  flag: z.string().trim().min(1),
  name: localizedText,
  nameEs: z.string().trim().min(1),
  capital: z.string().trim().min(1),
  population: z.string().trim().min(1),
  tagline: localizedText.optional(),                 // NEW, optional
  heroImage: cultureImage.optional(),                // NEW, optional
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
        image: cultureImage.optional(),              // NEW, optional
      }),
    )
    .min(1),
  food: z                                            // NEW, optional
    .array(
      z.object({
        name: z.string().trim().min(1),
        description: localizedText,
        image: cultureImage.optional(),
      }),
    )
    .optional(),
  festivals: z                                       // NEW, optional
    .array(
      z.object({
        name: z.string().trim().min(1),
        when: localizedText,
        description: localizedText,
        image: cultureImage.optional(),
      }),
    )
    .optional(),
  etiquette: z                                       // NEW, optional
    .array(
      z.object({
        title: z.string().trim().min(1),
        text: localizedText,
      }),
    )
    .optional(),
})

export type CultureCountryInput = z.infer<typeof cultureCountrySchema>
