"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const WorldMap = dynamic(
  () => import("@/components/features/culture/WorldMap").then((m) => m.WorldMap),
  { ssr: false },
)

/** One country, fully localized on the server. */
export interface CultureCard {
  id: string
  flag: string
  name: string
  nameEs: string
  capital: string
  population: string
  /** First slang entry, shown as teaser. */
  teaser: { term: string; meaning: string } | null
}

export function CultureExplorer({ countries }: { countries: CultureCard[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = selectedId
    ? countries.find((c) => c.id === selectedId) ?? null
    : null

  return (
    <>
      <div className="relative">
        <div className="h-[480px] overflow-hidden rounded-[24px] border border-cielo-200 bg-cielo-50 shadow-sm">
          {/* countries (server prop) and setSelectedId are referentially stable,
              so selecting a country never rebuilds the amCharts map. */}
          <WorldMap countries={countries} onSelect={setSelectedId} />
        </div>

        {/* Preview card — in-flow below the map on mobile, overlaid bottom-left on md+ */}
        <div className="mt-3 rounded-[16px] border border-ink-100 bg-white p-4 shadow-lg md:absolute md:bottom-5 md:left-5 md:z-10 md:mt-0 md:w-[280px]">
          {selected ? (
            <div className="relative pr-5">
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setSelectedId(null)}
                className="absolute -right-2 -top-1 rounded-full p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="font-display text-xl font-bold leading-tight text-ink-800">
                {selected.flag} {selected.name}
              </div>
              <div className="font-display text-sm italic text-ink-400">
                {selected.nameEs}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge color="cielo" variant="soft" size="sm">
                  🏛 {selected.capital}
                </Badge>
                <Badge color="jade" variant="soft" size="sm">
                  👥 {selected.population}
                </Badge>
              </div>
              {selected.teaser ? (
                <div className="mt-2 text-xs text-ink-500">
                  «{selected.teaser.term}» — {selected.teaser.meaning}
                </div>
              ) : null}
              <Link href={`/culture/${selected.id}`} className="mt-3 block">
                <Button variant="primary" size="sm">Explorar →</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="font-display text-xl font-bold leading-tight text-ink-800">
                Toca un país 👆
              </div>
              <div className="mt-1 text-xs text-ink-500">
                Elige un país del mapa para ver su slang, vocabulario y lugares.
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {countries.map((c) => (
          <Link
            key={c.id}
            href={`/culture/${c.id}`}
            className="rounded-[16px] border border-ink-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="text-[32px]">{c.flag}</div>
            <div className="mt-1.5 font-display text-sm font-bold text-ink-700">
              {c.name}
            </div>
            {c.teaser ? (
              <>
                <div className="mt-2 font-display text-lg font-bold tracking-tight text-ink-800">
                  «{c.teaser.term}»
                </div>
                <div className="mt-0.5 line-clamp-2 text-xs text-ink-500">
                  {c.teaser.meaning}
                </div>
              </>
            ) : null}
          </Link>
        ))}
      </div>
    </>
  )
}
