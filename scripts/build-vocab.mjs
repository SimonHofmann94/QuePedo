#!/usr/bin/env node
/**
 * build-vocab.mjs — generates shared/content/vocab/{level}.json
 * by bucketing the doozan/spanish_data frequency.csv into CEFR levels
 * and translating Spanish lemmas to German via Gemini.
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node scripts/build-vocab.mjs                       # build all levels
 *   GEMINI_API_KEY=xxx node scripts/build-vocab.mjs --levels=a1,a2        # only a1, a2
 *   GEMINI_API_KEY=xxx node scripts/build-vocab.mjs b1 b2                 # legacy positional
 *   node scripts/build-vocab.mjs --dry-run --levels=a1,a2                 # preview, no API calls
 *
 * Behavior:
 *   - Resume-safe: appends to existing {level}.json, skips terms already present.
 *   - Cross-level dedup: a candidate is rejected if its normalized Spanish term
 *     already exists in ANY {a1,a2,b1,b2,c1,c2}.json (including itself). Existing
 *     entries are NEVER removed — dedup only filters NEW candidates.
 *   - Each level grows toward LEVEL_TARGETS[level] (early-stop when reached).
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

// Level metadata + canonical title for the JSON file header.
const BUCKETS = {
  a1: { title: 'A1 — Principiante' },
  a2: { title: 'A2 — Elemental' },
  b1: { title: 'B1 — Intermedio' },
  b2: { title: 'B2 — Alto' },
  c1: { title: 'C1 — Avanzado' },
  c2: { title: 'C2 — Maestría' },
}

// Target word counts per level. Used to early-stop harvesting.
const LEVEL_TARGETS = {
  a1: 500,
  a2: 800,
  b1: 1000,
  b2: 1400,
  c1: 1800,
  c2: 2500,
}

// Frequency-rank harvest ranges per level. These are intentionally WIDER than
// the final target so cross-level dedup (which removes terms already present
// in OTHER level files) still leaves enough candidates to hit the target.
//   - A1 biased to top 1000 (high-frequency beginner core)
//   - A2 spans 500–2500 (overlaps B1 by rank, but normalized-term dedup
//     filters those out)
//   - B1/B2/C1/C2 keep their original tight ranges to preserve the
//     existing densely-packed files.
const LEVEL_RANGES = {
  a1: [1, 1000],
  a2: [200, 8000],
  b1: [801, 1800],
  b2: [1801, 3200],
  c1: [3201, 5000],
  c2: [5001, 7500],
}

// We only keep "content words". Skip purely grammatical entries.
const KEEP_POS = new Set(['n', 'v', 'adj', 'adv', 'num', 'interj', 'phrase'])

// Mirrors the normalization used by `normalizeAnswer` in shared/utils/quiz.ts:
// lowercase + trim, then strip leading Spanish articles. Punctuation stripping
// is omitted (it doesn't apply to lemmas in the frequency list).
const LEADING_ARTICLE_RE = /^(el|la|los|las|un|una|unos|unas)\s+/i
function normalizeTerm(s) {
  if (!s) return ''
  return s.toLowerCase().trim().replace(LEADING_ARTICLE_RE, '').trim()
}

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

function harvestForLevel(words, level) {
  const [lo, hi] = LEVEL_RANGES[level]
  return words.filter((w) => w.rank >= lo && w.rank <= hi)
}

/**
 * Load every existing {level}.json and return:
 *   - perLevel: { a1: [VocabWord, …], … }  (raw arrays, in file order)
 *   - allTerms: Set<normalizedTerm>        (union across ALL levels)
 */
