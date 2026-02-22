import { supabase } from '@/lib/supabase'
import { consumeTaco } from '@/services/subscription'

interface GeneratedWord {
  term: string
  translations: Record<string, string>
  context_sentence?: string
  difficulty_rating: number
  tags: string[]
  synonyms: string[]
}

export type AIErrorCode =
  | 'AUTH_ERROR'
  | 'NO_TACOS'
  | 'EDGE_FUNCTION_ERROR'
  | 'GEMINI_API_ERROR'
  | 'INVALID_RESPONSE'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export class AIGenerationError extends Error {
  code: AIErrorCode
  details?: string

  constructor(code: AIErrorCode, message: string, details?: string) {
    super(message)
    this.name = 'AIGenerationError'
    this.code = code
    this.details = details
  }
}

export async function generateVocabulary(userPrompt: string, count: number = 5): Promise<GeneratedWord[]> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new AIGenerationError('AUTH_ERROR', 'You must be logged in to generate vocabulary', authError?.message)
  }

  const allowed = await consumeTaco(user.id)
  if (!allowed) {
    throw new AIGenerationError('NO_TACOS', 'No tacos remaining')
  }

  let data: any
  let error: any
  try {
    const result = await supabase.functions.invoke('generate-vocabulary', {
      body: { userPrompt, count },
    })
    data = result.data
    error = result.error
  } catch (e: any) {
    throw new AIGenerationError('NETWORK_ERROR', 'Could not reach the server. Check your connection.', e?.message)
  }

  if (error) {
    // supabase.functions.invoke puts the error response in error.context (a Response object)
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

    console.error('[AI Generation Error]', fullDetails)

    switch (serverCode) {
      case 'GEMINI_KEY_MISSING':
        throw new AIGenerationError('EDGE_FUNCTION_ERROR', 'AI service is not configured on the server', fullDetails)
      case 'GEMINI_NETWORK_ERROR':
        throw new AIGenerationError('GEMINI_API_ERROR', 'Could not reach the AI service', fullDetails)
      case 'GEMINI_API_ERROR':
        throw new AIGenerationError('GEMINI_API_ERROR', 'AI model returned an error', fullDetails)
      case 'GEMINI_EMPTY_RESPONSE':
        throw new AIGenerationError('GEMINI_API_ERROR', 'AI model returned an empty response', fullDetails)
      case 'GEMINI_PARSE_ERROR':
      case 'GEMINI_INVALID_FORMAT':
        throw new AIGenerationError('INVALID_RESPONSE', 'AI returned malformed data', fullDetails)
      case 'INVALID_BODY':
      case 'MISSING_PROMPT':
        throw new AIGenerationError('EDGE_FUNCTION_ERROR', 'Invalid request sent to server', fullDetails)
      default:
        throw new AIGenerationError('EDGE_FUNCTION_ERROR', serverError || 'Server error while generating vocabulary', fullDetails)
    }
  }

  if (!data || !Array.isArray(data)) {
    throw new AIGenerationError('INVALID_RESPONSE', 'Received invalid data from the server', JSON.stringify(data)?.slice(0, 200))
  }

  return data
}
