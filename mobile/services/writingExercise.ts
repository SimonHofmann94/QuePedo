import { supabase } from '@/lib/supabase'
import {
  buildWritingPrompt,
  evaluateWriting,
  type WritingFeedback,
  type WritingPrompt,
} from '@chingon/shared'

/**
 * Grade a piece of Spanish writing via the `evaluate-writing` Supabase edge
 * function. NEVER throws: on any failure (auth, absent function, network, bad
 * payload) it degrades to the shared offline `evaluateWriting` heuristic so the
 * results screen always has something to show.
 *
 * NOTE: the `evaluate-writing` edge function lives outside this repo and must be
 * deployed separately (same as `evaluate-speaking` / `generate-speaking-exercises`).
 */
export async function getWritingFeedback(
  level: string,
  chapterId: number,
  text: string,
): Promise<WritingFeedback> {
  const prompt: WritingPrompt =
    buildWritingPrompt(level, chapterId) ?? {
      id: `${level}-${chapterId}`,
      level: level.toLowerCase(),
      chapterId,
      chapterTitle: '',
      prompt: '',
      minWords: 40,
      guidance: [],
    }

  // Auth — if we can't confirm the user, just grade offline rather than crash.
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return evaluateWriting(text, prompt)
  }

  let data: unknown
  let error: unknown
  try {
    const result = await supabase.functions.invoke('evaluate-writing', {
      body: {
        level: level.toUpperCase(),
        chapterId,
        chapterTitle: prompt.chapterTitle,
        prompt: prompt.prompt,
        text,
      },
    })
    data = result.data
    error = result.error
  } catch (e) {
    console.error('[Writing Exercise] network/invoke error', e)
    return evaluateWriting(text, prompt)
  }

  if (error || !isFeedback(data)) {
    if (error) console.error('[Writing Exercise] edge function error', error)
    return evaluateWriting(text, prompt)
  }

  return {
    score: clampScore(data.score),
    note: data.note || '¡Órale! Buen intento.',
    corrections: Array.isArray(data.corrections) ? data.corrections : [],
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
  }
}

function clampScore(score: unknown): number {
  const n = typeof score === 'number' ? score : Number(score)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

function isFeedback(data: unknown): data is WritingFeedback {
  return (
    typeof data === 'object' &&
    data !== null &&
    'score' in data &&
    'note' in data
  )
}
