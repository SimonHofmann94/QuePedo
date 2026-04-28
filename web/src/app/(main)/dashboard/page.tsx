import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/actions/auth"
import { getUserProfile } from "@/actions/profile"
import { getUserActivityDates, getUserStreak } from "@/actions/activity"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sunburst } from "@/components/ui/motifs"
import {
  ArrowIcon,
  BookIcon,
  ChartIcon,
  FireIcon,
  PlayIcon,
  TrophyIcon,
} from "@/components/ui/icons"

const GREETINGS = [
  "¡Qué pedo, {name}!",
  "¡Qué onda, {name}!",
  "¡Hola, {name}!",
  "¡Buenas, crack!",
  "¡Epa, {name}!",
  "¡Saludos, jefe!",
]

const DAY_LABELS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function pickGreeting(name: string) {
  const t = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
  return t.replace("{name}", name)
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const profileResult = await getUserProfile()
  const profile = profileResult.data
  if (profile && !profile.onboarding_completed) redirect("/onboarding")

  const activityResult = await getUserActivityDates()
  const activityDates = activityResult.data || []
  const streakResult = await getUserStreak()
  const currentStreak = streakResult.streak || 0

  const displayName = user.user_metadata?.name || user.email?.split("@")[0] || "amigo"
  const greeting = pickGreeting(displayName)

  // Build last-7-days activity row
  const today = new Date()
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const i = 6 - idx
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    return d
  })
  const isActive = (d: Date) => activityDates.includes(d.toISOString().split("T")[0])

  const todayEs = today.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-marker text-[40px] leading-none text-chili-500 md:text-[56px]">
              {greeting}
            </div>
            <div className="mt-2 text-base text-ink-500">{todayEs}</div>
          </div>
          <Link href="/exercises">
            <Button variant="primary">
              <PlayIcon size={16} />
              Continuar lección
            </Button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Vocabulario"
            value={profile?.vocabulary_count ?? 0}
            sub="+12 esta semana"
            color="var(--chili-500)"
            icon={<BookIcon />}
          />
          <StatCard
            label="Racha"
            value={currentStreak}
            sub="¡no la rompas!"
            color="var(--maiz-400)"
            icon={<FireIcon />}
          />
          <StatCard
            label="Promedio"
            value="85%"
            sub="últimos 30 quizzes"
            color="var(--jade-500)"
            icon={<TrophyIcon />}
          />
          <StatCard
            label="Tiempo"
            value="120m"
            sub="esta semana"
            color="var(--cielo-500)"
            icon={<ChartIcon />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* LEFT: Quick actions + Streak */}
          <div>
            <h2 className="mb-3 font-display text-[22px] font-bold text-ink-800">Acciones rápidas</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickAction
                href="/exercises"
                color="var(--chili-500)"
                emoji="📚"
                title="Continuar"
                sub="Lección 12 · Subjuntivo"
              />
              <QuickAction
                href="/exercises/quiz"
                color="var(--jade-500)"
                emoji="🎯"
                title="Quiz diario"
                sub="10 palabras · 2 min"
              />
              <QuickAction
                href="/vocabulary"
                color="var(--cielo-500)"
                emoji="➕"
                title="Añadir palabra"
                sub="Expande tu cuaderno"
              />
              <QuickAction
                href="/profile"
                color="var(--jacaranda-500)"
                emoji="📊"
                title="Ver progreso"
                sub="Tu ruta a C2"
              />
            </div>

            {/* Weekly streak */}
            <div className="mt-6 rounded-[20px] border border-ink-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-baseline justify-between">
                <div>
                  <div className="font-display text-xl font-bold text-ink-800">Tu semana</div>
                  <div className="text-xs text-ink-500">¡mantén la racha!</div>
                </div>
                <Badge color="maiz" variant="solid">🔥 {currentStreak} días</Badge>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((d) => {
                  const active = isActive(d)
                  return (
                    <div key={d.toISOString()} className="text-center">
                      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-400">
                        {DAY_LABELS_ES[d.getDay()]}
                      </div>
                      <div
                        className={`flex aspect-square w-full items-center justify-center rounded-[12px] text-xl ${
                          active
                            ? "bg-chili-500 text-white shadow-[0_3px_0_var(--chili-700)]"
                            : "bg-ink-100 text-ink-400"
                        }`}
                      >
                        {active ? "🔥" : "·"}
                      </div>
                      <div className="mt-1.5 font-mono text-[10px] font-semibold text-ink-500">
                        {d.getDate()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Daily challenge + Recent */}
          <div className="space-y-4">
            <div
              className="relative overflow-hidden rounded-[20px] p-6 text-white"
              style={{
                background: "linear-gradient(135deg, var(--chili-500), var(--rosa-500))",
              }}
            >
              <div className="absolute -right-5 -top-5 opacity-20">
                <Sunburst size={160} color="#fff" />
              </div>
              <Badge color="maiz" variant="solid" size="sm">⚡ Reto del día</Badge>
              <div className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight md:text-[28px]">
                Ordena una torta en la esquina
              </div>
              <div className="mt-2 max-w-[260px] text-sm opacity-90">
                5 minutos · B1 · práctica de habla
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="font-mono text-[11px] opacity-90">+50 XP · +1 🔥</div>
                <Link
                  href="/exercises"
                  className="rounded-[10px] bg-white px-3.5 py-2 text-[13px] font-bold text-chili-600 shadow-[0_3px_0_rgba(0,0,0,.15)]"
                >
                  ¡Dale! →
                </Link>
              </div>
            </div>

            <div className="rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm">
              <div className="mb-3.5 font-display text-lg font-bold text-ink-800">
                Actividad reciente
              </div>
              <div className="space-y-3">
                {[
                  ["🎯", "Quiz A2 · Verbos", "10/10 · hace 2h", "var(--jade-500)"],
                  ["📚", "+8 palabras nuevas", "Mercado vocab · ayer", "var(--chili-500)"],
                  ["🏆", "Logro: 100 palabras", "hace 3 días", "var(--maiz-400)"],
                ].map(([e, t, s, c], i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-lg"
                      style={{ background: c }}
                    >
                      {e}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-[13px] font-semibold text-ink-800">{t}</div>
                      <div className="font-mono text-[10px] text-ink-400">{s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
      <div className="mt-2 font-display text-[44px] font-extrabold leading-none tracking-tight text-ink-800">
        {value}
      </div>
      <div className="mt-1.5 text-xs text-ink-500">{sub}</div>
    </div>
  )
}

function QuickAction({
  href,
  color,
  emoji,
  title,
  sub,
}: {
  href: string
  color: string
  emoji: string
  title: string
  sub: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 rounded-[16px] border border-ink-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] text-[26px] shadow-[0_3px_0_rgba(0,0,0,.15)]"
        style={{ background: color }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-base font-bold text-ink-800">{title}</div>
        <div className="mt-0.5 truncate text-xs text-ink-500">{sub}</div>
      </div>
      <ArrowIcon size={18} className="text-ink-400" />
    </Link>
  )
}
