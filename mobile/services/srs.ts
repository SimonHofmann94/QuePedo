import { supabase } from "@/lib/supabase"
import {
    nextReview,
    initialSM2State,
    type Quality,
    type UserVocabulary,
} from "@chingon/shared"

/**
 * Record a review for a personal vocab word using the SM-2 algorithm.
 * Mirrors the web `recordReview` server action.
 */
export async function recordReview(
    wordId: string,
    quality: Quality,
): Promise<{ success: true } | { error: string }> {
    if (!wordId) return { error: "Missing wordId" }
    if (![0, 1, 2, 3, 4, 5].includes(quality)) {
        return { error: "Invalid quality" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: existing } = await supabase
        .from("user_word_progress")
        .select("ease, interval_days, repetitions, times_correct, times_wrong")
        .eq("user_id", user.id)
        .eq("user_vocab_id", wordId)
        .maybeSingle()

    const prevState = existing
        ? {
            ease: Number(existing.ease ?? 2.5),
            interval: Number(existing.interval_days ?? 0),
            repetitions: Number(existing.repetitions ?? 0),
        }
        : initialSM2State()

    const result = nextReview(prevState, quality)
    const correct = quality >= 3
    const now = new Date()

    const { error } = await supabase
        .from("user_word_progress")
        .upsert(
            {
                user_id: user.id,
                user_vocab_id: wordId,
                master_vocab_id: null,
                ease: result.ease,
                interval_days: result.interval,
                repetitions: result.repetitions,
                next_review_at: result.nextReviewAt.toISOString(),
                last_reviewed_at: now.toISOString(),
                times_correct: (existing?.times_correct ?? 0) + (correct ? 1 : 0),
                times_wrong: (existing?.times_wrong ?? 0) + (correct ? 0 : 1),
            },
            { onConflict: "user_id,user_vocab_id" },
        )

    if (error) {
        console.error("recordReview error:", error)
        return { error: "Failed to record review" }
    }

    return { success: true }
}

/**
 * Words the user should review now: due first, then brand-new words.
 */
export async function getDueWords(
    level?: string,
    limit = 20,
): Promise<UserVocabulary[]> {
    void level
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from("user_vocabulary")
        .select("*, user_word_progress!left(next_review_at, repetitions)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(500)

    if (error) {
        console.error("getDueWords error:", error)
        return []
    }

    type Row = UserVocabulary & {
        user_word_progress: Array<{ next_review_at: string | null; repetitions: number }> | null
    }

    const now = Date.now()
    const due: Array<{ word: UserVocabulary; nextReview: number; isNew: boolean }> = []

    for (const row of (data ?? []) as Row[]) {
        const progress = row.user_word_progress?.[0]
        if (!progress || !progress.next_review_at) {
            due.push({ word: stripJoin(row), nextReview: Number.POSITIVE_INFINITY, isNew: true })
        } else {
            const ts = new Date(progress.next_review_at).getTime()
            if (ts <= now) {
                due.push({ word: stripJoin(row), nextReview: ts, isNew: false })
            }
        }
    }

    due.sort((a, b) => {
        if (a.isNew !== b.isNew) return a.isNew ? 1 : -1
        return a.nextReview - b.nextReview
    })

    return due.slice(0, limit).map((d) => d.word)
}

function stripJoin<T extends { user_word_progress?: unknown }>(row: T): UserVocabulary {
    const { user_word_progress: _omit, ...rest } = row as T & { user_word_progress?: unknown }
    void _omit
    return rest as unknown as UserVocabulary
}

/**
 * Aggregate review statistics for the dashboard badge.
 */
export async function getReviewStats(): Promise<{
    due_now: number
    due_today: number
    learned: number
    mastered: number
}> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { due_now: 0, due_today: 0, learned: 0, mastered: 0 }

    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    const [dueNowRes, dueTodayRes, learnedRes, masteredRes] = await Promise.all([
        supabase
            .from("user_word_progress")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .lte("next_review_at", now.toISOString()),
        supabase
            .from("user_word_progress")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .lte("next_review_at", endOfDay.toISOString()),
        supabase
            .from("user_word_progress")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("repetitions", 3),
        supabase
            .from("user_word_progress")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("repetitions", 8),
    ])

    return {
        due_now: dueNowRes.count ?? 0,
        due_today: dueTodayRes.count ?? 0,
        learned: learnedRes.count ?? 0,
        mastered: masteredRes.count ?? 0,
    }
}
