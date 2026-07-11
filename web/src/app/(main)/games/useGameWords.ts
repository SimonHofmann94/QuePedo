"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { buildSessionPool, getVocabList, type SessionWord } from "@chingon/shared"
import { getGameWords } from "@/actions/games"

/**
 * Load the session word pool for a game: the user's vocabulary (SRS-weighted)
 * topped up from the curated A1 list when it's too small. Every game page
 * starts here.
 */
export function useGameWords(minCount: number) {
  const locale = useLocale()
  const [pool, setPool] = useState<SessionWord[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const userWords = await getGameWords()
        if (cancelled) return
        const curated = getVocabList("A1")?.words ?? []
        const built = buildSessionPool({
          userWords,
          curatedFallback: curated,
          minCount,
          locale,
        })
        if (built.length < minCount) {
          setError("No hay suficientes palabras para jugar.")
        } else {
          setPool(built)
        }
      } catch (err) {
        console.error("[games] pool load failed:", err)
        if (!cancelled) setError("No se pudo cargar el juego.")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [minCount, locale])

  return { pool, error }
}
