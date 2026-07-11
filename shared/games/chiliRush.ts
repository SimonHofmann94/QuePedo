import { GAME_CONFIG, type SessionWord } from './types'
import { pickDistractors } from './wordPool'

const CFG = GAME_CONFIG.chili_rush

// ── State ────────────────────────────────────────────────────────────────

export interface ChiliRushDrop {
  word: SessionWord
  /** Basket labels (displays) in presentation order */
  options: string[]
  correctIndex: number
}

export interface ChiliRushState {
  pool: SessionWord[]
  queueIndex: number
  current: ChiliRushDrop | null
  lives: number
  combo: number // multiplier ×1..×5
  maxCombo: number
  catches: number
  misses: number
  speedLevel: number // 1-based; UI derives fall duration from this
  score: number
  over: boolean
}

// ── Internals ────────────────────────────────────────────────────────────

function spawn(pool: SessionWord[], queueIndex: number): ChiliRushDrop {
  const word = pool[queueIndex % pool.length]
  const distractors = pickDistractors(pool, word, 2)
  const options = [word, ...distractors]
  // Fisher–Yates on the 3 baskets
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }
  return {
    word,
    options: options.map((o) => o.display),
    correctIndex: options.findIndex((o) => o.es === word.es),
  }
}

// ── Public API (pure reducer — UI owns the clock/animation) ─────────────

export function initChiliRush(pool: SessionWord[]): ChiliRushState {
  return {
    pool,
    queueIndex: 1,
    current: spawn(pool, 0),
    lives: CFG.lives,
    combo: 1,
    maxCombo: 1,
    catches: 0,
    misses: 0,
    speedLevel: 1,
    score: 0,
    over: false,
  }
}

/**
 * Apply a basket tap (`basketIndex`) or a miss (`null` — the word landed).
 * Correct: score += pointsPerCatch × speedLevel × combo; combo grows to ×5;
 * speed +1 every `speedRampEvery` catches. Wrong/miss: −1 life, combo resets.
 */
export function onAnswer(state: ChiliRushState, basketIndex: number | null): ChiliRushState {
  if (state.over || !state.current) return state

  if (basketIndex !== null && basketIndex === state.current.correctIndex) {
    const catches = state.catches + 1
    const score = state.score + CFG.pointsPerCatch * state.speedLevel * state.combo
    const combo = Math.min(state.combo + 1, CFG.comboCap)
    return {
      ...state,
      catches,
      score,
      combo,
      maxCombo: Math.max(state.maxCombo, combo),
      speedLevel: 1 + Math.floor(catches / CFG.speedRampEvery),
      current: spawn(state.pool, state.queueIndex),
      queueIndex: state.queueIndex + 1,
    }
  }

  const lives = state.lives - 1
  return {
    ...state,
    lives,
    misses: state.misses + 1,
    combo: 1,
    over: lives <= 0,
    current: lives <= 0 ? null : spawn(state.pool, state.queueIndex),
    queueIndex: state.queueIndex + 1,
  }
}

/** Session end: out of lives, or the 90 s clock (elapsed supplied by the UI). */
export function isOver(state: ChiliRushState, elapsedMs: number): boolean {
  return state.over || elapsedMs >= CFG.sessionMs
}
