import { GAME_CONFIG, type SessionWord } from './types'

const CFG = GAME_CONFIG.construye

// ── State ────────────────────────────────────────────────────────────────

export interface ConstruyeRound {
  word: SessionWord
  /** Scrambled letter tiles (unicode-safe: é, ñ, ü are single tiles) */
  tiles: string[]
  hintsUsed: number
  solved: boolean
}

export interface ConstruyeState {
  rounds: ConstruyeRound[]
  roundIndex: number
  score: number
  solvedNoHints: number
  over: boolean
}

// ── Scramble ─────────────────────────────────────────────────────────────

/**
 * Shuffle the word's letters, guaranteed ≠ the solution (re-shuffles up to
 * maxScrambleAttempts). Words whose letters are all identical (or length ≤ 1)
 * can't differ — returned as-is; callers treat those rounds as trivially solved.
 */
export function scramble(word: string): string[] {
  const letters = Array.from(word)
  if (new Set(letters).size <= 1) return letters

  for (let attempt = 0; attempt < CFG.maxScrambleAttempts; attempt++) {
    const shuffledLetters = [...letters]
    for (let i = shuffledLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]]
    }
    if (shuffledLetters.join('') !== word) return shuffledLetters
  }
  // Statistically unreachable for words with ≥ 2 distinct letters; last resort:
  // swap the first two distinct letters so the result provably differs.
  const idx = letters.findIndex((l) => l !== letters[0])
  const swapped = [...letters]
  ;[swapped[0], swapped[idx]] = [swapped[idx], swapped[0]]
  return swapped
}

// ── Public API ───────────────────────────────────────────────────────────

export function initConstruye(pool: SessionWord[]): ConstruyeState {
  const words = pool.slice(0, CFG.rounds)
  return {
    rounds: words.map((word) => ({
      word,
      tiles: scramble(word.es),
      hintsUsed: 0,
      solved: false,
    })),
    roundIndex: 0,
    score: 0,
    solvedNoHints: 0,
    over: words.length === 0,
  }
}

/** Strict equality per spec — no accent/case normalization. */
export function checkComplete(assembled: string, target: string): boolean {
  return assembled === target
}

/** Points for a solved round. */
export function scoreRound(word: SessionWord, hintsUsed: number): number {
  const letters = Array.from(word.es).length
  return letters * CFG.pointsPerLetter + (hintsUsed === 0 ? CFG.noHintBonus : 0)
}

/**
 * Record a hint on the current round (reveal the next letter — the UI charges
 * 1 taco via the existing consume_taco path). Returns the revealed letter.
 */
export function applyHint(state: ConstruyeState): { state: ConstruyeState; nextLetter: string } {
  const round = state.rounds[state.roundIndex]
  const letters = Array.from(round.word.es)
  const nextLetter = letters[Math.min(round.hintsUsed, letters.length - 1)]
  const rounds = [...state.rounds]
  rounds[state.roundIndex] = { ...round, hintsUsed: round.hintsUsed + 1 }
  return { state: { ...state, rounds }, nextLetter }
}

/** Mark the current round solved and advance. */
export function completeRound(state: ConstruyeState): ConstruyeState {
  const round = state.rounds[state.roundIndex]
  if (round.solved) return state
  const rounds = [...state.rounds]
  rounds[state.roundIndex] = { ...round, solved: true }
  const roundIndex = state.roundIndex + 1
  return {
    ...state,
    rounds,
    roundIndex,
    score: state.score + scoreRound(round.word, round.hintsUsed),
    solvedNoHints: state.solvedNoHints + (round.hintsUsed === 0 ? 1 : 0),
    over: roundIndex >= rounds.length,
  }
}
