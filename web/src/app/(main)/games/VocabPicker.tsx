"use client"

import { useState } from "react"
import Link from "next/link"
import { LockIcon } from "@/components/ui/icons"
import { useSubscription } from "@/contexts/SubscriptionProvider"
import { FREE_GAME_LEVELS, type CEFRLevel, type GameVocabSource } from "./useGameWords"

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"]

const LEVEL_COLOR: Record<CEFRLevel, string> = {
  A1: "chili",
  A2: "jade",
  B1: "cielo",
  B2: "maiz",
  C1: "jacaranda",
  C2: "rosa",
}

/**
 * Vocabulary source picker — the difficulty dial on every game's start
 * screen. "Mi cuaderno" plays your own words (SRS-weighted); a CEFR level
 * plays that curated list. A1/A2 free, B1+ premium (mirrors lists/grammar).
 */
export function VocabPicker({
  value,
  onChange,
  hideMine = false,
  levels = LEVELS,
  freeLevels = FREE_GAME_LEVELS,
}: {
  value: GameVocabSource
  onChange: (s: GameVocabSource) => void
  /** Grammar games: notebook words carry no gender and no sentences. */
  hideMine?: boolean
  /** Which CEFR chips to show (a game may only have content for some). */
  levels?: readonly CEFRLevel[]
  /** Which of those are free — grammar games free their own floor level. */
  freeLevels?: ReadonlySet<CEFRLevel>
}) {
  const { isPremium } = useSubscription()
  const [premiumNudge, setPremiumNudge] = useState(false)

  const pick = (source: GameVocabSource, locked: boolean) => {
    if (locked) {
      setPremiumNudge(true)
      return
    }
    setPremiumNudge(false)
    onChange(source)
  }

  const mineActive = value.kind === "mine"

  return (
    <div className="mt-5">
      <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[2px] text-ink-400">
        {hideMine ? "¿Qué nivel?" : "¿Con qué palabras juegas?"}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {!hideMine && (
          <button
            type="button"
            onClick={() => pick({ kind: "mine" }, false)}
            className={`rounded-full border-2 px-3.5 py-1.5 font-display text-xs font-extrabold transition-all ${
              mineActive
                ? "border-ink-700 bg-ink-700 text-white"
                : "border-ink-200 bg-white text-ink-500"
            }`}
          >
            📓 Mi cuaderno
          </button>
        )}
        {levels.map((level) => {
          const locked = !isPremium && !freeLevels.has(level)
          const active = value.kind === "curated" && value.level === level
          const color = LEVEL_COLOR[level]
          return (
            <button
              key={level}
              type="button"
              onClick={() => pick({ kind: "curated", level }, locked)}
              className={`inline-flex items-center gap-1 rounded-full border-2 px-3 py-1.5 font-display text-xs font-extrabold transition-all ${
                active ? "text-white" : locked ? "border-ink-200 bg-white text-ink-300" : "border-ink-200 bg-white text-ink-500"
              }`}
              style={
                active
                  ? { background: `var(--${color}-500)`, borderColor: `var(--${color}-500)` }
                  : undefined
              }
            >
              {locked && <LockIcon size={10} />}
              {level}
            </button>
          )
        })}
      </div>
      {premiumNudge && (
        <p className="mt-2 text-center text-xs text-ink-500">
          Los niveles superiores son Premium.{" "}
          <Link href="/pricing" className="font-bold text-chili-500 underline">
            Hazte Premium
          </Link>
        </p>
      )}
    </div>
  )
}
