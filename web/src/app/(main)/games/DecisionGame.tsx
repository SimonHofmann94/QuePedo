"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  GAME_CONFIG,
  initDecision,
  answerDecision,
  isDecisionOver,
  buildDecisionPool,
  type DecisionGameId,
  type DecisionItem,
  type DecisionState,
  type SubmitGameOutcome,
  type CEFR,
} from "@chingon/shared"
import { submitGameResult } from "@/actions/games"
import { useVocabSource, type CEFRLevel } from "./useGameWords"
import { VocabPicker } from "./VocabPicker"
import { ReadyCard, ResultCard } from "./ResultCard"
import { playCorrect, playWrong, playCombo } from "./sounds"
import { Burst, Shake, useReducedMotion } from "./juice"

// One client component for all four grammar-decision games. A page is just
// <DecisionGame gameId="…" … buildPool={…} /> — the reducer, scoring, HUD,
// feedback and submit path are shared; the page supplies the item source
// and the words on the ready card.

/** Where a rule tag points for "Mehr dazu →". */
export type RuleRef = { level: CEFR; chapterId: number }

export interface DecisionGameProps {
  gameId: DecisionGameId
  emoji: string
  title: string
  instructions: string
  /** Item source for a level. Gender: from vocab; sentence games: from a bank. */
  buildPool: (level: CEFR) => DecisionItem[]
  /** Optional chapter link per rule tag. */
  ruleRef?: (ruleTag: string) => RuleRef | undefined
}

const OPTION_COLORS = ["cielo", "rosa", "jade", "maiz"] as const

