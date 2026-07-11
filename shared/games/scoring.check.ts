// Run: npx tsx shared/games/scoring.check.ts
import assert from 'node:assert'
import { tacoPayout, dailyCapMultiplier, finalTacos, isPlausible, maxAchievableScore, accuracyOf } from './scoring'
import { gameResultSchema, type GameResult } from './types'

// Payout tiers
assert.equal(tacoPayout(100, 0.9), 2, 'great session → 2')
assert.equal(tacoPayout(100, 0.7), 1, 'decent session → 1')
assert.equal(tacoPayout(100, 0.5), 0, 'weak session → 0')
assert.equal(tacoPayout(0, 1), 0, 'zero score → 0')

// Cap curve: full for sessions 1–3, half 4–6, zero after
assert.equal(dailyCapMultiplier(0), 1)
assert.equal(dailyCapMultiplier(2), 1)
assert.equal(dailyCapMultiplier(3), 0.5)
assert.equal(dailyCapMultiplier(5), 0.5)
assert.equal(dailyCapMultiplier(6), 0)
assert.equal(finalTacos(100, 0.9, 0), 2)
assert.equal(finalTacos(100, 0.9, 3), 1, 'half rate floors 2→1')
assert.equal(finalTacos(100, 0.7, 3), 0, 'half rate floors 1→0')
assert.equal(finalTacos(100, 0.9, 6), 0, 'zero after 6 sessions')

// Plausibility
const base: GameResult = { game_id: 'loteria', score: 100, correct: 10, total: 16, duration_ms: 60_000 }
assert.ok(isPlausible(base))
assert.ok(!isPlausible({ ...base, correct: 20 }), 'correct > total rejected')
assert.ok(!isPlausible({ ...base, duration_ms: 3_000 }), 'sub-5s rejected')
assert.ok(isPlausible({ ...base, duration_ms: 6_000 }), 'fast honest loss (~6s) accepted')
assert.ok(!isPlausible({ ...base, duration_ms: 700_000 }), 'over-10min rejected')
assert.ok(!isPlausible({ ...base, score: 10_000 }), 'over-max loteria score rejected')

// Per-game max bounds are generous but finite
assert.equal(maxAchievableScore('loteria', 16), 16 * 10 + 8 * 50)
assert.ok(maxAchievableScore('chili_rush', 12) >= 12 * 10 * 5 * 3)
assert.ok(maxAchievableScore('construye', 10) === 10 * (30 * 10 + 20))

// Real chili session score must pass its own bound
const chili: GameResult = { game_id: 'chili_rush', score: maxAchievableScore('chili_rush', 30), correct: 30, total: 35, duration_ms: 90_000 }
assert.ok(isPlausible(chili), 'boundary score accepted')

// Schema round-trip
assert.ok(gameResultSchema.safeParse(base).success)
assert.ok(!gameResultSchema.safeParse({ ...base, game_id: 'poker' }).success, 'unknown game rejected')
assert.ok(!gameResultSchema.safeParse({ ...base, score: -5 }).success, 'negative score rejected')

// accuracyOf
assert.equal(accuracyOf({ correct: 8, total: 16 }), 0.5)

console.log('✓ scoring OK')
