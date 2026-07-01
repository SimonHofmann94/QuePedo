"use server"

import { createClient } from "@/utils/supabase/server"
import { isUserPremium } from "@/lib/premium"
import {
  getChapter,
  serializeChapterContent,
  type SpeakingExercise,
} from "@chingon/shared"

export type SpeakingLoadResult =
  | { ok: true; exercises: SpeakingExercise[] }
  | { ok: false; code: "NOT_PREMIUM" | "NO_EXERCISES" | "ERROR"; message: string }

export interface SpeakingFeedback {
  feedback: string
  corrections: Array<{ wrong: string; correct: string; explanation: string }>
  tip: string
}

/**
 * Select a diverse mix of speaking exercises from a pool.
 * Aims for an even split across the three types when count divides evenly.
 */
function selectExercises(all: SpeakingExercise[], count: number): SpeakingExercise[] {
  const types = ["read_aloud", "translate_speak", "listen_repeat"] as const
  const grouped: Record<string, SpeakingExercise[]> = {}

  for (const type of types) {
    grouped[type] = all.filter((ex) => ex.type === type).sort(() => Math.random() - 0.5)
  }

  const perType = Math.floor(count / types.length)
  const selected: SpeakingExercise[] = []

  for (const type of types) {
    selected.push(...(grouped[type] || []).slice(0, perType))
  }

  const remaining = count - selected.length
  if (remaining > 0) {
    const used = new Set(selected)
    const leftover = all.filter((ex) => !used.has(ex)).sort(() => Math.random() - 0.5)
    selected.push(...leftover.slice(0, remaining))
  }

  return selected.sort(() => Math.random() - 0.5)
}

/**
 * Load speaking exercises for a grammar chapter. Premium-gated.
 * Cache-first (speaking_exercise_cache), falling back to the
 * `generate-speaking-exercises` edge function on a miss.
 *
 * Runs server-side so the edge-function call is server-to-server (no CORS).
 */
export async function getSpeakingExercises(
  level: string,
  chapterId: number,
  count: number = 6,
): Promise<SpeakingLoadResult> {
  if (!(await isUserPremium())) {
    return { ok: false, code: "NOT_PREMIUM", message: "La práctica de habla es solo para Premium." }
  }

  const supabase = await createClient()

  // Try cache first.
  const { data: cached } = await supabase
    .from("speaking_exercise_cache")
    .select("exercises")
    .eq("level", level.toUpperCase())
    .eq("chapter_id", chapterId)
    .single()

  if (cached && Array.isArray(cached.exercises) && cached.exercises.length > 0) {
    return { ok: true, exercises: selectExercises(cached.exercises as SpeakingExercise[], count) }
  }

  // Cache miss — serialize the chapter and ask the edge function to generate.
  const chapter = getChapter(level, chapterId)
  if (!chapter) {
    return { ok: false, code: "NO_EXERCISES", message: "No encontramos ese capítulo." }
  }

  try {
    const { data, error } = await supabase.functions.invoke("generate-speaking-exercises", {
      body: {
        level: level.toUpperCase(),
        chapterId,
        chapterTitle: chapter.title,
        chapterContent: serializeChapterContent(chapter),
        count: 12,
      },
    })

    if (error || !Array.isArray(data) || data.length === 0) {
      console.error("[Speaking] generate failed", error)
      return {
        ok: false,
        code: "NO_EXERCISES",
        message: "Aún no hay ejercicios para este capítulo. Prueba con otro.",
      }
    }

    return { ok: true, exercises: selectExercises(data as SpeakingExercise[], count) }
  } catch (e) {
    console.error("[Speaking] generate error", e)
    return { ok: false, code: "ERROR", message: "No pudimos conectar con el servidor." }
  }
}

/**
 * Optional AI feedback for an incorrect spoken answer. Non-fatal:
 * returns null on any failure so the UI can simply omit the feedback.
 */
export async function getSpeakingFeedback(
  expectedText: string,
  transcribedText: string,
  exerciseType: string,
  level: string,
  chapterTitle: string,
): Promise<SpeakingFeedback | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.functions.invoke("evaluate-speaking", {
      body: { expectedText, transcribedText, exerciseType, level, chapterTitle },
    })
    if (error || !data) return null
    return {
      feedback: data.feedback || "",
      corrections: Array.isArray(data.corrections) ? data.corrections : [],
      tip: data.tip || "",
    }
  } catch (e) {
    console.error("[Speaking] feedback error", e)
    return null
  }
}
