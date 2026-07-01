"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlayIcon } from "@/components/ui/icons"

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const
const LEVEL_COLOR: Record<string, "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda"> = {
  A1: "chili", A2: "jade", B1: "cielo", B2: "maiz", C1: "jacaranda", C2: "rosa",
}

export function EscuchaPicker() {
  const router = useRouter()
  const [level, setLevel] = useState<string>("A1")
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = () => {
    setIsLoading(true)
    sessionStorage.setItem("escuchaSettings", JSON.stringify({ level: level.toLowerCase() }))
    router.push("/exercises/escucha/play")
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cielo-500 text-3xl shadow-[0_4px_0_var(--cielo-700)]">
            🎧
          </div>
        </div>
        <div className="mb-8 text-center">
          <div className="font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-[44px]">
            Escucha y comprende
          </div>
          <div className="mt-2 text-[15px] text-ink-500">
            Escucha la frase en español y elige lo que significa
          </div>
        </div>

        <div className="rounded-[24px] border border-ink-100 bg-white p-7 shadow-md md:p-8">
          <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-600">
            Nivel CEFR
          </div>
          <div className="flex flex-wrap gap-2">
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

          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={isLoading}
            className="mt-7 w-full"
          >
            <PlayIcon size={18} />
            {isLoading ? "Cocinando…" : "¡Dale! Empezar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
