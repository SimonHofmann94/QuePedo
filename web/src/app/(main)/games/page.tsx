import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getPersonalBests } from "@/actions/games"
import type { GameId } from "@chingon/shared"

type Color = "chili" | "jacaranda" | "jade" | "maiz" | "cielo" | "rosa"

interface GameCard {
  id: GameId
  href: string
  emoji: string
  title: string
  tagline: string
  color: Color
}

// The grammar-decision drills (¿El o La?, Ser o Estar, Pasado, ¿Subjuntivo?)
// moved to /exercises — tapping the right form ten times is practice, not a
// game. What is left here actually plays with your own vocabulary.
const SECTIONS: { eyebrow: string; title: string; games: GameCard[] }[] = [
  {
    eyebrow: "Palabras",
    title: "Con tu vocabulario",
    games: [
      {
        id: "chili_rush",
        href: "/games/chili-rush",
        emoji: "🌶",
        title: "Chili Rush",
        tagline: "Atrapa la traducción antes de que caiga. Cada vez más rápido.",
        color: "chili",
      },
      {
        id: "loteria",
        href: "/games/loteria",
        emoji: "🎴",
        title: "Lotería de Palabras",
        tagline: "El clásico mexicano — encuentra la palabra cantada en tu tabla.",
        color: "jacaranda",
      },
      {
        id: "construye",
        href: "/games/construye",
        emoji: "🧱",
        title: "Construye la Palabra",
        tagline: "Ordena las letras y deletrea el español. Sin prisa, con maña.",
        color: "jade",
      },
    ],
  },
]

export default async function GamesHubPage() {
  const bests = await getPersonalBests()

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
            Juega y gana tacos
          </div>
          <h1 className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
            Juegos
          </h1>
          <p className="mt-3 text-base text-ink-500">
            Partidas de 2–3 minutos con tu vocabulario. Mantén tu racha 🔥
          </p>
        </div>

        {SECTIONS.map((section) => (
          <section key={section.eyebrow} className="mb-10">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-ink-400">
              {section.eyebrow}
            </div>
            <h2 className="mb-4 mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-800">
              {section.title}
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {section.games.map((g) => {
                const best = bests[g.id]
                return (
                  <Link
                    key={g.id}
                    href={g.href}
                    className="group flex flex-col rounded-[20px] border-[3px] bg-white p-6 transition-transform duration-100 active:translate-y-1 active:shadow-none"
                    style={{
                      borderColor: `var(--${g.color}-500)`,
                      boxShadow: `0 4px 0 0 var(--${g.color}-700)`,
                    }}
                  >
                    <div className="text-4xl">{g.emoji}</div>
                    <div className="mt-3 font-display text-xl font-extrabold leading-tight tracking-tight text-ink-800">
                      {g.title}
                    </div>
                    <p className="mt-2 flex-1 text-sm text-ink-500">{g.tagline}</p>
                    <div className="mt-4 flex items-center justify-between">
                      {best !== null ? (
                        <Badge color={g.color} variant="soft" size="sm">
                          Récord: {best}
                        </Badge>
                      ) : (
                        <Badge color={g.color} variant="outline" size="sm">
                          Nuevo
                        </Badge>
                      )}
                      <span
                        className="font-display text-sm font-bold transition-transform group-hover:translate-x-1"
                        style={{ color: `var(--${g.color}-500)` }}
                      >
                        ¡Dale! →
                      </span>
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
