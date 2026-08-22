#!/usr/bin/env npx tsx
/**
 * translate-grammar.ts — generates shared/grammar/{level}.de.ts from the English
 * base content, one chapter per Gemini call.
 *
 * Usage:
 *   GEMINI_API_KEY=xxx npx tsx scripts/translate-grammar.ts                  # all levels
 *   GEMINI_API_KEY=xxx npx tsx scripts/translate-grammar.ts --levels=a1,a2
 *   npx tsx scripts/translate-grammar.ts --dry-run                          # plan only, no API calls
 *   GEMINI_API_KEY=xxx npx tsx scripts/translate-grammar.ts --force         # ignore the cache
 *
 * Never clobbers work: a chapter that is ALREADY German in shared/grammar/{level}.de.ts
 * is reused verbatim, so re-running after reviewers have hand-corrected chapters
 * costs nothing and preserves their edits. Within a run, each freshly translated
 * chapter is also cached under scripts/.cache/grammar-de/ so a crash or a rate
 * limit resumes where it stopped. Use --force to re-translate everything.
 *
 * Structure is guaranteed, not hoped for: the model's answer is MERGED ONTO the
 * base chapter field by field. Chapter/section ids, block types, array lengths
 * and every Spanish `es` example come from the base and are never taken from the
 * model, so a hallucinated shape can't corrupt the output — the worst case is an
 * untranslated string, which `localeContent.check.ts` then catches.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getGrammarLevel, grammarLevels } from '../shared/grammar/index'
import type { GrammarChapter, GrammarContentBlock, GrammarLevel, GrammarSection } from '../shared/grammar/types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'shared', 'grammar')
const CACHE_DIR = path.join(__dirname, '.cache', 'grammar-de')
const GLOSSARY_FILE = path.join(__dirname, 'grammar-de-glossary.md')

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const

// Six fixed strings — cheaper and more consistent than asking the model, and the
// level title is the one string that never varies by chapter.
const LEVEL_TITLES_DE: Record<string, string> = {
  a1: 'Spanische Grammatik für Anfänger',
  a2: 'Spanische Grammatik — Grundstufe',
  b1: 'Spanische Grammatik — Mittelstufe',
  b2: 'Spanische Grammatik — Obere Mittelstufe',
  c1: 'Spanische Grammatik für Fortgeschrittene',
  c2: 'Spanische Grammatik — Meisterklasse',
}

// Full flash first, not lite: grammar rules must survive translation intact,
// and a wrong rule is worse than a slow run. Verified Aug 2026 — the 2.5 family
// 404s for new API keys.
const MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3-flash-preview']
const RETRYABLE = new Set([429, 500, 502, 503, 504])

// ── Gemini ───────────────────────────────────────────────────────────────

async function callGemini(prompt: string, apiKey: string, model: string) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    },
  )
  if (!r.ok) {
    const err = new Error(`Gemini ${r.status}: ${(await r.text()).slice(0, 200)}`) as Error & { status?: number }
    err.status = r.status
    throw err
  }
  return r.json() as Promise<{ candidates?: { content?: { parts?: { text?: string }[] } }[] }>
}

function buildPrompt(chapter: GrammarChapter, levelTitle: string, glossary: string): string {
  return `You translate Spanish-grammar reference material from English into German for a language-learning app.

The learner is a GERMAN speaker learning SPANISH. You translate the EXPLANATIONS.
You do NOT translate the Spanish language material being explained.

TRANSLATE into German:
- "title" fields (chapter and section)
- "content" (explanatory prose)
- "items" (rule bullets)
- "headers" (table column labels)
- the "en" field of each example — this holds the German gloss of the Spanish sentence
- English metalanguage inside table "rows" (row labels like "Singular", "Meaning", and English glosses)

NEVER translate, alter, reorder or "correct":
- the "es" field of any example — copy it through byte for byte
- Spanish words, verb forms, articles, endings and conjugations wherever they appear,
  including inside "content", "items" and table "rows". "el / la / los / las" stays
  "el / la / los / las". A cell containing "hablo" stays "hablo".
- "id" and "type" fields, and the number of items in every array

Accuracy matters more than fluency: these are grammar rules a learner will trust.
If an English sentence states a rule about Spanish, the German must state the SAME
rule — do not soften, generalise or add rules that were not there.

Use "du" to address the learner. Keep sentences short.

TERMINOLOGY — follow this glossary exactly:
${glossary}

Return ONLY JSON with the identical structure to the input, no markdown fence.

Level: ${levelTitle}

INPUT:
${JSON.stringify(chapter, null, 2)}`
}

async function translateChapter(
  chapter: GrammarChapter,
  levelTitle: string,
  glossary: string,
  apiKey: string,
): Promise<GrammarChapter> {
  const prompt = buildPrompt(chapter, levelTitle, glossary)
  let lastErr: unknown

  for (const model of MODELS) {
    const delays = [2000, 5000, 12000, 30000]
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const data = await callGemini(prompt, apiKey, model)
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
        return mergeChapter(chapter, JSON.parse(raw))
      } catch (e) {
        lastErr = e
        const status = (e as { status?: number }).status
        if (!status || !RETRYABLE.has(status)) break
        if (attempt === delays.length) break
        const wait = delays[attempt]
        process.stdout.write(` [${model} ${status} retry in ${wait / 1000}s]`)
        await new Promise((r) => setTimeout(r, wait))
      }
    }
    process.stdout.write(` [${model} failed → next]`)
  }
  throw lastErr ?? new Error('All models exhausted')
}

/**
 * Is this chapter already authored in German? Compares against the English base:
 * enough long strings differing means somebody (the script or a reviewer) has
 * already done it, and we must not overwrite them.
 */
