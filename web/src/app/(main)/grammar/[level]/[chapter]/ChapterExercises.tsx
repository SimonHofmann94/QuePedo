"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress"
import { CheckIcon, XIcon } from "@/components/ui/icons"
import type {
  GrammarQuestion,
  MultipleChoiceQuestion,
  FillInBlankQuestion,
  SentenceReorderQuestion,
  ErrorCorrectionQuestion,
} from "@chingon/shared"

type Result = { question: GrammarQuestion; userAnswer: string; correct: boolean }

type QuestionState = {
  selectedOption: string | null
  textAnswer: string
  placedWords: string[]
  availableWords: string[]
  selectedErrorWord: string | null
  correctionInput: string
}

interface Props {
  exercises: GrammarQuestion[]
  level: string
  chapterId: number
}

function emptyState(q: GrammarQuestion | undefined): QuestionState {
  return {
    selectedOption: null,
    textAnswer: "",
    placedWords: [],
    availableWords: q?.type === "sentence_reorder" ? [...q.shuffledWords] : [],
    selectedErrorWord: null,
    correctionInput: "",
  }
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?¿¡'"]/g, "")
    .trim()
}

function checkAnswer(user: string, correct: string, acceptable?: string[]): boolean {
  const u = normalize(user)
  if (u === normalize(correct)) return true
  if (acceptable?.some((a) => normalize(a) === u)) return true
  return false
}

