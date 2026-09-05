// Server-side exercise resolution: baked bundle ∪ grammar_exercises (027),
// then one session's worth, unseen items first.
//
// Mirrors the layering in web/src/lib/culture.ts — the bundle is the base and
// the DB is additive, so a Supabase hiccup costs variety, never the lesson.
import { createClient } from "@/utils/supabase/server"
import {
  EXERCISES_PER_SESSION,
  getChapterExercises,
  grammarQuestionSchema,
  mergePool,
  selectSession,
  type GrammarQuestion,
} from "@chingon/shared"

export interface ChapterSession {
  /** The questions to play, already selected and shuffled. */
  questions: GrammarQuestion[]
  /** Everything available for this chapter (bundle + DB), for the counter. */
  poolSize: number
}

/** Pool rows for one chapter. Malformed payloads are dropped, not served. */
async function fetchDbPool(level: string, chapterId: number): Promise<GrammarQuestion[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("grammar_exercises")
      .select("payload")
      .eq("level", level.toLowerCase())
      .eq("chapter_id", chapterId)
    if (error || !data?.length) return []

    const out: GrammarQuestion[] = []
    for (const row of data) {
      const parsed = grammarQuestionSchema.safeParse(row.payload)
      if (parsed.success) out.push(parsed.data as GrammarQuestion)
    }
    if (out.length < data.length) {
      console.error(`[grammar] ${data.length - out.length} malformed pool rows skipped (${level}/${chapterId})`)
    }
    return out
  } catch (err) {
    console.error("[grammar] pool read failed — bundle only:", err)
    return []
  }
}

/** content_keys this user has already been served. Empty when signed out. */
async function fetchSeenKeys(level: string, chapterId: number): Promise<Set<string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("user_grammar_progress")
      .select("content_key")
      .eq("level", level.toLowerCase())
      .eq("chapter_id", chapterId)
    return new Set((data ?? []).map((r) => r.content_key as string))
  } catch {
    return new Set()
  }
}

export async function getChapterSession(
  level: string,
  chapterId: number,
  count: number = EXERCISES_PER_SESSION,
): Promise<ChapterSession> {
  const baked = getChapterExercises(level, chapterId) ?? []
  const [fromDb, seen] = await Promise.all([
    fetchDbPool(level, chapterId),
    fetchSeenKeys(level, chapterId),
  ])

  const pool = mergePool(baked, fromDb)
  return { questions: selectSession(pool, count, seen), poolSize: pool.length }
}

/** Per-chapter pool sizes for the admin generator. DB rows only. */
export async function getPoolCounts(level: string): Promise<Record<number, number>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("grammar_exercises")
    .select("chapter_id")
    .eq("level", level.toLowerCase())
  const counts: Record<number, number> = {}
  for (const row of data ?? []) {
    const id = row.chapter_id as number
    counts[id] = (counts[id] ?? 0) + 1
  }
  return counts
}