async function loadExistingVocab() {
  const perLevel = {}
  const allTerms = new Set()
  for (const level of Object.keys(BUCKETS)) {
    const file = path.join(VOCAB_DIR, `${level}.json`)
    let words = []
    try {
      const prev = JSON.parse(await fs.readFile(file, 'utf8'))
      words = Array.isArray(prev?.words) ? prev.words : []
    } catch {
      // file missing or unreadable — treat as empty
    }
    perLevel[level] = words
    for (const w of words) allTerms.add(normalizeTerm(w.es))
  }
  return { perLevel, allTerms }
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

/**
 * Plan a level: returns the list of NEW candidate words to translate, given
 *   - the harvested rank range
 *   - the cross-level term blocklist (every term already in any *.json)
 *   - the per-level target (early-stop once we've planned that many new words)
 *
 * Within a single planning call, we also dedupe by normalized term so the
 * frequency CSV doesn't yield two surface forms that collapse to the same key.
 */
function planLevel(level, harvested, blocklist) {
  const existingCount = blocklist.existingPerLevel[level]
  const target = LEVEL_TARGETS[level]
  const slotsLeft = Math.max(0, target - existingCount)

  const seenInPlan = new Set()
  const planned = []
  for (const w of harvested) {
    if (planned.length >= slotsLeft) break
    const norm = normalizeTerm(w.es)
    if (!norm) continue
    if (blocklist.allTerms.has(norm)) continue
    if (seenInPlan.has(norm)) continue
    seenInPlan.add(norm)
    planned.push(w)
  }
  return { planned, slotsLeft, existingCount, target }
}

async function buildLevel(level, planned, perLevelExisting, dryRun, apiKey) {
  const file = path.join(VOCAB_DIR, `${level}.json`)
  const existing = [...perLevelExisting]

  if (dryRun) {
    const sample = planned.slice(0, 8).map((w) => `${w.es}(${w.rank})`).join(', ')
    console.log(`  Sample new: ${sample}${planned.length > 8 ? ' …' : ''}`)
    return
  }
  if (!apiKey) {
    console.log('  ⚠ No GEMINI_API_KEY — skipping translation')
    return
  }
  if (planned.length === 0) {
    console.log('  Nothing to do (target already met).')
    return
  }

  const BATCH = 50

  const flush = async () => {
    // Append, dedupe again (defensive against any race / re-runs), preserve
    // existing order then sort by rank for deterministic file output.
    const seen = new Set()
    const merged = []
    for (const w of existing) {
      const n = normalizeTerm(w.es)
      if (seen.has(n)) continue
      seen.add(n)
      merged.push(w)
    }
    merged.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    const list = {
      level: level.toUpperCase(),
      title: BUCKETS[level].title,
      source: 'doozan/spanish_data (CC-BY-4.0) + Gemini-translated',
      generatedAt: new Date().toISOString().split('T')[0],
      wordCount: merged.length,
      words: merged,
    }
    await fs.writeFile(file, JSON.stringify(list, null, 2))
  }

  const totalBatches = Math.ceil(planned.length / BATCH)
  for (let i = 0; i < planned.length; i += BATCH) {
    const batch = planned.slice(i, i + BATCH)
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

function parseLevelArgs(args) {
  // Accept --levels=a1,a2 OR positional `a1 a2 b1`.
  const flag = args.find((a) => a.startsWith('--levels='))
  if (flag) {
    return flag
      .slice('--levels='.length)
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  }
  return args.filter((a) => /^[a-c][12]$/i.test(a)).map((a) => a.toLowerCase())
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const requested = parseLevelArgs(args)
  const levels = requested.length > 0 ? requested : Object.keys(BUCKETS)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey && !dryRun) {
    console.warn('⚠ GEMINI_API_KEY not set. Use --dry-run to preview without translation.')
  }

  const csvText = await fetchFreq()
  const words = parseFreq(csvText)
  console.log(`Parsed ${words.length} content words from frequency.csv`)

  // Load EVERY existing level for cross-level dedup, regardless of which
  // levels we're building this run.
  const { perLevel, allTerms } = await loadExistingVocab()
  const existingPerLevel = Object.fromEntries(
    Object.keys(BUCKETS).map((lvl) => [lvl, perLevel[lvl].length]),
  )
  console.log(`Cross-level dedup pool: ${allTerms.size} unique normalized terms across all levels`)
  console.log(`Existing per level: ${Object.entries(existingPerLevel).map(([k, v]) => `${k}=${v}`).join(', ')}`)

  for (const level of levels) {
    if (!BUCKETS[level]) {
      console.warn(`Unknown level: ${level}`)
      continue
    }
    const harvested = harvestForLevel(words, level)
    const { planned, existingCount, target } = planLevel(level, harvested, {
      allTerms,
      existingPerLevel,
    })

    const slotsLeft = Math.max(0, target - existingCount)
    const shortfall = Math.max(0, slotsLeft - planned.length)
    const totalBatches = Math.ceil(planned.length / 50)

    console.log(`\n=== ${level.toUpperCase()} ===`)
    console.log(`  range:           ranks ${LEVEL_RANGES[level][0]}–${LEVEL_RANGES[level][1]}`)
    console.log(`  existing:        ${existingCount}`)
    console.log(`  target:          ${target}`)
    console.log(`  slots remaining: ${slotsLeft}`)
    console.log(`  candidates:      ${harvested.length} harvested → ${planned.length} after cross-level dedup`)
    console.log(`  to request:      ${planned.length} (batches of 50 → ${totalBatches} batch${totalBatches === 1 ? '' : 'es'})`)
    if (shortfall > 0) {
      console.log(`  ⚠ shortfall:     ${shortfall} (target won't be met — widen LEVEL_RANGES.${level} or lower LEVEL_TARGETS.${level})`)
    }

    await buildLevel(level, planned, perLevel[level], dryRun, apiKey)
  }

  console.log('\n✓ Done.')
}

main().catch((e) => {
  console.error('✗', e)
  process.exit(1)
})
