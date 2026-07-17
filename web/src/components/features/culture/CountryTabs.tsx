"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Segment } from "@/components/ui/segment"
import {
  CountrySightsMap,
  type SightPin,
} from "@/components/features/culture/CountrySightsMap"

type Tab = "idioma" | "cultura" | "lugares"

/** All strings are already localized on the server. */
export interface CountryTabsProps {
  countryId: string
  capital: string
  population: string
  intro: string
  funFact: string
  slang: { term: string; meaning: string; example?: string }[]
  vocabulary: { es: string; translation: string; note?: string }[]
  sights: SightPin[]
}

export function CountryTabs({
  countryId,
  capital,
  population,
  intro,
  funFact,
  slang,
  vocabulary,
  sights,
}: CountryTabsProps) {
  const [tab, setTab] = useState<Tab>("idioma")

  return (
    <div className="mt-8">
      <Segment<Tab>
        options={[
          { value: "idioma", label: "Idioma" },
          { value: "cultura", label: "Cultura" },
          { value: "lugares", label: "Lugares" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "idioma" ? (
        <>
          {/* Slang — chili accent */}
          <section className="mt-6">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
              Slang
            </div>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-800">
              Así se habla
            </h2>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              {slang.map((s) => (
                <div key={s.term} className="rounded-[16px] border border-chili-200 bg-chili-50 p-5">
                  <div className="font-display text-xl font-bold tracking-tight text-ink-800">
                    {s.term}
                  </div>
                  <div className="mt-1 text-sm text-ink-600">{s.meaning}</div>
                  {s.example ? (
                    <div className="mt-2 text-sm italic text-chili-700">«{s.example}»</div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Vocabulario local — jade accent */}
          <section className="mt-10">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-jade-600">
              Palabras
            </div>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-800">
              Vocabulario local
            </h2>
            <div className="mt-4 overflow-hidden rounded-[16px] border border-jade-200 bg-white">
              <div className="divide-y divide-jade-100">
                {vocabulary.map((v) => (
                  <div
                    key={v.es}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-jade-50"
                  >
                    <div className="font-display text-base font-bold text-ink-800">{v.es}</div>
                    <div className="text-sm text-ink-600">{v.translation}</div>
                    {v.note ? (
                      <div className="w-full font-mono text-[11px] text-ink-400">{v.note}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      {tab === "cultura" ? (
        <>
          <div className="mt-6 rounded-[24px] border border-ink-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge color="cielo" variant="soft" size="md">
                🏛 {capital}
              </Badge>
              <Badge color="jade" variant="soft" size="md">
                👥 {population}
              </Badge>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">{intro}</p>
          </div>

          {/* Dato curioso — maíz accent */}
          <div className="mt-6 rounded-[16px] border-l-4 border-maiz-400 bg-maiz-50 p-5">
            <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider text-maiz-600">
              💡 Dato curioso
            </div>
            <p className="text-[14px] leading-relaxed text-ink-700">{funFact}</p>
          </div>
        </>
      ) : null}

      {tab === "lugares" ? (
        /* Qué visitar — cielo accent */
        <section className="mt-6">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-cielo-600">
            Lugares
          </div>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-800">
            Qué visitar
          </h2>
          <div className="mt-4 h-[380px] overflow-hidden rounded-[24px] border border-cielo-200 bg-cielo-50 shadow-sm">
            <CountrySightsMap countryId={countryId} sights={sights} />
          </div>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
            {sights.map((s) => (
              <div key={s.name} className="rounded-[16px] border border-cielo-200 bg-white p-5 shadow-sm">
                <div className="text-[28px]">{s.emoji}</div>
                <div className="mt-1.5 font-display text-base font-bold text-ink-800">{s.name}</div>
                <div className="mt-1 text-sm leading-relaxed text-ink-500">{s.description}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
