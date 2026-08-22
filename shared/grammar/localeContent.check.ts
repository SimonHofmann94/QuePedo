// Self-check for locale-aware content resolution AND German grammar coverage.
// Run: npx tsx shared/grammar/localeContent.check.ts
import assert from 'node:assert'
import { getDisplayTranslation } from '../utils/quiz'
import { getGrammarLevel, getChapter } from './index'
import type { GrammarChapter, GrammarLevel } from './types'

// --- Vocabulary: pick the translation matching the active locale ---
const tr = { de: 'Haus', en: 'house' }
assert.equal(getDisplayTranslation(tr, 'de'), 'Haus', 'de locale → German')
assert.equal(getDisplayTranslation(tr, 'en'), 'house', 'en locale → English (was the bug: showed German)')
assert.equal(getDisplayTranslation(tr, 'es'), 'Haus', 'missing es → falls back (de before en)')
assert.equal(getDisplayTranslation({ en: 'house' }, 'de'), 'house', 'missing de → falls back to en')
assert.equal(getDisplayTranslation(tr), 'Haus', 'no locale arg → legacy de→en behavior unchanged')

// --- Grammar: German content loads for de; untranslated falls back to English base ---
assert.equal(getGrammarLevel('a1', 'en')?.title, 'Beginner Spanish Grammar', 'a1/en → English baseline unchanged')
assert.equal(getGrammarLevel('a1')?.title, 'Beginner Spanish Grammar', 'a1 no locale → English base unchanged')

// --- A partial German file must NOT hide English chapters (merge, no regression) ---
const baseA1 = getGrammarLevel('a1')!
const deA1 = getGrammarLevel('a1', 'de')!
assert.equal(deA1.chapters.length, baseA1.chapters.length, 'de/a1 keeps full base chapter set (no content loss)')
assert.equal(getChapter('a1', 1, 'de')?.id, getChapter('a1', 1)?.id, 'every base chapter id resolvable under de')

// ── Structural integrity + coverage, per level ────────────────────────────
// The translation script merges onto the base, so a shape mismatch means the
// file was hand-edited into an inconsistent state. `es` drift means a reviewer
// "corrected" Spanish that is the very thing being taught.

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const
/** A level is considered authored once this share of its prose differs from English. */
const MIN_TRANSLATED_RATIO = 0.9

interface Coverage { total: number; translated: number }

function walkStrings(base: GrammarChapter, de: GrammarChapter, level: string, cov: Coverage) {
    const where = `${level} ch${base.id}`
    assert.equal(de.id, base.id, `${where}: chapter id must match base`)
    assert.equal(de.sections.length, base.sections.length, `${where}: section count must match base`)

    count(base.title, de.title, cov)

    base.sections.forEach((bs, si) => {
        const ds = de.sections[si]
        assert.equal(ds.id, bs.id, `${where}: section ${si} id must match base`)
        assert.equal(ds.blocks.length, bs.blocks.length, `${where} §${bs.id}: block count must match base`)
        count(bs.title, ds.title, cov)

        bs.blocks.forEach((bb, bi) => {
            const db = ds.blocks[bi]
            const at = `${where} §${bs.id} block ${bi}`
            assert.equal(db.type, bb.type, `${at}: block type must match base`)

            if (bb.content !== undefined) count(bb.content, db.content ?? '', cov)

            if (bb.items) {
                assert.equal(db.items?.length, bb.items.length, `${at}: rule count must match base`)
                bb.items.forEach((it, i) => count(it, db.items![i], cov))
            }

            if (bb.examples) {
                assert.equal(db.examples?.length, bb.examples.length, `${at}: example count must match base`)
                bb.examples.forEach((ex, i) => {
                    assert.equal(
                        db.examples![i].es, ex.es,
                        `${at} example ${i}: Spanish must be byte-identical to base (never translate the target language)`,
                    )
                    count(ex.en, db.examples![i].en, cov)
                })
            }

            if (bb.headers) {
                assert.equal(db.headers?.length, bb.headers.length, `${at}: table column count must match base`)
                // Headers are metalanguage ("Past Participle", "always indicative") and
                // must be translated. They were invisible to this metric until a reviewer
                // found most of C2's leftover English hiding in exactly here.
                bb.headers.forEach((h, i) => count(h, db.headers![i], cov))
            }
            if (bb.rows) {
                assert.equal(db.rows?.length, bb.rows.length, `${at}: table row count must match base`)
                bb.rows.forEach((row, i) =>
                    assert.equal(db.rows![i].length, row.length, `${at} row ${i}: cell count must match base`),
                )
            }
        })
    })
}

/**
 * Prose counts as translated when it differs from the English base.
 *
 * Known blind spot: table `rows` are NOT counted. They are predominantly Spanish
 * forms (`hablé`, `el/ella/usted`) that are legitimately identical in both
 * languages, so counting them would drown the signal in false positives — but it
 * does mean English can hide in a row cell. Only a human reading the table finds
 * that; this metric is a floor, not a proof.
 */
function count(base: string, de: string, cov: Coverage) {
    // Very short strings ("Person", "Singular", "Plural") are legitimately
    // identical in both languages — they'd poison the ratio.
    if (base.trim().length < 12) return
    cov.total++
    if (de.trim() !== base.trim()) cov.translated++
}

const report: string[] = []
let incomplete = 0

for (const level of LEVELS) {
    const base = getGrammarLevel(level) as GrammarLevel
    const de = getGrammarLevel(level, 'de') as GrammarLevel
    const cov: Coverage = { total: 0, translated: 0 }

    base.chapters.forEach((ch, i) => walkStrings(ch, de.chapters[i], level, cov))

    const ratio = cov.total === 0 ? 1 : cov.translated / cov.total
    const pct = (ratio * 100).toFixed(1).padStart(5)
    const ok = ratio >= MIN_TRANSLATED_RATIO
    if (!ok) incomplete++
    report.push(
        `  ${ok ? '✓' : '✗'} ${level.toUpperCase()}  ${pct}% German  (${cov.translated}/${cov.total} strings, ${base.chapters.length} chapters)`,
    )
}

console.log('✓ locale-aware vocab + grammar resolution OK')
console.log('German grammar coverage:')
report.forEach((l) => console.log(l))

if (incomplete > 0) {
    console.error(
        `\n✗ ${incomplete} level(s) below ${MIN_TRANSLATED_RATIO * 100}% German.` +
        `\n  Run: GEMINI_API_KEY=… npx tsx scripts/translate-grammar.ts`,
    )
    process.exit(1)
}
console.log('\n✓ all levels authored in German')