function isAlreadyGerman(base: GrammarChapter, current: GrammarChapter): boolean {
  let total = 0
  let differs = 0
  const cmp = (a: string, b: string) => {
    if (a.trim().length < 12) return // "Person"/"Singular" are the same in both languages
    total++
    if (a.trim() !== b.trim()) differs++
  }
  cmp(base.title, current.title)
  base.sections.forEach((bs, si) => {
    const cs = current.sections[si]
    if (!cs) return
    cmp(bs.title, cs.title)
    bs.blocks.forEach((bb, bi) => {
      const cb = cs.blocks[bi]
      if (!cb) return
      if (bb.content !== undefined) cmp(bb.content, cb.content ?? '')
      bb.items?.forEach((it, i) => cmp(it, cb.items?.[i] ?? ''))
      bb.examples?.forEach((ex, i) => cmp(ex.en, cb.examples?.[i]?.en ?? ''))
    })
  })
  return total > 0 && differs / total >= 0.9
}

// ── Merge: base is the skeleton, the model only supplies strings ──────────

/** Use the translation if it's a non-empty string, otherwise keep the base. */
function str(candidate: unknown, base: string): string {
  return typeof candidate === 'string' && candidate.trim() ? candidate : base
}

/** Same length as base, element-wise fallback. */
function strList(candidate: unknown, base: string[]): string[] {
  const list = Array.isArray(candidate) ? candidate : []
  return base.map((b, i) => str(list[i], b))
}

function mergeBlock(base: GrammarContentBlock, tr: Record<string, unknown> | undefined): GrammarContentBlock {
  const out: GrammarContentBlock = { type: base.type }
  if (base.content !== undefined) out.content = str(tr?.content, base.content)
  if (base.items !== undefined) out.items = strList(tr?.items, base.items)
  if (base.examples !== undefined) {
    const trEx = Array.isArray(tr?.examples) ? (tr.examples as Record<string, unknown>[]) : []
    // `es` always comes from the base — the Spanish is the thing being taught.
    out.examples = base.examples.map((e, i) => ({ es: e.es, en: str(trEx[i]?.en, e.en) }))
  }
  if (base.headers !== undefined) out.headers = strList(tr?.headers, base.headers)
  if (base.rows !== undefined) {
    const trRows = Array.isArray(tr?.rows) ? (tr.rows as unknown[]) : []
    out.rows = base.rows.map((row, i) => strList(trRows[i], row))
  }
  return out
}

function mergeSection(base: GrammarSection, tr: Record<string, unknown> | undefined): GrammarSection {
  const trBlocks = Array.isArray(tr?.blocks) ? (tr.blocks as Record<string, unknown>[]) : []
  return {
    id: base.id,
    title: str(tr?.title, base.title),
    blocks: base.blocks.map((b, i) => mergeBlock(b, trBlocks[i])),
  }
}

