"use server"

import { createClient } from "@/utils/supabase/server"
import { checkAchievements } from "@/actions/achievements"

export async function getUserActivityDates() {
    const supabase = await createClient()
    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
        return { data: [] }
    }

    const { data, error } = await supabase
        .from("user_activity")
        .select("activity_date")
        .eq("user_id", user.id)
        .order("activity_date", { ascending: false })
        .limit(30)

    if (error) {
        return { data: [] }
    }

    return { data: data.map(row => row.activity_date) }
}

export async function getUserStreak() {
    const supabase = await createClient()
    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
        return { streak: 0 }
    }

    // Call the database function
    const { data, error } = await supabase.rpc('get_user_streak', { p_user_id: user.id })

    if (error) {
        console.error("Error getting streak:", error)
        return { streak: 0 }
    }

    return { streak: data || 0 }
}

/**
 * Records today's activity for the current user and checks streak achievements.
 * Idempotent — can be called many times per day. Achievement check is wrapped
 * in try/catch so it never breaks the activity-recording flow.
 */
export async function recordActivity() {
    const supabase = await createClient()
    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
        return { recorded: false, streak: 0 }
    }

    const { error: rpcErr } = await supabase.rpc('record_user_activity', { p_user_id: user.id })
    if (rpcErr) {
        console.error("Error recording activity:", rpcErr)
        return { recorded: false, streak: 0 }
    }

    const { data: streak } = await supabase.rpc('get_user_streak', { p_user_id: user.id })
    const streakValue = (streak as number | null) ?? 0

    try {
        await checkAchievements({ type: 'streak_updated', payload: { streak: streakValue } })
    } catch (err) {
        console.error('[activity] achievement check failed:', err)
    }

    return { recorded: true, streak: streakValue }
}
