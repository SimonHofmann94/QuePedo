#!/usr/bin/env node
/**
 * build-grammar-exercises.mjs — generates 12 grammar exercises per chapter
 * across all 78 A1–C2 chapters and writes them to:
 *
 *   shared/content/grammar-exercises/{a1,a2,b1,b2,c1,c2}.json
 *
 * Usage (via tsx so .ts imports from shared/ resolve):
 *   GEMINI_API_KEY=xxx npm run build:grammar-exercises                         # all levels
 *   GEMINI_API_KEY=xxx npm run build:grammar-exercises -- a1 a2                # only a1+a2
 *   GEMINI_API_KEY=xxx npm run build:grammar-exercises -- --chapter a1:0
 *   npm run build:grammar-exercises -- --dry-run                               # no API calls
 *
 *   GEMINI_API_KEY=xxx npm run build:grammar-exercises -- --to-db            # grow the DB pool
 *
 * Per chapter: 1 Gemini call returning 12 exercises (3 of each type).
 *
 * Two destinations:
 *   default    → bakes into the level JSON. Skips chapters already present,
 *                so it only ever fills gaps in the bundled base.
 *   --to-db    → inserts into grammar_exercises (migration 027) instead, for
 *                EVERY chapter. This is the growth path: the bundle stays the
 *                reviewed base, the DB accumulates. Duplicates collapse on the
 *                content_key unique index, so re-running is always safe.
 *                Needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'shared', 'content', 'grammar-exercises')

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

const LEVEL_TITLES = {
  a1: 'Beginner Spanish Grammar',
  a2: 'Elementary Spanish Grammar',
  b1: 'Intermediate Spanish Grammar',
  b2: 'Upper Intermediate Spanish Grammar',
  c1: 'Advanced Spanish Grammar',
  c2: 'Mastery Spanish Grammar',
}

// Model ladder and prompt both live in shared/grammar/prompt.ts so the admin
// generator in the web app emits identical exercises. Filled by loadShared().
let MODELS = []
let buildPrompt = null
let toPoolItems = null

const RETRYABLE = new Set([429, 500, 502, 503, 504])

async function loadShared() {
  // Use ESM dynamic import; tsx handles the .ts files.
  const grammar = await import(path.join(ROOT, 'shared', 'grammar', 'index.ts'))
  MODELS = [...grammar.GRAMMAR_MODELS]
  buildPrompt = grammar.buildGrammarPrompt
  toPoolItems = grammar.toPoolItems
  return { grammar }
}

async function callGemini(prompt, apiKey, model) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    },
  )
  if (!r.ok) {
    const errText = await r.text()
    const err = new Error(`Gemini ${r.status}: ${errText.slice(0, 200)}`)
    err.status = r.status
    throw err
  }
  return r.json()
}

function validateExercises(arr) {
  if (!Array.isArray(arr)) throw new Error('Not an array')
  if (arr.length < 8) throw new Error(`Too few exercises: ${arr.length}`)
  const counts = { multiple_choice: 0, fill_in_blank: 0, sentence_reorder: 0, error_correction: 0 }
  for (const ex of arr) {
    if (!counts.hasOwnProperty(ex.type)) throw new Error(`Bad type: ${ex.type}`)
    counts[ex.type]++
    // Per-type minimal validation
    if (ex.type === 'multiple_choice') {
      if (!ex.prompt || !Array.isArray(ex.options) || ex.options.length !== 4 || !ex.correctAnswer) {
        throw new Error('Invalid multiple_choice')
      }
      if (!ex.options.includes(ex.correctAnswer)) {
        throw new Error('correctAnswer not in options')
      }
    } else if (ex.type === 'fill_in_blank') {
      if (!ex.sentenceWithBlank?.includes('___') || !ex.correctAnswer) {
        throw new Error('Invalid fill_in_blank')
      }
    } else if (ex.type === 'sentence_reorder') {
      if (!ex.correctSentence || !Array.isArray(ex.shuffledWords) || ex.shuffledWords.length < 2) {
        throw new Error('Invalid sentence_reorder')
      }
    } else if (ex.type === 'error_correction') {
      if (!ex.sentenceWithError || !ex.errorWord || !ex.correctedWord) {
        throw new Error('Invalid error_correction')
      }
      if (!ex.sentenceWithError.includes(ex.errorWord)) {
        throw new Error('errorWord not in sentenceWithError')
      }
    }
  }
  return counts
}

async function generateForChapter(level, chapter, apiKey, serializeFn) {
  const prompt = buildPrompt(level, chapter.title, serializeFn(chapter))

  let lastErr
  for (const model of MODELS) {
    const delays = [2000, 5000, 12000, 30000]
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const data = await callGemini(prompt, apiKey, model)
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
        const parsed = JSON.parse(raw)
        const counts = validateExercises(parsed)
        process.stdout.write(
          ` ✓ [${counts.multiple_choice}MC ${counts.fill_in_blank}FIB ${counts.sentence_reorder}SR ${counts.error_correction}EC]`,
        )
        return parsed
      } catch (e) {
        lastErr = e
        if (!e.status || !RETRYABLE.has(e.status)) {
          break
        }
        if (attempt === delays.length) break
        process.stdout.write(` [${model} ${e.status} retry in ${delays[attempt] / 1000}s]`)
        await new Promise((r) => setTimeout(r, delays[attempt]))
      }
    }
    process.stdout.write(` [${model} failed → next]`)
  }
  throw lastErr ?? new Error('All models exhausted')
}

/**
 * Insert a batch into grammar_exercises (027) with the service-role key.
 * Service role bypasses RLS, so this writes the table directly instead of
 * going through add_grammar_exercises (which exists for CLIENTS and caps at
 * 16 rows). `on_conflict=content_key` + ignore-duplicates gives the same
 * ON CONFLICT DO NOTHING semantics, so re-runs never double up.
 *
 * Returns the number of rows actually inserted.
 */
