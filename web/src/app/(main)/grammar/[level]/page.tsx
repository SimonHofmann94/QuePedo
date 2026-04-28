import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LockIcon } from "@/components/ui/icons"
import { getGrammarLevel } from "@chingon/shared"
import { isFreeGrammarLevel, isUserPremium } from "@/lib/premium"

const LEVEL_TITLES: Record<string, string> = {
  a1: "A1 — Principiante",
  a2: "A2 — Elemental",
  b1: "B1 — Intermedio",
  b2: "B2 — Alto",
  c1: "C1 — Avanzado",
  c2: "C2 — Maestría",
}

const LEVEL_COLOR: Record<string, "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda"> = {
  a1: "chili",
  a2: "jade",
  b1: "cielo",
  b2: "maiz",
  c1: "jacaranda",
  c2: "rosa",
}

const LEVEL_HEX: Record<string, string> = {
  a1: "var(--chili-500)",
  a2: "var(--jade-500)",
  b1: "var(--cielo-500)",
  b2: "var(--maiz-400)",
  c1: "var(--jacaranda-500)",
  c2: "var(--rosa-500)",
}

export default async function GrammarLevelPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
  const data = getGrammarLevel(level)
  if (!data) notFound()

  const color = LEVEL_HEX[level.toLowerCase()] ?? "var(--chili-500)"
  const family = LEVEL_COLOR[level.toLowerCase()] ?? "chili"
  const title = LEVEL_TITLES[level.toLowerCase()] ?? level.toUpperCase()

  // Premium gate: A1+A2 always free; B1+ requires premium or admin
  if (!isFreeGrammarLevel(level)) {
    const premium = await isUserPremium()
    if (!premium) {
      return (
        <div className="p-6 md:p-10">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/grammar"
              className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">
                Volver a niveles
              </span>
            </Link>
            <div className="rounded-[24px] border-2 border-maiz-300 bg-maiz-50 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maiz-400 text-white shadow-[0_4px_0_var(--maiz-600)]">
                <LockIcon size={28} />
              </div>
              <div className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-800">
                {title} es Premium
              </div>
              <div className="mt-2 text-sm text-ink-600">
                {data.chapters.length} capítulos esperándote · ejercicios + lecciones completas.
              </div>
              <Link
                href="/profile"
                className="mt-6 inline-flex items-center justify-center rounded-[14px] bg-chili-500 px-6 py-3 font-display text-sm font-bold text-white shadow-[0_4px_0_var(--chili-700)] active:translate-y-1 active:shadow-none"
              >
                ¡Dale! Hazte Premium →
              </Link>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/grammar"
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver a niveles</span>
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge color={family} variant="solid" size="lg">
              CEFR {level.toUpperCase()}
            </Badge>
            <h1 className="mt-3 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-base text-ink-500">
              {data.chapters.length} capítulos · domina paso a paso
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {data.chapters.map((chapter, idx) => (
            <Link
              key={chapter.id}
              href={`/grammar/${level.toLowerCase()}/${chapter.id}`}
              className="group flex items-center gap-4 rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] font-display text-xl font-extrabold text-white"
                style={{ background: color, boxShadow: "0 4px 0 rgba(0,0,0,.15)" }}
              >
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg font-bold leading-tight tracking-tight text-ink-800">
                  {chapter.title}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-500">
                  {chapter.sections.length}{" "}
                  {chapter.sections.length === 1 ? "sección" : "secciones"}
                </div>
              </div>
              <span className="text-xl text-ink-400 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