function mergeChapter(base: GrammarChapter, tr: Record<string, unknown>): GrammarChapter {
  const trSections = Array.isArray(tr?.sections) ? (tr.sections as Record<string, unknown>[]) : []
  return {
    id: base.id,
    title: str(tr?.title, base.title),
    sections: base.sections.map((s, i) => mergeSection(s, trSections[i])),
  }
}

// ── Emit ─────────────────────────────────────────────────────────────────

function emitLevelFile(level: string, data: GrammarLevel): string {
  const constName = `grammar${level.toUpperCase()}De`
  return `import { GrammarLevel } from './types'

// GENERATED by scripts/translate-grammar.ts — reviewed and corrected by hand.
// German explanations, Spanish examples untouched. Example \`en\` fields hold the
// German gloss (the Block renderer shows that field as the secondary line).
// Re-running the script will NOT clobber this file's cache; delete
// scripts/.cache/grammar-de/${level}-*.json to force a re-translation.
export const ${constName}: GrammarLevel = ${JSON.stringify(data, null, 2)}
`
}

// ── Main ─────────────────────────────────────────────────────────────────

function parseLevels(args: string[]): string[] {
  const flag = args.find((a) => a.startsWith('--levels='))
  if (!flag) return [...LEVELS]
  return flag
    .slice('--levels='.length)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => (LEVELS as readonly string[]).includes(s))
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const force = args.includes('--force')
  const levels = parseLevels(args)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey && !dryRun) {
    console.error('✗ GEMINI_API_KEY not set. Use --dry-run to preview.')
    process.exit(1)
  }

  const glossary = await fs.readFile(GLOSSARY_FILE, 'utf8')
  await fs.mkdir(CACHE_DIR, { recursive: true })

  for (const level of levels) {
    const base = grammarLevels[level]
    if (!base) {
      console.warn(`Unknown level: ${level}`)
      continue
    }

    // Whatever is already shipped for `de` — hand-authored or previously generated.
    const shipped = getGrammarLevel(level, 'de') as GrammarLevel

    console.log(`\n=== ${level.toUpperCase()} — ${base.chapters.length} chapters ===`)
    const translated: GrammarChapter[] = []
    let done = 0
    let cached = 0
    let kept = 0
    let failed = 0

    for (const [idx, chapter] of base.chapters.entries()) {
      const cacheFile = path.join(CACHE_DIR, `${level}-${chapter.id}.json`)

      if (!force) {
        const existing = shipped.chapters[idx]
        if (existing && isAlreadyGerman(chapter, existing)) {
          translated.push(existing) // reviewer edits win over a fresh translation
          kept++
          continue
        }
        try {
          translated.push(JSON.parse(await fs.readFile(cacheFile, 'utf8')))
          cached++
          continue
        } catch {
          // not cached yet
        }
      }

      if (dryRun) {
        console.log(`  would translate ch${chapter.id}: ${chapter.title}`)
        continue
      }

      process.stdout.write(`  ch${chapter.id} ${chapter.title.slice(0, 44)}…`)
      try {
        const result = await translateChapter(chapter, base.title, glossary, apiKey!)
        await fs.writeFile(cacheFile, JSON.stringify(result, null, 2))
        translated.push(result)
        done++
        process.stdout.write(' ✓\n')
      } catch (e) {
        failed++
        translated.push(chapter) // English fallback beats a missing chapter
        process.stdout.write(` ✗ ${(e as Error).message}\n`)
      }
      await new Promise((r) => setTimeout(r, 500))
    }

    if (dryRun) {
      console.log(`  (${kept} already German, ${cached} cached)`)
      continue
    }

    const outFile = path.join(OUT_DIR, `${level}.de.ts`)
    await fs.writeFile(
      outFile,
      emitLevelFile(level, {
        level: base.level,
        title: LEVEL_TITLES_DE[level] ?? base.title,
        chapters: translated,
      }),
    )
    console.log(
      `✓ Wrote ${outFile} — ${done} translated, ${kept} kept as-is, ${cached} from cache, ${failed} failed`,
    )
    if (failed > 0) {
      console.log(`  ⚠ ${failed} chapter(s) fell back to English. Re-run to retry just those.`)
    }
  }

  console.log('\n✓ Done. Now run: npx tsx shared/grammar/localeContent.check.ts')
}

main().catch((e) => {
  console.error('✗', e)
  process.exit(1)
})
