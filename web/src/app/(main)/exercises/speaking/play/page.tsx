"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mic, MicOff, Volume2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSpeakingExercises, getSpeakingFeedback, type SpeakingFeedback } from "@/actions/speaking"
import {
  evaluateSpeaking,
  getGrammarLevel,
  type SpeakingExercise,
  type SpeakingResult,
  type WordResult,
} from "@chingon/shared"
import { useLocale } from "next-intl"

// ── Web Speech API (not in lib.dom.d.ts) — minimal typed surface ────────
interface SpeechAlt { transcript: string }
interface SpeechResult { 0: SpeechAlt; isFinal: boolean; length: number }
interface SpeechResultList { length: number; [i: number]: SpeechResult }
interface SpeechEventLike { results: SpeechResultList }
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((e: SpeechEventLike) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

const TYPE_LABEL: Record<SpeakingExercise["type"], string> = {
  read_aloud: "Lee en voz alta",
  translate_speak: "Traduce y habla",
  listen_repeat: "Escucha y repite",
}

export default function SpeakingPlayPage() {
  const router = useRouter()
  const locale = useLocale()

  const [level, setLevel] = useState("a1")
  const [chapterId, setChapterId] = useState(0)

  const [exercises, setExercises] = useState<SpeakingExercise[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<SpeakingResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Speech support
  const [sttSupported, setSttSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [partial, setPartial] = useState("")

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false)
  const [wordResults, setWordResults] = useState<WordResult[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<SpeakingFeedback | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  // Listen & Repeat state
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasListened, setHasListened] = useState(false)
  const [showSpanishText, setShowSpanishText] = useState(false)

  const chapterTitle =
    getGrammarLevel(level, locale)?.chapters.find((c) => c.id === chapterId)?.title || ""
  const exercise = exercises[currentIndex]
  const total = exercises.length
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0

  // Load exercises (reads params from the URL inside the effect to avoid the
  // useSearchParams CSR-bailout during static prerender).
  useEffect(() => {
    setSttSupported(getSpeechRecognitionCtor() !== null)

    const params = new URLSearchParams(window.location.search)
    const lvl = (params.get("level") || "a1").toLowerCase()
    const ch = parseInt(params.get("chapter") || "0", 10)
    setLevel(lvl)
    setChapterId(ch)

    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      const res = await getSpeakingExercises(lvl, ch, 6)
      if (cancelled) return
      if (res.ok) setExercises(res.exercises)
      else setError(res.message)
      setLoading(false)
    })()
    return () => {
      cancelled = true
      recognitionRef.current?.stop()
      if (typeof window !== "undefined") window.speechSynthesis?.cancel()
    }
  }, [])

  const getExpectedText = useCallback((): string => {
    if (!exercise) return ""
    switch (exercise.type) {
      case "read_aloud":
        return exercise.spanishText
      case "translate_speak":
        return exercise.expectedSpanish
      case "listen_repeat":
        return exercise.spanishText
    }
  }, [exercise])

  const startRecording = () => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setSttSupported(false)
      return
    }
    const recognition = new Ctor()
    recognition.lang = "es-ES"
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onresult = (e) => {
      let text = ""
      let final = false
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript
        if (e.results[i].isFinal) final = true
      }
      if (final) {
        setTranscription(text.trim())
        setPartial("")
      } else {
        setPartial(text)
      }
    }
    recognition.onerror = () => {
      setIsRecording(false)
      setPartial((p) => {
        if (p) setTranscription(p.trim())
        return ""
      })
    }
    recognition.onend = () => setIsRecording(false)

    recognitionRef.current = recognition
    setTranscription("")
    setPartial("")
    setShowFeedback(false)
    setWordResults([])
    setAiFeedback(null)
    setIsRecording(true)
    recognition.start()
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
    if (!transcription && partial) {
      setTranscription(partial.trim())
      setPartial("")
    }
  }

  const playTTS = () => {
    if (!exercise || exercise.type !== "listen_repeat") return
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(exercise.spanishText)
    utterance.lang = "es-ES"
    utterance.rate = 0.85
    utterance.onend = () => {
      setIsPlaying(false)
      setHasListened(true)
    }
    utterance.onerror = () => setIsPlaying(false)
    setIsPlaying(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleCheck = async () => {
    if (!exercise || !transcription) return
    const expectedText = getExpectedText()
    const comparison = evaluateSpeaking(
      expectedText,
      transcription,
      exercise.type === "translate_speak" ? exercise.acceptableVariations : undefined,
    )
    setWordResults(comparison.wordResults)
    setIsCorrect(comparison.isCorrect)
    setShowFeedback(true)

    let feedback: SpeakingFeedback | null = null
    if (!comparison.isCorrect) {
      setIsEvaluating(true)
      feedback = await getSpeakingFeedback(
        expectedText,
        transcription,
        exercise.type,
        level.toUpperCase(),
        chapterTitle,
      )
      setAiFeedback(feedback)
      setIsEvaluating(false)
    }

    setResults((prev) => [
      ...prev,
      {
        exercise,
        transcription,
        expectedText,
        correct: comparison.isCorrect,
        wordResults: comparison.wordResults,
        aiFeedback: feedback?.feedback || undefined,
      },
    ])
  }

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
      setTranscription("")
      setPartial("")
      setShowFeedback(false)
      setWordResults([])
      setAiFeedback(null)
      setIsCorrect(false)
      setHasListened(false)
      setShowSpanishText(false)
    } else {
      sessionStorage.setItem(
        "speakingResults",
        JSON.stringify({ results, level, chapter: String(chapterId) }),
      )
      router.push("/exercises/speaking/results")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-chili-500" />
        <div className="font-display text-lg font-bold text-ink-700">Cocinando…</div>
        <div className="text-sm text-ink-500">Esto puede tardar un momento la primera vez.</div>
      </div>
    )
  }

  if (error || total === 0) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <button
          type="button"
          onClick={() => router.push("/exercises/speaking")}
          className="mb-6 inline-flex items-center gap-2 text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver</span>
        </button>
        <div className="rounded-[20px] border-2 border-rosa-300 bg-rosa-50 p-6 text-center">
          <div className="font-display text-xl font-extrabold text-rosa-700">¡Ay, no!</div>
          <p className="mt-2 text-sm text-ink-600">{error || "No hay ejercicios para este capítulo."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/exercises/speaking")}
          className="flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver</span>
        </button>
        <div className="font-mono text-sm text-ink-500">
          <span className="font-display text-lg font-extrabold text-chili-500">{currentIndex + 1}</span>
          <span className="text-ink-400"> / {total}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-chili-500 transition-all duration-500"
          style={{ width: `${progress}%`, boxShadow: "inset 0 -2px 0 var(--chili-700)" }}
        />
      </div>

      {!sttSupported && (
        <div className="mb-5 rounded-[16px] border-2 border-maiz-300 bg-maiz-50 p-4 text-sm text-ink-700">
          Tu navegador no soporta reconocimiento de voz. Prueba en Chrome o Edge para hablar.
        </div>
      )}

      {/* Type badge */}
      {exercise && (
        <Badge color="rosa" variant="soft" size="md" className="mb-4">
          {TYPE_LABEL[exercise.type]}
        </Badge>
      )}

      {/* Exercise content */}
      {exercise?.type === "read_aloud" && (
        <ExerciseCard
          instruction="Lee esta frase en voz alta en español:"
          spanish={exercise.spanishText}
          translation={exercise.translation}
        />
      )}
      {exercise?.type === "translate_speak" && (
        <ExerciseCard instruction="Tradúcela y dila en español:" spanish={exercise.promptText} />
      )}
      {exercise?.type === "listen_repeat" && (
        <div>
          <p className="mb-3 font-display text-xl font-bold text-ink-800">Escucha y luego repite:</p>
          <div className="rounded-[20px] border border-ink-100 bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={playTTS}
              disabled={isPlaying}
              className="flex items-center gap-3 font-display text-base font-bold text-chili-600 disabled:text-ink-400"
            >
              <Volume2 className="h-6 w-6" />
              {isPlaying ? "Reproduciendo…" : hasListened ? "Escuchar otra vez" : "Toca para escuchar"}
            </button>
            {showSpanishText || showFeedback ? (
              <div className="mt-4 border-t border-ink-100 pt-3">
                <div className="font-display text-lg font-semibold text-ink-800">{exercise.spanishText}</div>
                <div className="mt-1 text-sm text-ink-500">{exercise.translation}</div>
              </div>
            ) : hasListened ? (
              <button
                type="button"
                onClick={() => setShowSpanishText(true)}
                className="mt-4 flex items-center gap-1.5 border-t border-ink-100 pt-3 text-xs text-ink-500"
              >
                <Eye className="h-4 w-4" /> Mostrar texto
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Transcription */}
      {(transcription || partial) && (
        <div className="mt-5 rounded-[16px] border border-ink-100 bg-white p-4 shadow-sm">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">
            Lo que dijiste
          </div>
          <div className="mt-1 text-lg text-ink-800">{transcription || partial}</div>
          {isRecording && <div className="mt-1 text-xs italic text-chili-500">Sigo escuchando…</div>}
        </div>
      )}

      {/* Record button */}
      {!showFeedback && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={(exercise?.type === "listen_repeat" && !hasListened) || !sttSupported}
            className={`flex h-[72px] w-[72px] items-center justify-center rounded-full text-white shadow-[0_4px_0_rgba(0,0,0,.2)] transition-transform active:translate-y-1 disabled:bg-ink-200 disabled:shadow-none ${
              isRecording ? "animate-pulse bg-rosa-500" : "bg-chili-500"
            }`}
          >
            {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </button>
          <div className="text-sm font-medium text-ink-500">
            {isRecording
              ? "Toca para parar"
              : exercise?.type === "listen_repeat" && !hasListened
                ? "Escucha primero, luego graba"
                : "Toca para hablar"}
          </div>
        </div>
      )}

      {/* Word-by-word */}
      {showFeedback && wordResults.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">
            Palabra por palabra
          </div>
          <div className="flex flex-wrap gap-1.5">
            {wordResults.map((wr, i) => (
              <span
                key={i}
                className={`flex flex-col items-center rounded-[8px] border px-2.5 py-1.5 text-[15px] font-semibold ${wordChipClass(wr.status)}`}
              >
                {wr.word}
                {wr.status === "incorrect" && wr.expected && (
                  <span className="text-[11px] font-normal text-ink-500">{wr.expected}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback box */}
      {showFeedback && (
        <div
          className={`mt-6 rounded-[16px] border-2 p-4 ${
            isCorrect ? "border-jade-300 bg-jade-50" : "border-rosa-300 bg-rosa-50"
          }`}
        >
          <div
            className={`font-display text-lg font-extrabold ${isCorrect ? "text-jade-700" : "text-rosa-700"}`}
          >
            {isCorrect ? "¡Órale!" : "Casi…"}
          </div>
          {!isCorrect && (
            <div className="mt-2">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">
                Esperado
              </div>
              <div className="font-semibold text-jade-600">{getExpectedText()}</div>
            </div>
          )}
          {exercise?.explanation && (
            <p className="mt-2 text-sm text-ink-700">{exercise.explanation}</p>
          )}
          {isEvaluating && (
            <div className="mt-3 flex items-center gap-2 text-sm text-ink-500">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-chili-500" />
              Cocinando feedback…
            </div>
          )}
          {aiFeedback && (
            <div className="mt-3 space-y-2 border-t border-ink-100 pt-3">
              {aiFeedback.feedback && <p className="text-sm text-ink-700">{aiFeedback.feedback}</p>}
              {aiFeedback.corrections.map((c, i) => (
                <div key={i} className="text-sm">
                  <span className="font-semibold text-rosa-600">{c.wrong}</span>
                  <span className="text-ink-500"> → </span>
                  <span className="font-semibold text-jade-600">{c.correct}</span>
                </div>
              ))}
              {aiFeedback.tip && <p className="text-xs italic text-ink-500">{aiFeedback.tip}</p>}
            </div>
          )}
        </div>
      )}

      {/* Bottom action */}
      <div className="mt-7">
        {!showFeedback ? (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleCheck}
            disabled={!transcription || isRecording}
          >
            ¡Dale! Revisar
          </Button>
        ) : (
          <Button variant="primary" size="lg" className="w-full" onClick={handleNext}>
            {currentIndex < total - 1 ? "Ándale, siguiente" : "Ver resultados"}
          </Button>
        )}
      </div>
    </div>
  )
}

function ExerciseCard({
  instruction,
  spanish,
  translation,
}: {
  instruction: string
  spanish: string
  translation?: string
}) {
  return (
    <div>
      <p className="mb-3 font-display text-xl font-bold text-ink-800">{instruction}</p>
      <div className="rounded-[20px] border border-ink-100 bg-white p-6 shadow-sm">
        <div className="font-display text-xl font-semibold leading-snug text-ink-800">{spanish}</div>
        {translation && <div className="mt-2 text-sm text-ink-500">{translation}</div>}
      </div>
    </div>
  )
}

function wordChipClass(status: WordResult["status"]): string {
  switch (status) {
    case "correct":
      return "border-jade-200 bg-jade-50 text-jade-700"
    case "missing":
      return "border-maiz-300 bg-maiz-50 text-maiz-700"
    case "incorrect":
    case "extra":
      return "border-rosa-200 bg-rosa-50 text-rosa-700"
  }
}
