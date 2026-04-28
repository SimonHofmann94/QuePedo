"use client"

import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress"
import { LockIcon } from "@/components/ui/icons"
import { TalaveraTile } from "@/components/ui/motifs"

const LEVELS = [
  { code: "A1", label: "Principiante", desc: "Saludos, verbos regulares, pronombres", progress: 100, state: "done", color: "var(--chili-500)" },
  { code: "A2", label: "Elemental",   desc: "Pretérito, futuro, objetos directos",  progress: 62,  state: "current", color: "var(--jade-500)" },
  { code: "B1", label: "Intermedio",  desc: "Subjuntivo, condicional, por/para",    progress: 0,   state: "locked", color: "var(--cielo-500)" },
  { code: "B2", label: "Alto",        desc: "Subjuntivo imperfecto, voz pasiva",     progress: 0,   state: "locked", color: "var(--maiz-400)" },
  { code: "C1", label: "Avanzado",    desc: "Matices, registros, expresiones",        progress: 0,   state: "locked", color: "var(--jacaranda-500)" },
  { code: "C2", label: "Maestría",    desc: "Fluidez nativa, literatura, dialectos", progress: 0,   state: "locked", color: "var(--rosa-500)" },
] as const

const LEVEL_BADGE = {
  A1: "chili", A2: "jade", B1: "cielo", B2: "maiz", C1: "jacaranda", C2: "rosa",
} as const

export default function GrammarPage() {
  const userLevel = "A2"

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
              Tu ruta
            </div>
            <div className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
              Gramática
            </div>
            <div className="mt-2 max-w-xl text-[15px] text-ink-500">
              Del «hola» al «me cae re gordo» · 6 niveles · CEFR oficial
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-400">
              Nivel actual
            </div>
            <div className="font-display text-5xl font-extrabold leading-none tracking-tight text-jade-500">
              {userLevel}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((l, i) => {
            const locked = l.state === "locked"
            const current = l.state === "current"
            const done = l.state === "done"
            const prevCode = i > 0 ? LEVELS[i - 1].code : null
            return (
              <div
                key={l.code}
                className={`relative min-h-[240px] overflow-hidden rounded-[20px] p-7 ${
                  locked
                    ? "border border-ink-100 bg-ink-50 opacity-60"
                    : current
                      ? "border-[3px] bg-white shadow-[0_6px_0_var(--jade-500)]"
                      : "border border-ink-100 bg-white shadow-sm"
                }`}
                style={current ? { borderColor: l.color } : undefined}
              >
                {!locked && (
                  <div className="pointer-events-none absolute -right-8 -top-8 opacity-[0.08]">
                    <TalaveraTile size={120} />
                  </div>
                )}
                <div className="relative mb-5 flex items-start justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-[16px] font-display text-2xl font-extrabold text-white"
                    style={{
                      background: locked ? "var(--ink-200)" : l.color,
                      boxShadow: locked ? "none" : "0 4px 0 rgba(0,0,0,.15)",
                    }}
                  >
                    {locked ? <LockIcon size={22} /> : l.code}
                  </div>
                  {done && (
                    <Badge color="jade" variant="solid" size="sm">
                      ✓ Completo
                    </Badge>
                  )}
                  {current && (
                    <Badge color="maiz" variant="solid" size="sm">
                      ⚡ Ahora
                    </Badge>
                  )}
                </div>
                <div className="font-display text-2xl font-bold tracking-tight text-ink-800">
                  Nivel {l.code}
                </div>
                <div className="mt-1 text-sm font-semibold text-ink-600">{l.label}</div>
                <div className="mt-2 text-xs leading-snug text-ink-500">{l.desc}</div>
                {!locked ? (
                  <div className="mt-4">
                    <ProgressBar value={l.progress} color={l.color} height={8} />
                    <div className="mt-1.5 font-mono text-[10px] font-semibold text-ink-500">
                      {l.progress}% ·{" "}
                      {l.progress === 100 ? "¡ya lo dominas!" : current ? "sigue así" : ""}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 font-mono text-[11px] font-semibold text-ink-500">
                    Completa {prevCode} primero
                  </div>
                )}
                {/* CEFR family-tag pill bottom-left for color reinforcement */}
                <div className="absolute bottom-4 left-7">
                  <Badge color={LEVEL_BADGE[l.code]} variant="soft" size="sm">
                    CEFR {l.code}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
