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
import { useGameWords, useVocabSource } from "../useGameWords"
import { VocabPicker } from "../VocabPicker"
import { ReadyCard, ResultCard } from "../ResultCard"
import { playCorrect, playWrong, playFanfare, playTick } from "../sounds"
import { Burst, useReducedMotion } from "../juice"

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
  const [vocabSource, setVocabSource] = useVocabSource("loteria")
  const { pool, error } = useGameWords(CFG.boardSize, vocabSource)
  const reduced = useReducedMotion()
  const [state, setState] = useState<LoteriaState | null>(null)
  const [outcome, setOutcome] = useState<SubmitGameOutcome | null>(null)
  const [wrongFlash, setWrongFlash] = useState<number | null>(null)
  // ¡LOTERÍA! beat: bonus shown on the overlay, `final` = board completed.
  const [loteriaFlash, setLoteriaFlash] = useState<{ bonus: number; final: boolean } | null>(null)
  const [burst, setBurst] = useState(0)
  // Bumped per game so the board remounts and the deal-in replays on "Otra vez".
  const [round, setRound] = useState(0)
  const startRef = useRef(0)
  const submittedRef = useRef(false)
  const lastPayloadRef = useRef<Parameters<typeof submitGameResult>[0] | null>(null)

  const start = useCallback((p: SessionWord[]) => {
    submittedRef.current = false
    setOutcome(null)
    setWrongFlash(null)
    setLoteriaFlash(null)
    startRef.current = Date.now()
    setRound((r) => r + 1)
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
      playWrong()
      setWrongFlash(cellIndex)
      setTimeout(() => setWrongFlash(null), 400)
      return
    }

    playCorrect()
    // El cantor confirms the match — delayed so TTS doesn't collide with playCorrect().
    if (call) setTimeout(() => speakSpanish(call.es), 450)

    const gainedLines = next.linesCompleted - state.linesCompleted
    if (gainedLines > 0) {
      playFanfare()
      setBurst((b) => b + 1)
      setLoteriaFlash({ bonus: gainedLines * CFG.lineBonus, final: next.over })
      setTimeout(() => setLoteriaFlash(null), next.over ? 1400 : 1100)
    } else if (!next.over) {
      // The next card gets flicked onto the table.
      setTimeout(() => playTick(), 280)
    }

    // Hold the final ¡LOTERÍA! beat before the result card takes over. The
    // last tap always completes its row + column, so the overlay always fires.
    if (next.over) setTimeout(() => finish(next), 1500)
  }

  if (error) return <GameShell><p className="text-center text-ink-500">{error}</p></GameShell>
  if (!pool) return <GameShell><p className="text-center text-ink-500">Cocinando…</p></GameShell>
  if (!state) {
    return (
      <GameShell>
        <ReadyCard
          emoji="🎴"
          instructions="Como la lotería de siempre: se canta la traducción y tú encuentras la palabra en tu tabla de 4×4. Completa filas y columnas para el bonus ¡LOTERÍA!"
          extra={<VocabPicker value={vocabSource} onChange={setVocabSource} />}
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
      <style>{`
        @keyframes loteria-deal {
          0%   { opacity: 0; transform: translateY(18px) scale(0.8); }
          70%  { opacity: 1; transform: translateY(-3px) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bean-stamp {
          0%   { opacity: 0; transform: scale(2.4) rotate(-25deg); }
          55%  { opacity: 1; transform: scale(0.8) rotate(8deg); }
          78%  { transform: scale(1.15) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes loteria-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
        }
        @keyframes caller-pop {
          0%   { opacity: 0; transform: translateY(-10px) scale(0.7); }
          60%  { opacity: 1; transform: translateY(2px) scale(1.06); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes score-pop {
          0%   { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        @keyframes loteria-pop {
          0%   { opacity: 0; transform: scale(0.5) rotate(-5deg); }
          60%  { opacity: 1; transform: scale(1.1) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>

      {/* HUD */}
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-xs uppercase tracking-wider text-ink-500">
          Carta {Math.min(state.callIndex + 1, CFG.boardSize)} / {CFG.boardSize}
        </div>
        <div
          key={state.score}
          className="font-display text-2xl font-extrabold text-ink-800"
          style={reduced ? undefined : { animation: "score-pop 0.25s ease-out" }}
        >
          {state.score}
        </div>
      </div>

      {/* Caller — keyed per call so each new card pops in */}
      <div className="mb-5 min-h-[52px] text-center">
        {call && (
          <span
            key={`${round}-${state.callIndex}`}
            className="inline-flex items-center gap-2 rounded-full bg-jacaranda-500 px-6 py-3 font-display text-lg font-extrabold text-white shadow-[0_4px_0_var(--jacaranda-700)]"
            style={reduced ? undefined : { animation: "caller-pop 0.3s ease-out backwards" }}
          >
            <Volume2 className="h-5 w-5" />
            {call.display}
          </span>
        )}
      </div>

      {/* Board */}
      <div className="relative">
        <div key={round} className="grid grid-cols-4 gap-2.5">
          {state.board.map((w, i) => {
            const marked = state.marked[i]
            const wrong = wrongFlash === i
            return (
              // Deal-in lives on the wrapper so the shake (on the button)
              // toggling off never re-triggers it.
              <div
                key={w.id}
                style={
                  reduced
                    ? undefined
                    : { animation: `loteria-deal 0.4s ease-out ${i * 45}ms backwards` }
                }
              >
                <button
                  type="button"
                  disabled={marked}
                  onClick={() => tap(i)}
                  style={
                    wrong && !reduced
                      ? { animation: "loteria-shake 0.35s ease-in-out" }
                      : undefined
                  }
                  className={`relative h-full w-full rounded-[12px] border-2 px-2 py-4 text-center font-display text-sm font-bold leading-tight transition-all ${
                    marked
                      ? "border-jade-500 bg-jade-50 text-ink-300"
                      : wrong
                        ? "border-rosa-500 bg-rosa-50 text-rosa-600"
                        : "border-masa-300 bg-masa-50 text-ink-800 shadow-[0_3px_0_var(--masa-300),inset_0_0_0_2px_var(--masa-50),inset_0_0_0_3px_var(--masa-200)] active:translate-y-0.5 active:shadow-[inset_0_0_0_2px_var(--masa-50),inset_0_0_0_3px_var(--masa-200)]"
                  }`}
                >
                  {/* Corner number, like the classic cards */}
                  <span className="pointer-events-none absolute left-1.5 top-1 font-mono text-[9px] leading-none text-masa-500">
                    {i + 1}
                  </span>
                  <span>{w.es}</span>
                  {marked && (
                    <span
                      className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl drop-shadow-sm"
                      style={reduced ? undefined : { animation: "bean-stamp 0.32s ease-out" }}
                    >
                      🫘
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <Burst trigger={burst} count={state.over ? 48 : 28} />

        {/* ¡LOTERÍA! beat — holds over the board while the fanfare plays */}
        {loteriaFlash && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div
              className="rounded-[20px] border-2 border-maiz-400 bg-ink-900/90 px-8 py-5 text-center"
              style={reduced ? undefined : { animation: "loteria-pop 0.35s ease-out backwards" }}
            >
              <div className="font-marker text-4xl text-maiz-400">¡LOTERÍA!</div>
              <div className="mt-1 font-mono text-xs uppercase tracking-[2px] text-white">
                {loteriaFlash.final
                  ? `¡Tabla llena, chingón! +${loteriaFlash.bonus}`
                  : `+${loteriaFlash.bonus} puntos`}
              </div>
            </div>
          </div>
        )}
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
