// Prompt + response schema for AI vocabulary generation.
// Kept out of the "use server" action so it can be imported by a check script:
// a server action file can only export async functions, and pulling in
// utils/supabase/server drags in next/headers. See vocabPrompt.check.ts.
import { SchemaType, type ResponseSchema } from "@google/generative-ai"

export const MODEL = "gemini-3-flash-preview"
export const MAX_COUNT = 20
export const MAX_PROMPT_WORDS = 50

// Spanish words routinely carry several unrelated senses, so every language gets
// a LIST of meanings. `de`/`en` are always present so the UI can follow the app
// locale no matter which language the user typed their request in; `es` holds a
// short Spanish definition, which is what a Spanish-locale learner wants to read.
export const RESPONSE_SCHEMA: ResponseSchema = {
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            term: { type: SchemaType.STRING },
            translations: {
                type: SchemaType.OBJECT,
                properties: {
                    de: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    en: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    es: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                },
                required: ["de", "en", "es"],
            },
            context_sentence: { type: SchemaType.STRING },
            difficulty_rating: { type: SchemaType.INTEGER },
            tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            synonyms: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        },
        required: ["term", "translations", "context_sentence", "difficulty_rating", "tags", "synonyms"],
    },
}

export function buildPrompt(userPrompt: string, count: number, locale: string) {
    return `You are a Spanish vocabulary tutor. The learner's app language is "${locale}".

Generate ${count} Spanish vocabulary words for this request: "${userPrompt}"

For every word return translations in ALL THREE languages:
- "de": German translation(s)
- "en": English translation(s)
- "es": a short Spanish definition or close synonym (NOT the word itself)

Each is a LIST of meanings, ordered most-common first:
- Give SEVERAL meanings when the Spanish word genuinely has distinct senses.
  "el banco" -> de: ["die Bank (Geldinstitut)", "die Sitzbank"], en: ["bank", "bench"]
  "tiempo"   -> de: ["die Zeit", "das Wetter"],                  en: ["time", "weather"]
- Give exactly ONE meaning when the word has only one sense. Do NOT pad the list
  with near-synonyms: "la casa" is ["das Haus"], not ["das Haus", "das Heim", "die Wohnung"].
- German nouns include their article (der/die/das). Disambiguate with a short
  parenthetical when two senses would otherwise read identically.

Also return:
- term: the Spanish word or phrase, with its article for nouns ("el gato")
- context_sentence: one simple Spanish sentence using the word in its primary sense
- difficulty_rating: integer 1-5
- tags: English topic tags
- synonyms: Spanish synonyms, empty list if none`
}
