"use client"

import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Delete, Lightbulb } from "lucide-react"
import {
  GAME_CONFIG,
  initConstruye,
  checkComplete,
  completeRound,
  applyHint,
  type ConstruyeState,
  type SessionWord,
  type SubmitGameOutcome,
} from "@chingon/shared"
import { submitGameResult, spendHintTaco } from "@/actions/games"
import { useGameWords, useVocabSource } from "../useGameWords"
import { VocabPicker } from "../VocabPicker"
import { ReadyCard, ResultCard } from "../ResultCard"
import { playCombo, playCorrect, playFanfare, playTick, playWrong } from "../sounds"
import { Shake, useReducedMotion } from "../juice"

const CFG = GAME_CONFIG.construye

/** Speak the built Spanish word — same TTS path as lotería/escucha. */
function speakSpanish(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = "es-ES"
  window.speechSynthesis.speak(u)
}

/** Greedily map the assembled string back to tile indexes (duplicates safe). */
function usedIndexes(placed: string, tiles: string[]): number[] {
  const used: number[] = []
  for (const ch of Array.from(placed)) {
    const i = tiles.findIndex((t, idx) => t === ch && !used.includes(idx))
    if (i >= 0) used.push(i)
  }
  return used
}

export default function ConstruyePage() {
  const [vocabSource, setVocabSource] = useVocabSource("construye")
  const { pool, error } = useGameWords(CFG.minWords, vocabSource)
  const reduced = useReducedMotion()
  const [state, setState] = useState<ConstruyeState | null>(null)
  const [placed, setPlaced] = useState("")
  const [wrongFlash, setWrongFlash] = useState(false)
  const [wrongShake, setWrongShake] = useState(0)
  const [denyShake, setDenyShake] = useState(0)
  const [hintMsg, setHintMsg] = useState<string | null>(null)
  const [outcome, setOutcome] = useState<SubmitGameOutcome | null>(null)
  const startRef = useRef(0)
  const submittedRef = useRef(false)
  const lastPayloadRef = useRef<Parameters<typeof submitGameResult>[0] | null>(null)

  const start = useCallback((p: SessionWord[]) => {
    submittedRef.current = false
    setOutcome(null)
    setPlaced("")
    setHintMsg(null)
    startRef.current = Date.now()
    setState(initConstruye(p))
  }, [])

  const finish = useCallback(async (s: ConstruyeState) => {
    if (submittedRef.current) return
    submittedRef.current = true
    const payload = {
      game_id: "construye" as const,
      score: s.score,
      // Hints are self-balancing (each costs a taco), so completion is the
      // accuracy signal — every session that ends is 10/10.
      correct: s.rounds.length,
      total: s.rounds.length,
      duration_ms: Date.now() - startRef.current,
      no_hints: s.solvedNoHints === s.rounds.length,
    }
    lastPayloadRef.current = payload
    setOutcome(await submitGameResult(payload))
  }, [])

  const retrySubmit = useCallback(async () => {
    if (lastPayloadRef.current) setOutcome(await submitGameResult(lastPayloadRef.current))
  }, [])

  if (error) return <GameShell><p className="text-center text-ink-500">{error}</p></GameShell>
  if (!pool) return <GameShell><p className="text-center text-ink-500">Cocinando…</p></GameShell>
  if (!state) {
    return (
      <GameShell>
        <ReadyCard
          emoji="🧱"
          instructions="Te damos la traducción — tú construyes la palabra en español con las fichas revueltas. Diez palabras; las pistas cuestan un taco. Sin prisa, con maña."
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

  const round = state.rounds[state.roundIndex]
  const target = round.word.es
  const targetLetters = Array.from(target)
  const used = usedIndexes(placed, round.tiles)
  // Derived, no extra state: the word is complete and correct → celebration window.
  const solvedFlash = checkComplete(placed, target)

  const advance = (s: ConstruyeState) => {
    const next = completeRound(s)
    setState(next)
    setPlaced("")
    setHintMsg(null)
    if (next.over) {
      // Perfect session (all ten sin pista) gets its own beat before the card.
      if (next.solvedNoHints === next.rounds.length) playFanfare()
      finish(next)
    }
  }

  const placeTile = (i: number) => {
    if (used.includes(i) || wrongFlash || solvedFlash) return
    const next = placed + round.tiles[i]
    if (Array.from(next).length === targetLetters.length) {
      if (checkComplete(next, target)) {
        setPlaced(next)
        playCorrect()
        speakSpanish(target) // the learner hears the word they just built
        setTimeout(() => advance(state), 900)
      } else {
        setPlaced(next)
        setWrongFlash(true)
        setWrongShake((n) => n + 1)
        playWrong()
        setTimeout(() => {
          setWrongFlash(false)
          setPlaced("")
        }, 500)
      }
    } else {
      setPlaced(next)
      playCombo(Array.from(next).length) // rising pitch per successive placement
    }
  }

  const backspace = () => {
    if (wrongFlash || solvedFlash || !placed) return
    playTick()
    setPlaced(Array.from(placed).slice(0, -1).join(""))
  }

  const hint = async () => {
    if (wrongFlash || solvedFlash) return
    const { ok } = await spendHintTaco()
    if (!ok) {
      setHintMsg("Sin tacos 🌮 — ¡gánate unos jugando!")
      setDenyShake((n) => n + 1)
      playWrong()
      return
    }
    const { state: hinted } = applyHint(state)
    setState(hinted)
    playTick()
    // Reveal = reset to the correct prefix, one letter longer.
    const revealed = hinted.rounds[hinted.roundIndex].hintsUsed
    setPlaced(targetLetters.slice(0, Math.min(revealed, targetLetters.length)).join(""))
    setHintMsg(null)
  }

  return (
    <GameShell>
      <style>{`
        @keyframes construye-pop {
          0% { transform: scale(0.4); }
          65% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes construye-ripple {
          0%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-8px) scale(1.08); }
        }
        @keyframes construye-deal {
          0% { opacity: 0; transform: translateY(12px) rotate(-4deg) scale(0.85); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes construye-fade {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes construye-dot {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.35); }
        }
      `}</style>

      {/* HUD */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-500">
            Palabra {state.roundIndex + 1} / {state.rounds.length}
          </div>
          {state.solvedNoHints > 0 && (
            <div className="font-mono text-xs font-bold text-jade-600">
              ✨ {state.solvedNoHints} sin pista
            </div>
          )}
        </div>
        <div className="font-display text-2xl font-extrabold text-ink-800">{state.score}</div>
      </div>

      {/* Progress dots */}
      <div className="mb-5 flex justify-center gap-1.5">
        {state.rounds.map((r, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full ${
              r.solved ? "bg-jade-500" : i === state.roundIndex ? "bg-chili-500" : "bg-ink-200"
            }`}
            style={
              i === state.roundIndex && !reduced
                ? { animation: "construye-dot 1.4s ease-in-out infinite" }
                : undefined
            }
          />
        ))}
      </div>

      {/* Prompt — keyed by round so each new word fades in */}
      <div
        key={`prompt-${state.roundIndex}`}
        className="mb-6 text-center"
        style={reduced ? undefined : { animation: "construye-fade 0.35s ease-out both" }}
      >
        <div className="font-mono text-[11px] uppercase tracking-[2px] text-ink-400">Construye</div>
        <div className="mt-1 font-display text-2xl font-extrabold text-ink-800">
          „{round.word.display}“
        </div>
      </div>

      {/* Slots */}
      <Shake trigger={wrongShake}>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {targetLetters.map((_, i) => {
            const ch = Array.from(placed)[i]
            const hinted = ch !== undefined && i < round.hintsUsed
            return (
              <div
                key={i}
                className={`flex h-12 w-10 items-center justify-center rounded-[10px] border-2 font-display text-xl font-extrabold ${
                  ch
                    ? wrongFlash
                      ? "border-rosa-500 bg-rosa-50 text-rosa-600"
                      : solvedFlash
                        ? "border-jade-500 bg-jade-500 text-white"
                        : hinted
                          ? "border-maiz-400 bg-maiz-50 text-ink-800"
                          : "border-jade-500 bg-white text-ink-800"
                    : "border-dashed border-ink-200 bg-white"
                }`}
                style={
                  reduced || !ch || wrongFlash
                    ? undefined
                    : solvedFlash
                      ? {
                          // Wave rolls left → right across the finished word.
                          animation: "construye-ripple 0.5s ease-in-out both",
                          animationDelay: `${i * 55}ms`,
                        }
                      : { animation: "construye-pop 0.18s ease-out" }
                }
              >
                {ch ?? ""}
              </div>
            )
          })}
        </div>
      </Shake>

      {/* Tiles — keyed by round so a fresh rack deals in with a stagger */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {round.tiles.map((t, i) => (
          <button
            key={`${state.roundIndex}-${i}`}
            type="button"
            disabled={used.includes(i)}
            onClick={() => placeTile(i)}
            className="h-12 w-10 rounded-[10px] bg-maiz-400 font-display text-xl font-extrabold text-ink-800 shadow-[0_3px_0_var(--maiz-600)] [transition:transform_100ms,opacity_350ms] active:translate-y-0.5 active:shadow-none disabled:opacity-25 disabled:shadow-none"
            style={
              reduced
                ? undefined
                : { animation: "construye-deal 0.3s ease-out both", animationDelay: `${i * 40}ms` }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={backspace}
          className="inline-flex items-center gap-2 rounded-[12px] border-2 border-ink-200 bg-white px-4 py-2.5 font-bold text-ink-600 active:translate-y-0.5"
        >
          <Delete className="h-4 w-4" /> Borrar
        </button>
        <button
          type="button"
          onClick={hint}
          className="inline-flex items-center gap-2 rounded-[12px] border-2 border-maiz-400 bg-maiz-50 px-4 py-2.5 font-bold text-ink-700 active:translate-y-0.5"
        >
          <Lightbulb className="h-4 w-4" /> Pista (1 🌮)
        </button>
      </div>
      {hintMsg && (
        <Shake trigger={denyShake}>
          <p className="mt-3 text-center text-sm font-bold text-rosa-600">{hintMsg}</p>
        </Shake>
      )}
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
          Construye la Palabra <span className="text-xl">🧱</span>
        </h1>
        {children}
      </div>
    </div>
  )
}
