import { GAME_CONFIG, type SessionWord } from './types'

const CFG = GAME_CONFIG.loteria

// ── State ────────────────────────────────────────────────────────────────

export interface LoteriaState {
  board: SessionWord[] // 16 unique words, 4×4 row-major
  marked: boolean[]
  callOrder: number[] // permutation of board indexes
  callIndex: number
  score: number
  wrongTaps: number
  linesCompleted: number
  over: boolean
}

// ── Internals ────────────────────────────────────────────────────────────

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Count completed rows + columns on a 4×4 marked grid. */
export function completedLines(marked: boolean[]): number {
  const n = 4
  let lines = 0
  for (let r = 0; r < n; r++) {
    if (marked.slice(r * n, r * n + n).every(Boolean)) lines++
  }
  for (let c = 0; c < n; c++) {
    let full = true
    for (let r = 0; r < n; r++) if (!marked[r * n + c]) full = false
    if (full) lines++
  }
  return lines
}

// ── Public API ───────────────────────────────────────────────────────────

/** Requires a pool of ≥ 16 words (wordPool guarantees this via minCount). */
export function initLoteria(pool: SessionWord[]): LoteriaState {
  const board = pool.slice(0, CFG.boardSize)
  if (board.length < CFG.boardSize) {
    throw new Error(`loteria needs ${CFG.boardSize} words, got ${board.length}`)
  }
  return {
    board,
    marked: new Array(CFG.boardSize).fill(false),
    callOrder: shuffled(board.map((_, i) => i)),
    callIndex: 0,
    score: 0,
    wrongTaps: 0,
    linesCompleted: 0,
    over: false,
  }
}

/** The active call: translation shown as the prompt, `es` spoken via TTS. */
export function currentCall(state: LoteriaState): SessionWord | null {
  if (state.over) return null
  return state.board[state.callOrder[state.callIndex]]
}

/**
 * Tap a cell. Correct match marks it, scores, and advances the call (the call
 * stays active until matched — a perfect board means zero wrong taps). Each
 * newly completed row/column fires a ¡LOTERÍA! bonus.
 */
export function onTap(state: LoteriaState, cellIndex: number): LoteriaState {
  const call = currentCall(state)
  if (!call || state.marked[cellIndex]) return state

  if (state.board[cellIndex].es !== call.es) {
    return { ...state, wrongTaps: state.wrongTaps + 1, score: Math.max(0, state.score - CFG.wrongTapPenalty) }
  }

  const marked = [...state.marked]
  marked[cellIndex] = true
  const lines = completedLines(marked)
  const newLines = lines - state.linesCompleted
  const callIndex = state.callIndex + 1

  return {
    ...state,
    marked,
    callIndex,
    linesCompleted: lines,
    score: state.score + CFG.pointsPerMatch + newLines * CFG.lineBonus,
    over: callIndex >= state.callOrder.length,
  }
}
