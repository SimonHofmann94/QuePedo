"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mic } from "lucide-react"
import { getGrammarLevel } from "@chingon/shared"

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const
const LEVEL_COLOR: Record<string, string> = {
  A1: "chili", A2: "jade", B1: "cielo", B2: "maiz", C1: "jacaranda", C2: "rosa",
}

export function SpeakingPicker() {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState<(typeof LEVELS)[number]>("A1")
  const levelData = getGrammarLevel(selectedLevel)

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/exercises"
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver a ejercicios</span>
        </Link>

        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-rosa-500 text-white shadow-[0_4px_0_var(--rosa-700)]">
            <Mic className="h-6 w-6" />
          </div>
          <h1 className="font-display text-[34px] font-extrabold leading-none tracking-tight text-ink-800 md:text-[40px]">
            Práctica de habla
          </h1>
        </div>
        <p className="mb-7 text-[15px] text-ink-500">
          Escoge un nivel y un capítulo para practicar tu pronunciación.
        </p>

        {/* Level chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {LEVELS.map((l) => {
            const active = selectedLevel === l
            const color = LEVEL_COLOR[l]
            return (
              <button
                key={l}
                type="button"
                onClick={() => setSelectedLevel(l)}
                className={`rounded-full border-2 px-5 py-2.5 font-display text-sm font-extrabold transition-all ${
                  active ? "text-white" : "border-ink-200 bg-white text-ink-400"
                }`}
                style={active ? { background: `var(--${color}-500)`, borderColor: `var(--${color}-500)` } : undefined}
              >
                {l}
              </button>
            )
          })}
        </div>

        {/* Chapter list */}
        <div className="grid gap-3 md:grid-cols-2">
          {levelData?.chapters.map((chapter, idx) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() =>
                router.push(`/exercises/speaking/play?level=${selectedLevel.toLowerCase()}&chapter=${chapter.id}`)
              }
              className="group flex items-center gap-4 rounded-[20px] border border-ink-100 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-surface-bg font-mono text-sm font-bold text-ink-500">
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-bold leading-tight tracking-tight text-ink-800">
                  {chapter.title}
                </div>
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-500">
                  {chapter.sections.length} {chapter.sections.length === 1 ? "sección" : "secciones"}
                </div>
              </div>
              <span className="text-xl text-ink-400 transition-transform group-hover:translate-x-1">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
