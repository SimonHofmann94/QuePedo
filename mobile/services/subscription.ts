import { supabase } from '@/lib/supabase'

interface SubscriptionInfo {
  subscription_tier: string
  taco_balance: number
  daily_quiz_count: number
  last_quiz_date: string | null
  is_admin: boolean
}

export async function getSubscriptionInfo(userId: string): Promise<SubscriptionInfo | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('subscription_tier, taco_balance, daily_quiz_count, last_quiz_date, is_admin')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching subscription info:', error)
    return null
  }

  return data
}

export async function consumeTaco(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('consume_taco', { p_user_id: userId })

  if (error) {
    console.error('Error consuming taco:', error)
    return false
  }

  return data === true
}

export async function checkAndIncrementQuiz(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_and_increment_quiz', { p_user_id: userId })

  if (error) {
    console.error('Error checking quiz limit:', error)
    return false
  }

  return data === true
}

export async function getVocabularyCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('user_vocabulary')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error('Error getting vocabulary count:', error)
    return 0
  }

  return count ?? 0
}
