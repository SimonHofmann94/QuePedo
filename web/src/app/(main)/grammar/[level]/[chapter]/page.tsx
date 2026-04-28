import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getChapter, getChapterExercises } from "@chingon/shared"
import type { GrammarContentBlock } from "@chingon/shared"
import { ChapterExercises } from "./ChapterExercises"
import { isFreeGrammarLevel, isUserPremium } from "@/lib/premium"

const LEVEL_COLOR: Record<string, "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda"> = {
  a1: "chili", a2: "jade", b1: "cielo", b2: "maiz", c1: "jacaranda", c2: "rosa",
}

export default async function GrammarChapterPage({
  params,
}: {
  params: Promise<{ level: string; chapter: string }>
}) {
  const { level, chapter } = await params
  const chapterId = parseInt(chapter, 10)
  if (isNaN(chapterId)) notFound()

  const data = getChapter(level, chapterId)
  if (!data) notFound()

  // Premium gate — redirect to level page (which renders the lock card)
  if (!isFreeGrammarLevel(level)) {
    const premium = await isUserPremium()
    if (!premium) redirect(`/grammar/${level.toLowerCase()}`)
  }

  const exercises = getChapterExercises(level, chapterId) ?? []
  const family = LEVEL_COLOR[level.toLowerCase()] ?? "chili"

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/grammar/${level.toLowerCase()}`}
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver a capítulos</span>
        </Link>

        <div className="mb-6 flex flex-wrap items-baseline gap-3">
          <Badge color={family} variant="soft" size="md">
            {level.toUpperCase()} · Cap. {chapterId + 1}
          </Badge>
        </div>
        <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-800 md:text-4xl">
          {data.title}
        </h1>

        {/* Lesson sections */}
        <div className="mt-8 space-y-8">
          {data.sections.map((section) => (
            <section key={section.id}>
              <h2 className="font-display text-xl font-bold tracking-tight text-ink-800">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Exercises */}
        {exercises.length > 0 ? (
          <div className="mt-12 rounded-[24px] border border-ink-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-800">
                ¡Practica!
              </h2>
              <Badge color="maiz" variant="solid" size="sm">
                {exercises.length} ejercicios
              </Badge>
            </div>
            <ChapterExercises exercises={exercises} level={level.toLowerCase()} chapterId={chapterId} />
          </div>
        ) : (
          <div className="mt-12 rounded-[20px] border-2 border-dashed border-ink-200 bg-card p-8 text-center">
            <div className="text-3xl">🌶</div>
            <div className="mt-3 font-display text-lg font-bold text-ink-800">
              Cocinando los ejercicios…
            </div>
            <div className="mt-1 text-sm text-ink-500">
              Este capítulo aún no se ha generado. Corre{" "}
              <code className="rounded bg-ink-100 px-1 font-mono text-[12px]">
                npm run build:grammar-exercises
              </code>{" "}
              y vuelve.
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Link href={`/grammar/${level.toLowerCase()}`}>
            <Button variant="ghost">← Otro capítulo</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Block({ block }: { block: GrammarContentBlock }) {
  if (block.type === "text") {
    return <p className="text-[15px] leading-relaxed text-ink-700">{block.content}</p>
  }
  if (block.type === "rules" && block.items) {
    return (
      <div className="rounded-[16px] border-l-4 border-chili-400 bg-chili-50 p-5">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-chili-600">
          Reglas clave
        </div>
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-[14px] text-ink-700">
              <span className="text-chili-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (block.type === "examples" && block.examples) {
    return (
      <div className="rounded-[16px] border border-jade-200 bg-jade-50 p-5">
        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wider text-jade-700">
          Ejemplos
        </div>
        <div className="space-y-3">
          {block.examples.map((ex, i) => (
            <div key={i}>
              <div className="font-display text-base font-bold text-ink-800">{ex.es}</div>
              <div className="mt-0.5 text-sm italic text-ink-500">{ex.en}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (block.type === "table" && block.headers && block.rows) {
    return (
      <div className="overflow-hidden rounded-[16px] border border-ink-100">
        <table className="w-full">
          <thead className="border-b border-ink-100 bg-masa-50">
            <tr>
              {block.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-ink-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {block.rows.map((row, i) => (
              <tr key={i} className="hover:bg-masa-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-sm text-ink-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return null
}
