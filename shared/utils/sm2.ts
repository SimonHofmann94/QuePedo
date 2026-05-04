/**
 * SM-2 spaced repetition algorithm.
 *
 * Given the user's current memory state for a word and the quality of their
 * latest answer (0–5), returns the updated state and the next review date.
 *
 * Quality scale (Anki/SuperMemo convention):
 *   0 — total blackout
 *   1 — incorrect, but felt familiar
 *   2 — incorrect, but easy to recall once shown
 *   3 — correct with serious difficulty
 *   4 — correct after hesitation
 *   5 — perfect recall
 *
 * Reference: https://super-memory.com/english/ol/sm2.htm
 */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5

export interface SM2State {
    /** Easiness factor — multiplier on the interval after each successful review. Min 1.3. */
    ease: number
    /** Current scheduling interval in days. */
    interval: number
    /** Successful repetitions in a row. */
    repetitions: number
}

export interface SM2Result extends SM2State {
    /** When the card is due next. */
    nextReviewAt: Date
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * Compute the next SM-2 state from the previous state and the quality of the
 * latest answer.
 *
 * The math:
 *   - On a fail (quality < 3) we reset repetitions to 0 and schedule the card
 *     again in 1 day. The ease factor is still penalised by the formula.
 *   - On a pass (quality >= 3):
 *       repetitions = 1  -> interval = 1 day
 *       repetitions = 2  -> interval = 6 days
 *       repetitions > 2  -> interval = round(prev_interval * ease)
 *   - Ease update:  ease + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
 *   - Ease is clamped to a minimum of 1.3.
 */
export function nextReview(
    state: SM2State,
    quality: Quality,
    now: Date = new Date(),
): SM2Result {
    const q = quality

    // Update ease factor (applies to both pass and fail)
    let ease = state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if (ease < 1.3) ease = 1.3
    // Round to 2 decimals so we don't drift on float math.
    ease = Math.round(ease * 100) / 100

    let repetitions: number
    let interval: number

    if (q < 3) {
        // Lapse — reset repetitions, see the card tomorrow.
        repetitions = 0
        interval = 1
    } else {
        repetitions = state.repetitions + 1
        if (repetitions === 1) {
            interval = 1
        } else if (repetitions === 2) {
            interval = 6
        } else {
            interval = Math.max(1, Math.round(state.interval * ease))
        }
    }

    const nextReviewAt = new Date(now.getTime() + interval * MS_PER_DAY)

    return { ease, interval, repetitions, nextReviewAt }
}

/**
 * Initial state for a brand new word the user has never seen.
 */
export function initialSM2State(): SM2State {
    return { ease: 2.5, interval: 0, repetitions: 0 }
}

// ---------------------------------------------------------------------------
// Inline test cases — exported so consumers can sanity-check, and run
// automatically in non-production environments to catch regressions.
// ---------------------------------------------------------------------------
export const __sm2TestCases: Array<{
    name: string
    state: SM2State
    quality: Quality
    expected: { ease: number; interval: number; repetitions: number }
}> = [
        {
            name: "first correct (q=5) on a new card -> 1 day",
            state: { ease: 2.5, interval: 0, repetitions: 0 },
            quality: 5,
            expected: { ease: 2.6, interval: 1, repetitions: 1 },
        },
        {
            name: "second correct (q=4) -> 6 days",
            state: { ease: 2.5, interval: 1, repetitions: 1 },
            quality: 4,
            expected: { ease: 2.5, interval: 6, repetitions: 2 },
        },
        {
            name: "third correct (q=5) -> round(6 * 2.6) = 16 days",
            state: { ease: 2.5, interval: 6, repetitions: 2 },
            quality: 5,
            expected: { ease: 2.6, interval: 16, repetitions: 3 },
        },
        {
            name: "fail (q=1) on a learned card -> resets reps, 1 day",
            state: { ease: 2.5, interval: 16, repetitions: 3 },
            quality: 1,
            expected: { ease: 1.96, interval: 1, repetitions: 0 },
        },
        {
            name: "ease floors at 1.3 after repeated failures",
            state: { ease: 1.4, interval: 1, repetitions: 0 },
            quality: 0,
            expected: { ease: 1.3, interval: 1, repetitions: 0 },
        },
    ]

if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
    for (const tc of __sm2TestCases) {
        const r = nextReview(tc.state, tc.quality, new Date(0))
        const ok =
            Math.abs(r.ease - tc.expected.ease) < 0.001 &&
            r.interval === tc.expected.interval &&
            r.repetitions === tc.expected.repetitions
        if (!ok) {
            // eslint-disable-next-line no-console
            console.warn(
                `[sm2] test failed: ${tc.name}`,
                { got: r, expected: tc.expected },
            )
        }
    }
}
