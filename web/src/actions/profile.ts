"use server"

import { createClient } from "@/utils/supabase/server"
import { userProfileSchema, type UserProfileInput } from "@/types/schemas"
import { revalidatePath } from "next/cache"
import { getPostHogServer } from "@/lib/posthog-server"
import { AnalyticsEvent } from "@chingon/shared"
import { checkAchievements } from "@/actions/achievements"

export async function getUserProfile(userId?: string) {
    const supabase = await createClient()

    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id

    if (!targetUserId) {
        return { error: "Not authenticated" }
    }

    const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", targetUserId)
        .single()

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function updateUserProfile(profileData: UserProfileInput) {
    const supabase = await createClient()
    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
        return { error: "Not authenticated" }
    }

    const validated = userProfileSchema.parse(profileData)

    const { data, error } = await supabase
        .from("user_profiles")
        .update({
            ...validated,
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    const ph = getPostHogServer()
    if (ph) {
        ph.capture({
            distinctId: user.id,
            event: AnalyticsEvent.ONBOARDING_COMPLETED,
            properties: {
                native_language: validated.native_language,
                proficiency_level: validated.proficiency_level,
            },
        })
        await ph.shutdown()
    }

    try {
        await checkAchievements({ type: "onboarding_completed" })
    } catch (err) {
        console.error("[profile] achievement check failed:", err)
    }

    revalidatePath("/dashboard")
    return { data }
}
