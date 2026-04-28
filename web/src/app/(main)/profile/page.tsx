"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { ProgressBar } from "@/components/ui/progress"
import { Sunburst, TalaveraTile } from "@/components/ui/motifs"
import { BookIcon, FireIcon, GearIcon, SparkleIcon } from "@/components/ui/icons"

const ACHIEVEMENTS = [
  { emoji: "🌶", label: "Primera lección", color: "var(--chili-500)", done: true },
  { emoji: "🔥", label: "7 días",          color: "var(--maiz-400)",  done: true },
  { emoji: "🔥", label: "14 días",         color: "var(--chili-500)", done: true },
  { emoji: "📚", label: "100 palabras",    color: "var(--cielo-500)", done: true },
  { emoji: "🎯", label: "10/10 quiz",      color: "var(--jade-500)",  done: true },
  { emoji: "🏆", label: "A1 completo",     color: "var(--jacaranda-500)", done: true },
  { emoji: "🌵", label: "30 días",         color: "var(--ink-300)",   done: false },
  { emoji: "📖", label: "500 palabras",    color: "var(--ink-300)",   done: false },
  { emoji: "🗣", label: "Primer habla",    color: "var(--ink-300)",   done: false },
  { emoji: "🎉", label: "A2 completo",     color: "var(--ink-300)",   done: false },
] as const

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header card */}
        <div
          className="relative overflow-hidden rounded-[24px] p-7 text-white md:p-8"
          style={{ background: "linear-gradient(135deg, var(--chili-500), var(--jacaranda-500))" }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 opacity-15">
            <TalaveraTile size={240} />
          </div>
          <div className="relative flex flex-wrap items-center gap-6">
            <div className="relative">
              <Avatar name="H" color="var(--maiz-400)" size={96} />
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-jade-500 font-display text-sm font-extrabold text-white">
                A2
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="font-display text-3xl font-extrabold leading-none tracking-tight md:text-4xl">
                  Habs Borsch
                </div>
                <Badge color="maiz" variant="solid">🔥 14 días</Badge>
              </div>
              <div className="mt-2 font-marker text-xl text-maiz-200">
                colega desde 23/02/2026
              </div>
              <div className="mt-3 flex flex-wrap gap-5 font-mono text-xs opacity-90">
                <div>📍 Vive en España</div>
                <div>🎮 Estilo: gamer</div>
                <div>⏱ Meta diaria: 15 min</div>
              </div>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* LEFT */}
          <div>
            <div className="mb-3 font-display text-xl font-bold text-ink-800">Tu journey</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Total XP" value="1,240" sub="nivel 12" color="var(--chili-500)" icon={<SparkleIcon />} />
              <StatCard label="Días activos" value="59" sub="de 60 · ¡wow!" color="var(--jade-500)" icon={<FireIcon />} />
              <StatCard label="Palabras" value="247" sub="+12 esta semana" color="var(--cielo-500)" icon={<BookIcon />} />
            </div>

            <div className="mt-7 mb-3 font-display text-xl font-bold text-ink-800">
              Logros desbloqueados
            </div>
            <div className="rounded-[20px] border border-ink-100 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-5 gap-3">
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="flex aspect-square w-full items-center justify-center rounded-[16px] text-2xl md:text-3xl"
                      style={{
                        background: a.done ? "white" : "var(--ink-50)",
                        border: a.done
                          ? `3px solid ${a.color}`
                          : "3px dashed var(--ink-200)",
                        boxShadow: a.done ? `0 4px 0 ${a.color}` : "none",
                        opacity: a.done ? 1 : 0.4,
                      }}
                    >
                      {a.emoji}
                    </div>
                    <div
                      className="mt-2 font-mono text-[9px] font-bold uppercase tracking-wide"
                      style={{ color: a.done ? "var(--ink-700)" : "var(--ink-400)" }}
                    >
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[20px] bg-cielo-500 p-6 text-white">
              <div className="pointer-events-none absolute -right-5 -top-5 opacity-20">
                <Sunburst size={160} color="var(--maiz-200)" />
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-90">
                Foco actual
              </div>
              <div className="mt-1 font-display text-3xl font-extrabold leading-none tracking-tight md:text-[36px]">
                Spanish social
              </div>
              <div className="mt-2 max-w-[280px] text-sm opacity-90">
                Aprendiendo el español para una fiesta, no una entrevista de trabajo.
              </div>
              <div className="mt-4">
                <ProgressBar value={62} color="white" trackColor="rgba(255,255,255,.2)" height={6} />
                <div className="mt-1.5 font-mono text-[10px] opacity-85">62% · 18 / 30 unidades</div>
              </div>
            </div>

            <div className="rounded-[20px] border-2 border-dashed border-maiz-300 bg-white p-6">
              <Badge color="maiz" variant="soft" size="sm">Tu misión</Badge>
              <div className="mt-2.5 font-marker text-2xl leading-snug text-ink-800">
                Habs está en una misión para dominar el español social.
              </div>
              <div className="mt-2.5 text-[13px] text-ink-500">
                Meta: chatear sin miedo en CDMX para julio 2026 🌮
              </div>
            </div>

            <div className="rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm">
              <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-400">
                Idiomas
              </div>
              <LanguageRow flag="🇩🇪" name="Alemán" sub="Nativo" badgeColor="jade" badge="Native" badgeVariant="soft" />
              <div className="my-1 h-px bg-ink-100" />
              <LanguageRow flag="🇲🇽" name="Español" sub="Aprendiendo" badgeColor="chili" badge="A2" badgeVariant="solid" />
            </div>

            <Button variant="ghost" className="w-full">
              <GearIcon size={16} />
              Ajustes (próximamente)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string
  value: React.ReactNode
  sub: string
  color: string
  icon: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-ink-100 bg-white p-5">
      <div
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[10px] text-white"
        style={{ background: color }}
      >
        {icon}
      </div>
      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-400">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-extrabold leading-none tracking-tight text-ink-800">
        {value}
      </div>
      <div className="mt-1.5 text-xs text-ink-500">{sub}</div>
    </div>
  )
}

function LanguageRow({
  flag,
  name,
  sub,
  badgeColor,
  badge,
  badgeVariant,
}: {
  flag: string
  name: string
  sub: string
  badgeColor: "chili" | "jade" | "cielo"
  badge: string
  badgeVariant: "solid" | "soft"
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{flag}</div>
        <div>
          <div className="text-sm font-semibold text-ink-800">{name}</div>
          <div className="font-mono text-[10px] text-ink-400">{sub}</div>
        </div>
      </div>
      <Badge color={badgeColor} variant={badgeVariant}>{badge}</Badge>
    </div>
  )
}
