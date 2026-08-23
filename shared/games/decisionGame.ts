import { GAME_CONFIG, type DecisionGameId } from './types'
import type { DecisionItem } from './decisionItems'

// One reducer for all four grammar-decision games. Pure `state → state`, no
// action unions, no dispatch — same convention as chiliRush/loteria/construye.
// The UI owns the clock: sprint mode never sets `over` itself.

// ── State ────────────────────────────────────────────────────────────────

export interface DecisionMiss {
  item: DecisionItem
  chosen: number
}

export interface DecisionState {
  gameId: DecisionGameId
  items: DecisionItem[]
  /** Indexes into `items`. Sprint appends a missed item once so it comes back. */
  queue: number[]
  /** Cursor into `queue` */
  pos: number
  current: DecisionItem | null
  correct: number
  wrong: number
  combo: number // ×1..×comboCap
  maxCombo: number
  score: number
  /** For the result-card recap */
  misses: DecisionMiss[]
  over: boolean
}

// ── Internals ────────────────────────────────────────────────────────────

function cfg(gameId: DecisionGameId) {
  return GAME_CONFIG[gameId]
}

function itemAt(state: Pick<DecisionState, 'gameId' | 'items' | 'queue'>, pos: number): DecisionItem | null {
  if (state.queue.length === 0) return null
  // Sprint cycles through the queue if the player outruns it; rounds never
  // reach past the end because `over` fires first.
  const idx = cfg(state.gameId).mode === 'sprint' ? pos % state.queue.length : pos
  const itemIndex = state.queue[idx]
  return itemIndex === undefined ? null : state.items[itemIndex]
}

// ── Public API ───────────────────────────────────────────────────────────

/** Pool must hold ≥ 1 item. Rounds: exactly `rounds` are played; sprint: `poolSize`, cycling. */
export function initDecision(gameId: DecisionGameId, items: DecisionItem[]): DecisionState {
  if (items.length === 0) throw new Error(`initDecision(${gameId}): empty item pool`)
  const c = cfg(gameId)
  const limit = c.mode === 'rounds' ? Math.min(c.rounds, items.length) : items.length
  const queue = Array.from({ length: limit }, (_, i) => i)
  const state: DecisionState = {
    gameId,
    items,
    queue,
    pos: 0,
    current: null,
    correct: 0,
    wrong: 0,
    combo: 1,
    maxCombo: 1,
    score: 0,
    misses: [],
    over: false,
  }
  return { ...state, current: itemAt(state, 0) }
}

/**
 * Tap option `optionIndex`.
 * Correct: score += pointsPerCorrect × combo, combo grows to the cap.
 * Wrong: combo resets, the miss is recorded; in sprint mode the item is
 * re-queued once so the player meets it again this session.
 * Rounds: over when correct + wrong ≥ rounds. Sprint: never sets `over` here.
 */
export function answerDecision(state: DecisionState, optionIndex: number): DecisionState {
  if (state.over || !state.current) return state
  const c = cfg(state.gameId)
  const item = state.current
  const isCorrect = optionIndex === item.correct

  let queue = state.queue
  let correct = state.correct
  let wrong = state.wrong
  let combo = state.combo
  let score = state.score
  let misses = state.misses

  if (isCorrect) {
    correct += 1
    score += c.pointsPerCorrect * combo
    combo = Math.min(combo + 1, c.comboCap)
  } else {
    wrong += 1
    combo = 1
    misses = [...misses, { item, chosen: optionIndex }]
    if (c.mode === 'sprint') {
      // Re-queue once: the item index, appended to the end of the cycle.
      const itemIndex = state.items.indexOf(item)
      if (itemIndex >= 0) queue = [...queue, itemIndex]
    }
  }

  const pos = state.pos + 1
  const over = c.mode === 'rounds' && correct + wrong >= c.rounds
  const next: DecisionState = {
    ...state,
    queue,
    pos,
    correct,
    wrong,
    combo,
    maxCombo: Math.max(state.maxCombo, combo),
    score,
    misses,
    over,
    current: null,
  }
  return { ...next, current: over ? null : itemAt(next, pos) }
}

/** Rounds: state.over. Sprint: state.over || the clock (elapsed supplied by the UI). */
export function isDecisionOver(state: DecisionState, elapsedMs: number): boolean {
  if (state.over) return true
  const c = cfg(state.gameId)
  return c.mode === 'sprint' && elapsedMs >= c.sessionMs
}
