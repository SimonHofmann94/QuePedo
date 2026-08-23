#!/usr/bin/env node
/**
 * merge-decision-banks.mjs — assemble agent-authored item slices into the
 * per-game banks under shared/content/decision-items/.
 *
 *   node scripts/merge-decision-banks.mjs --in=<dir> [--dry-run]
 *
 * Slices are named <game>-<LEVEL>.json and hold a JSON array of DecisionItem.
 * The merge is REPLACE-BY-LEVEL: a slice for (game, level) replaces every
 * existing item at that level and leaves other levels alone, so a single
 * level can be re-authored without touching the rest.
 *
 * Validation is the bank check's job (bank.check.ts --strict); this script
 * only guarantees the structural merge and refuses obviously broken input.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BANK_DIR = path.join(ROOT, 'shared', 'content', 'decision-items')
const GAMES = ['ser_estar', 'pasado', 'subjuntivo']
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const arg = (n) => { const f = process.argv.find((a) => a.startsWith(`--${n}=`)); return f ? f.slice(n.length + 3) : null }
const dryRun = process.argv.includes('--dry-run')
const inDir = arg('in')
if (!inDir) { console.error('--in=<dir> required'); process.exit(1) }

const files = (await fs.readdir(inDir)).filter((f) => /^[a-z_]+-[ABC][12]\.json$/.test(f))
const byGame = {}
const errors = []

for (const f of files) {
  const [game, levelExt] = f.split('-')
  const level = levelExt.replace('.json', '')
  if (!GAMES.includes(game) || !LEVELS.includes(level)) { errors.push(`${f}: unrecognised game/level`); continue }
  let items
  try { items = JSON.parse(await fs.readFile(path.join(inDir, f), 'utf8')) } catch (e) { errors.push(`${f}: ${e.message}`); continue }
  if (!Array.isArray(items)) { errors.push(`${f}: not an array`); continue }
  for (const it of items) {
    if (it.level !== level) errors.push(`${f}: item ${it.id} says level ${it.level}`)
    if (!String(it.id ?? '').startsWith(`${game}:${level}:`)) errors.push(`${f}: item id "${it.id}" doesn't match ${game}:${level}:nnn`)
  }
  ;(byGame[game] ??= {})[level] = items
}

if (errors.length) { console.error(`✗ ${errors.length} problem(s) — nothing written:`); errors.slice(0, 20).forEach((e) => console.error('  ' + e)); process.exit(1) }

for (const [game, levels] of Object.entries(byGame)) {
  const file = path.join(BANK_DIR, `${game}.json`)
  const bank = JSON.parse(await fs.readFile(file, 'utf8'))
  const replaced = new Set(Object.keys(levels))
  const kept = bank.items.filter((it) => !replaced.has(it.level))
  const incoming = Object.values(levels).flat()
  const next = [...kept, ...incoming].sort((a, b) => a.id.localeCompare(b.id))
  console.log(`${game}: kept ${kept.length} (${LEVELS.filter((l) => !replaced.has(l) && kept.some((it) => it.level === l)).join(',') || '—'}), replaced ${[...replaced].join(',')} with ${incoming.length} → ${next.length} total`)
  if (!dryRun) await fs.writeFile(file, JSON.stringify({ ...bank, generatedAt: new Date().toISOString().slice(0, 10), items: next }, null, 2) + '\n')
}
console.log(dryRun ? '✓ dry run — nothing written' : '✓ banks written — now run: npx tsx shared/content/decision-items/bank.check.ts --strict')
