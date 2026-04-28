"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlayIcon } from "@/components/ui/icons"

type QuizType = "term_to_translation" | "translation_to_term"

interface QuizSettings {
  wordCount: number
  difficulty: number[]
  level: string[]
  quizType: QuizType
  showContext: boolean
  showTags: boolean
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const
const LEVEL_COLOR: Record<string, "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda"> = {
  A1: "chili", A2: "jade", B1: "cielo", B2: "maiz", C1: "jacaranda", C2: "rosa",
}

export default function QuizSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<QuizSettings>({
    wordCount: 10,
    difficulty: [1, 2, 3, 4, 5],
    level: ["A1", "A2", "B1", "B2"],
    quizType: "term_to_translation",
    showContext: true,
    showTags: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const toggleDifficulty = (d: number) =>
    setSettings((p) => ({
      ...p,
      difficulty: p.difficulty.includes(d) ? p.difficulty.filter((x) => x !== d) : [...p.difficulty, d],
    }))

  const toggleLevel = (l: string) =>
    setSettings((p) => ({
      ...p,
      level: p.level.includes(l) ? p.level.filter((x) => x !== l) : [...p.level, l],
    }))

  const handleStart = () => {
    setIsLoading(true)
    sessionStorage.setItem("quizSettings", JSON.stringify(settings))
    router.push("/exercises/quiz/play")
  }

  const sliderPct = ((settings.wordCount - 5) / (50 - 5)) * 100

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chili-500 text-3xl shadow-[0_4px_0_var(--chili-700)]">
            🎯
          </div>
        </div>
        <div className="mb-8 text-center">
          <div className="font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-[44px]">
            Configura tu quiz
          </div>
          <div className="mt-2 text-[15px] text-ink-500">
            Ajústalo a tu mood · dale cuando estés listo
          </div>
        </div>

        <div className="rounded-[24px] border border-ink-100 bg-white p-7 shadow-md md:p-8">
          {/* Word count slider */}
          <Section label="Número de palabras" right={
            <span className="font-display text-3xl font-extrabold leading-none text-chili-500">
              {settings.wordCount}
            </span>
          }>
            <div className="relative mt-2 h-3.5 rounded-full bg-ink-100">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-chili-500 shadow-[inset_0_-3px_0_var(--chili-700)]"
                style={{ width: `${sliderPct}%` }}
              />
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={settings.wordCount}
                onChange={(e) => setSettings((p) => ({ ...p, wordCount: parseInt(e.target.value) }))}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
              />
              <div
                className="pointer-events-none absolute -top-1 h-[22px] w-[22px] -translate-x-1/2 rounded-full border-[3px] border-chili-500 bg-white shadow-sm"
                style={{ left: `${sliderPct}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-ink-400">
              <span>5</span>
              <span>25</span>
              <span>50</span>
            </div>
          </Section>

          {/* Difficulty */}
          <Section label="Dificultad">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = settings.difficulty.includes(n)
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggleDifficulty(n)}
                    className={`flex h-12 flex-1 items-center justify-center gap-1 rounded-[12px] border-2 font-display text-lg font-extrabold transition-all ${
                      active
                        ? "border-chili-500 bg-chili-500 text-white shadow-[0_3px_0_var(--chili-700)]"
                        : "border-ink-200 bg-white text-ink-500"
                    }`}
                  >
                    {Array.from({ length: n }).map((_, i) => (
                      <span key={i} style={{ opacity: active ? 1 : 0.4 }}>🌶</span>
                    ))}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* CEFR */}
          <Section label="Nivel CEFR">
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => {
                const active = settings.level.includes(l)
                const color = LEVEL_COLOR[l]
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggleLevel(l)}
                    className={`flex h-12 flex-1 min-w-[72px] items-center justify-center rounded-[12px] border-2 font-display text-base font-extrabold transition-all ${
                      active
                        ? `text-white shadow-[0_3px_0_rgba(0,0,0,0.2)] bg-${color}-500 border-${color}-500`
                        : "border-ink-200 bg-white text-ink-400"
                    }`}
                    style={
                      active
                        ? { background: `var(--${color}-500)`, borderColor: `var(--${color}-500)` }
                        : undefined
                    }
                  >
                    {l}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Direction */}
          <Section label="Dirección del quiz">
            <div className="grid grid-cols-2 gap-2.5">
              <DirectionTile
                active={settings.quizType === "term_to_translation"}
                onClick={() => setSettings((p) => ({ ...p, quizType: "term_to_translation" }))}
                title="ES → DE"
                sub="Ves español, escribes alemán"
              />
              <DirectionTile
                active={settings.quizType === "translation_to_term"}
                onClick={() => setSettings((p) => ({ ...p, quizType: "translation_to_term" }))}
                title="DE → ES"
                sub="Ves alemán, escribes español"
              />
            </div>
          </Section>

          {/* Options */}
          <Section label="Opciones">
            <div className="space-y-3">
              <CheckRow
                checked={settings.showContext}
                onChange={(v) => setSettings((p) => ({ ...p, showContext: v }))}
                label="Mostrar frases de contexto como pistas"
              />
              <CheckRow
                checked={settings.showTags}
                onChange={(v) => setSettings((p) => ({ ...p, showTags: v }))}
                label="Mostrar etiquetas de palabras"
              />
            </div>
          </Section>

          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={isLoading || settings.difficulty.length === 0 || settings.level.length === 0}
            className="w-full"
          >
            <PlayIcon size={18} />
            {isLoading ? "Cocinando…" : "¡Dale! Empezar quiz"}
          </Button>
        </div>

        {settings.difficulty.length === 0 && (
          <div className="mt-3 text-center text-xs font-semibold text-rosa-600">
            Selecciona al menos una dificultad
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  label,
  right,
  children,
}: {
  label: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mb-7">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-600">
          {label}
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

function DirectionTile({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean
  onClick: () => void
  title: string
  sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[14px] p-4 text-left transition-all ${
        active
          ? "border-2 border-chili-500 bg-chili-50 shadow-[0_3px_0_var(--chili-300)]"
          : "border-2 border-ink-200 bg-white"
      }`}
    >
      <div className={`font-display text-lg font-bold ${active ? "text-chili-700" : "text-ink-700"}`}>
        {title}
      </div>
      <div className="mt-0.5 text-xs text-ink-500">{sub}</div>
    </button>
  )
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 font-body text-sm text-ink-700">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`flex h-[22px] w-[22px] items-center justify-center rounded-md border-2 transition-all ${
          checked
            ? "border-chili-500 bg-chili-500 shadow-[0_2px_0_var(--chili-700)]"
            : "border-ink-300 bg-white"
        }`}
      >
        {checked && (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {label}
    </label>
  )
}
