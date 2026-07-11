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
import { useGameWords } from "../useGameWords"
import { ReadyCard, ResultCard } from "../ResultCard"

const CFG = GAME_CONFIG.construye

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
  const { pool, error } = useGameWords(CFG.minWords)
  const [state, setState] = useState<ConstruyeState | null>(null)
  const [placed, setPlaced] = useState("")
  const [wrongFlash, setWrongFlash] = useState(false)
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
          instructions="Te damos la traducción — tú construyes la palabra en español con las fichas revueltas. Diez palabras; las pistas cuestan un taco."
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

  const advance = (s: ConstruyeState) => {
    const next = completeRound(s)
    setState(next)
    setPlaced("")
    setHintMsg(null)
    if (next.over) finish(next)
  }

  const placeTile = (i: number) => {
    if (used.includes(i) || wrongFlash) return
    const next = placed + round.tiles[i]
    if (Array.from(next).length === targetLetters.length) {
      if (checkComplete(next, target)) {
        setPlaced(next)
        setTimeout(() => advance(state), 350)
      } else {
        setPlaced(next)
        setWrongFlash(true)
        setTimeout(() => {
          setWrongFlash(false)
          setPlaced("")
        }, 500)
      }
    } else {
      setPlaced(next)
    }
  }

  const backspace = () => {
    if (wrongFlash) return
    setPlaced(Array.from(placed).slice(0, -1).join(""))
  }

  const hint = async () => {
    if (wrongFlash) return
    const { ok } = await spendHintTaco()
    if (!ok) {
      setHintMsg("Sin tacos 🌮 — ¡gánate unos jugando!")
      return
    }
    const { state: hinted } = applyHint(state)
    setState(hinted)
    // Reveal = reset to the correct prefix, one letter longer.
    const revealed = hinted.rounds[hinted.roundIndex].hintsUsed
    setPlaced(targetLetters.slice(0, Math.min(revealed, targetLetters.length)).join(""))
    setHintMsg(null)
  }

  return (
    <GameShell>
      {/* HUD */}
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-xs uppercase tracking-wider text-ink-500">
          Palabra {state.roundIndex + 1} / {state.rounds.length}
        </div>
        <div className="font-display text-2xl font-extrabold text-ink-800">{state.score}</div>
      </div>

      {/* Prompt */}
      <div className="mb-6 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[2px] text-ink-400">Construye</div>
        <div className="mt-1 font-display text-2xl font-extrabold text-ink-800">
          „{round.word.display}“
        </div>
      </div>

      {/* Slots */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {targetLetters.map((_, i) => {
          const ch = Array.from(placed)[i]
          return (
            <div
              key={i}
              className={`flex h-12 w-10 items-center justify-center rounded-[10px] border-2 font-display text-xl font-extrabold ${
                ch
                  ? wrongFlash
                    ? "border-rosa-500 bg-rosa-50 text-rosa-600"
                    : "border-jade-500 bg-white text-ink-800"
                  : "border-dashed border-ink-200 bg-white"
              }`}
            >
              {ch ?? ""}
            </div>
          )
        })}
      </div>

      {/* Tiles */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {round.tiles.map((t, i) => (
          <button
            key={i}
            type="button"
            disabled={used.includes(i)}
            onClick={() => placeTile(i)}
            className="h-12 w-10 rounded-[10px] bg-maiz-400 font-display text-xl font-extrabold text-ink-800 shadow-[0_3px_0_var(--maiz-600)] transition-transform duration-100 active:translate-y-0.5 active:shadow-none disabled:opacity-25 disabled:shadow-none"
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
      {hintMsg && <p className="mt-3 text-center text-sm text-rosa-600">{hintMsg}</p>}
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
