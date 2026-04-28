import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LockIcon } from "@/components/ui/icons"
import { getVocabList } from "@chingon/shared"
import { VocabListClient } from "./VocabListClient"

const LEVEL_COLOR: Record<string, "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda"> = {
  A1: "chili", A2: "jade", B1: "cielo", B2: "maiz", C1: "jacaranda", C2: "rosa",
}

const POS_COLOR: Record<string, "chili" | "jade" | "cielo" | "jacaranda" | "maiz" | "rosa" | "ink"> = {
  n: "chili",
  v: "jade",
  adj: "cielo",
  adv: "maiz",
  pron: "jacaranda",
  prep: "ink",
  conj: "ink",
  num: "rosa",
  art: "ink",
  interj: "rosa",
  phrase: "rosa",
}

const POS_LABEL: Record<string, string> = {
  n: "sustantivo",
  v: "verbo",
  adj: "adjetivo",
  adv: "adverbio",
  pron: "pronombre",
  prep: "preposición",
  conj: "conjunción",
  num: "número",
  art: "artículo",
  interj: "interjección",
  phrase: "frase",
}

const FREE_LEVELS = new Set(["a1", "a2"])

export default async function VocabListLevelPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
  const list = getVocabList(level)
  if (!list) notFound()

  const family = LEVEL_COLOR[list.level]
  const isFree = FREE_LEVELS.has(level.toLowerCase())

  // Premium gate stub: in production, check user subscription via Supabase profile.
  // For now we let A1+A2 through and show a soft paywall on B1+.
  if (!isFree) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/vocabulary/lists"
            className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-wider">Volver a niveles</span>
          </Link>
          <div className="rounded-[24px] border-2 border-maiz-300 bg-maiz-50 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maiz-400 text-white shadow-[0_4px_0_var(--maiz-600)]">
              <LockIcon size={28} />
            </div>
            <div className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-800">
              {list.title} es Premium
            </div>
            <div className="mt-2 text-sm text-ink-600">
              {list.wordCount > 0
                ? `${list.wordCount} palabras esperando para ti.`
                : "Próximamente — estamos curando esta lista."}
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

  if (list.wordCount === 0) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/vocabulary/lists"
            className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-wider">Volver</span>
          </Link>
          <div className="rounded-[20px] border-2 border-dashed border-ink-200 bg-card p-8 text-center">
            <div className="text-3xl">🌶</div>
            <div className="mt-3 font-display text-lg font-bold text-ink-800">Próximamente</div>
            <div className="mt-1 text-sm text-ink-500">
              Esta lista todavía está en preparación.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/vocabulary/lists"
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver a niveles</span>
        </Link>

        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge color={family} variant="solid" size="lg">
              CEFR {list.level}
            </Badge>
            <h1 className="mt-3 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
              {list.title}
            </h1>
            <p className="mt-3 text-base text-ink-500">
              {list.wordCount} palabras · ordenadas por frecuencia
            </p>
          </div>
        </div>

        <VocabListClient
          words={list.words}
          posLabel={POS_LABEL}
          posColor={POS_COLOR}
        />
      </div>
    </div>
  )
}
