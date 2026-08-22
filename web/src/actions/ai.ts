'use server'

import { GoogleGenerativeAI } from "@google/generative-ai"
import { getLocale } from "next-intl/server"
import { z } from "zod"
import { generatedVocabularySchema, type GeneratedVocabularyWord } from "@/types/schemas"
import { createClient } from "@/utils/supabase/server"
import {
    MODEL,
    MAX_COUNT,
    MAX_PROMPT_WORDS,
    RESPONSE_SCHEMA,
    buildPrompt,
} from "@/lib/vocabPrompt"

export async function generateVocabulary(userPrompt: string, count: number = 5): Promise<GeneratedVocabularyWord[]> {
    // This action spends money. Anonymous callers used to be able to drive the
    // Gemini bill straight from the landing page.
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const trimmed = userPrompt.trim()
    if (!trimmed) throw new Error("Prompt is required")
    if (trimmed.split(/\s+/).length > MAX_PROMPT_WORDS) {
        throw new Error(`Prompt must be at most ${MAX_PROMPT_WORDS} words`)
    }
    const wordCount = Math.min(Math.max(Math.trunc(count) || 5, 1), MAX_COUNT)

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set in environment")
        throw new Error("API key not configured")
    }

    const locale = await getLocale()

    try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
            model: MODEL,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
            },
        })

        const result = await model.generateContent(buildPrompt(trimmed, wordCount, locale))
        const parsed = z
            .array(generatedVocabularySchema)
            .safeParse(JSON.parse((await result.response).text()))

        if (!parsed.success) {
            console.error("Gemini returned an unexpected shape:", parsed.error.issues)
            throw new Error("The model returned malformed vocabulary")
        }
        return parsed.data
    } catch (error) {
        console.error("Error generating vocabulary:", error)
        if (error instanceof Error) {
            throw new Error(`Failed to generate vocabulary: ${error.message}`)
        }
        throw new Error("Failed to generate vocabulary: Unknown error")
    }
}
