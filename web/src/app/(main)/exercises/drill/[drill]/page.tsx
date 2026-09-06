import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getChapter } from "@chingon/shared"
import { getLocale } from "next-intl/server"
import { getChapterSession } from "@/lib/grammarPool"
import { isUserPremium } from "@/lib/premium"
import { ChapterExercises } from "../../../grammar/[level]/[chapter]/ChapterExercises"

// A drill is one chapter served as fill-in-blank only: the verb of the first
// clause is on screen, the verb of the second clause gets typed. Everything
// underneath (pool, unseen-first, progress) is the normal chapter machinery —
// only the type filter is new.
const DRILLS = {
  condicional: {
    emoji: "🔀",
    title: "Condicional",
    tagline: "Si + verbo … → ¿qué va en la segunda parte?",
    color: "cielo" as const,
    chapters: { b1: 4, b2: 2 } as Record<string, number>,
    levelNote: { b1: "Tipos 0, 1 y 2", b2: "Los tres tipos + mixtas" } as Record<string, string>,
  },
  indirecto: {
    emoji: "💬",
    title: "Estilo indirecto",
    tagline: "«Voy al cine» → dijo que ___ al cine",
    color: "maiz" as const,
    chapters: { b1: 12, b2: 6 } as Record<string, number>,
    levelNote: { b1: "Cambio de tiempos", b2: "Con tiempos compuestos" } as Record<string, string>,
  },
}

const LEVELS = ["b1", "b2"]

export default async function DrillPage({
  params,
  searchParams,
}: {
  params: Promise<{ drill: string }>
  searchParams: Promise<{ level?: string }>
}) {
  const { drill } = await params
  const config = DRILLS[drill as keyof typeof DRILLS]
  if (!config) notFound()

  const { level: levelParam } = await searchParams
  const level = LEVELS.includes((levelParam ?? "").toLowerCase())
    ? (levelParam as string).toLowerCase()
    : "b2"
  const chapterId = config.chapters[level]

  // B1/B2 are premium, exactly as the chapter pages gate them.
  if (!(await isUserPremium())) redirect("/exercises")

  const session = await getChapterSession(level, chapterId, 12, ["fill_in_blank"])
  const chapter = getChapter(level, chapterId, await getLocale())

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/exercises"
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver a ejercicios</span>
        </Link>

        <div className="mb-3 flex flex-wrap items-baseline gap-3">
          <Badge color={config.color} variant="soft" size="md">
            {config.emoji} {level.toUpperCase()} · {config.levelNote[level]}
          </Badge>
        </div>
        <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-800 md:text-4xl">
          {config.title}
        </h1>
        <p className="mt-2 text-ink-500">{config.tagline}</p>

        <div className="mt-6 flex gap-2">
          {LEVELS.map((l) => (
            <Link key={l} href={`/exercises/drill/${drill}?level=${l}`}>
              <Button variant={l === level ? "primary" : "outline"} size="sm">
                {l.toUpperCase()}
              </Button>
            </Link>
          ))}
        </div>

        {session.questions.length > 0 ? (
          <div className="mt-8 rounded-[24px] border border-ink-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-800">
                ¡Practica!
              </h2>
              <Badge color="maiz" variant="solid" size="sm">
                {session.poolSize > session.questions.length
                  ? `${session.questions.length} de ${session.poolSize}`
                  : `${session.questions.length} ejercicios`}
              </Badge>
            </div>
            <ChapterExercises
              exercises={session.questions}
              level={level}
              chapterId={chapterId}
            />
          </div>
        ) : (
          <div className="mt-8 rounded-[20px] border-2 border-dashed border-ink-200 bg-card p-8 text-center">
            <div className="text-3xl">🌶</div>
            <div className="mt-3 font-display text-lg font-bold text-ink-800">
              Cocinando los ejercicios…
            </div>
          </div>
        )}

        {chapter && (
          <div className="mt-8 flex justify-end">
            <Link href={`/grammar/${level}/${chapterId}`}>
              <Button variant="ghost">Ver la lección: {chapter.title} →</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
