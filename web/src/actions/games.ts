"use server"

import { createClient } from "@/utils/supabase/server"
import { recordActivity } from "@/actions/activity"
import { checkAchievements } from "@/actions/achievements"
import {
  gameResultSchema,
  isPlausible,
  accuracyOf,
  finalTacos,
  GAME_IDS,
  type GameId,
  type SubmitGameOutcome,
  type UserWordInput,
} from "@chingon/shared"

/**
 * The user's vocabulary joined with SRS progress, in the shape
 * `buildSessionPool` consumes. Curated fallback is bundled client-side
 * (`getVocabList`), so this is the only fetch a game needs.
 */
export async function getGameWords(): Promise<UserWordInput[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("user_vocabulary")
    .select("id, term, translations, user_word_progress ( box_level, next_review_at )")
    .eq("user_id", user.id)

  if (error) {
    console.error("[games] getGameWords error:", error)
    return []
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    term: row.term as string,
    translations: (row.translations ?? {}) as Record<string, string>,
    // 0..1 row despite the array shape (unique constraint per user+word)
    progress: (row.user_word_progress as { box_level?: number; next_review_at?: string | null }[] | null)?.[0] ?? null,
  }))
}

/**
 * Validate → plausibility-check → insert → award tacos (SQL-capped) →
 * streak credit → achievements. The award_tacos RPC is the authority on the
 * credited amount (per-row and daily ceilings live in SQL).
 */
export async function submitGameResult(payload: unknown): Promise<SubmitGameOutcome> {
  const parsed = gameResultSchema.safeParse(payload)
  if (!parsed.success) {
    return { saved: false, score: 0, tacosEarned: 0, newBest: false, error: "Invalid result" }
  }
  const result = parsed.data

  if (!isPlausible(result)) {
    return { saved: false, score: result.score, tacosEarned: 0, newBest: false, error: "Implausible result" }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { saved: false, score: result.score, tacosEarned: 0, newBest: false, error: "Unauthorized" }
  }

  // Sessions already completed today → daily payout curve (UTC day, matching
  // the SQL ceiling's date_trunc).
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  const { count: sessionsToday } = await supabase
    .from("game_results")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", todayStart.toISOString())

  const tacos = finalTacos(result.score, accuracyOf(result), sessionsToday ?? 0)
  const priorBest = await fetchBest(supabase, user.id, result.game_id)

  const { data: inserted, error: insertErr } = await supabase
    .from("game_results")
    .insert({
      user_id: user.id,
      game_id: result.game_id,
      score: result.score,
      correct: result.correct,
      total: result.total,
      duration_ms: result.duration_ms,
      tacos_earned: tacos,
    })
    .select("id")
    .single()

  if (insertErr || !inserted) {
    console.error("[games] insert error:", insertErr)
    return { saved: false, score: result.score, tacosEarned: 0, newBest: false, error: "No se pudo guardar" }
  }

  // SQL clamps per-row and per-day; its return value is the truth.
  let tacosEarned = 0
  const { data: awarded, error: awardErr } = await supabase.rpc("award_tacos", { p_result_id: inserted.id })
  if (awardErr) {
    console.error("[games] award_tacos error:", awardErr)
  } else {
    tacosEarned = (awarded as number | null) ?? 0
  }

  // Streak credit — recordActivity is idempotent and never throws.
  await recordActivity()

  try {
    await checkAchievements({
      type: "game_completed",
      payload: {
        gameId: result.game_id,
        combo: result.combo,
        perfectBoard: result.perfect_board,
        noHints: result.no_hints,
        correct: result.correct,
        total: result.total,
      },
    })
  } catch (err) {
    console.error("[games] achievement check failed:", err)
  }

  return {
    saved: true,
    score: result.score,
    tacosEarned,
    newBest: result.score > (priorBest ?? 0),
  }
}

export async function getPersonalBests(): Promise<Record<GameId, number | null>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // Derived from GAME_IDS so a new game can never be forgotten here. The old
  // hand-written literal was `as`-cast, which is why TS never caught a gap.
  const bests = Object.fromEntries(GAME_IDS.map((id) => [id, null])) as Record<GameId, number | null>
  if (!user) return bests

  for (const gameId of GAME_IDS) {
    bests[gameId] = await fetchBest(supabase, user.id, gameId)
  }
  return bests
}

/** Spend one taco on a Construye hint via the existing consume_taco RPC. */
export async function spendHintTaco(): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const { data, error } = await supabase.rpc("consume_taco", { p_user_id: user.id })
  if (error) {
    console.error("[games] consume_taco error:", error)
    return { ok: false }
  }
  return { ok: data === true }
}

async function fetchBest(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  gameId: GameId,
): Promise<number | null> {
  const { data } = await supabase
    .from("game_results")
    .select("score")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data?.score as number | undefined) ?? null
}
