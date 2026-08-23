import { z } from 'zod'

// ── Game identity ────────────────────────────────────────────────────────

export const GAME_IDS = [
  'chili_rush', 'loteria', 'construye',
  'el_o_la', 'ser_estar', 'pasado', 'subjuntivo',
] as const
export type GameId = (typeof GAME_IDS)[number]

/** The grammar-decision family: one engine (decisionGame.ts), four configs. */
export const DECISION_GAME_IDS = ['el_o_la', 'ser_estar', 'pasado', 'subjuntivo'] as const
export type DecisionGameId = (typeof DECISION_GAME_IDS)[number]

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type CEFR = (typeof CEFR_LEVELS)[number]

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

  // ── Grammar-decision games ───────────────────────────────────────────
  // `mode` is the only thing the engine branches on. `floor` is the lowest
  // level — and the one that's free; higher levels follow premium gating.
  // No lives: MIN_DURATION_MS in scoring.ts would reject an honest
  // three-wrong-taps death in a one-second-per-item sprint.
  el_o_la: {
    mode: 'sprint',
    sessionMs: 60_000,
    poolSize: 40,
    pointsPerCorrect: 10,
    comboCap: 5,
    levels: ['A1', 'A2', 'B1', 'B2'],
    floor: 'A1',
  },
  ser_estar: {
    mode: 'rounds',
    rounds: 10,
    poolSize: 10,
    pointsPerCorrect: 10,
    comboCap: 5,
    levels: ['A1', 'A2', 'B1'],
    floor: 'A1',
  },
  pasado: {
    mode: 'rounds',
    rounds: 10,
    poolSize: 10,
    pointsPerCorrect: 10,
    comboCap: 5,
    levels: ['A2', 'B1', 'B2'],
    floor: 'A2',
  },
  subjuntivo: {
    mode: 'rounds',
    rounds: 10,
    poolSize: 10,
    pointsPerCorrect: 10,
    comboCap: 5,
    levels: ['B1', 'B2'],
    floor: 'B1',
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