export function DecisionGame({ gameId, emoji, title, instructions, buildPool, ruleRef }: DecisionGameProps) {
  const cfg = GAME_CONFIG[gameId]
  const levels = cfg.levels as readonly CEFRLevel[]
  const freeLevels = new Set<CEFRLevel>([cfg.floor])

  const [vocabSource, setVocabSource] = useVocabSource(gameId, { kind: "curated", level: cfg.floor })
  const level: CEFR = vocabSource.kind === "curated" ? vocabSource.level : cfg.floor

  const reduced = useReducedMotion()
  const [state, setState] = useState<DecisionState | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [outcome, setOutcome] = useState<SubmitGameOutcome | null>(null)
  // Rounds mode blocks on a wrong answer so the explanation is read; sprint
  // shows it as a passing banner. `feedback` holds the miss being explained.
  const [feedback, setFeedback] = useState<{ item: DecisionItem; chosen: number } | null>(null)
  const [bannerKey, setBannerKey] = useState(0)
  const startRef = useRef(0)
  const submittedRef = useRef(false)
  const lastPayloadRef = useRef<Parameters<typeof submitGameResult>[0] | null>(null)

  const start = useCallback(() => {
    const pool = buildDecisionPool({ items: buildPool(level), level, count: cfg.poolSize })
    if (pool.length === 0) return
    submittedRef.current = false
    setOutcome(null)
    setFeedback(null)
    setElapsed(0)
    startRef.current = Date.now()
    setState(initDecision(gameId, pool))
  }, [buildPool, level, cfg.poolSize, gameId])

  const finish = useCallback(
    async (s: DecisionState, durationMs: number) => {
      if (submittedRef.current) return
      submittedRef.current = true
      const total = s.correct + s.wrong
      if (total === 0) {
        setOutcome({ saved: true, score: 0, tacosEarned: 0, newBest: false })
        return
      }
      const payload = {
        game_id: gameId,
        score: s.score,
        correct: s.correct,
        total,
        duration_ms: Math.round(durationMs),
        combo: s.maxCombo,
      }
      lastPayloadRef.current = payload
      setOutcome(await submitGameResult(payload))
    },
    [gameId],
  )

  // Clock + over-check run inside the interval so the closure is never stale.
  // Rounds mode also ends here (state.over), so both modes share one path.
  useEffect(() => {
    if (!state || outcome) return
    const t = setInterval(() => {
      const el = Date.now() - startRef.current
      setElapsed(el)
      if (isDecisionOver(state, el) && !feedback) {
        finish(state, cfg.mode === "sprint" ? Math.min(el, cfg.sessionMs) : el)
      }
    }, 250)
    return () => clearInterval(t)
  }, [state, outcome, feedback, finish, cfg])

  const retrySubmit = useCallback(async () => {
    if (lastPayloadRef.current) setOutcome(await submitGameResult(lastPayloadRef.current))
  }, [])

  const tap = (optionIndex: number) => {
    if (!state?.current || feedback || isDecisionOver(state, elapsed)) return
    const item = state.current
    const correct = optionIndex === item.correct
    if (correct) {
      if (state.combo >= 2) playCombo(state.combo)
      else playCorrect()
    } else {
      playWrong()
      if (cfg.mode === "rounds") setFeedback({ item, chosen: optionIndex })
      else setBannerKey((k) => k + 1)
    }
    setState((s) => (s ? answerDecision(s, optionIndex) : s))
  }

  if (!state) {
    return (
      <GameShell title={title}>
        <ReadyCard
          emoji={emoji}
          instructions={instructions}
          extra={
            <VocabPicker
              value={vocabSource}
              onChange={setVocabSource}
              hideMine
              levels={levels}
              freeLevels={freeLevels}
            />
          }
          onStart={start}
        />
      </GameShell>
    )
  }

  if (outcome) {
    return (
      <GameShell title={title}>
        <ResultCard
          outcome={outcome}
          onRetrySubmit={retrySubmit}
          onPlayAgain={start}
          recap={<MissRecap misses={state.misses} ruleRef={ruleRef} />}
        />
      </GameShell>
    )
  }

  const item = state.current
  const secondsLeft = cfg.mode === "sprint" ? Math.max(0, Math.ceil((cfg.sessionMs - elapsed) / 1000)) : null
  const lastMiss = state.misses[state.misses.length - 1]

  return (
    <GameShell title={title}>
      {/* HUD */}
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-sm font-bold text-ink-600">
          {cfg.mode === "rounds" ? `${state.correct + state.wrong}/${cfg.rounds}` : `✓ ${state.correct}`}
        </div>
        <div
          className={`font-mono text-sm font-bold ${secondsLeft !== null && secondsLeft <= 10 ? "text-rosa-500" : "text-ink-600"}`}
        >
          {state.combo > 1 && (
            <span
              key={state.combo}
              className="mr-3 inline-block text-chili-500"
              style={reduced ? undefined : { animation: "hud-pop 0.3s ease-out" }}
            >
              ×{state.combo} 🔥
            </span>
          )}
          {secondsLeft !== null ? `0:${String(secondsLeft).padStart(2, "0")}` : null}
        </div>
        <div
          key={state.score}
          className="font-display text-2xl font-extrabold text-ink-800"
          style={reduced ? undefined : { animation: "hud-pop 0.3s ease-out" }}
        >
          {state.score}
        </div>
      </div>

      <Shake trigger={state.wrong}>
        <div className="relative overflow-hidden rounded-[20px] border border-ink-100 bg-white p-6 shadow-sm md:p-8">
          <style>{`@keyframes hud-pop { 0% { transform: scale(1) } 40% { transform: scale(1.4) } 100% { transform: scale(1) } }
            @keyframes banner-in { 0% { opacity: 0; transform: translateY(-6px) } 15% { opacity: 1; transform: none } 80% { opacity: 1 } 100% { opacity: 0 } }`}</style>
          <Burst trigger={state.correct} count={12} />

          {/* Sprint: passing rule banner after a miss, non-blocking */}
          {cfg.mode === "sprint" && lastMiss && bannerKey > 0 && (
            <div
              key={bannerKey}
              className="pointer-events-none absolute inset-x-4 top-3 rounded-[12px] border border-rosa-200 bg-rosa-50 px-3 py-2 text-center text-xs text-rosa-700"
              style={reduced ? { animation: "banner-in 1.6s ease-out forwards" } : { animation: "banner-in 1.6s ease-out forwards" }}
            >
              <strong>{lastMiss.item.options[lastMiss.item.correct]}</strong> — {lastMiss.item.explanation_de}
            </div>
          )}

          {item && !feedback && (
            <>
              <Prompt prompt={item.prompt} />
              <div className={`mt-8 grid gap-3 ${item.options.length > 2 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
                {item.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => tap(i)}
                    className="rounded-[16px] border-[3px] px-4 py-5 font-display text-2xl font-extrabold text-ink-800 transition-transform active:translate-y-1 active:shadow-none"
                    style={{
                      borderColor: `var(--${OPTION_COLORS[i]}-400)`,
                      background: `var(--${OPTION_COLORS[i]}-50)`,
                      boxShadow: `0 4px 0 0 var(--${OPTION_COLORS[i]}-400)`,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Rounds: blocking explanation card — the learning payoff */}
          {feedback && (
            <div className="text-center">
              <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-rosa-500">
                Casi…
              </div>
              <Prompt prompt={feedback.item.prompt} fill={feedback.item.options[feedback.item.correct]} />
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-600">
                Tú: <span className="font-bold text-rosa-600 line-through">{feedback.item.options[feedback.chosen]}</span>
                {" · "}
                Correcto: <span className="font-bold text-jade-600">{feedback.item.options[feedback.item.correct]}</span>
              </p>
              <p className="mx-auto mt-3 max-w-md rounded-[14px] border-l-4 border-maiz-400 bg-maiz-50 p-3 text-left text-sm leading-relaxed text-ink-700">
                {feedback.item.explanation_de}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                {ruleRef?.(feedback.item.ruleTag) && (
                  <Link
                    href={`/grammar/${ruleRef(feedback.item.ruleTag)!.level.toLowerCase()}/${ruleRef(feedback.item.ruleTag)!.chapterId}`}
                    target="_blank"
                    className="font-display text-sm font-bold text-cielo-600 underline"
                  >
                    Mehr dazu →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  className="rounded-[14px] bg-chili-500 px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-[0_4px_0_0_var(--chili-700)] active:translate-y-1 active:shadow-none"
                >
                  Sigue →
                </button>
              </div>
            </div>
          )}
        </div>
      </Shake>
    </GameShell>
  )
}

/** The prompt with its blank rendered as a chunky underscore slot (or filled). */
function Prompt({ prompt, fill }: { prompt: string; fill?: string }) {
  const [before, after] = prompt.split("___")
  return (
    <div className="text-center font-display text-3xl font-extrabold leading-snug tracking-tight text-ink-800 md:text-4xl">
      {before}
      {fill ? (
        <span className="text-jade-600">{fill}</span>
      ) : (
        <span className="inline-block min-w-[2.2em] border-b-4 border-dashed border-chili-400 align-baseline">&nbsp;</span>
      )}
      {after}
    </div>
  )
}

function MissRecap({ misses, ruleRef }: { misses: DecisionState["misses"]; ruleRef?: (tag: string) => RuleRef | undefined }) {
  if (misses.length === 0) {
    return <p className="mt-5 text-sm text-jade-600">Sin una sola falla. ¡chingón!</p>
  }
  // Sprint can re-queue an item; show each missed item once.
  const seen = new Set<string>()
  const unique = misses.filter((m) => (seen.has(m.item.id) ? false : (seen.add(m.item.id), true)))
  return (
    <div className="mt-6 text-left">
      <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[2px] text-ink-400">
        Para repasar
      </div>
      <ul className="space-y-2">
        {unique.map((m) => {
          const ref = ruleRef?.(m.item.ruleTag)
          return (
            <li key={m.item.id} className="rounded-[12px] border border-ink-100 bg-masa-50 p-3 text-sm">
              <div className="font-display font-bold text-ink-800">
                {m.item.prompt.replace("___", m.item.options[m.item.correct])}
              </div>
              <div className="mt-1 text-xs text-ink-500">
                {m.item.explanation_de}
                {ref && (
                  <>
                    {" "}
                    <Link href={`/grammar/${ref.level.toLowerCase()}/${ref.chapterId}`} className="font-bold text-cielo-600 underline">
                      Mehr dazu →
                    </Link>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function GameShell({ title, children }: { title: string; children: React.ReactNode }) {
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
        <h1 className="mb-5 font-display text-3xl font-extrabold tracking-tight text-ink-800">{title}</h1>
        {children}
      </div>
    </div>
  )
}
