import { supabase } from '@/lib/supabase'
import { userVocabularySchema, FREE_TIER_LIMITS } from '@chingon/shared'

export async function getUserVocabulary() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_vocabulary')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vocabulary:', error)
    return []
  }

  return data
}

export async function addVocabulary(
  formData: unknown,
  source: 'manual' | 'ai_generated' = 'manual',
  aiPrompt?: string
) {
  const result = userVocabularySchema.safeParse(formData)
  if (!result.success) {
    return { error: 'Invalid data' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check vocabulary limit for free users
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_tier, is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin && profile?.subscription_tier !== 'premium') {
    const { count } = await supabase
      .from('user_vocabulary')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) >= FREE_TIER_LIMITS.maxVocabulary) {
      return { error: 'VOCAB_LIMIT_REACHED' }
    }
  }

  // Check for duplicates
  const { data: existing } = await supabase
    .from('user_vocabulary')
    .select('id')
    .eq('user_id', user.id)
    .ilike('term', result.data.term)
    .single()

  if (existing) {
    return { error: `The word "${result.data.term}" already exists in your vocabulary.` }
  }

  const { error } = await supabase
    .from('user_vocabulary')
    .insert({
      ...result.data,
      user_id: user.id,
      source,
      ai_prompt: aiPrompt,
    })

  if (error) {
    console.error('Error adding vocabulary:', error)
    return { error: 'Failed to add vocabulary' }
  }

  return { success: true }
}

export async function updateVocabulary(id: string, formData: unknown) {
  const result = userVocabularySchema.partial().safeParse(formData)
  if (!result.success) return { error: 'Invalid data' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('user_vocabulary')
    .update({
      ...result.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating vocabulary:', error)
    return { error: 'Failed to update vocabulary' }
  }

  return { success: true }
}

export async function deleteVocabulary(id: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('user_vocabulary')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting vocabulary:', error)
    return { error: 'Failed to delete vocabulary' }
  }

  return { success: true }
}

export async function deleteMultipleVocabulary(ids: string[]) {
  if (!ids || ids.length === 0) return { error: 'No items to delete' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('user_vocabulary')
    .delete()
    .in('id', ids)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting vocabulary:', error)
    return { error: 'Failed to delete vocabulary' }
  }

  return { success: true, deleted: ids.length }
}
