import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress"
import { LockIcon } from "@/components/ui/icons"
import { getAllVocabLevels } from "@chingon/shared"

const LEVEL_COLOR: Record<string, "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda"> = {
  A1: "chili", A2: "jade", B1: "cielo", B2: "maiz", C1: "jacaranda", C2: "rosa",
}

const LEVEL_HEX: Record<string, string> = {
  A1: "var(--chili-500)",
  A2: "var(--jade-500)",
  B1: "var(--cielo-500)",
  B2: "var(--maiz-400)",
  C1: "var(--jacaranda-500)",
  C2: "var(--rosa-500)",
}

const LEVEL_DESC: Record<string, string> = {
  A1: "Saludos, números, familia, presente",
  A2: "Pasado, viajes, restaurante, descripciones",
  B1: "Subjuntivo, condicional, abstractos",
  B2: "Negocios, política, sentimientos complejos",
  C1: "Matices, registros, expresiones idiomáticas",
  C2: "Literatura, dialectos, fluidez nativa",
}

// MVP: A1 + A2 free as teaser, B1+ premium
const FREE_LEVELS = new Set(["A1", "A2"])

export default function VocabListsPage() {
  const lists = getAllVocabLevels()

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/vocabulary"
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver al cuaderno</span>
        </Link>

        <div className="mb-8">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
            Vocab base · 6 niveles
          </div>
          <h1 className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
            Listas de vocabulario
          </h1>
          <p className="mt-3 max-w-xl text-base text-ink-500">
            Las palabras más usadas del español, organizadas por nivel CEFR.
            Empieza con A1 y avanza hasta C2 — añade las palabras a tu cuaderno con un toque.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {lists.map((list) => {
            const isFree = FREE_LEVELS.has(list.level)
            const family = LEVEL_COLOR[list.level]
            const color = LEVEL_HEX[list.level]
            const empty = list.wordCount === 0
            const cardClass = `relative block overflow-hidden rounded-[20px] border p-6 transition-shadow ${
              empty
                ? "border-ink-100 bg-ink-50 opacity-70"
                : isFree
                  ? "border-ink-100 bg-white shadow-sm hover:shadow-md"
                  : "border-ink-100 bg-white shadow-sm hover:shadow-md"
            }`
            const Inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-[16px] font-display text-xl font-extrabold text-white"
                    style={{
                      background: empty ? "var(--ink-200)" : color,
                      boxShadow: empty ? "none" : "0 4px 0 rgba(0,0,0,.15)",
                    }}
                  >
                    {list.level}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color={family} variant="soft" size="sm">
                      {list.wordCount} palabras
                    </Badge>
                    {!isFree && !empty && (
                      <Badge color="maiz" variant="solid" size="sm">
                        <LockIcon size={12} /> Premium
                      </Badge>
                    )}
                    {empty && (
                      <Badge color="ink" variant="soft" size="sm">
                        Próximamente
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4 font-display text-2xl font-bold tracking-tight text-ink-800">
                  {list.title}
                </div>
                <div className="mt-1 text-sm text-ink-500">{LEVEL_DESC[list.level]}</div>
                {!empty && (
                  <div className="mt-4">
                    <ProgressBar value={0} max={list.wordCount} color={color} height={6} />
                    <div className="mt-1.5 font-mono text-[11px] font-semibold text-ink-500">
                      0 / {list.wordCount} dominadas
                    </div>
                  </div>
                )}
              </>
            )
            if (empty) return <div key={list.level} className={cardClass}>{Inner}</div>
            return (
              <Link
                key={list.level}
                href={`/vocabulary/lists/${list.level.toLowerCase()}`}
                className={cardClass}
              >
                {Inner}
              </Link>
            )
          })}
        </div>

        <div className="mt-8 rounded-[16px] border border-ink-100 bg-masa-50 p-4 font-mono text-[11px] text-ink-500">
          <div className="font-bold text-ink-700">Atribución</div>
          <div className="mt-1">
            Listas basadas en el corpus de frecuencias de{" "}
            <a
              href="https://github.com/doozan/spanish_data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chili-600 underline"
            >
              doozan/spanish_data
            </a>{" "}
            (CC-BY-4.0), curado y traducido para los niveles CEFR.
          </div>
        </div>
      </div>
    </div>
  )
}
