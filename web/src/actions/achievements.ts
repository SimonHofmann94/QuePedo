"use server"

import { createClient } from "@/utils/supabase/server"
import { getPostHogServer } from "@/lib/posthog-server"
import {
  ACHIEVEMENTS,
  AnalyticsEvent,
  getAchievementById,
  type Achievement,
  type AchievementId,
} from "@chingon/shared"

// ---------- Public types ----------

export type EarnedAchievement = {
  id: string
  earnedAt: string
}

export type UnlockResult = {
  unlocked: boolean
  achievement: Achievement | null
}

export type TriggerContext =
  | { type: "vocab_added"; payload?: { source?: "manual" | "ai" | "ai_generated" } }
  | { type: "quiz_completed"; payload?: { score?: number; total?: number; passed?: boolean } }
  | { type: "grammar_chapter_opened"; payload?: { chapter?: string } }
  | { type: "grammar_chapter_completed"; payload?: { level?: string; chapter?: string } }
  | { type: "streak_updated"; payload?: { streak?: number } }
  | { type: "onboarding_completed"; payload?: Record<string, never> }
  | { type: "premium_purchased"; payload?: Record<string, never> }
  | { type: "culture_lesson_opened"; payload?: { lessonId?: string; country?: string } }

// ---------- Read ----------

export async function getUserAchievements(): Promise<EarnedAchievement[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("user_achievements")
    .select("achievement_id, earned_at")
    .eq("user_id", user.id)

  if (error) {
    console.error("[achievements] getUserAchievements error:", error)
    return []
  }

  return (data ?? []).map((row) => ({
    id: row.achievement_id as string,
    earnedAt: row.earned_at as string,
  }))
}

// ---------- Unlock (idempotent) ----------

export async function unlockAchievement(id: string): Promise<UnlockResult> {
  const achievement = getAchievementById(id) ?? null

  // Don't insert unknown ids — keep DB clean.
  if (!achievement) {
    console.warn(`[achievements] unknown achievement id: ${id}`)
    return { unlocked: false, achievement: null }
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { unlocked: false, achievement }

    const { error } = await supabase
      .from("user_achievements")
      .insert({ user_id: user.id, achievement_id: id })

    if (error) {
      // 23505 = unique_violation → already had it. That's fine.
      const code = (error as { code?: string }).code
      if (code === "23505") {
        return { unlocked: false, achievement }
      }
      console.error("[achievements] unlock error:", error)
      return { unlocked: false, achievement }
    }

    const ph = getPostHogServer()
    if (ph) {
      try {
        ph.capture({
          distinctId: user.id,
          event: AnalyticsEvent.ACHIEVEMENT_UNLOCKED,
          properties: { id, label: achievement.label, group: achievement.group },
        })
        await ph.shutdown()
      } catch {
        // never let analytics throw into product code
      }
    }

    return { unlocked: true, achievement }
  } catch (err) {
    console.error("[achievements] unlock unexpected:", err)
    return { unlocked: false, achievement }
  }
}

// ---------- Trigger checks ----------

/**
 * Examines a trigger event and unlocks any achievements it satisfies.
 * Always wrapped in try/catch by callers — must never throw.
 * Returns the list of newly-unlocked achievements (may be empty).
 */
export async function checkAchievements(
  trigger: TriggerContext,
): Promise<Achievement[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const idsToUnlock: AchievementId[] = []

    switch (trigger.type) {
      case "vocab_added": {
        // vocab_first_word: any successful add
        idsToUnlock.push("vocab_first_word")

        // vocab_hundred / vocab_five_hundred — count personal vocab
        const { count } = await supabase
          .from("user_vocabulary")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        if ((count ?? 0) >= 100) idsToUnlock.push("vocab_hundred")
        if ((count ?? 0) >= 500) idsToUnlock.push("vocab_five_hundred")

        // vocab_ai_master — 50 entries from AI source
        const source = trigger.payload?.source
        if (source === "ai" || source === "ai_generated") {
          const { count: aiCount } = await supabase
            .from("user_vocabulary")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("source", "ai_generated")

          if ((aiCount ?? 0) >= 50) idsToUnlock.push("vocab_ai_master")
        }
        break
      }

      case "quiz_completed": {
        idsToUnlock.push("quiz_first")
        const { score, total } = trigger.payload ?? {}
        if (
          typeof score === "number" &&
          typeof total === "number" &&
          total > 0 &&
          score === total
        ) {
          idsToUnlock.push("quiz_perfect")
        }

        // quiz_streak: 10 consecutive passed quizzes.
        // TODO: requires a `quiz_results` / `user_quiz_history` table that
        // doesn't exist yet (Agent E owns SR / quiz play). When it does,
        // query the last 10 results here and check `passed === true` for all.
        break
      }

      case "grammar_chapter_opened": {
        idsToUnlock.push("grammar_first_chapter")
        break
      }

      case "grammar_chapter_completed": {
        // TODO: requires a `user_grammar_progress` table to count completed
        // chapters per CEFR level. Not yet wired.
        // Stub: if payload.level === 'A1' or 'A2', no count check yet.
        const level = trigger.payload?.level?.toUpperCase()
        if (level === "A1") idsToUnlock.push("grammar_a1_complete")
        if (level === "A2") idsToUnlock.push("grammar_a2_complete")
        break
      }

      case "streak_updated": {
        const streak = trigger.payload?.streak ?? 0
        if (streak >= 1)  idsToUnlock.push("streak_first_day")
        if (streak >= 7)  idsToUnlock.push("streak_week")
        if (streak >= 14) idsToUnlock.push("streak_two_weeks")
        if (streak >= 30) idsToUnlock.push("streak_month")
        break
      }

      case "onboarding_completed": {
        idsToUnlock.push("welcome")
        break
      }

      case "premium_purchased": {
        idsToUnlock.push("premium")
        idsToUnlock.push("grammar_premium")
        break
      }

      case "culture_lesson_opened": {
        // culture_explorer: 5 distinct lessons opened
        // culture_pan_america: 3 distinct countries
        // TODO: requires a `user_culture_progress` table. Not wired yet —
        // only fires `culture_explorer` when caller passes a lessonId, but
        // there's no persistent count, so this is a no-op until storage exists.
        break
      }

      default: {
        // Exhaustive switch — TS will catch missing cases.
        const _exhaustive: never = trigger
        void _exhaustive
        break
      }
    }

    if (idsToUnlock.length === 0) return []

    const newlyUnlocked: Achievement[] = []
    for (const id of idsToUnlock) {
      const result = await unlockAchievement(id)
      if (result.unlocked && result.achievement) {
        newlyUnlocked.push(result.achievement)
      }
    }

    return newlyUnlocked
  } catch (err) {
    console.error("[achievements] checkAchievements error:", err)
    return []
  }
}

// Re-export the static list so the profile page can render all 19.
export async function listAllAchievements(): Promise<readonly Achievement[]> {
  return ACHIEVEMENTS
}
