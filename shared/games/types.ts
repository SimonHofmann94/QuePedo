import { z } from 'zod'

// ── Game identity ────────────────────────────────────────────────────────

export const GAME_IDS = ['chili_rush', 'loteria', 'construye'] as const
export type GameId = (typeof GAME_IDS)[number]

// ── Session word — the one shape every game consumes ─────────────────────
// Both sources (user_vocabulary rows with JSONB `translations`, curated
// VocabWord with flat {es, de, en}) are normalized into this by wordPool.

export interface SessionWord {
  /** Stable id: user_vocabulary uuid or `curated:<es>` */
  id: string
  /** Spanish term (the answer side) */
  es: string
  /** Locale-resolved translation shown to the player */
  display: string
  pos?: string
  /** SRS weight: due words 3, weak (box ≤ 2) 2, default 1 */
  srsWeight: number
}

// ── Per-game tuning (single source for logic, UI and plausibility) ──────

export const GAME_CONFIG = {
  chili_rush: {
    minWords: 15,
    lives: 3,
    sessionMs: 90_000,
    speedRampEvery: 5, // catches per speed level
    comboCap: 5,
    pointsPerCatch: 10, // × speedLevel × combo
  },
  loteria: {
    boardSize: 16,
    pointsPerMatch: 10,
    wrongTapPenalty: 5,
    lineBonus: 50, // per completed row/column
  },
  construye: {
    rounds: 10,
    minWords: 10,
    pointsPerLetter: 10,
    noHintBonus: 20, // per word solved without hints
    maxScrambleAttempts: 20,
  },
} as const

// ── Submit payload — validated identically on web and mobile ────────────

export const gameResultSchema = z.object({
  game_id: z.enum(GAME_IDS),
  score: z.number().int().min(0),
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
  duration_ms: z.number().int(),
  // Optional achievement signals (consumed by the games achievement group)
  combo: z.number().int().min(1).optional(),
  perfect_board: z.boolean().optional(),
  no_hints: z.boolean().optional(),
})

export type GameResult = z.infer<typeof gameResultSchema>

export type SubmitGameOutcome = {
  saved: boolean
  score: number
  tacosEarned: number
  newBest: boolean
  error?: string
}
