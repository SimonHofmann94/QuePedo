"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "@/components/ui/progress"
import { Sunburst } from "@/components/ui/motifs"
import type { WritingResult } from "@chingon/shared"

export default function EscrituraResultsPage() {
  const router = useRouter()
  const [result] = useState<WritingResult | null>(() => {
    if (typeof window === "undefined") return null
    const saved = sessionStorage.getItem("escrituraResult")
    return saved ? (JSON.parse(saved) as WritingResult) : null
  })

  useEffect(() => {
    if (!result) router.push("/exercises/escritura")
  }, [result, router])

  if (!result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-jacaranda-500" />
      </div>
    )
  }

  const { prompt, text, feedback } = result
  const pct = Math.round(feedback.score)

  let accent: "jade" | "cielo" | "maiz" | "rosa"
  if (pct >= 90) accent = "jade"
  else if (pct >= 70) accent = "cielo"
  else if (pct >= 50) accent = "maiz"
  else accent = "rosa"

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-6 md:p-10">
      {/* Header */}
      <div className="text-center">
        <div className="relative mx-auto inline-flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 opacity-30">
            <Sunburst size={96} color={`var(--${accent}-300)`} />
          </div>
          <div className="relative text-6xl">✍️</div>
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-800">
          ¡Texto revisado!
        </h1>
      </div>

      {/* Score + note */}
      <div className="rounded-[24px] border border-ink-100 bg-white p-7 text-center shadow-md">
        <div className="mx-auto mb-3 inline-flex">
          <ProgressRing
            value={pct}
            max={100}
            size={140}
            stroke={12}
            color={`var(--${accent}-500)`}
            trackColor="var(--ink-100)"
          >
            <span style={{ color: `var(--${accent}-600)`, fontSize: 36, lineHeight: 1 }}>
              {pct}
            </span>
          </ProgressRing>
        </div>
        <div className="text-sm font-semibold" style={{ color: `var(--${accent}-600)` }}>
          {feedback.note}
        </div>
      </div>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <div className="rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm">
          <div className="mb-3">
            <Badge color="jade" variant="solid" size="sm">✓ Lo que hiciste bien</Badge>
          </div>
          <ul className="space-y-1.5">
            {feedback.strengths.map((s) => (
              <li key={s} className="text-sm text-ink-700">• {s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Corrections */}
      {feedback.corrections.length > 0 && (
        <div className="rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm">
          <div className="mb-3">
            <Badge color="rosa" variant="solid" size="sm">⚠ Correcciones</Badge>
          </div>
          <div className="space-y-3">
            {feedback.corrections.map((c, i) => (
              <div key={i} className="rounded-[12px] border border-ink-100 bg-masa-50 p-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-rosa-600 line-through">{c.wrong}</span>
                  <span className="text-ink-400">→</span>
                  <span className="font-semibold text-jade-600">{c.correct}</span>
                </div>
                {c.explanation && (
                  <div className="mt-1 text-xs text-ink-500">{c.explanation}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your text */}
      <div className="rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">
          Tu texto · {prompt.chapterTitle}
        </div>
        <p className="whitespace-pre-wrap text-sm italic text-ink-600">{text}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="lg"
          onClick={() =>
            router.push(`/exercises/escritura/play?level=${prompt.level}&chapter=${prompt.chapterId}`)
          }
          className="flex-1"
        >
          <RotateCcw className="h-5 w-5" />
          Otra vez
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/exercises")}
          className="flex-1"
        >
          <Home className="h-5 w-5" />
          Ejercicios
        </Button>
      </div>
    </div>
  )
}
