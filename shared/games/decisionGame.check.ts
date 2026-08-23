// Run: npx tsx shared/games/decisionGame.check.ts
import assert from 'node:assert/strict'
import { initDecision, answerDecision, isDecisionOver } from './decisionGame'
import { buildDecisionPool } from './decisionItems'
import type { DecisionItem } from './decisionItems'
import { maxAchievableScore } from './scoring'
import { GAME_CONFIG } from './types'

const mk = (n: number, level: DecisionItem['level'] = 'A1'): DecisionItem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `t:${i}`,
    prompt: `___ palabra${i}`,
    options: ['el', 'la'],
    correct: i % 2,
    ruleTag: i % 2 ? 'ending_a' : 'ending_o',
    level,
    explanation_de: 'Regel.',
  }))

// ── Rounds mode (ser_estar: 10 rounds) ──────────────────────────────────
{
  let s = initDecision('ser_estar', mk(10))
  assert.equal(s.current?.id, 't:0', 'starts on first item')
  assert.equal(s.queue.length, 10)

  // 5 correct in a row: combo 1,2,3,4,5 → score 10+20+30+40+50 = 150
  for (let i = 0; i < 5; i++) s = answerDecision(s, s.current!.correct)
  assert.equal(s.score, 150, 'combo ramps 1→5 and multiplies points')
  assert.equal(s.combo, 5, 'combo caps at 5')
  assert.equal(s.maxCombo, 5)

  // 6th correct at cap: +50 → 200; combo stays 5
  s = answerDecision(s, s.current!.correct)
  assert.equal(s.score, 200)
  assert.equal(s.combo, 5, 'combo stays at cap')

  // wrong: combo resets, miss recorded, score unchanged
  const wrongIdx = s.current!.correct === 0 ? 1 : 0
  s = answerDecision(s, wrongIdx)
  assert.equal(s.combo, 1, 'wrong answer resets combo')
  assert.equal(s.score, 200, 'wrong answer does not lose points')
  assert.equal(s.misses.length, 1)
  assert.equal(s.misses[0].chosen, wrongIdx)
  assert.equal(s.queue.length, 10, 'rounds mode does NOT re-queue misses')
  assert.ok(!s.over, 'not over at 7/10')

  // finish the round
  while (!s.over) s = answerDecision(s, s.current!.correct)
  assert.equal(s.correct + s.wrong, 10, 'rounds end at exactly 10 answers')
  assert.equal(s.current, null, 'no current item after over')
  assert.ok(isDecisionOver(s, 0), 'over regardless of clock')
  assert.equal(answerDecision(s, 0), s, 'answering after over is a no-op')

  // perfect run bound: 10 correct all at max combo = 10·10·5 = 500; real ≤ that
  const perfect = Array.from({ length: 10 }).reduce<ReturnType<typeof initDecision>>(
    (st) => answerDecision(st, st.current!.correct),
    initDecision('ser_estar', mk(10)),
  )
  assert.ok(perfect.score <= maxAchievableScore('ser_estar', 10), 'scoring.ts bound holds')
  assert.equal(perfect.score, 10 + 20 + 30 + 40 + 50 * 6, 'perfect 10 = 400')
}

// ── Sprint mode (el_o_la: 60 s, cycles, re-queues misses once) ──────────
{
  let s = initDecision('el_o_la', mk(3))
  assert.equal(s.queue.length, 3)
  assert.ok(!isDecisionOver(s, 59_999), 'sprint not over before the clock')
  assert.ok(isDecisionOver(s, 60_000), 'sprint over at sessionMs')

  // miss item 0 → re-queued at the end
  s = answerDecision(s, s.current!.correct === 0 ? 1 : 0)
  assert.deepEqual(s.queue, [0, 1, 2, 0], 'missed item appended once')
  assert.ok(!s.over, 'sprint never sets over on its own')

  // answer the rest; the 4th item shown is the re-queued one
  s = answerDecision(s, s.current!.correct) // item 1
  s = answerDecision(s, s.current!.correct) // item 2
  assert.equal(s.current?.id, 't:0', 'the missed item comes back')

  // keep going past the queue: it cycles instead of ending
  for (let i = 0; i < 10; i++) s = answerDecision(s, s.current!.correct)
  assert.ok(s.current !== null, 'sprint cycles, never runs dry')
  assert.ok(!s.over)
  assert.ok(s.score <= maxAchievableScore('el_o_la', s.correct), 'sprint bound holds')
}

// ── Pool builder ─────────────────────────────────────────────────────────
{
  const items = [...mk(20, 'A1'), ...mk(5, 'B1')]
  const pool = buildDecisionPool({ items, level: 'A1', count: 8 })
  assert.equal(pool.length, 8)
  assert.ok(pool.every((it) => it.level === 'A1'), 'level filter applied')
  assert.equal(new Set(pool.map((it) => it.id)).size, 8, 'no repeats')
  assert.equal(buildDecisionPool({ items, level: 'B1', count: 50 }).length, 5, 'count clamps to available')
}

// ── Config sanity ────────────────────────────────────────────────────────
for (const id of ['el_o_la', 'ser_estar', 'pasado', 'subjuntivo'] as const) {
  const c = GAME_CONFIG[id]
  const levels: readonly string[] = c.levels
  assert.ok(levels.includes(c.floor), `${id}: floor must be one of its levels`)
}
assert.throws(() => initDecision('pasado', []), /empty item pool/)

console.log('✓ decisionGame OK')
