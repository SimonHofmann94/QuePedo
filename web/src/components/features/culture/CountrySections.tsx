"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { TalaveraTile } from "@/components/ui/motifs"
import {
  CountrySightsMap,
  type SightPin,
} from "@/components/features/culture/CountrySightsMap"
import { CultureFigure, type FlatImage } from "@/components/features/culture/CultureImage"

/** All strings are already localized on the server — components see plain text. */
export interface CountrySectionsProps {
  countryId: string
  capital: string
  population: string
  intro: string
  funFact: string
  slang: { term: string; meaning: string; example?: string }[]
  vocabulary: { es: string; translation: string; note?: string }[]
  sights: (SightPin & { image?: FlatImage })[]
  food: { name: string; description: string; image?: FlatImage }[]
  festivals: { name: string; when: string; description: string; image?: FlatImage }[]
  etiquette: { title: string; text: string }[]
}

/** Section id → rail label. Order here is the order down the page. */
const RAIL = [
  { id: "retrato", label: "Retrato" },
  { id: "habla", label: "Así se habla" },
  { id: "visitar", label: "Qué visitar" },
  { id: "mesa", label: "A la mesa" },
  { id: "fiestas", label: "Fiestas" },
  { id: "maneras", label: "Buenas maneras" },
] as const

function SectionHead({
  eyebrow,
  title,
  tone,
}: {
  eyebrow: string
  title: string
  tone: string
}) {
  return (
    <>
      <div className={`font-mono text-[11px] font-bold uppercase tracking-[2px] ${tone}`}>
        {eyebrow}
      </div>
      <h2 className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-ink-800">
        {title}
      </h2>
    </>
  )
}

