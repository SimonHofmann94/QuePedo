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
import { useGameWords, useVocabSource } from "../useGameWords"
import { VocabPicker } from "../VocabPicker"
import { ReadyCard, ResultCard } from "../ResultCard"
import { playCorrect, playWrong, playCombo } from "../sounds"
import { Burst, Shake, useReducedMotion } from "../juice"

const CFG = GAME_CONFIG.chili_rush
const BASKET_COLORS = ["jade", "cielo", "maiz"] as const

/** Fall time shrinks as speedLevel ramps (every 5 catches). */
function fallMs(speedLevel: number): number {
  return Math.max(1400, 4200 - (speedLevel - 1) * 500)
}

/** Deterministic per-drop horizontal spawn (30–70%) — no extra state. */
function spawnLeft(queueIndex: number): number {
  return 30 + ((queueIndex * 47) % 41)
}

export default function ChiliRushPage() {
  const [vocabSource, setVocabSource] = useVocabSource("chili_rush")
  const { pool, error } = useGameWords(CFG.minWords, vocabSource)
  const reduced = useReducedMotion()
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

  const secondsLeft = Math.max(0, Math.ceil((CFG.sessionMs - elapsed) / 1000))
  // Fire trail intensity: combo ×3 → 🔥, ×4 → 🔥🔥, ×5 → 🔥🔥🔥
  const fireLevel = Math.max(0, Math.min(state.combo, CFG.comboCap) - 2)
  const dropMs = fallMs(state.speedLevel)

  // Sounds live in the event handlers (never in effect bodies). Correctness
  // is known synchronously from the rendered drop, so feedback is instant.
  // Guarding the blip with `elapsed` (250ms fresh) keeps this render-pure;
  // `answer` still applies the precise clock before mutating state.
  const tapBasket = (i: number) => {
    if (!state.current || isOver(state, elapsed)) return
    if (i === state.current.correctIndex) {
      if (state.combo >= 2) playCombo(state.combo)
      else playCorrect()
    } else {
      playWrong()
    }
    answer(i)
  }
  const wordLanded = () => {
    if (!state.current || isOver(state, elapsed)) return
    playWrong()
    answer(null)
  }

  return (
    <GameShell>
      {/* HUD */}
      <div className="mb-4 flex items-center justify-between">
        {/* Lives — lost chilis burn out (shrink + fade + desaturate) */}
        <div className="text-xl">
          {Array.from({ length: CFG.lives }, (_, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-500"
              style={
                i < state.lives
                  ? undefined
                  : { opacity: 0.15, transform: "scale(0.6) rotate(20deg)", filter: "grayscale(1)" }
              }
            >
              🌶
            </span>
          ))}
        </div>
        <div className={`font-mono text-sm font-bold ${secondsLeft <= 10 ? "text-rosa-500" : "text-ink-600"}`}>
          {state.combo > 1 && (
            <span
              key={state.combo}
              className="mr-3 inline-block text-chili-500"
              style={reduced ? undefined : { animation: "hud-pop 0.3s ease-out" }}
            >
              ×{state.combo} 🔥
            </span>
          )}
          0:{String(secondsLeft).padStart(2, "0")}
        </div>
        <div
          key={state.score}
          className="font-display text-2xl font-extrabold text-ink-800"
          style={reduced ? undefined : { animation: "hud-pop 0.3s ease-out" }}
        >
          {state.score}
        </div>
      </div>

      {/* Play field — shakes on every miss/wrong tap */}
      <Shake trigger={state.misses}>
        <div className="relative h-[420px] overflow-hidden rounded-[20px] border border-ink-100 bg-white shadow-sm">
          <style>{`
            @keyframes chili-fall { from { top: -56px } to { top: calc(100% - 64px) } }
            @keyframes chili-wobble { 0%, 100% { transform: rotate(-2.5deg) } 50% { transform: rotate(2.5deg) } }
            @keyframes danger-glow { 0%, 68% { opacity: 0 } 90%, 100% { opacity: 0.5 } }
            @keyframes hud-pop { 0% { transform: scale(1) } 40% { transform: scale(1.4) } 100% { transform: scale(1) } }
            @keyframes speed-flash { 0% { opacity: 0; transform: scale(0.6) } 15% { opacity: 1; transform: scale(1.1) } 35% { transform: scale(1) } 70% { opacity: 1; transform: scale(1) } 100% { opacity: 0; transform: scale(1) } }
            @keyframes speed-flash-fade { 0% { opacity: 0 } 15%, 70% { opacity: 1 } 100% { opacity: 0 } }
            @keyframes sun-rotate { from { transform: rotate(0) } to { transform: rotate(360deg) } }
          `}</style>

          {/* Idle life: slow sunburst so the field never looks static */}
          {!reduced && (
            <div
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                width: 560,
                height: 560,
                left: "calc(50% - 280px)",
                top: "calc(50% - 280px)",
                background: "repeating-conic-gradient(var(--maiz-400) 0deg 10deg, transparent 10deg 26deg)",
                opacity: 0.07,
                animation: "sun-rotate 90s linear infinite",
              }}
            />
          )}

          {/* Danger glow — same duration/key as the drop, so it fades in
              over the last ~30% of the fall with zero JS ticking */}
          {state.current && (
            <div
              key={`danger-${state.queueIndex}`}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-0"
              style={{
                background: "linear-gradient(to top, var(--rosa-500), transparent)",
                animation: `danger-glow ${dropMs}ms linear forwards`,
              }}
            />
          )}

          {/* Falling word — varied spawn X, wobble, fire trail at combo ≥ 3 */}
          {state.current && (
            <div
              key={state.queueIndex}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) wordLanded()
              }}
              className="absolute -translate-x-1/2"
              style={{
                left: `${spawnLeft(state.queueIndex)}%`,
                animation: `chili-fall ${dropMs}ms linear forwards`,
              }}
            >
              {fireLevel > 0 && (
                <div aria-hidden className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-base">
                  {"🔥".repeat(fireLevel)}
                </div>
              )}
              <div
                className="rounded-[12px] border-2 border-chili-500 bg-white px-5 py-2.5 font-display text-xl font-extrabold text-ink-800"
                style={{
                  boxShadow:
                    fireLevel > 0
                      ? `0 3px 0 var(--chili-700), 0 0 ${8 + fireLevel * 8}px var(--maiz-400)`
                      : "0 3px 0 var(--chili-700)",
                  animation: reduced ? undefined : "chili-wobble 1s ease-in-out infinite",
                }}
              >
                {state.current.word.es}
              </div>
            </div>
          )}

          {/* Speed level up — interstitial flash, remounts per level */}
          {state.speedLevel > 1 && (
            <div
              key={`speed-${state.speedLevel}`}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            >
              <span
                className="font-display text-4xl font-extrabold text-chili-500 opacity-0"
                style={{
                  textShadow: "0 3px 0 var(--maiz-400)",
                  animation: `${reduced ? "speed-flash-fade" : "speed-flash"} 1.1s ease-out forwards`,
                }}
              >
                ¡Más rápido!
              </span>
            </div>
          )}
        </div>
      </Shake>

      {/* Baskets — mini papel-picado burst on every catch */}
      <div className="relative mt-4 grid grid-cols-3 gap-3">
        {state.current?.options.map((label, i) => (
          <button
            key={`${state.queueIndex}-${i}`}
            type="button"
            onClick={() => tapBasket(i)}
            className="rounded-[14px] px-3 py-4 font-display text-base font-bold text-white transition-transform duration-100 active:translate-y-1 active:shadow-none!"
            style={{
              background: `var(--${BASKET_COLORS[i]}-500)`,
              boxShadow: `0 4px 0 var(--${BASKET_COLORS[i]}-700)`,
            }}
          >
            🧺 {label}
          </button>
        ))}
        <Burst trigger={state.catches} count={10} />
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
