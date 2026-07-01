"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { listWritingPrompts } from "@chingon/shared"

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const
const LEVEL_COLOR: Record<string, "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda"> = {
  A1: "chili", A2: "jade", B1: "cielo", B2: "maiz", C1: "jacaranda", C2: "rosa",
}

export function EscrituraPicker() {
  const router = useRouter()
  const [level, setLevel] = useState<string>("A1")

  const prompts = listWritingPrompts(level)

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-jacaranda-500 text-3xl shadow-[0_4px_0_var(--jacaranda-700)]">
            ✍️
          </div>
        </div>
        <div className="mb-8 text-center">
          <div className="font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-[44px]">
            Escritura
          </div>
          <div className="mt-2 text-[15px] text-ink-500">
            Escoge un tema · escribe · la AI te corrige
          </div>
        </div>

        {/* Level chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {LEVELS.map((l) => {
            const active = level === l
            const color = LEVEL_COLOR[l]
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`flex h-12 flex-1 min-w-[72px] items-center justify-center rounded-[12px] border-2 font-display text-base font-extrabold transition-all ${
                  active ? "text-white shadow-[0_3px_0_rgba(0,0,0,0.2)]" : "border-ink-200 bg-white text-ink-400"
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

        {/* Chapter / prompt list */}
        <div className="space-y-3">
          {prompts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                router.push(`/exercises/escritura/play?level=${p.level}&chapter=${p.chapterId}`)
              }
              className="group flex w-full items-center gap-4 rounded-[20px] border border-ink-100 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-jacaranda-50 font-display text-lg font-extrabold text-jacaranda-600">
                {p.chapterId + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-bold tracking-tight text-ink-800">
                  {p.chapterTitle}
                </div>
                <div className="mt-0.5 text-xs text-ink-500">
                  Mínimo {p.minWords} palabras
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
