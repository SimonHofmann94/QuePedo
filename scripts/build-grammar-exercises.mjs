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
 * Per chapter: 1 Gemini call returning 12 exercises (3 of each type).
 * Resume: skips chapters already present in the level JSON.
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

// Models to try in order — flash-lite first since it's cheap and rarely
// rate-limited; same ladder as build-vocab.mjs.
const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
]

const RETRYABLE = new Set([429, 500, 502, 503, 504])

async function loadShared() {
  // Use ESM dynamic import; tsx handles the .ts files.
  const grammar = await import(path.join(ROOT, 'shared', 'grammar', 'index.ts'))
  const fewShot = await import(path.join(ROOT, 'shared', 'grammar', 'fewShotExamples.ts'))
  return { grammar, fewShot }
}

const SYSTEM_PROMPT_HEADER = `You generate Spanish grammar exercises for a CEFR-graded language-learning app.

OUTPUT FORMAT — return ONLY a JSON array of exactly 12 objects matching one of these shapes:
- multiple_choice:    { "type": "multiple_choice", "prompt": "…", "options": ["A","B","C","D"], "correctAnswer": "A", "explanation": "…" }
- fill_in_blank:      { "type": "fill_in_blank", "sentenceWithBlank": "… ___ …", "correctAnswer": "…", "acceptableAnswers": ["…"], "hint": "…", "explanation": "…" }
- sentence_reorder:   { "type": "sentence_reorder", "correctSentence": "…", "shuffledWords": ["…"], "hint": "…", "explanation": "…" }
- error_correction:   { "type": "error_correction", "sentenceWithError": "…", "errorWord": "…", "correctedWord": "…", "acceptableCorrections": ["…"], "explanation": "…" }

CONSTRAINTS:
- Generate EXACTLY 3 of each type. Total exactly 12 exercises.
- Difficulty must match the CEFR level given below.
- Examples must be in Spanish; explanations in English.
- Distractors (wrong options) must be plausible for a learner at this level.
- Use ONLY grammar covered in the chapter content below.
- For sentence_reorder: shuffledWords must contain the exact tokens of correctSentence in a random order.
- For error_correction: errorWord must appear verbatim in sentenceWithError.
- For fill_in_blank: sentenceWithBlank MUST contain the substring "___" (three underscores) where the blank goes.

Here is one example of the desired tone for each type:`

function buildPrompt(level, chapter, fewShotJson, serialized) {
  return `${SYSTEM_PROMPT_HEADER}

${fewShotJson}

(End of examples — do NOT repeat them. Generate fresh exercises for the chapter below.)

CEFR LEVEL: ${level.toUpperCase()}
CHAPTER TITLE: ${chapter.title}

CHAPTER CONTENT:
${serialized}

Generate 12 exercises now. Return ONLY the JSON array.`
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

async function generateForChapter(level, chapter, fewShotJson, apiKey, serializeFn) {
  const serialized = serializeFn(chapter)
  const prompt = buildPrompt(level, chapter, fewShotJson, serialized)

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

async function buildLevel(level, levelData, fewShotJson, apiKey, dryRun, chapterFilter, serializeFn) {
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
      const exercises = await generateForChapter(
        level,
        chapter,
        fewShotJson,
        apiKey,
        serializeFn,
      )
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

  const { grammar, fewShot } = await loadShared()
  const fewShotJson = fewShot.fewShotPromptBlock()
  const serializeFn = grammar.serializeChapterContent

  for (const level of targets) {
    const levelData = grammar.grammarLevels?.[level] ?? grammar[`grammar${level.toUpperCase()}`]
    if (!levelData) {
      console.warn(`Unknown level: ${level}`)
      continue
    }
    await buildLevel(
      level,
      levelData,
      fewShotJson,
      apiKey,
      dryRun,
      singleChapter ? singleChapter.chapterId : null,
      serializeFn,
    )
  }

  console.log('\n✓ Done.')
}

main().catch((e) => {
  console.error('✗', e)
  process.exit(1)
})
