// Self-check for the hand-authored two-clause verb drills (conditional
// sentences + reported speech) that live inside the baked chapter files.
// Run: npx tsx shared/content/grammar-exercises/verbos.check.ts
//
// The same four chapters also hold the older Gemini-baked fill-ins, which do
// not follow the drill shape. Drill items are the ones whose `hint` uses the
// "infinitivo · persona" format; structural rules apply to everything.
import assert from 'node:assert'
import { getBakedExercises } from './index'
import { grammarQuestionSchema } from '../../grammar/exerciseSchema'
import { normalizeGrammarAnswer } from '../../grammar/answer'
import type { FillInBlankQuestion } from '../../grammar/exerciseTypes'

const CHAPTERS = [
  { level: 'b1', id: 4, kind: 'si' as const, label: 'B1 · si-clauses' },
  { level: 'b2', id: 2, kind: 'si' as const, label: 'B2 · si-clauses' },
  { level: 'b1', id: 12, kind: 'reported' as const, label: 'B1 · estilo indirecto' },
  { level: 'b2', id: 6, kind: 'reported' as const, label: 'B2 · estilo indirecto' },
]

const PERSONS = ['yo', 'tú', 'él', 'ella', 'usted', 'nosotros', 'ustedes', 'ellos', 'ellas']
/** Naming the tense in the hint would hand over the answer. */
const TENSE_WORDS = [
  'presente', 'futuro', 'condicional', 'subjuntivo', 'imperfecto', 'indefinido',
  'perfecto', 'pluscuamperfecto', 'compuesto', 'simple', 'indicativo',
]
const MIN_PER_CHAPTER = 24

/** hubiera → hubiese, esperáramos → esperásemos … */
const SE_TWIN: [RegExp, string][] = [
  [/ramos$/, 'semos'], [/ras$/, 'ses'], [/ran$/, 'sen'], [/ra$/, 'se'],
]
function seTwin(answer: string): string | null {
  const tokens = answer.split(' ')
  for (let i = 0; i < tokens.length; i++) {
    for (const [re, rep] of SE_TWIN) {
      if (re.test(tokens[i])) {
        const swapped = [...tokens]
        swapped[i] = tokens[i].replace(re, rep)
        return swapped.join(' ')
      }
    }
  }
  return null
}

const seenSentences = new Map<string, string>()
let drillTotal = 0

for (const ch of CHAPTERS) {
  const all = getBakedExercises(ch.level, ch.id)
  assert.ok(all?.length, `${ch.label}: chapter has no baked exercises`)

  const fills = all.filter((q): q is FillInBlankQuestion => q.type === 'fill_in_blank')

  // ── applies to every fill-in in these chapters, old and new ────────────
  for (const q of fills) {
    assert.ok(grammarQuestionSchema.safeParse(q).success, `${ch.label}: item fails the schema: ${q.sentenceWithBlank}`)
    assert.equal(
      q.sentenceWithBlank.split('___').length - 1, 1,
      `${ch.label}: exactly one blank — the renderers drop a second one: ${q.sentenceWithBlank}`,
    )
    assert.ok(q.hint && q.hint.trim().length > 0, `${ch.label}: hint missing: ${q.sentenceWithBlank}`)
  }

  // ── drill items only ───────────────────────────────────────────────────
  const drills = fills.filter((q) => (q.hint ?? '').includes(' · '))
  assert.ok(
    drills.length >= MIN_PER_CHAPTER,
    `${ch.label}: ${drills.length} drill items, want ≥ ${MIN_PER_CHAPTER}`,
  )
  drillTotal += drills.length

  for (const q of drills) {
    const where = `${ch.label} «${q.sentenceWithBlank.slice(0, 48)}…»`

    const parts = (q.hint ?? '').split(' · ')
    assert.equal(parts.length, 2, `${where}: hint must be "infinitivo · persona"`)
    assert.ok(
      /^[a-záéíóúñ]*(ar|er|ir)$/.test(parts[0]),
      `${where}: hint must start from an infinitive, got "${parts[0]}"`,
    )
    assert.ok(PERSONS.includes(parts[1]), `${where}: unknown person "${parts[1]}"`)
    for (const w of TENSE_WORDS) {
      assert.ok(
        !q.hint!.toLowerCase().includes(w),
        `${where}: hint names the tense ("${w}") — that IS the exercise`,
      )
    }

    // The verb to supply must sit in the SECOND half of the sentence.
    const [before, after] = q.sentenceWithBlank.split('___')
    assert.ok(before.trim().length > 0, `${where}: nothing before the blank`)
    assert.ok(
      before.includes(',') || before.includes('→'),
      `${where}: the blank must follow a first clause (comma or →)`,
    )
    assert.ok(after !== undefined, `${where}: malformed blank`)

    // Answer shape
    const answers = [q.correctAnswer, ...(q.acceptableAnswers ?? [])]
    assert.ok(
      q.acceptableAnswers?.includes(q.correctAnswer),
      `${where}: correctAnswer must also be listed in acceptableAnswers`,
    )
    for (const a of answers) {
      const n = a.trim().split(/\s+/)
      assert.ok(n.length >= 1 && n.length <= 3, `${where}: "${a}" is not a verb form (1–3 tokens)`)
      assert.equal(a, a.trim(), `${where}: "${a}" has stray whitespace`)
    }
    assert.ok(q.explanation && q.explanation.length > 20, `${where}: explanation missing or too short`)

    // -ra forms are interchangeable with -se: list both or the item is unfair.
    for (const a of answers) {
      const twin = seTwin(a)
      if (!twin || twin === a) continue
      assert.ok(
        answers.includes(twin),
        `${where}: "${a}" needs its -se twin "${twin}" in acceptableAnswers`,
      )
    }

    // Shape per drill kind
    if (ch.kind === 'si') {
      assert.ok(/(^|\s)[Ss]i\s/.test(q.sentenceWithBlank), `${where}: a conditional item needs a «si» clause`)
    } else {
      assert.ok(q.sentenceWithBlank.includes('→'), `${where}: a reported-speech item needs "quote → reported"`)
      assert.ok(q.sentenceWithBlank.includes('«'), `${where}: the direct quote must be shown`)
    }

    // No duplicates anywhere in the four banks.
    const key = normalizeGrammarAnswer(q.sentenceWithBlank)
    const prev = seenSentences.get(key)
    assert.ok(!prev, `duplicate sentence in ${ch.label} (also in ${prev}): ${q.sentenceWithBlank}`)
    seenSentences.set(key, ch.label)
  }
}

// The conditional banks must actually cover all three types + mixed at B2.
const b2 = (getBakedExercises('b2', 2) ?? []).filter(
  (q): q is FillInBlankQuestion => q.type === 'fill_in_blank' && (q.hint ?? '').includes(' · '),
)
const byType = (needle: string) => b2.filter((q) => q.explanation?.includes(needle)).length
for (const t of ['Type 1', 'Type 2', 'Type 3', 'Mixed conditional']) {
  assert.ok(byType(t) >= 4, `B2 si-clauses: only ${byType(t)} items for ${t}, want ≥ 4`)
}
assert.ok(
  b2.some((q) => q.acceptableAnswers?.some((a) => a.startsWith('hubiera '))),
  'B2 si-clauses: type 3 must accept «hubiera + participio» next to «habría + participio»',
)

console.log(`✓ verbos.check.ts — ${drillTotal} drill items across ${CHAPTERS.length} chapters`)
