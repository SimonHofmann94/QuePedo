"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SubmitGameOutcome } from "@chingon/shared"
import { initAudio, playFanfare } from "./sounds"
import { Burst, CountUp } from "./juice"

/**
 * Pre-game card: explicit start keeps the session clock honest and state
 * initialization inside an event handler (react-hooks/set-state-in-effect).
 */
export function ReadyCard({
  emoji,
  instructions,
  onStart,
  extra,
}: {
  emoji: string
  instructions: string
  onStart: () => void
  /** Optional slot between instructions and ¡Dale! (e.g. the VocabPicker). */
  extra?: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-md rounded-[24px] border border-ink-100 bg-white p-8 text-center shadow-sm">
      <div className="text-5xl">{emoji}</div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-600">{instructions}</p>
      {extra}
      <div className="mt-7">
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            initAudio() // browser audio unlock — must happen in a user gesture
            onStart()
          }}
        >
          ¡Dale!
        </Button>
      </div>
    </div>
  )
}

/**
 * End-of-session card shared by all three games: score, taco payout,
 * personal-best celebration, and the "score not saved → retry" failure path.
 */
export function ResultCard({
  outcome,
  onRetrySubmit,
  onPlayAgain,
  recap,
}: {
  outcome: SubmitGameOutcome
  onRetrySubmit?: () => void
  onPlayAgain: () => void
  /** Slot under the score — grammar games list the items the player missed. */
  recap?: React.ReactNode
}) {
  // New personal best gets a real moment: papel picado + fanfare. The burst
  // is driven directly by the prop (stateless); only the sound is an effect.
  useEffect(() => {
    if (outcome.newBest) playFanfare()
  }, [outcome.newBest])

  return (
    <div className="relative mx-auto max-w-md rounded-[24px] border border-ink-100 bg-white p-8 text-center shadow-sm">
      <Burst trigger={outcome.newBest ? 1 : 0} count={32} />
      <div className="text-5xl">{outcome.newBest ? "🏆" : "🌶"}</div>
      <div className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-800">
        {outcome.newBest ? "¡chingón! Nuevo récord" : "¡Órale!"}
      </div>
      <div className="mt-4 font-display text-[56px] font-extrabold leading-none text-chili-500">
        <CountUp to={outcome.score} />
      </div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[2px] text-ink-400">puntos</div>

      {outcome.saved ? (
        outcome.tacosEarned > 0 && (
          <div className="mt-5">
            <Badge color="maiz" variant="solid" size="md">
              +{outcome.tacosEarned} 🌮
            </Badge>
          </div>
        )
      ) : (
        <div className="mt-5 rounded-[14px] border-2 border-rosa-200 bg-rosa-50 p-3 text-sm text-rosa-600">
          ¡Ay, no! Tu puntuación no se guardó.
          {onRetrySubmit && (
            <button type="button" onClick={onRetrySubmit} className="ml-2 font-bold underline">
              Reintentar
            </button>
          )}
        </div>
      )}

      {recap}

      <div className="mt-7 flex justify-center gap-3">
        <Button
          variant="primary"
          onClick={() => {
            initAudio()
            onPlayAgain()
          }}
        >
          Otra vez
        </Button>
        <Link href="/games">
          <Button variant="ghost">← Juegos</Button>
        </Link>
      </div>
    </div>
  )
}
