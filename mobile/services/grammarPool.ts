// Grammar exercise pool on mobile: bundled JSON ∪ grammar_exercises (027).
//
// Mirrors web/src/lib/grammarPool.ts and services/culture.ts — the bundle is
// the base AND the offline path, the DB is additive. Every Supabase call here
// is wrapped: on a plane you still get the baked exercises.
import { supabase } from '@/lib/supabase'
import {
  EXERCISES_PER_SESSION,
  exerciseKey,
  getChapterExercises,
  grammarQuestionSchema,
  mergePool,
  selectSession,
  toPoolItems,
  type GrammarQuestion,
} from '@chingon/shared'

export interface ChapterSession {
  questions: GrammarQuestion[]
  poolSize: number
}

async function fetchDbPool(level: string, chapterId: number): Promise<GrammarQuestion[]> {
  try {
    const { data, error } = await supabase
      .from('grammar_exercises')
      .select('payload')
      .eq('level', level.toLowerCase())
      .eq('chapter_id', chapterId)
    if (error || !data?.length) return []
    const out: GrammarQuestion[] = []
    for (const row of data) {
      const parsed = grammarQuestionSchema.safeParse(row.payload)
      if (parsed.success) out.push(parsed.data as GrammarQuestion)
    }
    return out
  } catch {
    return []
  }
}

async function fetchSeenKeys(level: string, chapterId: number): Promise<Set<string>> {
  try {
    const { data } = await supabase
      .from('user_grammar_progress')
      .select('content_key')
      .eq('level', level.toLowerCase())
      .eq('chapter_id', chapterId)
    return new Set((data ?? []).map((r) => r.content_key as string))
  } catch {
    return new Set()
  }
}

/**
 * One session for a chapter: unseen first, balanced across types, shuffled.
 * Never throws — a chapter with no bundled content and no DB rows returns [].
 */
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

/**
 * Add freshly generated exercises to the shared pool. This is what turns a
 * premium user's 3 daily generations into permanent content instead of
 * throwaway questions. Duplicates are dropped by the unique index in 027, so
 * calling this twice with the same batch is harmless.
 *
 * Best-effort: the user already has their questions on screen: a failed
 * insert must never block the test.
 */
export async function addToPool(
  level: string,
  chapterId: number,
  exercises: GrammarQuestion[],
  model?: string,
): Promise<number> {
  // The edge function's output is never schema-checked on its way here, and
  // this is the pool's least-trusted write path — a malformed item would
  // become a junk row that every future read silently drops.
  const valid = exercises.filter((ex) => grammarQuestionSchema.safeParse(ex).success)
  if (!valid.length) return 0
  try {
    const { data, error } = await supabase.rpc('add_grammar_exercises', {
      p_level: level.toLowerCase(),
      p_chapter_id: chapterId,
      p_items: toPoolItems(valid).slice(0, 16),
      p_source: 'ai',
      p_model: model ?? null,
    })
    if (error) {
      console.error('[grammar] pool insert failed:', error.message)
      return 0
    }
    return (data as number) ?? 0
  } catch (e) {
    console.error('[grammar] pool insert threw:', e)
    return 0
  }
}

/** Mark a finished session's items as seen. Best-effort, same as the web. */
export async function recordProgress(
  level: string,
  chapterId: number,
  results: { question: GrammarQuestion; correct: boolean }[],
): Promise<number> {
  if (!results.length) return 0
  try {
    const { data, error } = await supabase.rpc('record_grammar_progress', {
      p_level: level.toLowerCase(),
      p_chapter_id: chapterId,
      p_results: results
        .slice(0, 64)
        .map((r) => ({ content_key: exerciseKey(r.question), correct: r.correct })),
    })
    if (error) {
      console.error('[grammar] progress write failed:', error.message)
      return 0
    }
    return (data as number) ?? 0
  } catch {
    return 0
  }
}
