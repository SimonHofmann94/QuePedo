#!/usr/bin/env node
/**
 * build-vocab.mjs — generates shared/content/vocab/{level}.json
 * by bucketing the doozan/spanish_data frequency.csv into CEFR levels
 * and translating Spanish lemmas to German via Gemini.
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node scripts/build-vocab.mjs              # build all levels
 *   GEMINI_API_KEY=xxx node scripts/build-vocab.mjs b1 b2        # only b1, b2
 *   node scripts/build-vocab.mjs --dry-run                       # preview buckets, no API calls
 *
 * Source: https://github.com/doozan/spanish_data (CC-BY-4.0)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const VOCAB_DIR = path.join(ROOT, 'shared', 'content', 'vocab')
const FREQ_URL = 'https://raw.githubusercontent.com/doozan/spanish_data/master/frequency.csv'
const CACHE_FILE = '/tmp/qp-spanish-frequency.csv'

// CEFR buckets (rank ranges in the filtered frequency list)
const BUCKETS = {
  a1: { range: [1, 300],     title: 'A1 — Principiante' },
  a2: { range: [301, 800],   title: 'A2 — Elemental' },
  b1: { range: [801, 1800],  title: 'B1 — Intermedio' },
  b2: { range: [1801, 3200], title: 'B2 — Alto' },
  c1: { range: [3201, 5000], title: 'C1 — Avanzado' },
  c2: { range: [5001, 7500], title: 'C2 — Maestría' },
}

// We only keep "content words". Skip purely grammatical entries.
const KEEP_POS = new Set(['n', 'v', 'adj', 'adv', 'num', 'interj', 'phrase'])

async function fetchFreq() {
  try {
    await fs.access(CACHE_FILE)
    console.log(`✓ Using cached frequency.csv at ${CACHE_FILE}`)
    return fs.readFile(CACHE_FILE, 'utf8')
  } catch {
    console.log(`Fetching ${FREQ_URL}…`)
    const r = await fetch(FREQ_URL)
    if (!r.ok) throw new Error(`fetch failed: ${r.status}`)
    const text = await r.text()
    await fs.writeFile(CACHE_FILE, text)
    console.log(`✓ Cached at ${CACHE_FILE}`)
    return text
  }
}

function parseFreq(text) {
  const lines = text.split('\n').slice(1).filter(Boolean)
  let rank = 0
  const out = []
  for (const line of lines) {
    const [count, spanish, pos, flags] = line.split(',')
    if (flags === 'NOUSAGE') continue
    if (!KEEP_POS.has(pos)) continue
    rank++
    out.push({ rank, es: spanish, pos })
    if (rank >= 8000) break
  }
  return out
}

function bucketize(words) {
  const buckets = {}
  for (const [level, { range }] of Object.entries(BUCKETS)) {
    buckets[level] = words.filter((w) => w.rank >= range[0] && w.rank <= range[1])
  }
  return buckets
}

// Models to try in order — fall back if one is overloaded.
// flash-lite first: simple translation needs no reasoning, it's cheaper,
// and typically far less rate-limited than the flagship 2.5-flash.
// Verified Apr 2026: 2.0-flash and 1.5-flash are deprecated → removed.
const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
]

async function callGemini(prompt, apiKey, model) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
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

const RETRYABLE = new Set([429, 500, 502, 503, 504])

async function translateBatch(batch, apiKey) {
  const items = batch.map((w) => `${w.es} (${w.pos})`).join('\n')
  const prompt = `You are a Spanish-to-German translation assistant. Translate each lemma to German.
Return STRICT JSON: an array of objects with keys "de" (German translation) and "en" (English translation).
Keep order identical to input. For nouns, the German should include the article (der/die/das).
Use the most common modern translation.

Input (one lemma per line, format "spanish (pos)"):
${items}

Return ONLY the JSON array, no markdown, no explanation.`

  let lastErr
  for (const model of MODELS) {
    // Try each model with up to 4 retries (exp. backoff: 2s, 5s, 12s, 30s)
    const delays = [2000, 5000, 12000, 30000]
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const data = await callGemini(prompt, apiKey, model)
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed) || parsed.length !== batch.length) {
          throw new Error(`Bad shape: expected ${batch.length}, got ${parsed?.length}`)
        }
        return batch.map((w, i) => ({
          es: w.es,
          de: parsed[i].de,
          en: parsed[i].en,
          pos: w.pos,
          rank: w.rank,
        }))
      } catch (e) {
        lastErr = e
        // Only retry on transient errors
        if (!e.status || !RETRYABLE.has(e.status)) {
          // Fatal for this model (4xx other than 429), try next model
          break
        }
        if (attempt === delays.length) break
        const wait = delays[attempt]
        process.stdout.write(` [${model} ${e.status} retry in ${wait / 1000}s]`)
        await new Promise((r) => setTimeout(r, wait))
      }
    }
    process.stdout.write(` [${model} failed → next]`)
  }
  throw lastErr ?? new Error('All models exhausted')
}

async function buildLevel(level, words, apiKey, dryRun) {
  console.log(`\n=== ${level.toUpperCase()} (${words.length} words) ===`)
  if (dryRun) {
    console.log('  Sample:', words.slice(0, 5).map((w) => w.es).join(', '), '…')
    return
  }
  if (!apiKey) {
    console.log('  ⚠ No GEMINI_API_KEY — skipping translation')
    return
  }
  const BATCH = 50
  const file = path.join(VOCAB_DIR, `${level}.json`)

  // Resume: load existing translations, skip words already done
  let existing = []
  try {
    const prev = JSON.parse(await fs.readFile(file, 'utf8'))
    existing = Array.isArray(prev?.words) ? prev.words : []
  } catch {}
  const doneRanks = new Set(existing.map((w) => w.rank))
  const remaining = words.filter((w) => !doneRanks.has(w.rank))
  if (existing.length > 0) {
    console.log(`  Resuming: ${existing.length} already translated, ${remaining.length} remaining`)
  }

  const flush = async () => {
    const all = [...existing].sort((a, b) => a.rank - b.rank)
    const list = {
      level: level.toUpperCase(),
      title: BUCKETS[level].title,
      source: 'doozan/spanish_data (CC-BY-4.0) + Gemini-translated',
      generatedAt: new Date().toISOString().split('T')[0],
      wordCount: all.length,
      words: all,
    }
    await fs.writeFile(file, JSON.stringify(list, null, 2))
  }

  const totalBatches = Math.ceil(remaining.length / BATCH)
  for (let i = 0; i < remaining.length; i += BATCH) {
    const batch = remaining.slice(i, i + BATCH)
    process.stdout.write(`  Batch ${i / BATCH + 1}/${totalBatches} (${batch.length} words)…`)
    try {
      const translated = await translateBatch(batch, apiKey)
      existing.push(...translated)
      process.stdout.write(' ✓\n')
      // Save after every batch so we can resume cleanly
      await flush()
    } catch (e) {
      process.stdout.write(` ✗ ${e.message}\n  (Skipping this batch — re-run the script to retry.)\n`)
    }
    // Small delay to be nice to the API
    await new Promise((r) => setTimeout(r, 500))
  }

  await flush()
  console.log(`✓ Wrote ${file} (${existing.length} words total)`)
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const targets = args.filter((a) => a.match(/^[a-c][12]$/))
  const levels = targets.length > 0 ? targets : Object.keys(BUCKETS)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey && !dryRun) {
    console.warn('⚠ GEMINI_API_KEY not set. Use --dry-run to preview without translation.')
  }

  const csvText = await fetchFreq()
  const words = parseFreq(csvText)
  console.log(`Parsed ${words.length} content words from frequency.csv`)

  const buckets = bucketize(words)

  for (const level of levels) {
    if (!buckets[level]) {
      console.warn(`Unknown level: ${level}`)
      continue
    }
    await buildLevel(level, buckets[level], apiKey, dryRun)
  }

  console.log('\n✓ Done.')
}

main().catch((e) => {
  console.error('✗', e)
  process.exit(1)
})
