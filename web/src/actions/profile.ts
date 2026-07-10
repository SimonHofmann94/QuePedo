"use server"

import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { userProfileSchema, type UserProfileInput } from "@/types/schemas"
import { revalidatePath } from "next/cache"
import { getPostHogServer } from "@/lib/posthog-server"
import { AnalyticsEvent, isLocale } from "@chingon/shared"
import { checkAchievements } from "@/actions/achievements"
import { LOCALE_COOKIE } from "@/i18n/config"

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

/**
 * Persist the chosen UI locale: set the cookie (read by i18n/request.ts) and,
 * if signed in, mirror it into user_profiles.app_locale so it survives across
 * devices/logins. The cookie is the fast path; the DB is the durable fallback.
 */
export async function setAppLocale(locale: string) {
    if (!isLocale(locale)) {
        return { error: "Invalid locale" }
    }

    const store = await cookies()
    store.set(LOCALE_COOKIE, locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
    })

    const supabase = await createClient()
    const user = (await supabase.auth.getUser()).data.user
    if (user) {
        const { error } = await supabase
            .from("user_profiles")
            .update({ app_locale: locale })
            .eq("id", user.id)
        if (error) {
            return { error: error.message }
        }
    }

    return { success: true }
}
