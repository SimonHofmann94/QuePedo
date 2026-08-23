// Run: npx tsx shared/content/decision-items/bank.check.ts
// The contract every sentence-game item bank must satisfy. Agents author to
// this; nothing ships that fails it.
import assert from 'node:assert/strict'
import { decisionItemSchema, type DecisionItem } from '../../games/decisionItems'
import { GAME_CONFIG, type CEFR } from '../../games/types'
import { getChapter } from '../../grammar'
import { normalizeAnswer } from '../../utils/quiz'
import { RULE_TAGS, RULES_DE } from './rules'
import { getDecisionBank } from './index'

type Game = keyof typeof RULE_TAGS

/** Per-level minimums (target in the plan is ~25 % higher). */
const MIN_PER_LEVEL: Record<Game, Partial<Record<CEFR, number>>> = {
  ser_estar: { A1: 80, A2: 80, B1: 60 },
  pasado: { A2: 80, B1: 80, B2: 40 },
  subjuntivo: { B1: 100, B2: 80 },
}
const ARITY: Record<Game, number> = { ser_estar: 2, pasado: 3, subjuntivo: 2 }
/** `correct` may not sit in one position more than this share. */
const MAX_POSITION_SHARE: Record<Game, number> = { ser_estar: 0.6, pasado: 0.45, subjuntivo: 0.6 }
const MIN_PER_TAG_PER_LEVEL = 5

// Mexican norm: perfecto is NOT the "correct" answer for a completed event
// today. Spain says "hoy he comido"; Mexico says "hoy comí".
const MEXICAN_PERFECTO_TRAP = /\b(hoy|esta mañana|esta tarde|esta noche|hace un rato|hace poco)\b/i
const ENGLISH_LEAK = /\b(the|is|are|tense|because|when|which)\b/
const WIR_REGISTER = /\bwir\b/i

const STRICT = process.argv.includes('--strict') // fail on count floors (off until banks are filled)

let failures = 0
const fail = (msg: string) => { failures++; console.error('  ✗ ' + msg) }

// Every rule tag has a German line and a resolvable chapter.
for (const [game, tags] of Object.entries(RULE_TAGS)) {
  for (const tag of tags) {
    const ref = RULES_DE[tag as keyof typeof RULES_DE]
    assert.ok(ref, `${game}/${tag}: missing RULES_DE entry`)
    assert.ok(ref.rule.length > 20, `${game}/${tag}: rule line too short`)
    assert.ok(getChapter(ref.level, ref.chapterId), `${game}/${tag}: /grammar/${ref.level}/${ref.chapterId} does not resolve`)
  }
}
console.log('✓ rule taxonomy: every tag has a German line and a live chapter link')

for (const game of Object.keys(RULE_TAGS) as Game[]) {
  const items = getDecisionBank(game)
  const tags = new Set<string>(RULE_TAGS[game])
  const levels = GAME_CONFIG[game].levels as readonly CEFR[]
  const ids = new Set<string>()
  const prompts = new Set<string>()
  const byLevel: Record<string, DecisionItem[]> = {}
  const where = (it: DecisionItem) => `${game}/${it.id}`

  for (const raw of items) {
    const r = decisionItemSchema.safeParse(raw)
    if (!r.success) { fail(`${game}/${(raw as DecisionItem).id ?? '?'}: ${r.error.issues[0]?.message}`); continue }
    const it = r.data

    if (ids.has(it.id)) fail(`${where(it)}: duplicate id`)
    ids.add(it.id)
    const np = normalizeAnswer(it.prompt)
    if (prompts.has(np)) fail(`${where(it)}: duplicate prompt "${it.prompt}"`)
    prompts.add(np)

    if (it.options.length !== ARITY[game]) fail(`${where(it)}: ${it.options.length} options, ${game} needs ${ARITY[game]}`)
    if (new Set(it.options).size !== it.options.length) fail(`${where(it)}: duplicate options`)
    if (it.correct >= it.options.length) fail(`${where(it)}: correct=${it.correct} out of range`)
    if (!tags.has(it.ruleTag)) fail(`${where(it)}: unknown ruleTag "${it.ruleTag}"`)
    if (!levels.includes(it.level)) fail(`${where(it)}: level ${it.level} not offered by ${game}`)
    if ((it.prompt.match(/___/g) ?? []).length !== 1) fail(`${where(it)}: prompt must contain exactly one ___`)
    if (ENGLISH_LEAK.test(it.explanation_de)) fail(`${where(it)}: English in explanation_de`)
    if (WIR_REGISTER.test(it.explanation_de)) fail(`${where(it)}: use "du", not "wir"`)

    if (game === 'pasado' && it.correct === 1 && MEXICAN_PERFECTO_TRAP.test(it.prompt)) {
      fail(`${where(it)}: perfecto marked correct with a same-day marker — Mexican norm is indefinido ("hoy comí")`)
    }
    ;(byLevel[it.level] ??= []).push(it)
  }

  for (const [level, min] of Object.entries(MIN_PER_LEVEL[game])) {
    const n = byLevel[level]?.length ?? 0
    if (n < min!) (STRICT ? fail : (m: string) => console.warn('  · ' + m))(`${game}/${level}: ${n} items, floor is ${min}`)
    if (n === 0) continue

    // position balance
    const counts = Array(ARITY[game]).fill(0)
    for (const it of byLevel[level]) counts[it.correct]++
    const share = Math.max(...counts) / n
    if (share > MAX_POSITION_SHARE[game]) fail(`${game}/${level}: position ${counts.indexOf(Math.max(...counts))} is correct ${Math.round(share * 100)}% of the time (max ${MAX_POSITION_SHARE[game] * 100}%)`)

    // every tag represented where it applies
    const perTag: Record<string, number> = {}
    for (const it of byLevel[level]) perTag[it.ruleTag] = (perTag[it.ruleTag] ?? 0) + 1
    for (const [tag, c] of Object.entries(perTag)) {
      if (c < MIN_PER_TAG_PER_LEVEL && STRICT) fail(`${game}/${level}/${tag}: ${c} items, need ≥ ${MIN_PER_TAG_PER_LEVEL}`)
    }
  }
  console.log(`${failures ? '✗' : '✓'} ${game}: ${items.length} items — ${Object.entries(byLevel).map(([l, a]) => `${l}:${a.length}`).join(' ') || 'empty'}`)
}

if (failures) { console.error(`\n✗ ${failures} problem(s)`); process.exit(1) }
console.log('\n✓ decision-item banks OK' + (STRICT ? '' : ' (floors not enforced — pass --strict once banks are authored)'))
