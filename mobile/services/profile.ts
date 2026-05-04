import { supabase } from '@/lib/supabase'
import { userProfileSchema, type UserProfileInput, AnalyticsEvent } from '@chingon/shared'
import { posthog } from '@/lib/posthog'
import { checkAchievements } from '@/services/achievements'

export async function getUserProfile(userId?: string) {
  const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id

  if (!targetUserId) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', targetUserId)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateUserProfile(profileData: UserProfileInput) {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) return { error: 'Not authenticated' }

  const validated = userProfileSchema.parse(profileData)

  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...validated,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  posthog?.capture(AnalyticsEvent.ONBOARDING_COMPLETED, {
    native_language: validated.native_language,
    proficiency_level: validated.proficiency_level,
  })

  try {
    await checkAchievements({ type: 'onboarding_completed' })
  } catch (err) {
    console.error('[profile] achievement check failed:', err)
  }

  return { data }
}
