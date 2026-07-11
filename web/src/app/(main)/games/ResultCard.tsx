"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SubmitGameOutcome } from "@chingon/shared"

/**
 * Pre-game card: explicit start keeps the session clock honest and state
 * initialization inside an event handler (react-hooks/set-state-in-effect).
 */
export function ReadyCard({
  emoji,
  instructions,
  onStart,
}: {
  emoji: string
  instructions: string
  onStart: () => void
}) {
  return (
    <div className="mx-auto max-w-md rounded-[24px] border border-ink-100 bg-white p-8 text-center shadow-sm">
      <div className="text-5xl">{emoji}</div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-600">{instructions}</p>
      <div className="mt-7">
        <Button variant="primary" size="lg" onClick={onStart}>
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
}: {
  outcome: SubmitGameOutcome
  onRetrySubmit?: () => void
  onPlayAgain: () => void
}) {
  return (
    <div className="mx-auto max-w-md rounded-[24px] border border-ink-100 bg-white p-8 text-center shadow-sm">
      <div className="text-5xl">{outcome.newBest ? "🏆" : "🌶"}</div>
      <div className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-800">
        {outcome.newBest ? "¡chingón! Nuevo récord" : "¡Órale!"}
      </div>
      <div className="mt-4 font-display text-[56px] font-extrabold leading-none text-chili-500">
        {outcome.score}
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

      <div className="mt-7 flex justify-center gap-3">
        <Button variant="primary" onClick={onPlayAgain}>
          Otra vez
        </Button>
        <Link href="/games">
          <Button variant="ghost">← Juegos</Button>
        </Link>
      </div>
    </div>
  )
}