export function CountrySections({
  countryId,
  capital,
  population,
  intro,
  funFact,
  slang,
  vocabulary,
  sights,
  food,
  festivals,
  etiquette,
}: CountrySectionsProps) {
  // Sections with no data are omitted entirely — every v2 field is optional and
  // legacy countries still render with just the first three.
  const present = RAIL.filter((s) => {
    if (s.id === "mesa") return food.length > 0
    if (s.id === "fiestas") return festivals.length > 0
    if (s.id === "maneras") return etiquette.length > 0
    if (s.id === "visitar") return sights.length > 0
    return true
  })

  const [active, setActive] = useState<string>(present[0]?.id ?? "retrato")
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nodes = present
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null)
    if (nodes.length === 0) return

    // Top band only: a section counts as active once its heading clears the rail.
    const observer = new IntersectionObserver(
      (entries) => {
        // Several sections can straddle the band at once — a long one starts far
        // above it while the next one enters. The active section is the LAST to
        // enter, i.e. the greatest `top`, not the first in document order.
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [present])

  // Keep the active chip in view when the rail overflows on narrow screens.
  useEffect(() => {
    railRef.current
      ?.querySelector<HTMLElement>(`[data-rail="${active}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [active])

  return (
    <>
      <div
        ref={railRef}
        className="sticky top-0 z-20 -mx-6 mb-2 flex gap-1 overflow-x-auto border-b border-ink-100 bg-bg/85 px-6 py-2.5 backdrop-blur-md md:-mx-10 md:px-10"
      >
        {present.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-rail={s.id}
            aria-current={active === s.id ? "true" : undefined}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[1.5px] transition-colors ${
              active === s.id
                ? "bg-ink-800 text-white"
                : "text-ink-400 hover:bg-masa-100 hover:text-ink-700"
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>

      {/* ── Retrato ─────────────────────────────────────────────── */}
      <section id="retrato" className="scroll-mt-20 pt-8">
        <div className="relative overflow-hidden rounded-[24px] border border-ink-100 bg-white p-6 shadow-sm md:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.06]">
            <TalaveraTile size={160} />
          </div>
          <div className="relative flex flex-wrap gap-2">
            <Badge color="cielo" variant="soft" size="md">
              🏛 {capital}
            </Badge>
            <Badge color="jade" variant="soft" size="md">
              👥 {population}
            </Badge>
          </div>
          <p className="relative mt-4 text-[15px] leading-relaxed text-ink-700">{intro}</p>
        </div>

        <div className="mt-5 rounded-[16px] border-l-4 border-maiz-400 bg-maiz-50 p-5">
          <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider text-maiz-600">
            💡 Dato curioso
          </div>
          <p className="text-[14px] leading-relaxed text-ink-700">{funFact}</p>
        </div>
      </section>

      {/* ── Así se habla ────────────────────────────────────────── */}
      <section id="habla" className="scroll-mt-20 pt-12">
        <SectionHead eyebrow="Slang" title="Así se habla" tone="text-chili-500" />
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
          {slang.map((s) => (
            <div
              key={s.term}
              className="reveal rounded-[16px] border border-chili-200 bg-chili-50 p-5"
            >
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

        <div className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[2px] text-jade-600">
          Palabras
        </div>
        <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-800">
          Vocabulario local
        </h3>
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

      {/* ── Qué visitar ─────────────────────────────────────────── */}
      {sights.length > 0 ? (
        <section id="visitar" className="scroll-mt-20 pt-12">
          <SectionHead eyebrow="Lugares" title="Qué visitar" tone="text-cielo-600" />
          <div className="mt-4 h-[380px] overflow-hidden rounded-[24px] border border-cielo-200 bg-cielo-50 shadow-sm">
            <CountrySightsMap countryId={countryId} sights={sights} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sights.map((s) => (
              <article
                key={s.name}
                className="reveal overflow-hidden rounded-[16px] border border-cielo-200 bg-white pb-5 shadow-sm"
              >
                {s.image ? <CultureFigure image={s.image} /> : null}
                <div className={`px-5 ${s.image ? "pt-3" : "pt-5"}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[22px] leading-none">{s.emoji}</span>
                    <h3 className="font-display text-[17px] font-bold leading-tight text-ink-800">
                      {s.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── A la mesa ───────────────────────────────────────────── */}
      {food.length > 0 ? (
        <section id="mesa" className="scroll-mt-20 pt-12">
          <SectionHead eyebrow="Comida" title="A la mesa" tone="text-maiz-600" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {food.map((d) => (
              <article
                key={d.name}
                className="reveal overflow-hidden rounded-[16px] border border-maiz-200 bg-white pb-5 shadow-sm"
              >
                {d.image ? <CultureFigure image={d.image} /> : null}
                <div className={`px-5 ${d.image ? "pt-3" : "pt-5"}`}>
                  <h3 className="font-display text-[17px] font-bold leading-tight text-ink-800">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{d.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Fiestas ─────────────────────────────────────────────── */}
      {festivals.length > 0 ? (
        <section id="fiestas" className="scroll-mt-20 pt-12">
          <SectionHead eyebrow="Calendario" title="Fiestas" tone="text-rosa-500" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {festivals.map((f) => (
              <article
                key={f.name}
                className="reveal overflow-hidden rounded-[16px] border border-rosa-200 bg-white pb-5 shadow-sm"
              >
                {f.image ? (
                  <CultureFigure image={f.image} sizes="(min-width: 640px) 50vw, 100vw" />
                ) : null}
                <div className={`px-5 ${f.image ? "pt-3" : "pt-5"}`}>
                  <div className="inline-flex rounded-full bg-rosa-100 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-rosa-700">
                    {f.when}
                  </div>
                  <h3 className="mt-2 font-display text-[19px] font-bold leading-tight text-ink-800">
                    {f.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Buenas maneras ──────────────────────────────────────── */}
      {etiquette.length > 0 ? (
        <section id="maneras" className="scroll-mt-20 pb-4 pt-12">
          <SectionHead eyebrow="Costumbres" title="Buenas maneras" tone="text-jacaranda-500" />
          <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
            {etiquette.map((e) => (
              <div
                key={e.title}
                className="reveal rounded-[16px] border border-jacaranda-200 bg-jacaranda-50 p-5"
              >
                <h3 className="font-display text-base font-bold text-ink-800">{e.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{e.text}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
