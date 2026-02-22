import { supabase } from '@/lib/supabase'
import { grammarA1 } from '@/data/grammar/a1'
import { grammarA2 } from '@/data/grammar/a2'
import { grammarB1 } from '@/data/grammar/b1'
import { grammarB2 } from '@/data/grammar/b2'
import { grammarC1 } from '@/data/grammar/c1'
import { grammarC2 } from '@/data/grammar/c2'
import type { GrammarLevel, GrammarChapter } from '@/data/grammar/types'
import type { GrammarQuestion } from '@/data/grammar/exerciseTypes'

const LEVEL_DATA: Record<string, GrammarLevel> = {
  a1: grammarA1,
  a2: grammarA2,
  b1: grammarB1,
  b2: grammarB2,
  c1: grammarC1,
  c2: grammarC2,
}

export type GrammarAIErrorCode =
  | 'AUTH_ERROR'
  | 'NOT_PREMIUM'
  | 'DAILY_LIMIT'
  | 'EDGE_FUNCTION_ERROR'
  | 'GEMINI_API_ERROR'
  | 'INVALID_RESPONSE'
  | 'NETWORK_ERROR'

export class GrammarAIError extends Error {
  code: GrammarAIErrorCode
  details?: string

  constructor(code: GrammarAIErrorCode, message: string, details?: string) {
    super(message)
    this.name = 'GrammarAIError'
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
  // Truncate to ~2000 chars to keep the prompt reasonable
  return full.length > 2000 ? full.slice(0, 2000) + '...' : full
}

export async function checkGrammarAILimit(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_and_increment_grammar_ai', { p_user_id: userId })

  if (error) {
    console.error('Error checking grammar AI limit:', error)
    return false
  }

  return data === true
}

export async function getGrammarAIRemaining(userId?: string): Promise<number> {
  let uid = userId
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser()
    uid = user?.id
  }
  if (!uid) return 0

  const { data, error } = await supabase.rpc('get_grammar_ai_remaining', { p_user_id: uid })

  if (error) {
    console.error('Error getting grammar AI remaining:', error)
    return 0
  }

  return data ?? 0
}

export async function generateGrammarQuestions(
  level: string,
  chapterId: number,
  count: number = 3
): Promise<GrammarQuestion[]> {
  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new GrammarAIError('AUTH_ERROR', 'You must be logged in to generate grammar questions', authError?.message)
  }

  // Limit check (also checks premium status)
  const allowed = await checkGrammarAILimit(user.id)
  if (!allowed) {
    // Determine if it's a premium issue or daily limit
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_tier, is_admin')
      .eq('id', user.id)
      .single()

    if (profile && profile.subscription_tier !== 'premium' && !profile.is_admin) {
      throw new GrammarAIError('NOT_PREMIUM', 'AI grammar questions are available for premium users only')
    }

    throw new GrammarAIError('DAILY_LIMIT', 'You\'ve reached your daily limit of 3 AI-generated grammar tests')
  }

  // Get chapter data
  const levelData = LEVEL_DATA[level.toLowerCase()]
  const chapter = levelData?.chapters.find((c) => c.id === chapterId)
  if (!chapter) {
    throw new GrammarAIError('EDGE_FUNCTION_ERROR', 'Chapter not found')
  }

  const chapterContent = serializeChapterContent(chapter)

  // Call edge function
  let data: any
  let error: any
  try {
    const result = await supabase.functions.invoke('generate-grammar-questions', {
      body: {
        level: level.toUpperCase(),
        chapterTitle: chapter.title,
        chapterContent,
        count,
      },
    })
    data = result.data
    error = result.error
  } catch (e: any) {
    throw new GrammarAIError('NETWORK_ERROR', 'Could not reach the server. Check your connection.', e?.message)
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

    console.error('[Grammar AI Error]', fullDetails)

    switch (serverCode) {
      case 'GEMINI_KEY_MISSING':
        throw new GrammarAIError('EDGE_FUNCTION_ERROR', 'AI service is not configured on the server', fullDetails)
      case 'GEMINI_NETWORK_ERROR':
        throw new GrammarAIError('GEMINI_API_ERROR', 'Could not reach the AI service', fullDetails)
      case 'GEMINI_API_ERROR':
        throw new GrammarAIError('GEMINI_API_ERROR', 'AI model returned an error', fullDetails)
      case 'GEMINI_EMPTY_RESPONSE':
        throw new GrammarAIError('GEMINI_API_ERROR', 'AI model returned an empty response', fullDetails)
      case 'GEMINI_PARSE_ERROR':
      case 'GEMINI_INVALID_FORMAT':
        throw new GrammarAIError('INVALID_RESPONSE', 'AI returned malformed data', fullDetails)
      case 'INVALID_BODY':
      case 'MISSING_FIELDS':
        throw new GrammarAIError('EDGE_FUNCTION_ERROR', 'Invalid request sent to server', fullDetails)
      default:
        throw new GrammarAIError('EDGE_FUNCTION_ERROR', serverError || 'Server error while generating questions', fullDetails)
    }
  }

  if (!data || !Array.isArray(data)) {
    throw new GrammarAIError('INVALID_RESPONSE', 'Received invalid data from the server', JSON.stringify(data)?.slice(0, 200))
  }

  return data as GrammarQuestion[]
}
