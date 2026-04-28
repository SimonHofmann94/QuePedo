"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCards, Keyboard } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { ArrowLeft, Send, SkipForward } from "lucide-react"
import { getUserVocabulary } from "@/actions/vocabulary"
import { UserVocabulary } from "@/types/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import "swiper/css"
import "swiper/css/effect-cards"

interface QuizSettings {
  wordCount: number
  difficulty: number[]
  level: string[]
  quizType: "term_to_translation" | "translation_to_term"
  showContext: boolean
  showTags: boolean
}

interface QuizResult {
  word: UserVocabulary
  correct: boolean
  userAnswer: string
  correctAnswer: string
}

function getDisplayTranslation(translations: Record<string, string>): string {
  if (!translations || typeof translations !== "object") return ""
  if (translations.de) return translations.de
  if (translations.en) return translations.en
  const keys = Object.keys(translations)
  return keys.length > 0 ? translations[keys[0]] : ""
}

function normalizeAnswer(a: string) {
  return a
    .toLowerCase()
    .trim()
    .replace(/^(el|la|los|las|un|una|unos|unas|der|die|das|ein|eine)\s+/i, "")
    .replace(/[.,!?¿¡'"]/g, "")
    .trim()
}

function checkAnswer(user: string, correct: string): boolean {
  const u = normalizeAnswer(user)
  const c = normalizeAnswer(correct)
  if (u === c) return true
  if (c.includes(u) && u.length > 3) return true
  return false
}

export default function QuizPlayPage() {
  const router = useRouter()
  const swiperRef = useRef<SwiperType | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [words, setWords] = useState<UserVocabulary[]>([])
  const [settings, setSettings] = useState<QuizSettings | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [results, setResults] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadQuiz = async () => {
      const saved = sessionStorage.getItem("quizSettings")
      if (!saved) {
        router.push("/exercises/quiz")
        return
      }
      const parsed: QuizSettings = JSON.parse(saved)
      setSettings(parsed)
      const vocab = await getUserVocabulary()
      const filtered = vocab.filter((v) => parsed.difficulty.includes(v.difficulty_rating || 1))
      const shuffled = filtered.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, parsed.wordCount)
      if (selected.length === 0) {
        alert("¡Ay, no! No hay palabras para este quiz. Añade vocabulario primero.")
        router.push("/vocabulary")
        return
      }
      setWords(selected)
      setIsLoading(false)
    }
    loadQuiz()
  }, [router])

  useEffect(() => {
    if (!showResult && inputRef.current) inputRef.current.focus()
  }, [currentIndex, showResult])

  const getCurrentWord = () => words[currentIndex]
  const getCorrectAnswer = () => {
    const w = getCurrentWord()
    if (!w) return ""
    return settings?.quizType === "term_to_translation" ? getDisplayTranslation(w.translations) : w.term
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAnswer.trim()) return
    const correct = checkAnswer(userAnswer, getCorrectAnswer())
    setIsCorrect(correct)
    setShowResult(true)
    setResults((p) => [
      ...p,
      { word: getCurrentWord(), correct, userAnswer, correctAnswer: getCorrectAnswer() },
    ])
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      swiperRef.current?.slideNext()
      setUserAnswer("")
      setShowResult(false)
    } else {
      sessionStorage.setItem("quizResults", JSON.stringify({ results, settings }))
      router.push("/exercises/quiz/results")
    }
  }

  const handleSkip = () => {
    setResults((p) => [
      ...p,
      { word: getCurrentWord(), correct: false, userAnswer: "(skipped)", correctAnswer: getCorrectAnswer() },
    ])
    handleNext()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-chili-500" />
      </div>
    )
  }
  if (!settings || words.length === 0) return null

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/exercises/quiz")}
          className="flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver</span>
        </button>
        <div className="font-mono text-sm text-ink-500">
          <span className="font-display text-lg font-extrabold text-chili-500">
            {currentIndex + 1}
          </span>
          <span className="text-ink-400"> / {words.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-7 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-chili-500 transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / words.length) * 100}%`,
            boxShadow: "inset 0 -2px 0 var(--chili-700)",
          }}
        />
      </div>

      {/* Card */}
      <Swiper
        effect="cards"
        grabCursor={false}
        modules={[EffectCards, Keyboard]}
        allowTouchMove={false}
        onSwiper={(s) => {
          swiperRef.current = s
        }}
        onSlideChange={(s) => setCurrentIndex(s.activeIndex)}
        className="quiz-swiper"
        style={{ width: "100%", height: 320 }}
      >
        {words.map((w) => (
          <SwiperSlide key={w.id}>
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[24px] border border-ink-100 bg-white p-7 text-center shadow-md">
              <div className="font-display text-3xl font-extrabold tracking-tight text-ink-800 md:text-4xl">
                {settings.quizType === "term_to_translation"
                  ? w.term
                  : getDisplayTranslation(w.translations)}
              </div>
              {settings.showContext && w.context_sentence && (
                <div className="mt-4 text-sm italic text-ink-500">💡 {w.context_sentence}</div>
              )}
              {settings.showTags && w.tags && w.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {w.tags.map((tag) => (
                    <Badge key={tag} color="jacaranda" variant="soft" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-1">
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
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Answer */}
      <div className="mt-6">
        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={
                settings.quizType === "term_to_translation"
                  ? "Escribe la traducción…"
                  : "Escribe en español…"
              }
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="h-14 px-5 text-lg"
            />
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={handleSkip}>
                <SkipForward className="h-4 w-4" />
                Saltar
              </Button>
              <Button type="submit" variant="primary" disabled={!userAnswer.trim()} className="flex-1">
                <Send className="h-4 w-4" />
                ¡Dale!
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div
              className={`rounded-[16px] border-2 p-4 ${
                isCorrect
                  ? "border-jade-300 bg-jade-50"
                  : "border-rosa-300 bg-rosa-50"
              }`}
            >
              <div
                className={`mb-2 font-display text-lg font-extrabold ${
                  isCorrect ? "text-jade-700" : "text-rosa-700"
                }`}
              >
                {isCorrect ? "✓ ¡Órale!" : "✗ ¡Ay, no!"}
              </div>
              {!isCorrect && (
                <div className="space-y-1 text-sm text-ink-600">
                  <div>
                    Tu respuesta: <span className="font-semibold text-rosa-600">{userAnswer}</span>
                  </div>
                  <div>
                    Correcta: <span className="font-semibold text-jade-600">{getCorrectAnswer()}</span>
                  </div>
                </div>
              )}
            </div>
            <Button variant="primary" size="lg" onClick={handleNext} className="w-full">
              {currentIndex < words.length - 1 ? "Siguiente palabra" : "Ver resultados"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
