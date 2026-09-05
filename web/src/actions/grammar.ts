"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import {
  EXERCISES_PER_GENERATION,
  GRAMMAR_MODELS,
  buildGrammarPrompt,
  getChapter,
  grammarQuestionsArraySchema,
  serializeChapterContent,
  toPoolItems,
  type GrammarQuestion,
} from "@chingon/shared"
import { createClient } from "@/utils/supabase/server"
import { getUserAccess } from "@/lib/premium"

// Grammar pool writes. Reads live in web/src/lib/grammarPool.ts.
//
// Both actions are thin: the DB is the authorization boundary (027 gates
// add_grammar_exercises on premium-or-admin and record_grammar_progress on
// RLS), so these wrappers only shape data and translate errors.

export type GrammarProgressResult = { content_key: string; correct: boolean }

/**
 * Mark a finished session's items as seen. Fire-and-forget from the client:
 * a failure costs variety on the next visit, never the score the user just
 * earned, so it never surfaces as an error.
 */
export async function recordGrammarProgress(
  level: string,
  chapterId: number,
  results: GrammarProgressResult[],
): Promise<{ recorded: number }> {
  if (!results.length) return { recorded: 0 }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("record_grammar_progress", {
    p_level: level.toLowerCase(),
    p_chapter_id: chapterId,
    p_results: results.slice(0, 64),
  })
  if (error) {
    console.error("[grammar] progress write failed:", error.message)
    return { recorded: 0 }
  }
  return { recorded: (data as number) ?? 0 }
}

/**
 * Generate a fresh batch for one chapter and add it to the shared pool.
 * Admin-only here (it spends money); premium users feed the same pool from
 * mobile through their existing 3-per-day quota.
 */
export async function adminGenerateGrammarExercises(
  level: string,
  chapterId: number,
  count: number = EXERCISES_PER_GENERATION,
): Promise<{ generated: number; inserted: number; model?: string; error?: string }> {
  const { isAdmin } = await getUserAccess()
  if (!isAdmin) return { generated: 0, inserted: 0, error: "Solo admins" }

  const chapter = getChapter(level, chapterId)
  if (!chapter) return { generated: 0, inserted: 0, error: "Capítulo no encontrado" }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error("[grammar] GEMINI_API_KEY is not set")
    return { generated: 0, inserted: 0, error: "API key no configurada" }
  }

  const wanted = Math.min(Math.max(Math.trunc(count) || EXERCISES_PER_GENERATION, 4), 16)
  const prompt = buildGrammarPrompt(level, chapter.title, serializeChapterContent(chapter), wanted)
  const genAI = new GoogleGenerativeAI(apiKey)

  let exercises: GrammarQuestion[] | null = null
  let usedModel: string | undefined
  let lastError = "El modelo no devolvió ejercicios válidos"

  // Same ladder as the offline bake: cheapest model first, fall through on
  // rate limits or malformed output.
  for (const modelName of GRAMMAR_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        // Same config as the offline bake that produced all 936 baked items:
        // JSON mime type only. Shape is enforced by Zod below, which the
        // OpenAPI-subset responseSchema cannot express anyway (options is a
        // 4-tuple).
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      })
      const result = await model.generateContent(prompt)
      const parsed = grammarQuestionsArraySchema.safeParse(JSON.parse(result.response.text()))
      if (!parsed.success) {
        lastError = `Respuesta inválida de ${modelName}`
        continue
      }
      exercises = parsed.data as GrammarQuestion[]
      usedModel = modelName
      break
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
      console.error(`[grammar] ${modelName} failed:`, lastError)
    }
  }

  if (!exercises?.length) return { generated: 0, inserted: 0, error: lastError }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("add_grammar_exercises", {
    p_level: level.toLowerCase(),
    p_chapter_id: chapterId,
    p_items: toPoolItems(exercises).slice(0, 16),
    p_source: "admin",
    p_model: usedModel ?? null,
  })
  if (error) {
    console.error("[grammar] pool insert failed:", error.message)
    return { generated: exercises.length, inserted: 0, error: "No se pudo guardar en el pool" }
  }

  // inserted < generated means the model repeated itself — expected, and the
  // unique index on content_key is what makes re-running safe.
  return { generated: exercises.length, inserted: (data as number) ?? 0, model: usedModel }
}