async function pushToDb(level, chapterId, exercises, model) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for --to-db')
  }

  const rows = toPoolItems(exercises).map((it) => ({
    level: level.toLowerCase(),
    chapter_id: chapterId,
    type: it.type,
    payload: it.payload,
    content_key: it.content_key,
    source: 'script',
    model,
  }))

  const r = await fetch(`${url}/rest/v1/grammar_exercises?on_conflict=content_key`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify(rows),
  })
  if (!r.ok) {
    throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 200)}`)
  }
  const inserted = await r.json()
  return Array.isArray(inserted) ? inserted.length : 0
}

/**
 * --to-db mode: generate one batch for EVERY chapter and grow the pool.
 * Never touches the level JSON — the bundle stays the reviewed base.
 */
async function growPool(level, levelData, apiKey, chapterFilter, serializeFn) {
  const chapters = chapterFilter !== null
    ? levelData.chapters.filter((c) => c.id === chapterFilter)
    : levelData.chapters

  console.log(`\n=== ${level.toUpperCase()} → DB pool (${chapters.length} chapters) ===`)
  let total = 0

  for (const chapter of chapters) {
    process.stdout.write(`  Ch ${chapter.id}: ${chapter.title.slice(0, 50)}…`)
    try {
      const exercises = await generateForChapter(level, chapter, apiKey, serializeFn)
      const n = await pushToDb(level, chapter.id, exercises, MODELS[0])
      total += n
      process.stdout.write(` → +${n} new${n < exercises.length ? ` (${exercises.length - n} dupes)` : ''}\n`)
    } catch (e) {
      process.stdout.write(` ✗ ${e.message}\n`)
    }
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`✓ ${level.toUpperCase()}: +${total} exercises in the pool`)
  return total
}

async function buildLevel(level, levelData, apiKey, dryRun, chapterFilter, serializeFn) {
  const file = path.join(OUT_DIR, `${level}.json`)
  let existing = {
    level: level.toUpperCase(),
    title: LEVEL_TITLES[level],
    source: 'Gemini-generated, validated against GrammarQuestion schema',
    model: MODELS[0],
    generatedAt: new Date().toISOString().split('T')[0],
    chapters: {},
  }
  try {
    const prev = JSON.parse(await fs.readFile(file, 'utf8'))
    if (prev?.chapters) existing = prev
  } catch {}

  const flush = async () => fs.writeFile(file, JSON.stringify(existing, null, 2))

  const chapters = chapterFilter !== null
    ? levelData.chapters.filter((c) => c.id === chapterFilter)
    : levelData.chapters

  const todo = chapters.filter((c) => !existing.chapters[c.id])
  console.log(`\n=== ${level.toUpperCase()} (${chapters.length} chapters, ${todo.length} to do) ===`)

  if (dryRun) {
    for (const c of chapters) {
      const status = existing.chapters[c.id] ? '✓ already done' : '… would generate'
      console.log(`  Ch ${c.id}: ${c.title} — ${status}`)
    }
    return
  }
  if (!apiKey) {
    console.log('  ⚠ No GEMINI_API_KEY — skipping translation')
    return
  }

  for (const chapter of todo) {
    process.stdout.write(`  Ch ${chapter.id}: ${chapter.title.slice(0, 50)}…`)
    try {
      const exercises = await generateForChapter(level, chapter, apiKey, serializeFn)
      existing.chapters[chapter.id] = {
        title: chapter.title,
        exercises,
      }
      await flush()
      process.stdout.write('\n')
    } catch (e) {
      process.stdout.write(` ✗ ${e.message}\n`)
    }
    // Polite delay
    await new Promise((r) => setTimeout(r, 500))
  }

  await flush()
  console.log(`✓ ${file} (${Object.keys(existing.chapters).length}/${levelData.chapters.length} chapters)`)
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const toDb = args.includes('--to-db')

  // Single-chapter mode: --chapter a1:0
  let singleChapter = null
  const ci = args.indexOf('--chapter')
  if (ci >= 0 && args[ci + 1]) {
    const [lvl, id] = args[ci + 1].split(':')
    singleChapter = { level: lvl, chapterId: parseInt(id, 10) }
  }

  const levelArgs = args.filter((a) => LEVELS.includes(a.toLowerCase()))
  const targets = singleChapter
    ? [singleChapter.level]
    : (levelArgs.length > 0 ? levelArgs : LEVELS)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey && !dryRun) {
    console.warn('⚠ GEMINI_API_KEY not set. Use --dry-run to preview without translation.')
  }

  await fs.mkdir(OUT_DIR, { recursive: true })

  const { grammar } = await loadShared()
  const serializeFn = grammar.serializeChapterContent

  for (const level of targets) {
    const levelData = grammar.grammarLevels?.[level] ?? grammar[`grammar${level.toUpperCase()}`]
    if (!levelData) {
      console.warn(`Unknown level: ${level}`)
      continue
    }
    const chapterFilter = singleChapter ? singleChapter.chapterId : null
    if (toDb) {
      if (dryRun) {
        console.log(`\n=== ${level.toUpperCase()} → DB pool: would generate ${levelData.chapters.length} × 12 ===`)
        continue
      }
      await growPool(level, levelData, apiKey, chapterFilter, serializeFn)
    } else {
      await buildLevel(level, levelData, apiKey, dryRun, chapterFilter, serializeFn)
    }
  }

  console.log('\n✓ Done.')
}

main().catch((e) => {
  console.error('✗', e)
  process.exit(1)
})
