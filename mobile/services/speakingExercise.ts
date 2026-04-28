import { supabase } from '@/lib/supabase'
import { grammarA1 } from '@chingon/shared'
import { grammarA2 } from '@chingon/shared'
import { grammarB1 } from '@chingon/shared'
import { grammarB2 } from '@chingon/shared'
import { grammarC1 } from '@chingon/shared'
import { grammarC2 } from '@chingon/shared'
import type { GrammarLevel, GrammarChapter } from '@chingon/shared'
import type { SpeakingExercise, WordResult } from '@/data/speaking/exerciseTypes'

const LEVEL_DATA: Record<string, GrammarLevel> = {
  a1: grammarA1,
  a2: grammarA2,
  b1: grammarB1,
  b2: grammarB2,
  c1: grammarC1,
  c2: grammarC2,
}

export type SpeakingExerciseErrorCode =
  | 'AUTH_ERROR'
  | 'NOT_PREMIUM'
  | 'EDGE_FUNCTION_ERROR'
  | 'GEMINI_API_ERROR'
  | 'INVALID_RESPONSE'
  | 'NETWORK_ERROR'
  | 'NO_EXERCISES'
  | 'SPEECH_RECOGNITION_ERROR'

export class SpeakingExerciseError extends Error {
  code: SpeakingExerciseErrorCode
  details?: string

  constructor(code: SpeakingExerciseErrorCode, message: string, details?: string) {
    super(message)
    this.name = 'SpeakingExerciseError'
    this.code = code
    this.details = details
  }
}

function serializeChapterContent(chapter: GrammarChapter): string {
  const parts: string[] = [`Chapter: ${chapter.title}`]

  for (const section of chapter.sections) {
    parts.push(`\n## ${section.title}`)
    for (const block of section.blocks) {
      switch (block.type) {
        case 'text':
          if (block.content) parts.push(block.content)
          break
        case 'rules':
          if (block.items) parts.push(block.items.map((r) => `- ${r}`).join('\n'))
          break
        case 'examples':
          if (block.examples) {
            parts.push(block.examples.map((e) => `${e.es} — ${e.en}`).join('\n'))
          }
          break
        case 'table':
          if (block.headers && block.rows) {
            parts.push(block.headers.join(' | '))
            parts.push(block.rows.map((r) => r.join(' | ')).join('\n'))
          }
          break
      }
    }
  }

  const full = parts.join('\n')
  return full.length > 2000 ? full.slice(0, 2000) + '...' : full
}

/**
 * Select a diverse mix of speaking exercises from a pool.
 * Aims for 2 of each type when count=6.
 */
function selectExercises(all: SpeakingExercise[], count: number): SpeakingExercise[] {
  const types = ['read_aloud', 'translate_speak', 'listen_repeat'] as const
  const grouped: Record<string, SpeakingExercise[]> = {}

  for (const type of types) {
    grouped[type] = all.filter((ex) => ex.type === type).sort(() => Math.random() - 0.5)
  }

  const perType = Math.floor(count / types.length)
  const selected: SpeakingExercise[] = []

  for (const type of types) {
    const available = grouped[type] || []
    selected.push(...available.slice(0, perType))
  }

  const remaining = count - selected.length
  if (remaining > 0) {
    const used = new Set(selected)
    const leftover = all.filter((ex) => !used.has(ex)).sort(() => Math.random() - 0.5)
    selected.push(...leftover.slice(0, remaining))
  }

  return selected.sort(() => Math.random() - 0.5)
}

