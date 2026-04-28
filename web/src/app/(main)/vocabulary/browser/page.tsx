"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Filter as FilterIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchIcon } from "@/components/ui/icons"
import {
  getUserVocabulary,
  deleteMultipleVocabulary,
} from "@/actions/vocabulary"
import { UserVocabulary } from "@/types/schemas"

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

const LEVEL_COLOR = {
  A1: "chili",
  A2: "jade",
  B1: "cielo",
  B2: "maiz",
  C1: "jacaranda",
  C2: "rosa",
} as const

function levelFromDifficulty(d: number): Level {
  return (["A1", "A2", "B1", "B2", "C1"][Math.max(0, Math.min(4, d - 1))] as Level)
}

function getDisplay(translations: Record<string, string>): string {
  if (translations?.de) return translations.de
  if (translations?.en) return translations.en
  const k = Object.keys(translations || {})
  return k.length > 0 ? translations[k[0]] : ""
}

function translationsMatch(translations: Record<string, string>, search: string): boolean {
  if (!translations || typeof translations !== "object") return false
  return Object.values(translations).some((t) =>
    t.toLowerCase().includes(search.toLowerCase()),
  )
}

export default function VocabularyBrowserPage() {
  const router = useRouter()
  const [vocab, setVocab] = useState<UserVocabulary[]>([])
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [difficultyFilter, setDifficultyFilter] = useState<number[]>([1, 2, 3, 4, 5])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    getUserVocabulary().then((data) => {
      setVocab(data)
      setIsLoading(false)
    })
  }, [])

  const filtered = vocab.filter((item) => {
    const s = search.toLowerCase()
    const matchesSearch =
      !s ||
      item.term.toLowerCase().includes(s) ||
      translationsMatch(item.translations, s) ||
      item.synonyms?.some((x) => x.toLowerCase().includes(s)) ||
      item.tags?.some((x) => x.toLowerCase().includes(s))
    const matchesDifficulty = difficultyFilter.includes(item.difficulty_rating || 1)
    return matchesSearch && matchesDifficulty
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

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === filtered.length) return new Set()
      return new Set(filtered.map((v) => v.id))
    })
  }

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDifficulty = (d: number) => {
    setDifficultyFilter((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-chili-500" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/vocabulary")}
            className="flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-wider">Volver</span>
          </button>
          <h1 className="font-display text-2xl font-bold text-ink-800 md:text-3xl">
            Cuaderno completo
          </h1>
        </div>

        {/* Search + filter */}
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[280px] flex-1">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <Input
              placeholder="Buscar por término, traducción, sinónimo o tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "primary" : "ghost"}
            onClick={() => setShowFilters((v) => !v)}
          >
            <FilterIcon className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="rounded-[16px] border border-ink-100 bg-white p-5">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">
              Dificultad
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((d) => {
                const active = difficultyFilter.includes(d)
                const level = levelFromDifficulty(d)
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDifficulty(d)}
                    className="transition-transform active:scale-95"
                  >
                    <Badge
                      color={LEVEL_COLOR[level]}
                      variant={active ? "solid" : "outline"}
                      size="lg"
                    >
                      {level} · {d}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-ink-500">
            Mostrando <span className="font-bold text-chili-600">{filtered.length}</span> de{" "}
            <span className="font-bold text-ink-800">{vocab.length}</span>
          </span>
          {selectedIds.size > 0 && (
            <span className="font-mono text-xs font-bold text-chili-600">
              {selectedIds.size} seleccionadas
            </span>
          )}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="rounded-[20px] border-2 border-dashed border-ink-200 bg-card py-12 text-center">
            <div className="text-4xl">🌶</div>
            <div className="mt-3 font-display text-lg font-bold text-ink-800">
              {vocab.length === 0 ? "Tu cuaderno está vacío" : "Nada coincide"}
            </div>
            <div className="mt-1 text-sm text-ink-500">
              {vocab.length === 0 ? (
                <Link href="/vocabulary" className="text-chili-600 hover:underline">
                  Añade tu primera palabra
                </Link>
              ) : (
                "Cambia los filtros o la búsqueda."
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[20px] border border-ink-100 bg-white shadow-sm">
            <table className="w-full">
              <thead className="border-b border-ink-100 bg-masa-50 text-left">
                <tr className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-500">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="h-4 w-4 accent-chili-500"
                    />
                  </th>
                  <th className="px-4 py-3">Término</th>
                  <th className="px-4 py-3">Traducción</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3">Nivel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((w) => {
                  const level = levelFromDifficulty(w.difficulty_rating)
                  const checked = selectedIds.has(w.id)
                  return (
                    <tr
                      key={w.id}
                      className={`transition-colors ${checked ? "bg-chili-50" : "hover:bg-masa-50"}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(w.id)}
                          className="h-4 w-4 accent-chili-500"
                        />
                      </td>
                      <td className="px-4 py-3 font-display text-base font-bold text-ink-800">
                        {w.term}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-600">
                        {getDisplay(w.translations)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {w.tags?.slice(0, 2).map((t) => (
                            <Badge key={t} color="jacaranda" variant="soft" size="sm">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={LEVEL_COLOR[level]} variant="soft" size="sm">
                          {level}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Sticky delete bar */}
        {selectedIds.size > 0 && (
          <div className="sticky bottom-6 flex flex-wrap items-center gap-3 rounded-[16px] border border-ink-100 bg-white p-4 shadow-lg">
            <Button variant="danger" onClick={handleDeleteSelected} disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Borrando…" : `Borrar ${selectedIds.size}`}
            </Button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-ink-500 hover:text-ink-800"
            >
              Limpiar selección
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
