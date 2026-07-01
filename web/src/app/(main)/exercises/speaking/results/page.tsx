"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RotateCcw, Home, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SpeakingResult, WordResult } from "@chingon/shared"

interface SpeakingData {
  results: SpeakingResult[]
  level: string
  chapter: string
}

const TYPE_LABEL: Record<string, string> = {
  read_aloud: "Lee en voz alta",
  translate_speak: "Traduce y habla",
  listen_repeat: "Escucha y repite",
}

export default function SpeakingResultsPage() {
  const router = useRouter()
  const [data] = useState<SpeakingData | null>(() => {
    if (typeof window === "undefined") return null
    const saved = sessionStorage.getItem("speakingResults")
    return saved ? (JSON.parse(saved) as SpeakingData) : null
  })

  useEffect(() => {
    if (!data) router.push("/exercises/speaking")
  }, [data, router])

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-chili-500" />
      </div>
    )
  }

  const { results, level, chapter } = data
  const correct = results.filter((r) => r.correct).length
  const total = results.length
  const incorrect = total - correct
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  let accent: "jade" | "cielo" | "maiz" | "rosa" = "rosa"
  let message = "¡No te rajes! La práctica hace al maestro."
  if (pct >= 90) {
    accent = "jade"
    message = "¡Pronunciación de chingón! Hablas como nativo."
  } else if (pct >= 70) {
    accent = "cielo"
    message = "¡Bien hecho! Sigue practicando."
  } else if (pct >= 50) {
    accent = "maiz"
    message = "Vas bien — repasa las frases que fallaste."
  }

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="text-center">
        <div
          className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-chili-500"
          style={{ boxShadow: `0 6px 0 var(--${accent}-500)` }}
        >
          <Trophy className="h-9 w-9" />
        </div>
        <div className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-800">
          ¡Ejercicio completo!
        </div>
        <div className="mt-3 font-display text-6xl font-extrabold" style={{ color: `var(--${accent}-500)` }}>
          {pct}%
        </div>
        <div className="mt-1 text-sm text-ink-500">{correct} de {total} correctas</div>
        <div className="mt-3 font-marker text-xl" style={{ color: `var(--${accent}-600)` }}>
          {message}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat value={total} label="Total" color="cielo" />
        <Stat value={correct} label="Correctas" color="jade" />
        <Stat value={incorrect} label="Repasar" color="rosa" />
      </div>

      {/* Breakdown */}
      <div className="mt-6 space-y-3">
        {results.map((r, i) => (
          <div
            key={i}
            className={`rounded-[16px] border-2 p-4 ${
              r.correct ? "border-jade-200 bg-jade-50" : "border-rosa-200 bg-rosa-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">
                Ejercicio {i + 1}
              </span>
              <Badge color="rosa" variant="soft" size="sm">
                {TYPE_LABEL[r.exercise.type] ?? r.exercise.type}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">Esperado</div>
              <div className="text-sm font-medium text-ink-800">{r.expectedText}</div>
            </div>
            <div className="mt-2">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">Dijiste</div>
              <div className={`text-sm font-medium ${r.correct ? "text-jade-600" : "text-rosa-600"}`}>
                {r.transcription || "(nada detectado)"}
              </div>
            </div>
            {r.wordResults.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.wordResults.map((wr, j) => (
                  <span key={j} className={`text-sm font-semibold ${wordColor(wr.status)}`}>
                    {wr.word}
                  </span>
                ))}
              </div>
            )}
            {r.aiFeedback && <p className="mt-2 text-xs italic text-ink-500">{r.aiFeedback}</p>}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() =>
            router.push(`/exercises/speaking/play?level=${level}&chapter=${chapter}`)
          }
        >
          <RotateCcw className="h-4 w-4" /> Otra vez
        </Button>
        <Button variant="primary" className="flex-1" onClick={() => router.push("/exercises")}>
          <Home className="h-4 w-4" /> Ejercicios
        </Button>
      </div>
    </div>
  )
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-[16px] border border-ink-100 bg-white p-3 text-center shadow-sm">
      <div className="font-display text-2xl font-extrabold" style={{ color: `var(--${color}-500)` }}>
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  )
}

function wordColor(status: WordResult["status"]): string {
  switch (status) {
    case "correct":
      return "text-jade-600"
    case "missing":
      return "text-maiz-600"
    case "incorrect":
      return "text-rosa-600"
    case "extra":
      return "text-rosa-600 line-through"
  }
}
