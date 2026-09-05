"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { adminGenerateGrammarExercises } from "@/actions/grammar"

type Row = { id: number; title: string; bundled: number; inDb: number }

export function GrammarPoolTable({ level, chapters }: { level: string; chapters: Row[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<number | null>(null)
  const [note, setNote] = useState<Record<number, string>>({})

  const generate = async (chapterId: number) => {
    setBusyId(chapterId)
    setNote((n) => ({ ...n, [chapterId]: "Cocinando…" }))
    const res = await adminGenerateGrammarExercises(level, chapterId)
    setBusyId(null)
    setNote((n) => ({
      ...n,
      [chapterId]: res.error
        ? `¡Ay, no! ${res.error}`
        : res.inserted === 0
          ? `Sin novedades — ${res.generated} repetidos`
          : `¡Órale! +${res.inserted} nuevos${res.inserted < res.generated ? ` (${res.generated - res.inserted} repetidos)` : ""}`,
    }))
    // New rows only show up after the server re-reads the pool.
    startTransition(() => router.refresh())
  }

  return (
    <div className="divide-y divide-ink-100 rounded-[20px] border border-ink-100 bg-white shadow-sm">
      {chapters.map((c) => (
        <div key={c.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
          <span className="font-mono text-xs text-ink-400">{String(c.id + 1).padStart(2, "0")}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-base font-bold text-ink-800">
              {c.title}
            </span>
            <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-500">
              {c.bundled} bundle · {c.inDb} en DB
              {note[c.id] ? ` · ${note[c.id]}` : ""}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={busyId !== null || pending}
            onClick={() => generate(c.id)}
          >
            {busyId === c.id ? "Cocinando…" : "+12"}
          </Button>
        </div>
      ))}
    </div>
  )
}
