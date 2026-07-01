"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Volume2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  generateListeningItems,
  gradeListening,
  type ListeningItem,
  type ListeningResult,
} from "@chingon/shared"

const TOTAL = 6

export default function EscuchaPlayPage() {
  const router = useRouter()
  const [items, setItems] = useState<ListeningItem[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [results, setResults] = useState<ListeningResult[]>([])
  const [loading, setLoading] = useState(true)
  const [revealText, setRevealText] = useState(false)
  const [ttsSupported, setTtsSupported] = useState(true)

  // Read settings (written by the picker) and build the item set.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("escuchaSettings") : null
    if (!saved) {
      router.push("/exercises/escucha")
      return
    }
    const { level } = JSON.parse(saved) as { level: string }
    const generated = generateListeningItems(level, TOTAL)
    if (generated.length === 0) {
      router.push("/exercises/escucha")
      return
    }
    setItems(generated)
    setLoading(false)
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window)
  }, [router])

  const item = items[index]

  const speak = useCallback(() => {
    if (!item || typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(item.spanish)
    u.lang = "es-ES"
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }, [item])

  // Auto-play the sentence when a new item appears (if supported).
  useEffect(() => {
    if (item && ttsSupported) speak()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  if (loading || !item) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-cielo-500" />
      </div>
    )
  }

  const answered = selected !== null
  const isCorrect = answered && gradeListening(selected, item.answer)

  const handleSelect = (option: string) => {
    if (answered) return
    setSelected(option)
    setResults((p) => [
      ...p,
      { item, selected: option, correct: gradeListening(option, item.answer) },
    ])
  }

  const handleNext = () => {
    if (index < items.length - 1) {
      setIndex((i) => i + 1)
      setSelected(null)
      setRevealText(false)
    } else {
      sessionStorage.setItem("escuchaResults", JSON.stringify({ results }))
      router.push("/exercises/escucha/results")
    }
  }

  const optionStyle = (option: string): string => {
    if (!answered) return "border-ink-200 bg-white hover:border-cielo-400 text-ink-700"
    if (option === item.answer) return "border-jade-400 bg-jade-50 text-jade-700"
    if (option === selected) return "border-rosa-400 bg-rosa-50 text-rosa-700"
    return "border-ink-200 bg-white text-ink-400"
  }

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/exercises/escucha")}
          className="flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver</span>
        </button>
        <div className="font-mono text-sm text-ink-500">
          <span className="font-display text-lg font-extrabold text-cielo-500">{index + 1}</span>
          <span className="text-ink-400"> / {items.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-7 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-cielo-500 transition-all duration-500"
          style={{
            width: `${((index + 1) / items.length) * 100}%`,
            boxShadow: "inset 0 -2px 0 var(--cielo-700)",
          }}
        />
      </div>

      {/* Listen card */}
      <div className="rounded-[24px] border border-ink-100 bg-white p-7 text-center shadow-md">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-cielo-600">
          ¿Qué escuchaste?
        </div>

        {ttsSupported ? (
          <button
            type="button"
            onClick={speak}
            className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full bg-cielo-500 text-white shadow-[0_5px_0_var(--cielo-700)] transition-transform active:translate-y-1 active:shadow-none"
            aria-label="Reproducir audio"
          >
            <Volume2 size={34} />
          </button>
        ) : (
          <div className="mt-5 rounded-[16px] border-2 border-maiz-300 bg-maiz-50 p-4 text-sm text-ink-600">
            ¡Ay, no! Tu navegador no puede reproducir audio. Lee la frase y elige el
            significado.
          </div>
        )}

        {/* Reveal the text (always shown when TTS unsupported, or on demand / after answering). */}
        {!ttsSupported || revealText || answered ? (
          <div className="mt-5 font-display text-xl font-bold tracking-tight text-ink-800">
            {item.spanish}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealText(true)}
            className="mx-auto mt-5 flex items-center gap-1.5 text-ink-400 transition-colors hover:text-ink-600"
          >
            <Eye className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-wider">Ver texto</span>
          </button>
        )}
      </div>

      {/* Options */}
      <div className="mt-6 space-y-2.5">
        {item.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            disabled={answered}
            className={`w-full rounded-[14px] border-2 px-5 py-4 text-left font-body text-base font-semibold transition-all ${optionStyle(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback + next */}
      {answered && (
        <div className="mt-6 space-y-3">
          <div
            className={`rounded-[16px] border-2 p-4 ${
              isCorrect ? "border-jade-300 bg-jade-50" : "border-rosa-300 bg-rosa-50"
            }`}
          >
            <div
              className={`font-display text-lg font-extrabold ${
                isCorrect ? "text-jade-700" : "text-rosa-700"
              }`}
            >
              {isCorrect ? "✓ ¡Órale!" : "✗ ¡Ay, no!"}
            </div>
            {!isCorrect && (
              <div className="mt-1 text-sm text-ink-600">
                Significa: <span className="font-semibold text-jade-600">{item.answer}</span>
              </div>
            )}
          </div>
          <Button variant="primary" size="lg" onClick={handleNext} className="w-full">
            {index < items.length - 1 ? "Ándale, siguiente" : "Ver resultados"}
          </Button>
        </div>
      )}
    </div>
  )
}
