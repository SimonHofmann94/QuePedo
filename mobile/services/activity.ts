import { supabase } from '@/lib/supabase'

export async function getUserActivityDates() {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) return { data: [] }

  const { data, error } = await supabase
    .from('user_activity')
    .select('activity_date')
    .eq('user_id', user.id)
    .order('activity_date', { ascending: false })
    .limit(30)

  if (error) return { data: [] }

  return { data: data.map(row => row.activity_date) }
}

export async function getUserStreak() {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) return { streak: 0 }

  const { data, error } = await supabase.rpc('get_user_streak', { p_user_id: user.id })

  if (error) {
    console.error('Error getting streak:', error)
    return { streak: 0 }
  }

  return { streak: data || 0 }
}
