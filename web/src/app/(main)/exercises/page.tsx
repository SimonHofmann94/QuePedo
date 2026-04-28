"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  ArrowIcon,
  BookIcon,
  DumbbellIcon,
  HeartIcon,
  MicIcon,
  PlayIcon,
  SparkleIcon,
} from "@/components/ui/icons"

type Tile = {
  title: string
  sub: string
  emoji: string
  color: string
  href: string
  badge?: { label: string; color: "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda" | "ink" }
  icon?: React.ReactNode
}

const TILES: Tile[] = [
  {
    title: "Quiz de vocabulario",
    sub: "Tarjetas y swipe · 2 min",
    emoji: "🎯",
    color: "var(--chili-500)",
    href: "/exercises/quiz",
    badge: { label: "Práctica", color: "chili" },
    icon: <DumbbellIcon size={18} />,
  },
  {
    title: "Práctica de habla",
    sub: "Pronunciación con AI · STT",
    emoji: "🎤",
    color: "var(--rosa-500)",
    href: "/exercises",
    badge: { label: "AI", color: "rosa" },
    icon: <MicIcon size={18} />,
  },
  {
    title: "Gramática",
    sub: "Reglas + ejercicios · core",
    emoji: "📚",
    color: "var(--jade-500)",
    href: "/grammar",
    badge: { label: "Core", color: "jade" },
    icon: <BookIcon size={18} />,
  },
  {
    title: "Escucha",
    sub: "Audio nativo · comprensión",
    emoji: "🎧",
    color: "var(--cielo-500)",
    href: "/exercises",
    badge: { label: "Audio", color: "cielo" },
    icon: <PlayIcon size={18} />,
  },
  {
    title: "Escritura",
    sub: "Prompts con feedback AI",
    emoji: "✍️",
    color: "var(--jacaranda-500)",
    href: "/exercises",
    badge: { label: "AI", color: "jacaranda" },
    icon: <SparkleIcon size={18} />,
  },
  {
    title: "Juegos",
    sub: "Aprende jugando · fun",
    emoji: "🎮",
    color: "var(--maiz-400)",
    href: "/exercises",
    badge: { label: "Fun", color: "maiz" },
    icon: <HeartIcon size={18} />,
  },
]

export default function ExercisesPage() {
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
            Cinco modos para practicar — escoge el que te llame hoy.
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

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t) => (
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
                  {t.badge && (
                    <Badge color={t.badge.color} variant="soft" size="sm">
                      {t.badge.label}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 text-sm text-ink-500">{t.sub}</div>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-chili-600 transition-transform group-hover:translate-x-1">
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Empezar
                </span>
                <ArrowIcon size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
