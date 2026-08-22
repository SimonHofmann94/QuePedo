#!/usr/bin/env node
/**
 * vocab-agent-enrich.mjs — enrich the curated vocab lists with multiple meanings
 * using AGENTS instead of the Gemini API (see build-vocab.mjs --enrich for the
 * API route; this exists because the API quota runs out long before 8,000 words do).
 *
 * Agents never edit shared/content/vocab/*.json directly — a dozen of them
 * read-modify-writing the same file would race. Instead each agent owns a SLICE,
 * writes a PATCH, and this script merges and validates.
 *
 * Usage:
 *   node scripts/vocab-agent-enrich.mjs --slice --out=<dir> [--size=500] [--levels=b1,b2] [--redo]
 *   node scripts/vocab-agent-enrich.mjs --merge --in=<dir> [--dry-run]
 *
 * Patch file format — a flat map keyed by the Spanish lemma:
 *   { "el banco": { "de": ["die Bank (Geldinstitut)", "die Sitzbank"],
 *                   "en": ["bank", "bench"] } }
 *
 * The merge is paranoid on purpose: it refuses to write unless the word count,
 * order, and every non-translation field are untouched. An agent can only ever
 * change `de` and `en`.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const VOCAB_DIR = path.join(ROOT, 'shared', 'content', 'vocab')
const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

const arg = (name, dflt = null) => {
  const f = process.argv.find((a) => a.startsWith(`--${name}=`))
  return f ? f.slice(name.length + 3) : dflt
}
const flag = (name) => process.argv.includes(`--${name}`)

const isEnriched = (w) => Array.isArray(w.de) || Array.isArray(w.en)
const first = (v) => (Array.isArray(v) ? v[0] : v)

async function readLevel(level) {
  const file = path.join(VOCAB_DIR, `${level}.json`)
  return { file, list: JSON.parse(await fs.readFile(file, 'utf8')) }
}

// ── slice ────────────────────────────────────────────────────────────────

async function slice() {
  const outDir = arg('out')
  if (!outDir) throw new Error('--out=<dir> required')
  const size = Number(arg('size', '500'))
  const redo = flag('redo')
  const levels = (arg('levels') ?? LEVELS.join(',')).split(',').filter(Boolean)
  await fs.mkdir(outDir, { recursive: true })

  const manifest = []
  for (const level of levels) {
    const { list } = await readLevel(level)
    const todo = list.words.filter((w) => redo || !isEnriched(w))
    for (let i = 0; i < todo.length; i += size) {
      const chunk = todo.slice(i, i + size)
      const name = `${level}-${String(i).padStart(4, '0')}.json`
      await fs.writeFile(
        path.join(outDir, name),
        JSON.stringify(
          // Only what the agent needs to translate — no rank/gender noise.
          chunk.map((w) => ({ es: w.es, pos: w.pos, de: first(w.de), en: first(w.en) })),
          null,
          2,
        ),
      )
      manifest.push({ slice: name, level, count: chunk.length })
    }
  }
  await fs.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.table(manifest)
  console.log(`${manifest.length} slices, ${manifest.reduce((a, m) => a + m.count, 0)} words → ${outDir}`)
}

// ── merge ────────────────────────────────────────────────────────────────

/** One meaning stays a plain string; several become an array. */
function collapse(value, fallback, where, errors) {
  const list = (Array.isArray(value) ? value : [value])
    .filter((m) => typeof m === 'string' && m.trim())
    .map((m) => m.trim())
  if (list.length === 0) return fallback
  if (list.length > 3) errors.push(`${where}: ${list.length} meanings, max 3`)
  return list.length === 1 ? list[0] : list.slice(0, 3)
}

