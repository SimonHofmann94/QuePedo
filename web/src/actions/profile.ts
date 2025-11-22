"use server"

import { createClient } from "@/utils/supabase/server"
import { userProfileSchema, type UserProfileInput } from "@/types/schemas"
import { revalidatePath } from "next/cache"

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

    revalidatePath("/dashboard")
    return { data }
}
