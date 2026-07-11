"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  GAME_CONFIG,
  initChiliRush,
  onAnswer,
  isOver,
  type ChiliRushState,
  type SessionWord,
  type SubmitGameOutcome,
} from "@chingon/shared"
import { submitGameResult } from "@/actions/games"
import { useGameWords } from "../useGameWords"
import { ReadyCard, ResultCard } from "../ResultCard"

const CFG = GAME_CONFIG.chili_rush
const BASKET_COLORS = ["jade", "cielo", "maiz"] as const

/** Fall time shrinks as speedLevel ramps (every 5 catches). */
function fallMs(speedLevel: number): number {
  return Math.max(1400, 4200 - (speedLevel - 1) * 500)
}

export default function ChiliRushPage() {
  const { pool, error } = useGameWords(CFG.minWords)
  const [state, setState] = useState<ChiliRushState | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [outcome, setOutcome] = useState<SubmitGameOutcome | null>(null)
  const startRef = useRef<number>(0)
  const submittedRef = useRef(false)

  const start = useCallback((p: SessionWord[]) => {
    submittedRef.current = false
    setOutcome(null)
    setElapsed(0)
    startRef.current = Date.now()
    setState(initChiliRush(p))
  }, [])

  const lastPayloadRef = useRef<Parameters<typeof submitGameResult>[0] | null>(null)

  const finish = useCallback(async (s: ChiliRushState, durationMs: number) => {
    if (submittedRef.current) return
    submittedRef.current = true
    const total = s.catches + s.misses
    if (total === 0) {
      // Nothing happened — nothing worth saving.
      setOutcome({ saved: true, score: 0, tacosEarned: 0, newBest: false })
      return
    }
    const payload = {
      game_id: "chili_rush" as const,
      score: s.score,
      correct: s.catches,
      total,
      duration_ms: Math.round(durationMs),
      combo: s.maxCombo,
    }
    lastPayloadRef.current = payload // kept for the retry path
    setOutcome(await submitGameResult(payload))
  }, [])

  // Session clock + game-over check. Both run inside the interval callback
  // (not the effect body), and the effect re-subscribes on every state change
  // so the closure is never stale.
  useEffect(() => {
    if (!state || outcome) return
    const t = setInterval(() => {
      const el = Date.now() - startRef.current
      setElapsed(el)
      if (isOver(state, el)) finish(state, Math.min(el, CFG.sessionMs))
    }, 250)
    return () => clearInterval(t)
  }, [state, outcome, finish])
  const retrySubmit = useCallback(async () => {
    if (lastPayloadRef.current) setOutcome(await submitGameResult(lastPayloadRef.current))
  }, [])

  const answer = useCallback(
    (basketIndex: number | null) => {
      setState((s) => (s && !isOver(s, Date.now() - startRef.current) ? onAnswer(s, basketIndex) : s))
    },
    [],
  )

  if (error) return <GameShell><p className="text-center text-ink-500">{error}</p></GameShell>
  if (!pool) return <GameShell><p className="text-center text-ink-500">Cocinando…</p></GameShell>
  if (!state) {
    return (
      <GameShell>
        <ReadyCard
          emoji="🌶"
          instructions="Las palabras caen — toca la canasta con la traducción correcta antes de que lleguen al suelo. Tres vidas, 90 segundos, cada vez más rápido."
          onStart={() => start(pool)}
        />
      </GameShell>
    )
  }
  if (outcome) {
    return (
      <GameShell>
        <ResultCard outcome={outcome} onRetrySubmit={retrySubmit} onPlayAgain={() => pool && start(pool)} />
      </GameShell>
    )
  }

  const secondsLeft = Math.max(0, Math.ceil((CFG.sessionMs - elapsed) / 1000))

  return (
    <GameShell>
      {/* HUD */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xl">{"🌶".repeat(state.lives)}<span className="opacity-20">{"🌶".repeat(CFG.lives - state.lives)}</span></div>
        <div className="font-mono text-sm font-bold text-ink-600">
          {state.combo > 1 && <span className="mr-3 text-chili-500">×{state.combo} 🔥</span>}
          0:{String(secondsLeft).padStart(2, "0")}
        </div>
        <div className="font-display text-2xl font-extrabold text-ink-800">{state.score}</div>
      </div>

      {/* Play field */}
      <div className="relative h-[420px] overflow-hidden rounded-[20px] border border-ink-100 bg-white shadow-sm">
        <style>{`@keyframes chili-fall { from { top: -56px } to { top: calc(100% - 64px) } }`}</style>
        {state.current && (
          <div
            key={state.queueIndex}
            onAnimationEnd={() => answer(null)}
            className="absolute left-1/2 -translate-x-1/2 rounded-[12px] border-2 border-chili-500 bg-white px-5 py-2.5 font-display text-xl font-extrabold text-ink-800 shadow-[0_3px_0_var(--chili-700)]"
            style={{ animation: `chili-fall ${fallMs(state.speedLevel)}ms linear forwards` }}
          >
            {state.current.word.es}
          </div>
        )}
      </div>

      {/* Baskets */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {state.current?.options.map((label, i) => (
          <button
            key={`${state.queueIndex}-${i}`}
            type="button"
            onClick={() => answer(i)}
            className="rounded-[14px] px-3 py-4 font-display text-base font-bold text-white transition-transform duration-100 active:translate-y-1 active:shadow-none"
            style={{
              background: `var(--${BASKET_COLORS[i]}-500)`,
              boxShadow: `0 4px 0 var(--${BASKET_COLORS[i]}-700)`,
            }}
          >
            🧺 {label}
          </button>
        ))}
      </div>
    </GameShell>
  )
}

function GameShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/games"
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Juegos</span>
        </Link>
        <h1 className="mb-5 font-display text-3xl font-extrabold tracking-tight text-ink-800">
          Chili Rush <span className="text-xl">🌶</span>
        </h1>
        {children}
      </div>
    </div>
  )
}
