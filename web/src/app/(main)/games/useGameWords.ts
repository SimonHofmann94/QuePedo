"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { buildSessionPool, getVocabList, type SessionWord } from "@chingon/shared"
import { getGameWords } from "@/actions/games"

// ── Vocabulary source = the difficulty dial ──────────────────────────────

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export type GameVocabSource =
  | { kind: "mine" }
  | { kind: "curated"; level: CEFRLevel }

/** Curated levels playable on the free tier (mirrors grammar/lists gating). */
export const FREE_GAME_LEVELS: ReadonlySet<CEFRLevel> = new Set(["A1", "A2"])

const storageKey = (gameId: string) => `chingon_game_vocab:${gameId}`

function readSource(gameId: string): GameVocabSource {
  try {
    if (typeof window === "undefined") return { kind: "mine" }
    const raw = window.localStorage.getItem(storageKey(gameId))
    if (!raw) return { kind: "mine" }
    const parsed = JSON.parse(raw) as GameVocabSource
    if (parsed.kind === "curated" && getVocabList(parsed.level)) return parsed
    return { kind: "mine" }
  } catch {
    return { kind: "mine" }
  }
}

/** Per-game vocabulary source, remembered in localStorage. */
export function useVocabSource(gameId: string) {
  const [source, setSource] = useState<GameVocabSource>(() => readSource(gameId))

  const update = (next: GameVocabSource) => {
    setSource(next)
    try {
      window.localStorage.setItem(storageKey(gameId), JSON.stringify(next))
    } catch {
      /* private mode etc. — selection just won't persist */
    }
  }

  return [source, update] as const
}

// ── Session pool ─────────────────────────────────────────────────────────

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Load the session word pool for a game.
 * - `mine`: the user's vocabulary (SRS-weighted), topped up from curated A1.
 * - `curated`: a random slice of the chosen CEFR list — the level IS the
 *   difficulty. Oversampled beyond minCount so sessions vary.
 */
export function useGameWords(minCount: number, source: GameVocabSource = { kind: "mine" }) {
  const locale = useLocale()
  // Result is tagged with its input key; a stale tag derives to "loading"
  // in render — no synchronous reset-setState in the effect body.
  const [loaded, setLoaded] = useState<{
    key: string
    pool: SessionWord[] | null
    error: string | null
  } | null>(null)
  const sourceKey = source.kind === "curated" ? source.level : "mine"
  const inputKey = `${sourceKey}:${locale}:${minCount}`

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let pool: SessionWord[] | null = null
      let error: string | null = null
      try {
        const curatedLevel = sourceKey === "mine" ? "A1" : sourceKey
        // ponytail: curated words ship in the bundle; only "mine" needs the DB.
        const userWords = sourceKey === "mine" ? await getGameWords() : []
        const curated = shuffled(getVocabList(curatedLevel)?.words ?? [])
        const built = buildSessionPool({
          userWords,
          curatedFallback: curated,
          // Curated mode oversamples for variety; "mine" keeps every user word.
          minCount: sourceKey === "mine" ? minCount : Math.max(minCount, 40),
          locale,
        })
        if (built.length < minCount) error = "No hay suficientes palabras para jugar."
        else pool = built
      } catch (err) {
        console.error("[games] pool load failed:", err)
        error = "No se pudo cargar el juego."
      }
      if (!cancelled) setLoaded({ key: `${sourceKey}:${locale}:${minCount}`, pool, error })
    })()
    return () => {
      cancelled = true
    }
  }, [minCount, locale, sourceKey])

  const current = loaded && loaded.key === inputKey ? loaded : null
  return { pool: current?.pool ?? null, error: current?.error ?? null }
}
