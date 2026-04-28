"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "@/components/ui/progress"
import { Sunburst } from "@/components/ui/motifs"
import { UserVocabulary } from "@/types/schemas"

interface QuizResult {
  word: UserVocabulary
  correct: boolean
}

interface QuizData {
  results: QuizResult[]
  settings: { wordCount: number; quizType: string }
}

function getDisplayTranslation(translations: Record<string, string>): string {
  if (!translations || typeof translations !== "object") return ""
  if (translations.de) return translations.de
  if (translations.en) return translations.en
  const keys = Object.keys(translations)
  return keys.length > 0 ? translations[keys[0]] : ""
}

export default function QuizResultsPage() {
  const router = useRouter()
  const [quizData] = useState<QuizData | null>(() => {
    if (typeof window === "undefined") return null
    const saved = sessionStorage.getItem("quizResults")
    return saved ? (JSON.parse(saved) as QuizData) : null
  })

  useEffect(() => {
    if (!quizData) router.push("/exercises/quiz")
  }, [quizData, router])

  if (!quizData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-chili-500" />
      </div>
    )
  }

  const { results } = quizData
  const correct = results.filter((r) => r.correct).length
  const incorrect = results.length - correct
  const total = results.length
  const pct = Math.round((correct / total) * 100)

  let accent: "jade" | "cielo" | "maiz" | "rosa"
  let message: string
  if (pct >= 90) {
    accent = "jade"
    message = "¡Eres un chingón! Las dominas de verdad."
  } else if (pct >= 70) {
    accent = "cielo"
    message = "¡Bien hecho! Sigue practicando."
  } else if (pct >= 50) {
    accent = "maiz"
    message = "Vas bien — repasa las que se te escaparon."
  } else {
    accent = "rosa"
    message = "¡No te rajes! Repasa estas y dale otra vez."
  }

  const incorrectWords = results.filter((r) => !r.correct).map((r) => r.word)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-7 p-6 md:p-10">
      {/* Header */}
      <div className="text-center">
        <div className="relative mx-auto inline-flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 opacity-30">
            <Sunburst size={96} color={`var(--${accent}-300)`} />
          </div>
          <div className="relative text-6xl">🏆</div>
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-800">
          ¡Quiz completo!
        </h1>
      </div>

      {/* Score */}
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
              {pct}%
            </span>
          </ProgressRing>
        </div>
        <div className="font-display text-lg font-bold text-ink-800">
          {correct} de {total} correctas
        </div>
        <div className="mt-2 text-sm font-semibold" style={{ color: `var(--${accent}-600)` }}>
          {message}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Total" value={total} color="var(--cielo-500)" emoji="🎯" />
        <StatTile label="Correctas" value={correct} color="var(--jade-500)" emoji="✓" />
        <StatTile label="A repasar" value={incorrect} color="var(--rosa-500)" emoji="!" />
      </div>

      {/* To review */}
      {incorrectWords.length > 0 && (
        <div className="rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Badge color="rosa" variant="solid" size="sm">⚠ Para repasar</Badge>
          </div>
          <div className="space-y-2">
            {incorrectWords.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-[12px] border border-ink-100 bg-masa-50 p-3"
              >
                <div className="min-w-0">
                  <div className="font-display font-bold tracking-tight text-ink-800">
                    {w.term}
                  </div>
                  <div className="truncate text-xs text-ink-500">
                    {getDisplayTranslation(w.translations)}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <div
                      key={d}
                      className="h-2 w-2 rounded-full"
                      style={{
                        background:
                          d <= (w.difficulty_rating || 1) ? "var(--chili-500)" : "var(--ink-200)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.push("/exercises/quiz")}
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

function StatTile({
  label,
  value,
  color,
  emoji,
}: {
  label: string
  value: number
  color: string
  emoji: string
}) {
  return (
    <div className="rounded-[16px] border border-ink-100 bg-white p-4 text-center">
      <div
        className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-[10px] text-base font-bold text-white"
        style={{ background: color }}
      >
        {emoji}
      </div>
      <div className="font-display text-2xl font-extrabold leading-none text-ink-800">
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-500">
        {label}
      </div>
    </div>
  )
}