export async function getSpeakingExercises(
  level: string,
  chapterId: number,
  count: number = 6,
): Promise<SpeakingExercise[]> {
  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new SpeakingExerciseError('AUTH_ERROR', 'You must be logged in', authError?.message)
  }

  // Premium check
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_tier, is_admin')
    .eq('id', user.id)
    .single()

  if (profile && profile.subscription_tier !== 'premium' && !profile.is_admin) {
    throw new SpeakingExerciseError('NOT_PREMIUM', 'Speaking exercises are available for premium users only')
  }

  // Try cache first
  const { data: cached } = await supabase
    .from('speaking_exercise_cache')
    .select('exercises')
    .eq('level', level.toUpperCase())
    .eq('chapter_id', chapterId)
    .single()

  if (cached && Array.isArray(cached.exercises) && cached.exercises.length > 0) {
    return selectExercises(cached.exercises as SpeakingExercise[], count)
  }

  // Cache miss — get chapter data and call edge function
  const levelData = LEVEL_DATA[level.toLowerCase()]
  const chapter = levelData?.chapters.find((c) => c.id === chapterId)
  if (!chapter) {
    throw new SpeakingExerciseError('NO_EXERCISES', 'Chapter not found')
  }

  const chapterContent = serializeChapterContent(chapter)

  let data: any
  let error: any
  try {
    const result = await supabase.functions.invoke('generate-speaking-exercises', {
      body: {
        level: level.toUpperCase(),
        chapterId,
        chapterTitle: chapter.title,
        chapterContent,
        count: 12,
      },
    })
    data = result.data
    error = result.error
  } catch (e: any) {
    throw new SpeakingExerciseError('NETWORK_ERROR', 'Could not reach the server. Check your connection.', e?.message)
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

    console.error('[Speaking Exercise Error]', fullDetails)

    switch (serverCode) {
      case 'GEMINI_KEY_MISSING':
        throw new SpeakingExerciseError('EDGE_FUNCTION_ERROR', 'AI service is not configured on the server', fullDetails)
      case 'GEMINI_NETWORK_ERROR':
        throw new SpeakingExerciseError('GEMINI_API_ERROR', 'Could not reach the AI service', fullDetails)
      case 'GEMINI_API_ERROR':
        throw new SpeakingExerciseError('GEMINI_API_ERROR', 'AI model returned an error', fullDetails)
      case 'GEMINI_EMPTY_RESPONSE':
        throw new SpeakingExerciseError('GEMINI_API_ERROR', 'AI model returned an empty response', fullDetails)
      case 'GEMINI_PARSE_ERROR':
      case 'GEMINI_INVALID_FORMAT':
        throw new SpeakingExerciseError('INVALID_RESPONSE', 'AI returned malformed data', fullDetails)
      case 'INVALID_BODY':
      case 'MISSING_FIELDS':
        throw new SpeakingExerciseError('EDGE_FUNCTION_ERROR', 'Invalid request sent to server', fullDetails)
      default:
        throw new SpeakingExerciseError('EDGE_FUNCTION_ERROR', serverError || 'Server error while generating exercises', fullDetails)
    }
  }

  if (!data || !Array.isArray(data)) {
    throw new SpeakingExerciseError('INVALID_RESPONSE', 'Received invalid data from the server', JSON.stringify(data)?.slice(0, 200))
  }

  if (data.length === 0) {
    throw new SpeakingExerciseError('NO_EXERCISES', 'No speaking exercises were generated for this chapter')
  }

  return selectExercises(data as SpeakingExercise[], count)
}

export async function evaluateSpeaking(
  expectedText: string,
  transcribedText: string,
  exerciseType: string,
  level: string,
  chapterTitle: string,
): Promise<{ feedback: string; corrections: Array<{ wrong: string; correct: string; explanation: string }>; tip: string }> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new SpeakingExerciseError('AUTH_ERROR', 'You must be logged in', authError?.message)
  }

  let data: any
  let error: any
  try {
    const result = await supabase.functions.invoke('evaluate-speaking', {
      body: { expectedText, transcribedText, exerciseType, level, chapterTitle },
    })
    data = result.data
    error = result.error
  } catch (e: any) {
    throw new SpeakingExerciseError('NETWORK_ERROR', 'Could not reach the server.', e?.message)
  }

  if (error) {
    throw new SpeakingExerciseError('EDGE_FUNCTION_ERROR', 'Failed to evaluate speaking exercise')
  }

  return {
    feedback: data?.feedback || 'No feedback available.',
    corrections: Array.isArray(data?.corrections) ? data.corrections : [],
    tip: data?.tip || '',
  }
}

/**
 * Normalize text for comparison: lowercase, remove punctuation, trim.
 */
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?¿¡'";\-:()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Compare expected and transcribed texts word by word.
 * Returns per-word results and an overall correct boolean.
 */
export function compareTexts(
  expected: string,
  transcribed: string,
): { wordResults: WordResult[]; isCorrect: boolean } {
  const expectedWords = normalizeForComparison(expected).split(' ').filter(Boolean)
  const transcribedWords = normalizeForComparison(transcribed).split(' ').filter(Boolean)

  // Use LCS-based alignment for word-by-word diff
  const results: WordResult[] = []
  const lcs = computeLCS(expectedWords, transcribedWords)

  let ei = 0
  let ti = 0
  let li = 0

  while (ei < expectedWords.length || ti < transcribedWords.length) {
    if (li < lcs.length && ei < expectedWords.length && ti < transcribedWords.length
        && expectedWords[ei] === lcs[li] && transcribedWords[ti] === lcs[li]) {
      results.push({ word: transcribedWords[ti], status: 'correct' })
      ei++
      ti++
      li++
    } else if (li < lcs.length && ei < expectedWords.length && expectedWords[ei] !== lcs[li]) {
      // Expected word not in LCS — it's missing from transcription
      results.push({ word: expectedWords[ei], status: 'missing' })
      ei++
    } else if (ti < transcribedWords.length && (li >= lcs.length || transcribedWords[ti] !== lcs[li])) {
      // Transcribed word not in LCS — it's extra
      if (ei < expectedWords.length && li < lcs.length) {
        results.push({ word: transcribedWords[ti], status: 'incorrect', expected: expectedWords[ei] })
        ei++
      } else {
        results.push({ word: transcribedWords[ti], status: 'extra' })
      }
      ti++
    } else if (ei < expectedWords.length) {
      results.push({ word: expectedWords[ei], status: 'missing' })
      ei++
    } else {
      break
    }
  }

  const incorrectCount = results.filter((r) => r.status !== 'correct').length
  const isCorrect = incorrectCount === 0

  return { wordResults: results, isCorrect }
}

/**
 * Compute the Longest Common Subsequence of two string arrays.
 */
function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to find the LCS
  const result: string[] = []
  let i = m
  let j = n
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return result
}
