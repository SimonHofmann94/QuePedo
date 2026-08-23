#!/usr/bin/env node
/**
 * backfill-gender.mjs — derive the `gender` field for curated nouns.
 *
 * Only 63 of ~4,350 nouns in shared/content/vocab/*.json carry a gender;
 * ¿El o La? needs it on every noun it serves. The heuristic lives in
 * shared/games/gender.ts (one source for the backfill AND the in-game
 * explanation); this script just runs it and guards the write.
 *
 *   node scripts/backfill-gender.mjs --derive --out=<dir>
 *       writes <dir>/<level>.json patches { "<es>": { gender, rule, confidence, de } }
 *       plus <dir>/review.md listing every UNSURE row for a reviewer to settle
 *   <reviewer edits the unsure entries' `gender` in the patch files>
 *   node scripts/backfill-gender.mjs --merge --in=<dir> [--dry-run]
 *       paranoid merge: only `gender` may change; count/order/every other field frozen
 *
 * Deliberately separate from vocab-agent-enrich.mjs, whose merge errors if
 * `gender` moves — that guard is correct for translation patches.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const VOCAB_DIR = path.join(ROOT, 'shared', 'content', 'vocab')
const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

const arg = (name, dflt = null) => {
  const f = process.argv.find((a) => a.startsWith(`--${name}=`))
  return f ? f.slice(name.length + 3) : dflt
}
const flag = (name) => process.argv.includes(`--${name}`)

// The heuristic is TypeScript; load it through tsx's register hook so this
// script and the app can never drift apart.
async function loadGender() {
  const require = createRequire(import.meta.url)
  require('tsx/cjs')
  return require(path.join(ROOT, 'shared', 'games', 'gender.ts'))
}

async function readLevel(level) {
  const file = path.join(VOCAB_DIR, `${level}.json`)
  return { file, list: JSON.parse(await fs.readFile(file, 'utf8')) }
}

// ── derive ───────────────────────────────────────────────────────────────

async function derive() {
  const outDir = arg('out')
  if (!outDir) throw new Error('--out=<dir> required')
  await fs.mkdir(outDir, { recursive: true })
  const { deriveGender } = await loadGender()

  const totals = { sure: 0, likely: 0, unsure: 0, existing: 0, skipped: 0 }
  const review = ['# Gender review — settle every row below', '',
    'Set `gender` to `m`, `f`, or `mf` in the matching `<level>.json` patch. Leave it', 'as-is (or delete the key) to exclude the noun from the game.', '']

  for (const level of LEVELS) {
    const { list } = await readLevel(level)
    const patch = {}
    const unsureRows = []
    for (const w of list.words) {
      if (w.pos !== 'n') { totals.skipped++; continue }
      if (w.gender) { totals.existing++; continue } // never overwrite hand-set values
      const g = deriveGender(w.es, w.de)
      totals[g.confidence]++
      const de = Array.isArray(w.de) ? w.de[0] : w.de
      patch[w.es] = { gender: g.gender, rule: g.rule, confidence: g.confidence, de }
      if (g.confidence === 'unsure') unsureRows.push(`| \`${w.es}\` | ${de ?? ''} | ${g.gender ?? '?'} | ${g.rule} |`)
    }
    await fs.writeFile(path.join(outDir, `${level}.json`), JSON.stringify(patch, null, 2))
    if (unsureRows.length) {
      review.push(`## ${level.toUpperCase()} — ${unsureRows.length} unsure`, '', '| es | de | guess | rule |', '|---|---|---|---|', ...unsureRows, '')
    }
  }
  await fs.writeFile(path.join(outDir, 'review.md'), review.join('\n'))
  console.table(totals)
  console.log(`→ ${outDir}/<level>.json + review.md (${totals.unsure} rows to settle)`)
}

// ── merge ────────────────────────────────────────────────────────────────

const VALID = new Set(['m', 'f', 'mf'])

async function merge() {
  const inDir = arg('in')
  if (!inDir) throw new Error('--in=<dir> required')
  const dryRun = flag('dry-run')
  const errors = []
  let applied = 0
  let left = 0

  for (const level of LEVELS) {
    let patch
    try {
      patch = JSON.parse(await fs.readFile(path.join(inDir, `${level}.json`), 'utf8'))
    } catch {
      continue // no patch for this level
    }
    const { file, list } = await readLevel(level)
    const before = list.words
    const index = new Set(before.map((w) => w.es))
    for (const key of Object.keys(patch)) {
      if (!index.has(key)) errors.push(`${level}: patch has "${key}" which is not in the list`)
    }

    const after = before.map((w) => {
      const p = patch[w.es]
      if (!p || w.pos !== 'n') return w
      // An unsure row the reviewer didn't settle stays genderless on purpose.
      if (p.confidence === 'unsure' && !p.reviewed) { left++; return w }
      if (!VALID.has(p.gender)) {
        if (p.gender !== null && p.gender !== undefined) errors.push(`${level} "${w.es}": invalid gender "${p.gender}"`)
        return w
      }
      if (w.gender && w.gender !== p.gender) errors.push(`${level} "${w.es}": would overwrite hand-set gender`)
      if (w.gender) return w
      applied++
      return { ...w, gender: p.gender }
    })

    // Nothing but `gender` may move.
    if (after.length !== before.length) errors.push(`${level}: word count changed`)
    for (let i = 0; i < before.length; i++) {
      const { gender: _a, ...restA } = before[i]
      const { gender: _b, ...restB } = after[i]
      if (JSON.stringify(restA) !== JSON.stringify(restB)) errors.push(`${level}[${i}] "${before[i].es}": a non-gender field changed`)
    }

    if (!dryRun && errors.length === 0) {
      await fs.writeFile(file, JSON.stringify({ ...list, words: after }, null, 2) + '\n')
    }
  }

  if (errors.length) {
    console.error(`✗ ${errors.length} problem(s) — nothing written:`)
    errors.slice(0, 25).forEach((e) => console.error('  ' + e))
    process.exit(1)
  }
  console.log(`${dryRun ? '✓ would set' : '✓ set'} gender on ${applied} nouns (${left} unsure rows left unreviewed → excluded from the game)`)
}

const mode = flag('derive') ? derive : flag('merge') ? merge : null
if (!mode) { console.error('need --derive or --merge'); process.exit(1) }
mode().catch((e) => { console.error('✗', e.message); process.exit(1) })
