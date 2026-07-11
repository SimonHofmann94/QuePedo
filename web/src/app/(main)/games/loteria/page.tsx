"use client"

import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Volume2 } from "lucide-react"
import {
  GAME_CONFIG,
  initLoteria,
  currentCall,
  onTap,
  type LoteriaState,
  type SessionWord,
  type SubmitGameOutcome,
} from "@chingon/shared"
import { submitGameResult } from "@/actions/games"
import { useGameWords } from "../useGameWords"
import { ReadyCard, ResultCard } from "../ResultCard"

const CFG = GAME_CONFIG.loteria

/** Speak the Spanish word after a correct match — same TTS path as escucha. */
function speakSpanish(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = "es-ES"
  window.speechSynthesis.speak(u)
}

export default function LoteriaPage() {
  const { pool, error } = useGameWords(CFG.boardSize)
  const [state, setState] = useState<LoteriaState | null>(null)
  const [outcome, setOutcome] = useState<SubmitGameOutcome | null>(null)
  const [wrongFlash, setWrongFlash] = useState<number | null>(null)
  const [loteriaFlash, setLoteriaFlash] = useState(false)
  const startRef = useRef(0)
  const submittedRef = useRef(false)
  const lastPayloadRef = useRef<Parameters<typeof submitGameResult>[0] | null>(null)

  const start = useCallback((p: SessionWord[]) => {
    submittedRef.current = false
    setOutcome(null)
    startRef.current = Date.now()
    setState(initLoteria(p))
  }, [])

  const finish = useCallback(async (s: LoteriaState) => {
    if (submittedRef.current) return
    submittedRef.current = true
    const payload = {
      game_id: "loteria" as const,
      score: s.score,
      // Accuracy degrades with wrong taps: 16 matches out of 16 + errors.
      correct: CFG.boardSize,
      total: CFG.boardSize + s.wrongTaps,
      duration_ms: Date.now() - startRef.current,
      perfect_board: s.wrongTaps === 0,
    }
    lastPayloadRef.current = payload
    setOutcome(await submitGameResult(payload))
  }, [])

  const retrySubmit = useCallback(async () => {
    if (lastPayloadRef.current) setOutcome(await submitGameResult(lastPayloadRef.current))
  }, [])

  const tap = (cellIndex: number) => {
    if (!state || state.over) return
    const call = currentCall(state)
    const next = onTap(state, cellIndex)
    if (next === state) return // already-marked cell, no-op
    setState(next)

    if (next.wrongTaps > state.wrongTaps) {
      setWrongFlash(cellIndex)
      setTimeout(() => setWrongFlash(null), 400)
      return
    }
    if (call) speakSpanish(call.es)
    if (next.linesCompleted > state.linesCompleted) {
      setLoteriaFlash(true)
      setTimeout(() => setLoteriaFlash(false), 1200)
    }
    if (next.over) finish(next)
  }

  if (error) return <GameShell><p className="text-center text-ink-500">{error}</p></GameShell>
  if (!pool) return <GameShell><p className="text-center text-ink-500">Cocinando…</p></GameShell>
  if (!state) {
    return (
      <GameShell>
        <ReadyCard
          emoji="🎴"
          instructions="Como la lotería de siempre: se canta la traducción y tú encuentras la palabra en tu tabla de 4×4. Completa filas y columnas para el bonus ¡LOTERÍA!"
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

  const call = currentCall(state)

  return (
    <GameShell>
      {/* HUD */}
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-xs uppercase tracking-wider text-ink-500">
          Carta {Math.min(state.callIndex + 1, CFG.boardSize)} / {CFG.boardSize}
        </div>
        <div className="font-display text-2xl font-extrabold text-ink-800">{state.score}</div>
      </div>

      {/* Caller */}
      <div className="mb-5 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-jacaranda-500 px-6 py-3 font-display text-lg font-extrabold text-white shadow-[0_4px_0_var(--jacaranda-700)]">
          <Volume2 className="h-5 w-5" />
          {call?.display}
        </span>
        {loteriaFlash && (
          <div className="mt-3 animate-bounce font-display text-2xl font-extrabold text-maiz-500">
            ¡LOTERÍA! +{CFG.lineBonus}
          </div>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-4 gap-2.5">
        {state.board.map((w, i) => {
          const marked = state.marked[i]
          const wrong = wrongFlash === i
          return (
            <button
              key={w.id}
              type="button"
              disabled={marked}
              onClick={() => tap(i)}
              className={`rounded-[12px] border-2 px-2 py-4 text-center font-display text-sm font-bold leading-tight transition-all ${
                marked
                  ? "border-jade-500 bg-jade-500 text-white"
                  : wrong
                    ? "border-rosa-500 bg-rosa-50 text-rosa-600"
                    : "border-ink-200 bg-white text-ink-800 shadow-[0_3px_0_var(--ink-200)] active:translate-y-0.5 active:shadow-none"
              }`}
            >
              {marked ? "✓" : w.es}
            </button>
          )
        })}
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
          Lotería de Palabras <span className="text-xl">🎴</span>
        </h1>
        {children}
      </div>
    </div>
  )
}
