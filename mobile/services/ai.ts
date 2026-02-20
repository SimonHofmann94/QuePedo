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

/**
 * Generate vocabulary via the Supabase Edge Function.
 * The Edge Function calls Gemini API server-side to keep the API key secure.
 * Consumes a taco for free users before generating.
 */
export async function generateVocabulary(userPrompt: string, count: number = 5): Promise<GeneratedWord[]> {
  // Check/consume taco before generating
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const allowed = await consumeTaco(user.id)
  if (!allowed) {
    throw new Error('NO_TACOS')
  }

  const { data, error } = await supabase.functions.invoke('generate-vocabulary', {
    body: { userPrompt, count },
  })

  if (error) {
    console.error('Error generating vocabulary:', error)
    throw new Error(`Failed to generate vocabulary: ${error.message}`)
  }

  return data
}
