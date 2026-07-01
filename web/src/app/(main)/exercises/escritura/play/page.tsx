"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildWritingPrompt, countWords, type WritingPrompt, type WritingResult } from "@chingon/shared"
import { getWritingFeedback } from "@/actions/writing"

export default function EscrituraPlayPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null)
  const [text, setText] = useState("")
  const [isGrading, setIsGrading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const level = params.get("level") || ""
    const chapter = parseInt(params.get("chapter") || "", 10)
    const built = Number.isNaN(chapter) ? null : buildWritingPrompt(level, chapter)
    if (!built) {
      router.push("/exercises/escritura")
      return
    }
    setPrompt(built)
  }, [router])

  const words = countWords(text)

  const handleSubmit = async () => {
    if (!prompt || !text.trim() || isGrading) return
    setIsGrading(true)
    const feedback = await getWritingFeedback(prompt.level, prompt.chapterId, text)
    const result: WritingResult = { prompt, text, feedback }
    sessionStorage.setItem("escrituraResult", JSON.stringify(result))
    router.push("/exercises/escritura/results")
  }

  if (!prompt) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-jacaranda-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      {/* Header */}
      <button
        type="button"
        onClick={() => router.push("/exercises/escritura")}
        className="mb-5 flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-mono text-xs uppercase tracking-wider">Volver</span>
      </button>

      {/* Prompt card */}
      <div className="mb-5 rounded-[20px] border-2 border-jacaranda-200 bg-jacaranda-50 p-6">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-jacaranda-600">
          {prompt.chapterTitle}
        </div>
        <div className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-ink-800">
          {prompt.prompt}
        </div>
        <ul className="mt-3 space-y-1">
          {prompt.guidance.map((g) => (
            <li key={g} className="text-sm text-ink-600">• {g}</li>
          ))}
        </ul>
      </div>

      {/* Writing area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe aquí tu texto en español…"
        rows={8}
        autoCorrect="off"
        spellCheck={false}
        className="w-full resize-y rounded-[14px] border-2 border-ink-200 bg-white p-4 text-base text-ink-800 outline-none transition-all placeholder:text-ink-400 focus:border-jacaranda-400 focus:ring-4 focus:ring-jacaranda-100"
      />
      <div className="mt-2 flex items-center justify-between font-mono text-xs">
        <span className={words >= prompt.minWords ? "text-jade-600" : "text-ink-400"}>
          {words} palabra{words === 1 ? "" : "s"} · meta {prompt.minWords}
        </span>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={handleSubmit}
        disabled={!text.trim() || isGrading}
        className="mt-5 w-full"
      >
        <Send className="h-4 w-4" />
        {isGrading ? "Cocinando…" : "¡Dale! Revisar"}
      </Button>
    </div>
  )
}
