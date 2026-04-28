"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Segment } from "@/components/ui/segment"
import { PlusIcon, SearchIcon } from "@/components/ui/icons"
import { addVocabulary } from "@/actions/vocabulary"
import type { VocabWord } from "@chingon/shared"

type ColorFamily = "chili" | "jade" | "cielo" | "jacaranda" | "maiz" | "rosa" | "ink"

type Filter = "all" | "v" | "n" | "adj" | "other"

interface Props {
  words: VocabWord[]
  posLabel: Record<string, string>
  posColor: Record<string, ColorFamily>
}

export function VocabListClient({ words, posLabel, posColor }: Props) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [adding, setAdding] = useState<Set<string>>(new Set())
  const [added, setAdded] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim()
    return words.filter((w) => {
      if (filter === "v" && w.pos !== "v") return false
      if (filter === "n" && w.pos !== "n") return false
      if (filter === "adj" && w.pos !== "adj") return false
      if (filter === "other" && ["v", "n", "adj"].includes(w.pos)) return false
      if (!s) return true
      return (
        w.es.toLowerCase().includes(s) ||
        w.de.toLowerCase().includes(s) ||
        (w.en?.toLowerCase().includes(s) ?? false)
      )
    })
  }, [words, search, filter])

  const handleAdd = async (w: VocabWord) => {
    if (adding.has(w.es) || added.has(w.es)) return
    setAdding((prev) => new Set(prev).add(w.es))
    const translations: Record<string, string> = { de: w.de }
    if (w.en) translations.en = w.en
    const result = await addVocabulary(
      {
        term: w.es,
        translations,
        context_sentence: w.example,
        difficulty_rating: 1,
        tags: [w.pos],
        synonyms: [],
      },
      "manual",
    )
    setAdding((prev) => {
      const next = new Set(prev)
      next.delete(w.es)
      return next
    })
    if (!result.error) {
      setAdded((prev) => new Set(prev).add(w.es))
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[260px] flex-1">
          <SearchIcon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <Input
            placeholder="Buscar palabra…"
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
            { value: "v", label: "Verbos" },
            { value: "n", label: "Sustantivos" },
            { value: "adj", label: "Adjetivos" },
            { value: "other", label: "Otros" },
          ]}
        />
      </div>

      <div className="mb-3 font-mono text-[11px] text-ink-500">
        Mostrando {filtered.length} de {words.length}
      </div>

      <div className="overflow-hidden rounded-[20px] border border-ink-100 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-ink-100 bg-masa-50 text-left">
            <tr className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-500">
              <th className="px-4 py-3">Español</th>
              <th className="px-4 py-3">Alemán</th>
              <th className="hidden px-4 py-3 md:table-cell">Tipo</th>
              <th className="hidden px-4 py-3 md:table-cell">Ejemplo</th>
              <th className="px-4 py-3 text-right">Añadir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((w) => {
              const isAdded = added.has(w.es)
              const isAdding = adding.has(w.es)
              return (
                <tr key={w.es + w.pos} className="transition-colors hover:bg-masa-50">
                  <td className="px-4 py-3">
                    <div className="font-display text-base font-bold text-ink-800">
                      {w.gender === "f" ? "la " : w.gender === "m" ? "el " : ""}
                      {w.es}
                    </div>
                    {w.en && (
                      <div className="font-mono text-[10px] text-ink-400">{w.en}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-600">{w.de}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Badge color={posColor[w.pos] ?? "ink"} variant="soft" size="sm">
                      {posLabel[w.pos] ?? w.pos}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-xs italic text-ink-500 md:table-cell">
                    {w.example ?? ""}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant={isAdded ? "ghost" : "primary"}
                      size="sm"
                      onClick={() => handleAdd(w)}
                      disabled={isAdding || isAdded}
                    >
                      {isAdded ? "✓ Añadida" : isAdding ? "Cocinando…" : <><PlusIcon size={14} /> Añadir</>}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-[20px] border-2 border-dashed border-ink-200 bg-card p-8 text-center">
          <div className="text-3xl">🌶</div>
          <div className="mt-3 font-display text-lg font-bold text-ink-800">Nada coincide</div>
          <div className="mt-1 text-sm text-ink-500">Cambia el filtro o la búsqueda.</div>
        </div>
      )}
    </div>
  )
}
