import { supabase } from '@/lib/supabase'
import { grammarA1 } from '@chingon/shared'
import { grammarA2 } from '@chingon/shared'
import { grammarB1 } from '@chingon/shared'
import { grammarB2 } from '@chingon/shared'
import { grammarC1 } from '@chingon/shared'
import { grammarC2 } from '@chingon/shared'
import type { GrammarLevel } from '@chingon/shared'
import type { GrammarQuestion } from '@chingon/shared'
import { serializeChapterContent } from '@chingon/shared'

const LEVEL_DATA: Record<string, GrammarLevel> = {
  a1: grammarA1,
  a2: grammarA2,
  b1: grammarB1,
  b2: grammarB2,
  c1: grammarC1,
  c2: grammarC2,
}

export type GrammarExerciseErrorCode =
  | 'AUTH_ERROR'
  | 'NOT_PREMIUM'
  | 'EDGE_FUNCTION_ERROR'
  | 'GEMINI_API_ERROR'
  | 'INVALID_RESPONSE'
  | 'NETWORK_ERROR'
  | 'NO_EXERCISES'

export class GrammarExerciseError extends Error {
  code: GrammarExerciseErrorCode
  details?: string

  constructor(code: GrammarExerciseErrorCode, message: string, details?: string) {
    super(message)
    this.name = 'GrammarExerciseError'
    this.code = code
    this.details = details
  }
}

// serializeChapterContent now lives in @chingon/shared/grammar/serialize.

/**
 * Select a diverse mix of exercises from a pool.
 * Aims for 2 of each type when count=8, with shuffled order.
 */
function selectExercises(all: GrammarQuestion[], count: number): GrammarQuestion[] {
  const types = ['multiple_choice', 'fill_in_blank', 'sentence_reorder', 'error_correction'] as const
  const grouped: Record<string, GrammarQuestion[]> = {}

  for (const type of types) {
    grouped[type] = all.filter((q) => q.type === type).sort(() => Math.random() - 0.5)
  }

  const perType = Math.floor(count / types.length) // 2 when count=8
  const selected: GrammarQuestion[] = []

  // Pick perType from each group
  for (const type of types) {
    const available = grouped[type] || []
    selected.push(...available.slice(0, perType))
  }

  // Fill remaining slots from whatever is left
  const remaining = count - selected.length
  if (remaining > 0) {
    const used = new Set(selected)
    const leftover = all.filter((q) => !used.has(q)).sort(() => Math.random() - 0.5)
    selected.push(...leftover.slice(0, remaining))
  }

  // Shuffle final order
  return selected.sort(() => Math.random() - 0.5)
}

export async function getGrammarExercises(
  level: string,
  chapterId: number,
  count: number = 8,
): Promise<GrammarQuestion[]> {
  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new GrammarExerciseError('AUTH_ERROR', 'You must be logged in', authError?.message)
  }

  // Premium check
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_tier, is_admin')
    .eq('id', user.id)
    .single()

  if (profile && profile.subscription_tier !== 'premium' && !profile.is_admin) {
    throw new GrammarExerciseError('NOT_PREMIUM', 'Grammar exercises are available for premium users only')
  }

  // Try cache first
  const { data: cached } = await supabase
    .from('grammar_exercise_cache')
    .select('exercises')
    .eq('level', level.toUpperCase())
    .eq('chapter_id', chapterId)
    .single()

  if (cached && Array.isArray(cached.exercises) && cached.exercises.length > 0) {
    return selectExercises(cached.exercises as GrammarQuestion[], count)
  }

  // Cache miss — get chapter data and call edge function
  const levelData = LEVEL_DATA[level.toLowerCase()]
  const chapter = levelData?.chapters.find((c) => c.id === chapterId)
  if (!chapter) {
    throw new GrammarExerciseError('NO_EXERCISES', 'Chapter not found')
  }

  const chapterContent = serializeChapterContent(chapter)

  let data: any
  let error: any
  try {
    const result = await supabase.functions.invoke('generate-grammar-exercises', {
      body: {
        level: level.toUpperCase(),
        chapterId,
        chapterTitle: chapter.title,
        chapterContent,
        count: 16,
      },
    })
    data = result.data
    error = result.error
  } catch (e: any) {
    throw new GrammarExerciseError('NETWORK_ERROR', 'Could not reach the server. Check your connection.', e?.message)
  }

  if (error) {
    let serverBody: any = null
    try {
      if (error.context && typeof error.context.json === 'function') {
        serverBody = await error.context.json()
      } else if (data && typeof data === 'object') {
        serverBody = data
      }
    } catch {}

    const serverCode = serverBody?.code || ''
    const serverError = serverBody?.error || ''
    const serverDetails = serverBody?.details || ''
    const errorMsg = error?.message || String(error)
    const fullDetails = [serverCode, serverError, serverDetails].filter(Boolean).join(' | ') || errorMsg

    console.error('[Grammar Exercise Error]', fullDetails)

    switch (serverCode) {
      case 'GEMINI_KEY_MISSING':
        throw new GrammarExerciseError('EDGE_FUNCTION_ERROR', 'AI service is not configured on the server', fullDetails)
      case 'GEMINI_NETWORK_ERROR':
        throw new GrammarExerciseError('GEMINI_API_ERROR', 'Could not reach the AI service', fullDetails)
      case 'GEMINI_API_ERROR':
        throw new GrammarExerciseError('GEMINI_API_ERROR', 'AI model returned an error', fullDetails)
      case 'GEMINI_EMPTY_RESPONSE':
        throw new GrammarExerciseError('GEMINI_API_ERROR', 'AI model returned an empty response', fullDetails)
      case 'GEMINI_PARSE_ERROR':
      case 'GEMINI_INVALID_FORMAT':
        throw new GrammarExerciseError('INVALID_RESPONSE', 'AI returned malformed data', fullDetails)
      case 'INVALID_BODY':
      case 'MISSING_FIELDS':
        throw new GrammarExerciseError('EDGE_FUNCTION_ERROR', 'Invalid request sent to server', fullDetails)
      default:
        throw new GrammarExerciseError('EDGE_FUNCTION_ERROR', serverError || 'Server error while generating exercises', fullDetails)
    }
  }

  if (!data || !Array.isArray(data)) {
    throw new GrammarExerciseError('INVALID_RESPONSE', 'Received invalid data from the server', JSON.stringify(data)?.slice(0, 200))
  }

  if (data.length === 0) {
    throw new GrammarExerciseError('NO_EXERCISES', 'No exercises were generated for this chapter')
  }

  return selectExercises(data as GrammarQuestion[], count)
}
