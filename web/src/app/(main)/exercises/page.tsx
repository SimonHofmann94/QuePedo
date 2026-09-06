"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useSubscription } from "@/contexts/SubscriptionProvider"
import { getPersonalBests } from "@/actions/games"
import type { GameId } from "@chingon/shared"
import { ArrowIcon, LockIcon } from "@/components/ui/icons"

type BadgeColor = "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda" | "ink"

type Tile = {
  title: string
  sub: string
  emoji: string
  color: string
  href: string
  badge?: { label: string; color: BadgeColor }
  premium?: boolean
  /** Set for the four decision drills — they still score as games, so they keep a record. */
  gameId?: GameId
  recordColor?: BadgeColor
}

// Two sections. The grammar drills used to sit under /games, but tapping «ser»
// or «estar» ten times is an exercise, not a game — they belong here next to
// the chapters that teach the rule.
const SECTIONS: { eyebrow: string; title: string; tiles: Tile[] }[] = [
  {
    eyebrow: "Destrezas",
    title: "Vocabulario, voz y escritura",
    tiles: [
      {
        title: "Quiz de vocabulario",
        sub: "Tarjetas y swipe · 2 min",
        emoji: "🎯",
        color: "var(--chili-500)",
        href: "/exercises/quiz",
        badge: { label: "Práctica", color: "chili" },
      },
      {
        title: "Práctica de habla",
        sub: "Pronunciación con AI · STT",
        emoji: "🎤",
        color: "var(--rosa-500)",
        href: "/exercises/speaking",
        badge: { label: "AI", color: "rosa" },
        premium: true,
      },
      {
        title: "Escucha",
        sub: "Audio nativo · comprensión",
        emoji: "🎧",
        color: "var(--cielo-500)",
        href: "/exercises/escucha",
        badge: { label: "Audio", color: "cielo" },
        premium: true,
      },
      {
        title: "Escritura",
        sub: "Prompts con feedback AI",
        emoji: "✍️",
        color: "var(--jacaranda-500)",
        href: "/exercises/escritura",
        badge: { label: "AI", color: "jacaranda" },
        premium: true,
      },
      {
        title: "Juegos",
        sub: "Con tu vocabulario · fun",
        emoji: "🎮",
        color: "var(--maiz-400)",
        href: "/games",
        badge: { label: "Fun", color: "maiz" },
      },
    ],
  },
  {
    eyebrow: "Gramática",
    title: "Una regla a la vez",
    tiles: [
      {
        title: "Gramática",
        sub: "Reglas + ejercicios · core",
        emoji: "📚",
        color: "var(--jade-500)",
        href: "/grammar",
        badge: { label: "Core", color: "jade" },
      },
      {
        title: "Condicional",
        sub: "Si + verbo · las tres formas",
        emoji: "🔀",
        color: "var(--cielo-500)",
        href: "/exercises/drill/condicional",
        badge: { label: "Verbos", color: "cielo" },
        premium: true,
      },
      {
        title: "Estilo indirecto",
        sub: "«Voy» → dijo que iba",
        emoji: "💬",
        color: "var(--maiz-400)",
        href: "/exercises/drill/indirecto",
        badge: { label: "Verbos", color: "maiz" },
        premium: true,
      },
      {
        title: "¿El o La?",
        sub: "Sesenta segundos de artículos",
        emoji: "⚖️",
        color: "var(--maiz-400)",
        href: "/exercises/el-o-la",
        badge: { label: "Rápido", color: "maiz" },
        gameId: "el_o_la",
        recordColor: "maiz",
      },
      {
        title: "Ser o Estar",
        sub: "¿Esencia o estado? · 10 frases",
        emoji: "🎭",
        color: "var(--cielo-500)",
        href: "/exercises/ser-o-estar",
        badge: { label: "Decisión", color: "cielo" },
        gameId: "ser_estar",
        recordColor: "cielo",
      },
      {
        title: "Pasado",
        sub: "Indefinido, perfecto o imperfecto",
        emoji: "⏳",
        color: "var(--rosa-500)",
        href: "/exercises/pasado",
        badge: { label: "Decisión", color: "rosa" },
        gameId: "pasado",
        recordColor: "rosa",
      },
      {
        title: "¿Subjuntivo?",
        sub: "Encuentra el disparador",
        emoji: "🔮",
        color: "var(--jacaranda-500)",
        href: "/exercises/subjuntivo",
        badge: { label: "Decisión", color: "jacaranda" },
        gameId: "subjuntivo",
        recordColor: "jacaranda",
      },
    ],
  },
]

export default function ExercisesPage() {
  const { isPremium } = useSubscription()
  // The four decision drills still write to game_results, so their record
  // follows them here. Best-effort: no record simply means no badge.
  const [bests, setBests] = useState<Partial<Record<GameId, number | null>>>({})
  useEffect(() => {
    getPersonalBests()
      .then(setBests)
      .catch(() => setBests({}))
  }, [])

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
            Practica · Domina
          </div>
          <div className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
            Ejercicios
          </div>
          <div className="mt-2 max-w-xl text-[15px] text-ink-500">
            Escoge cómo practicar hoy — destrezas arriba, gramática abajo.
          </div>
        </div>

        {/* Featured: Daily quiz */}
        <Link
          href="/exercises/quiz"
          className="mb-6 block overflow-hidden rounded-[20px] p-6 text-white shadow-md md:p-8"
          style={{ background: "linear-gradient(135deg, var(--chili-500), var(--rosa-500))" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge color="maiz" variant="solid" size="sm">
                ⚡ Reto del día
              </Badge>
              <div className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                Quiz diario · 10 palabras
              </div>
              <div className="mt-2 text-sm opacity-90">
                A2 · 2 minutos · +50 XP · +1 🔥
              </div>
            </div>
            <div className="rounded-[14px] bg-white px-5 py-3 font-bold text-chili-600 shadow-[0_3px_0_rgba(0,0,0,.15)]">
              ¡Dale! <ArrowIcon size={16} className="-mb-0.5 ml-1 inline" />
            </div>
          </div>
        </Link>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <section key={section.eyebrow} className="mb-10">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-ink-400">
              {section.eyebrow}
            </div>
            <h2 className="mb-4 mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-800">
              {section.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.tiles.map((t) => {
                const best = t.gameId ? bests[t.gameId] : null
                return (
                  <Link
                    key={t.title}
                    href={t.href}
                    className="group flex flex-col gap-4 rounded-[20px] border border-ink-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-[16px] text-3xl shadow-[0_4px_0_rgba(0,0,0,.15)]"
                      style={{ background: t.color }}
                    >
                      {t.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-display text-xl font-bold tracking-tight text-ink-800">
                          {t.title}
                        </div>
                        {t.premium && !isPremium ? (
                          <Badge color="maiz" variant="solid" size="sm">
                            <LockIcon size={11} /> Premium
                          </Badge>
                        ) : (
                          t.badge && (
                            <Badge color={t.badge.color} variant="soft" size="sm">
                              {t.badge.label}
                            </Badge>
                          )
                        )}
                      </div>
                      <div className="mt-1 text-sm text-ink-500">{t.sub}</div>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-chili-600 transition-transform group-hover:translate-x-1">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                          Empezar
                        </span>
                        <ArrowIcon size={14} />
                      </span>
                      {best != null && (
                        <Badge color={t.recordColor ?? "ink"} variant="soft" size="sm">
                          Récord: {best}
                        </Badge>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