async function merge() {
  const inDir = arg('in')
  if (!inDir) throw new Error('--in=<dir> required')
  const dryRun = flag('dry-run')

  const files = (await fs.readdir(inDir)).filter((f) => f.endsWith('.json') && f !== 'manifest.json')
  const byLevel = {}
  const skipped = []
  const unreadable = []
  for (const f of files) {
    const level = f.split('-')[0]
    // Agents sometimes leave working files (part1.json, notes.json) in the patch
    // dir. Skip anything not named <level>-<offset>.json rather than dying on it.
    if (!LEVELS.includes(level)) { skipped.push(f); continue }
    try {
      const patch = JSON.parse(await fs.readFile(path.join(inDir, f), 'utf8'))
      byLevel[level] = { ...(byLevel[level] ?? {}), ...patch }
    } catch (e) {
      // A half-written file means that agent is still going — report all of them
      // at once instead of failing on the first.
      unreadable.push(`${f}: ${e.message.slice(0, 70)}`)
    }
  }
  if (skipped.length) console.warn(`  (ignored ${skipped.length} non-patch file(s): ${skipped.join(', ')})`)
  if (unreadable.length) {
    console.error(`✗ ${unreadable.length} patch file(s) could not be parsed — nothing written:`)
    unreadable.forEach((u) => console.error('  ' + u))
    process.exit(1)
  }

  const errors = []
  let changed = 0
  for (const [level, patch] of Object.entries(byLevel)) {
    const { file, list } = await readLevel(level)
    const before = list.words
    const index = new Map(before.map((w, i) => [w.es, i]))

    for (const key of Object.keys(patch)) {
      if (!index.has(key)) errors.push(`${level}: patch has "${key}" which is not in the list`)
    }

    // A few lemmas appear twice with different `pos` (técnico the technician vs
    // technical). A patch is keyed by lemma, so both rows get the same merged
    // gloss — redundant rather than wrong, but say so instead of hiding it.
    const counts = new Map()
    for (const w of before) counts.set(w.es, (counts.get(w.es) ?? 0) + 1)
    const dups = [...counts].filter(([es, n]) => n > 1 && patch[es])
    if (dups.length) {
      console.warn(
        `  note: ${level} has ${dups.length} lemma(s) listed twice under different pos ` +
        `(${dups.slice(0, 5).map(([e]) => e).join(', ')}${dups.length > 5 ? '…' : ''}) — ` +
        `both rows receive the same meanings`,
      )
    }

    const after = before.map((w) => {
      const p = patch[w.es]
      if (!p) return w
      const de = collapse(p.de, first(w.de), `${level}/${w.es}.de`, errors)
      const en = p.en !== undefined ? collapse(p.en, first(w.en), `${level}/${w.es}.en`, errors) : w.en
      changed++
      return { ...w, de, ...(en !== undefined ? { en } : {}) }
    })

    // Nothing but de/en may move. Word count, order and every other field are frozen.
    if (after.length !== before.length) errors.push(`${level}: word count changed`)
    for (let i = 0; i < before.length; i++) {
      const a = before[i]
      const b = after[i]
      for (const k of ['es', 'pos', 'rank', 'gender', 'example', 'tags']) {
        if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
          errors.push(`${level}[${i}] "${a.es}": field "${k}" was modified`)
        }
      }
      if (!b.de || (Array.isArray(b.de) && b.de.length === 0)) errors.push(`${level} "${a.es}": empty de`)
    }

    if (!dryRun && errors.length === 0) {
      await fs.writeFile(
        file,
        JSON.stringify({ ...list, wordCount: after.length, words: after }, null, 2) + '\n',
      )
    }
  }

  if (errors.length) {
    console.error(`✗ ${errors.length} problem(s) — nothing written:`)
    errors.slice(0, 25).forEach((e) => console.error('  ' + e))
    if (errors.length > 25) console.error(`  … and ${errors.length - 25} more`)
    process.exit(1)
  }
  console.log(`${dryRun ? '✓ would update' : '✓ updated'} ${changed} words across ${Object.keys(byLevel).length} level(s)`)
}

const mode = flag('slice') ? slice : flag('merge') ? merge : null
if (!mode) {
  console.error('need --slice or --merge')
  process.exit(1)
}
mode().catch((e) => {
  console.error('✗', e.message)
  process.exit(1)
})
