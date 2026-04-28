"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AddVocabForm } from "@/components/features/vocabulary/AddVocabForm"
import { AIGenerator } from "@/components/features/vocabulary/AIGenerator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Segment } from "@/components/ui/segment"
import { ProgressBar } from "@/components/ui/progress"
import {
  PlusIcon,
  SparkleIcon,
  SearchIcon,
} from "@/components/ui/icons"
import { Trash2 } from "lucide-react"
import {
  getUserVocabulary,
  deleteMultipleVocabulary,
} from "@/actions/vocabulary"
import { UserVocabulary } from "@/types/schemas"

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const
type Level = (typeof LEVELS)[number]
type ColorFamily = "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda" | "ink"

const LEVEL_COLOR: Record<Level, ColorFamily> = {
  A1: "chili",
  A2: "jade",
  B1: "cielo",
  B2: "maiz",
  C1: "jacaranda",
  C2: "rosa",
}

const TAG_COLOR: Record<string, ColorFamily> = {
  slang: "jacaranda",
  idiom: "rosa",
  noun: "chili",
  verb: "jade",
  adj: "cielo",
  adjective: "cielo",
  adverb: "maiz",
}

function pickTagColor(tag?: string): ColorFamily {
  if (!tag) return "ink"
  return TAG_COLOR[tag.toLowerCase()] ?? "ink"
}

function levelFromDifficulty(d: number): Level {
  // Map 1–5 to A1–C2
  return (["A1", "A2", "B1", "B2", "C1"][Math.max(0, Math.min(4, d - 1))] as Level)
}

function getDisplayTranslation(translations: Record<string, string>): string {
  if (!translations || typeof translations !== "object") return ""
  if (translations.de) return translations.de
  if (translations.en) return translations.en
  const keys = Object.keys(translations)
  return keys.length > 0 ? translations[keys[0]] : ""
}

function translationsMatch(translations: Record<string, string>, search: string): boolean {
  if (!translations || typeof translations !== "object") return false
  return Object.values(translations).some((t) =>
    t.toLowerCase().includes(search.toLowerCase()),
  )
}

type Filter = "all" | "new" | "review" | "mastered"

export default function VocabularyPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [vocab, setVocab] = useState<UserVocabulary[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [activeLevels, setActiveLevels] = useState<Set<Level>>(new Set())
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    getUserVocabulary().then(setVocab)
  }, [])

  const filtered = vocab.filter((item) => {
    if (
      search &&
      !item.term.toLowerCase().includes(search.toLowerCase()) &&
      !translationsMatch(item.translations, search)
    ) {
      return false
    }
    if (activeLevels.size > 0) {
      if (!activeLevels.has(levelFromDifficulty(item.difficulty_rating))) return false
    }
    return true
  })

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    setIsDeleting(true)
    try {
      const result = await deleteMultipleVocabulary(Array.from(selectedIds))
      if (result.success) {
        setSelectedIds(new Set())
        const newVocab = await getUserVocabulary()
        setVocab(newVocab)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleLevel = (l: Level) => {
    setActiveLevels((prev) => {
      const next = new Set(prev)
      if (next.has(l)) next.delete(l)
      else next.add(l)
      return next
    })
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
              Tu cuaderno
            </div>
            <div className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
              {vocab.length} palabras
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <SparkleIcon size={16} />
                  AI generar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    Generar vocabulario
                  </DialogTitle>
                </DialogHeader>
                <AIGenerator
                  onSuccess={() => {
                    setIsAiOpen(false)
                    getUserVocabulary().then(setVocab)
                  }}
                />
              </DialogContent>
            </Dialog>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="primary">
                  <PlusIcon size={16} />
                  Añadir palabra
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Nueva palabra</DialogTitle>
                </DialogHeader>
                <AddVocabForm
                  onSuccess={() => {
                    setIsAddOpen(false)
                    getUserVocabulary().then(setVocab)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search + Segment */}
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative min-w-[280px] flex-1">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <Input
              placeholder="Buscar en vocabulario…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Segment<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "Todas" },
              { value: "new", label: "Nuevas" },
              { value: "review", label: "Repaso" },
              { value: "mastered", label: "Dominadas" },
            ]}
          />
        </div>

        {/* Level filter row */}
        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          {LEVELS.map((l) => {
            const active = activeLevels.has(l)
            return (
              <button key={l} type="button" onClick={() => toggleLevel(l)}>
                <Badge color={LEVEL_COLOR[l]} variant={active ? "solid" : "outline"}>
                  {l}
                </Badge>
              </button>
            )
          })}
          <div className="flex-1" />
          <div className="font-mono text-[11px] text-ink-500">
            Mostrando {filtered.length} de {vocab.length}
          </div>
        </div>

        {/* Word grid */}
        {filtered.length === 0 ? (
          <div className="rounded-[20px] border-2 border-dashed border-ink-200 bg-card p-12 text-center">
            <div className="text-4xl">🌶</div>
            <div className="mt-3 font-display text-xl font-bold text-ink-800">
              Tu cuaderno está vacío
            </div>
            <div className="mt-1 text-sm text-ink-500">
              Añade tu primera palabra o pídele a la IA que te genere unas.
            </div>
          </div>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((w) => {
              const level = levelFromDifficulty(w.difficulty_rating)
              const tag = w.tags?.[0]
              return (
                <div
                  key={w.id}
                  className="relative overflow-hidden rounded-[16px] border border-ink-100 bg-white p-4.5 shadow-sm"
                  style={{ padding: 18 }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: `var(--${LEVEL_COLOR[level]}-500)` }}
                  />
                  <div className="mb-2 flex items-start justify-between">
                    {tag ? (
                      <Badge color={pickTagColor(tag)} variant="soft" size="sm">
                        {tag}
                      </Badge>
                    ) : (
                      <span />
                    )}
                    <div className="font-mono text-[9px] font-bold text-ink-400">{level}</div>
                  </div>
                  <div className="font-display text-[26px] font-bold leading-tight tracking-tight text-ink-800">
                    {w.term}
                  </div>
                  <div className="mt-1 text-[13px] text-ink-500">
                    {getDisplayTranslation(w.translations)}
                  </div>
                  {w.context_sentence && (
                    <div className="mt-1 text-[11px] italic text-ink-400">
                      «{w.context_sentence}»
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1">
                      <ProgressBar
                        value={(w.difficulty_rating / 5) * 100}
                        color="var(--jade-500)"
                        height={4}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIds(new Set([w.id]))
                        handleDeleteSelected()
                      }}
                      aria-label="Borrar"
                      className="rounded-md p-1.5 text-ink-400 transition-colors hover:bg-rosa-50 hover:text-rosa-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {selectedIds.size > 1 && (
          <div className="mt-6 flex items-center gap-3">
            <Button variant="danger" onClick={handleDeleteSelected} disabled={isDeleting}>
              {isDeleting ? "Borrando…" : `Borrar (${selectedIds.size})`}
            </Button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-ink-400 hover:text-ink-700"
            >
              Limpiar selección
            </button>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-6">
          <Link
            href="/vocabulary/lists"
            className="font-mono text-xs uppercase tracking-wider text-chili-600 hover:underline"
          >
            Listas CEFR (A1–C2) →
          </Link>
          <Link
            href="/vocabulary/browser"
            className="font-mono text-xs uppercase tracking-wider text-ink-500 hover:underline"
          >
            Ver mi cuaderno completo →
          </Link>
        </div>
      </div>
    </div>
  )
}