export function ChapterExercises({ exercises, level }: Props) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [feedbackByIndex, setFeedbackByIndex] = useState<Record<number, boolean>>({})
  const [stateByIndex, setStateByIndex] = useState<Record<number, QuestionState>>({})

  const total = exercises.length
  const current = exercises[index]
  const showFeedback = feedbackByIndex[index] !== undefined
  const isCorrect = !!feedbackByIndex[index]
  const qs = stateByIndex[index] ?? emptyState(current)

  const patchState = (patch: Partial<QuestionState>) => {
    setStateByIndex((prev) => ({ ...prev, [index]: { ...qs, ...patch } }))
  }

  const recordResult = (correct: boolean, userAnswerStr: string) => {
    setFeedbackByIndex((prev) => ({ ...prev, [index]: correct }))
    setResults((prev) => [...prev, { question: current, userAnswer: userAnswerStr, correct }])
  }

  const next = () => {
    if (index + 1 >= total) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (done) {
    const correctCount = results.filter((r) => r.correct).length
    const pct = Math.round((correctCount / Math.max(1, results.length)) * 100)
    let accent: "jade" | "cielo" | "maiz" | "rosa" = "rosa"
    let msg = "¡No te rajes! Repasa la lección y dale otra vez."
    if (pct >= 90) {
      accent = "jade"
      msg = "¡Eres un chingón!"
    } else if (pct >= 70) {
      accent = "cielo"
      msg = "¡Bien hecho! Sigue así."
    } else if (pct >= 50) {
      accent = "maiz"
      msg = "Vas bien — repasa los fallos."
    }

    return (
      <div className="space-y-5">
        <div className="text-center">
          <div
            className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl"
            style={{ boxShadow: `0 6px 0 var(--${accent}-500)` }}
          >
            {pct >= 70 ? "🏆" : "📚"}
          </div>
          <div className="mt-4 font-display text-4xl font-extrabold text-ink-800">{pct}%</div>
          <div className="mt-1 text-sm text-ink-500">
            {correctCount} / {results.length} correctas
          </div>
          <div className="mt-3 font-marker text-xl" style={{ color: `var(--${accent}-600)` }}>
            {msg}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => {
              setIndex(0)
              setResults([])
              setFeedbackByIndex({})
              setStateByIndex({})
              setDone(false)
            }}
          >
            Otra vez
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => (window.location.href = `/grammar/${level}`)}
          >
            Volver a capítulos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
          Pregunta {index + 1} de {total}
        </div>
        <Badge color="chili" variant="soft" size="sm">
          {current.type.replace(/_/g, " ")}
        </Badge>
      </div>
      <ProgressBar value={index} max={total} color="var(--chili-500)" height={6} />

      <div className="mt-6">
        {current.type === "multiple_choice" && (
          <MultipleChoice
            q={current}
            selected={qs.selectedOption}
            disabled={showFeedback}
            onSelect={(opt) => {
              if (showFeedback) return
              patchState({ selectedOption: opt })
              recordResult(opt === current.correctAnswer, opt)
            }}
          />
        )}
        {current.type === "fill_in_blank" && (
          <FillInBlank
            q={current}
            value={qs.textAnswer}
            disabled={showFeedback}
            onChange={(v) => patchState({ textAnswer: v })}
            onSubmit={() => {
              if (!qs.textAnswer.trim()) return
              const correct = checkAnswer(qs.textAnswer, current.correctAnswer, current.acceptableAnswers)
              recordResult(correct, qs.textAnswer)
            }}
          />
        )}
        {current.type === "sentence_reorder" && (
          <SentenceReorder
            q={current}
            placed={qs.placedWords}
            available={qs.availableWords}
            disabled={showFeedback}
            onPlace={(w, fromAvail) => {
              if (showFeedback) return
              if (fromAvail) {
                patchState({
                  availableWords: qs.availableWords.filter((x) => x !== w),
                  placedWords: [...qs.placedWords, w],
                })
              } else {
                patchState({
                  placedWords: qs.placedWords.filter((x) => x !== w),
                  availableWords: [...qs.availableWords, w],
                })
              }
            }}
            onSubmit={() => {
              const userSentence = qs.placedWords.join(" ")
              const correct = normalize(userSentence) === normalize(current.correctSentence)
              recordResult(correct, userSentence)
            }}
          />
        )}
        {current.type === "error_correction" && (
          <ErrorCorrection
            q={current}
            selectedErrorWord={qs.selectedErrorWord}
            correction={qs.correctionInput}
            disabled={showFeedback}
            onSelectError={(w) => patchState({ selectedErrorWord: w })}
            onCorrectionChange={(v) => patchState({ correctionInput: v })}
            onSubmit={() => {
              if (!qs.selectedErrorWord || !qs.correctionInput.trim()) return
              const errorOk = normalize(qs.selectedErrorWord) === normalize(current.errorWord)
              const correctionOk = checkAnswer(
                qs.correctionInput,
                current.correctedWord,
                current.acceptableCorrections,
              )
              recordResult(errorOk && correctionOk, `${qs.selectedErrorWord} → ${qs.correctionInput}`)
            }}
          />
        )}
      </div>

      {showFeedback && (
        <div
          className={`mt-5 rounded-[16px] border-2 p-4 ${
            isCorrect ? "border-jade-300 bg-jade-50" : "border-rosa-300 bg-rosa-50"
          }`}
        >
          <div
            className={`mb-1 flex items-center gap-2 font-display text-lg font-extrabold ${
              isCorrect ? "text-jade-700" : "text-rosa-700"
            }`}
          >
            {isCorrect ? <CheckIcon size={20} /> : <XIcon size={20} />}
            {isCorrect ? "¡Órale!" : "¡Ay, no!"}
          </div>
          {!isCorrect && current.type === "multiple_choice" && (
            <div className="text-sm text-ink-700">
              Correcta: <span className="font-bold">{current.correctAnswer}</span>
            </div>
          )}
          {!isCorrect && current.type === "fill_in_blank" && (
            <div className="text-sm text-ink-700">
              Correcta: <span className="font-bold">{current.correctAnswer}</span>
            </div>
          )}
          {!isCorrect && current.type === "sentence_reorder" && (
            <div className="text-sm text-ink-700">
              Correcta: <span className="font-bold">{current.correctSentence}</span>
            </div>
          )}
          {!isCorrect && current.type === "error_correction" && (
            <div className="text-sm text-ink-700">
              Error: <span className="font-bold">{current.errorWord}</span> →{" "}
              <span className="font-bold text-jade-600">{current.correctedWord}</span>
            </div>
          )}
          {(current as { explanation?: string }).explanation && (
            <div className="mt-2 text-xs italic text-ink-500">
              💡 {(current as { explanation?: string }).explanation}
            </div>
          )}
          <Button variant="primary" size="md" className="mt-4 w-full" onClick={next}>
            {index + 1 >= total ? "Ver resultados" : "Siguiente →"}
          </Button>
        </div>
      )}
    </div>
  )
}

