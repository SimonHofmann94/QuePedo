import Link from "next/link"
import { redirect } from "next/navigation"
import { getChapterExercises, getGrammarLevel } from "@chingon/shared"
import { isCallerAdmin } from "@/actions/admin"
import { getPoolCounts } from "@/lib/grammarPool"
import { Badge } from "@/components/ui/badge"
import { GrammarPoolTable } from "./GrammarPoolTable"

const LEVELS = ["a1", "a2", "b1", "b2", "c1", "c2"] as const

// Grammar pool generator — the admin half of "the pool keeps growing".
// Server-gated like the rest of /admin; add_grammar_exercises re-checks.
export default async function AdminGrammarPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>
}) {
  const admin = await isCallerAdmin()
  if (!admin) redirect("/dashboard")

  const { level: raw } = await searchParams
  const level = LEVELS.includes(raw as (typeof LEVELS)[number]) ? (raw as string) : "a1"

  const levelData = getGrammarLevel(level)
  const dbCounts = await getPoolCounts(level)

  const chapters = (levelData?.chapters ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    bundled: getChapterExercises(level, c.id)?.length ?? 0,
    inDb: dbCounts[c.id] ?? 0,
  }))

  const totalBundled = chapters.reduce((n, c) => n + c.bundled, 0)
  const totalDb = chapters.reduce((n, c) => n + c.inDb, 0)

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
            Solo admins
          </div>
          <h1 className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800">
            Pool de gramática
          </h1>
          <p className="mt-3 text-base text-ink-500">
            El bundle es la base; cada generación añade ejercicios nuevos al pool
            compartido. Los duplicados se descartan solos.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {LEVELS.map((l) => (
            <Link key={l} href={`/admin/grammar?level=${l}`} scroll={false}>
              <Badge
                color={l === level ? "chili" : "ink"}
                variant={l === level ? "solid" : "outline"}
                size="md"
              >
                {l.toUpperCase()}
              </Badge>
            </Link>
          ))}
          <span className="ml-auto font-mono text-xs text-ink-500">
            {totalBundled} bundle · {totalDb} en DB
          </span>
        </div>

        <GrammarPoolTable level={level} chapters={chapters} />
      </div>
    </div>
  )
}
