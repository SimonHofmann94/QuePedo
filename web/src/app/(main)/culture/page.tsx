"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Segment } from "@/components/ui/segment"

const WorldMap = dynamic(
  () => import("@/components/features/culture/WorldMap").then((m) => m.WorldMap),
  { ssr: false },
)

const COUNTRIES = [
  { flag: "🇲🇽", name: "México",    phrase: "¡No manches!",  mean: "¡No way!", id: "mx" },
  { flag: "🇦🇷", name: "Argentina", phrase: "Che, boludo",   mean: "Hey güey", id: "ar" },
  { flag: "🇪🇸", name: "España",    phrase: "Vale, tío",     mean: "OK, tío",  id: "es" },
  { flag: "🇨🇴", name: "Colombia",  phrase: "¡Qué chimba!",  mean: "¡Qué bien!", id: "co" },
  { flag: "🇨🇱", name: "Chile",     phrase: "¡Bacán!",       mean: "Genial",   id: "cl" },
  { flag: "🇵🇪", name: "Perú",      phrase: "¡Qué chévere!", mean: "Qué bien", id: "pe" },
  { flag: "🇨🇺", name: "Cuba",      phrase: "¡Asere!",        mean: "¡Compa!",  id: "cu" },
  { flag: "🇻🇪", name: "Venezuela", phrase: "¡Qué pana!",     mean: "Qué amigo",id: "ve" },
] as const

type Filter = "slang" | "food" | "music"

export default function CulturePage() {
  const [filter, setFilter] = useState<Filter>("slang")

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
              21 países · 500M hablantes
            </div>
            <div className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
              Mapa cultural
            </div>
            <div className="mt-2 max-w-xl text-[15px] text-ink-500">
              Un idioma, mil formas de decirlo. Explora slang, comida y costumbres por región.
            </div>
          </div>
          <Segment<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "slang", label: "Slang" },
              { value: "food", label: "Comida" },
              { value: "music", label: "Música" },
            ]}
          />
        </div>

        <div className="relative h-[480px] overflow-hidden rounded-[24px] border border-cielo-200 bg-cielo-50 shadow-sm">
          <WorldMap />
          <div className="absolute bottom-5 left-5 hidden w-[280px] rounded-[16px] border border-ink-100 bg-white p-4 shadow-lg md:block">
            <Badge color="chili" variant="solid" size="sm">
              🇲🇽 México · esta semana
            </Badge>
            <div className="mt-2 font-display text-xl font-bold leading-tight text-ink-800">
              Slang de CDMX
            </div>
            <div className="mt-1 text-xs text-ink-500">
              «No manches», «qué padre», «va que va»
            </div>
            <Link href="/culture/mx" className="mt-3 block">
              <Button variant="outline" size="sm">Explorar →</Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {COUNTRIES.map((c) => (
            <Link
              key={c.id}
              href={`/culture/${c.id}`}
              className="rounded-[16px] border border-ink-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-[32px]">{c.flag}</div>
              <div className="mt-1.5 font-display text-sm font-bold text-ink-700">{c.name}</div>
              <div className="mt-2 font-display text-lg font-bold tracking-tight text-ink-800">
                «{c.phrase}»
              </div>
              <div className="mt-0.5 text-xs text-ink-500">{c.mean}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