function MultipleChoice({
  q,
  selected,
  disabled,
  onSelect,
}: {
  q: MultipleChoiceQuestion
  selected: string | null
  disabled: boolean
  onSelect: (opt: string) => void
}) {
  return (
    <div>
      <p className="font-display text-xl font-bold text-ink-800">{q.prompt}</p>
      <div className="mt-4 grid gap-2.5">
        {q.options.map((opt) => {
          const isSelected = selected === opt
          const isCorrect = disabled && opt === q.correctAnswer
          const isWrongPick = disabled && isSelected && opt !== q.correctAnswer
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt)}
              className={`rounded-[14px] border-2 p-4 text-left text-[15px] font-semibold transition-all ${
                isCorrect
                  ? "border-jade-500 bg-jade-50 text-jade-800"
                  : isWrongPick
                    ? "border-rosa-500 bg-rosa-50 text-rosa-800"
                    : isSelected
                      ? "border-chili-500 bg-chili-50 text-chili-800"
                      : "border-ink-200 bg-white text-ink-700 hover:border-chili-300"
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FillInBlank({
  q,
  value,
  disabled,
  onChange,
  onSubmit,
}: {
  q: FillInBlankQuestion
  value: string
  disabled: boolean
  onChange: (v: string) => void
  onSubmit: () => void
}) {
  const parts = q.sentenceWithBlank.split("___")
  return (
    <div>
      <p className="font-display text-xl font-bold leading-snug text-ink-800">
        {parts[0]}
        <span className="mx-1 inline-block min-w-[64px] border-b-2 border-chili-500 px-2 align-baseline text-chili-600">
          {value || "?"}
        </span>
        {parts[1]}
      </p>
      {q.hint && <div className="mt-2 text-xs italic text-ink-500">💡 {q.hint}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="mt-4 flex gap-2"
      >
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tu respuesta…"
          disabled={disabled}
          autoFocus
        />
        <Button type="submit" variant="primary" disabled={disabled || !value.trim()}>
          ¡Dale!
        </Button>
      </form>
    </div>
  )
}

function SentenceReorder({
  q,
  placed,
  available,
  disabled,
  onPlace,
  onSubmit,
}: {
  q: SentenceReorderQuestion
  placed: string[]
  available: string[]
  disabled: boolean
  onPlace: (w: string, fromAvail: boolean) => void
  onSubmit: () => void
}) {
  return (
    <div>
      <p className="font-display text-base font-bold text-ink-700">
        Ordena las palabras para formar una frase correcta:
      </p>
      {q.hint && <div className="mt-1 text-xs italic text-ink-500">💡 {q.hint}</div>}

      <div className="mt-4 min-h-[64px] rounded-[14px] border-2 border-dashed border-chili-300 bg-chili-50 p-3">
        {placed.length === 0 ? (
          <div className="flex h-12 items-center justify-center text-sm text-ink-400">
            Toca las palabras de abajo
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placed.map((w, i) => (
              <button
                key={`${w}-${i}`}
                type="button"
                disabled={disabled}
                onClick={() => onPlace(w, false)}
                className="rounded-[10px] bg-chili-500 px-3 py-2 font-bold text-white shadow-[0_2px_0_var(--chili-700)] active:translate-y-0.5"
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {available.map((w, i) => (
          <button
            key={`${w}-${i}`}
            type="button"
            disabled={disabled}
            onClick={() => onPlace(w, true)}
            className="rounded-[10px] border-2 border-ink-200 bg-white px-3 py-2 font-bold text-ink-700 hover:border-chili-300 hover:text-chili-700 active:translate-y-0.5"
          >
            {w}
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        size="md"
        className="mt-5 w-full"
        disabled={disabled || available.length > 0}
        onClick={onSubmit}
      >
        ¡Dale!
      </Button>
    </div>
  )
}

function ErrorCorrection({
  q,
  selectedErrorWord,
  correction,
  disabled,
  onSelectError,
  onCorrectionChange,
  onSubmit,
}: {
  q: ErrorCorrectionQuestion
  selectedErrorWord: string | null
  correction: string
  disabled: boolean
  onSelectError: (w: string) => void
  onCorrectionChange: (v: string) => void
  onSubmit: () => void
}) {
  const words = q.sentenceWithError.split(/\s+/)
  return (
    <div>
      <p className="font-display text-base font-bold text-ink-700">
        Encuentra el error y corrígelo:
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {words.map((w, i) => {
          const cleaned = w.replace(/[.,!?¿¡]/g, "")
          const isSelected = selectedErrorWord === cleaned
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelectError(cleaned)}
              className={`rounded-[10px] px-3 py-2 font-display text-base font-bold transition-all ${
                isSelected
                  ? "bg-rosa-500 text-white shadow-[0_2px_0_var(--rosa-700)]"
                  : "border-2 border-ink-200 bg-white text-ink-700 hover:border-rosa-300"
              }`}
            >
              {w}
            </button>
          )
        })}
      </div>

      {selectedErrorWord && (
        <div className="mt-5">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">
            Corrección para «{selectedErrorWord}»
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            className="mt-2 flex gap-2"
          >
            <Input
              value={correction}
              onChange={(e) => onCorrectionChange(e.target.value)}
              placeholder="Palabra correcta…"
              disabled={disabled}
              autoFocus
            />
            <Button type="submit" variant="primary" disabled={disabled || !correction.trim()}>
              ¡Dale!
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
