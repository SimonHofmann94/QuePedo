import { GAME_CONFIG, type GameId, type GameResult } from './types'

// ── Taco payout (tunable economy constants) ──────────────────────────────
// Base payout: 2 tacos for a great session, 1 for a decent one. The daily cap
// halves then zeroes payouts — a perfect player earns at most 9 tacos/day
// (3×2 full + 3×1 half). Plays stay unlimited; only payouts cap.

const GREAT_ACCURACY = 0.85
const DECENT_ACCURACY = 0.6

export function tacoPayout(score: number, accuracy: number): number {
  if (score <= 0) return 0
  if (accuracy >= GREAT_ACCURACY) return 2
  if (accuracy >= DECENT_ACCURACY) return 1
  return 0
}

/** Sessions already completed today (across all games) → payout multiplier. */
export function dailyCapMultiplier(sessionsToday: number): number {
  if (sessionsToday < 3) return 1
  if (sessionsToday < 6) return 0.5
  return 0
}

export function finalTacos(score: number, accuracy: number, sessionsToday: number): number {
  return Math.floor(tacoPayout(score, accuracy) * dailyCapMultiplier(sessionsToday))
}

// ── Plausibility (server-side authority; shared so mobile matches) ──────

// 5 s, not 10: an all-miss Chili Rush death (3 quick wrong taps) can
// legitimately end in ~6 s and must not be rejected as implausible.
const MIN_DURATION_MS = 5_000
const MAX_DURATION_MS = 600_000

/** Generous per-game upper bound on score for a given correct count. */
export function maxAchievableScore(gameId: GameId, correct: number): number {
  switch (gameId) {
    case 'chili_rush': {
      const c = GAME_CONFIG.chili_rush
      // Every catch at max combo, at the speed level of the final catch.
      const maxSpeed = 1 + Math.ceil(correct / c.speedRampEvery)
      return correct * c.pointsPerCatch * c.comboCap * maxSpeed
    }
    case 'loteria': {
      const c = GAME_CONFIG.loteria
      // All matches + every row and column bonus (4 + 4).
      return correct * c.pointsPerMatch + 8 * c.lineBonus
    }
    case 'el_o_la':
    case 'ser_estar':
    case 'pasado':
    case 'subjuntivo': {
      // Every answer at max combo. No speed or lives factor by design.
      const c = GAME_CONFIG[gameId]
      return correct * c.pointsPerCorrect * c.comboCap
    }
    case 'construye': {
      const c = GAME_CONFIG.construye
      // Longest plausible Spanish word ≈ 30 letters, all no-hint.
      return correct * (30 * c.pointsPerLetter + c.noHintBonus)
    }
  }
}

/**
 * Reject impossible results. Structural validation is the Zod schema's job;
 * this is the semantic layer both platforms run before submitting/inserting.
 */
export function isPlausible(result: GameResult): boolean {
  if (result.correct > result.total) return false
  if (result.duration_ms < MIN_DURATION_MS || result.duration_ms > MAX_DURATION_MS) return false
  if (result.score > maxAchievableScore(result.game_id, result.correct)) return false
  return true
}

export function accuracyOf(result: Pick<GameResult, 'correct' | 'total'>): number {
  return result.total > 0 ? result.correct / result.total : 0
}
