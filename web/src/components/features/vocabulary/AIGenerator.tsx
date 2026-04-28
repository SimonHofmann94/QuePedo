"use client"

import { useState } from "react"
import { generateVocabulary } from "@/actions/ai"
import { addVocabulary } from "@/actions/vocabulary"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, SparkleIcon, XIcon } from "@/components/ui/icons"

interface GeneratedWord {
  term: string
  translations: Record<string, string>
  context_sentence?: string
  difficulty_rating: number
  tags: string[]
  synonyms: string[]
}

function getDisplayTranslation(translations: Record<string, string>): string {
  if (translations.de) return translations.de
  if (translations.en) return translations.en
  const keys = Object.keys(translations)
  return keys.length > 0 ? translations[keys[0]] : ""
}

export function AIGenerator({ onSuccess }: { onSuccess?: () => void }) {
  const [prompt, setPrompt] = useState("")
  const [count, setCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedWords, setGeneratedWords] = useState<GeneratedWord[]>([])
  const [savedStatus, setSavedStatus] = useState<Record<number, "saved" | "error" | null>>({})

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt) return
    const wordCount = prompt.trim().split(/\s+/).length
    if (wordCount > 50) {
      alert("Máximo 50 palabras en la descripción.")
      return
    }
    setIsLoading(true)
    setSavedStatus({})
    try {
      const words = await generateVocabulary(prompt, count)
      setGeneratedWords(words)
    } catch (e) {
      console.error(e)
      alert("¡Ay, no! No se pudo generar el vocabulario.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveWord = async (word: GeneratedWord, index: number) => {
    const result = await addVocabulary(word, "ai_generated", prompt)
    setSavedStatus((p) => ({ ...p, [index]: result.error ? "error" : "saved" }))
    return result
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    for (let i = 0; i < generatedWords.length; i++) {
      if (!savedStatus[i]) await handleSaveWord(generatedWords[i], i)
    }
    setIsSaving(false)
    if (generatedWords.every((_, i) => savedStatus[i] === "saved")) {
      setGeneratedWords([])
      setPrompt("")
      setSavedStatus({})
      onSuccess?.()
    }
  }

  const handleReset = () => {
    setGeneratedWords([])
    setSavedStatus({})
  }

  if (generatedWords.length === 0) {
    return (
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[13px] font-semibold text-ink-700">
            Describe lo que quieres aprender
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Quiero aprender palabras para pedir comida en una taquería de CDMX…"
            rows={4}
            className="rounded-[12px] border-2 border-ink-200 bg-white px-3.5 py-2.5 font-body text-[15px] text-ink-800 placeholder:text-ink-400 outline-none focus-visible:border-chili-400 focus-visible:ring-4 focus-visible:ring-chili-100"
          />
          <div className="text-xs text-ink-400">Máximo 50 palabras</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[13px] font-semibold text-ink-700">
            Número de palabras
          </label>
          <Input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              setCount(isNaN(v) ? 5 : Math.min(20, Math.max(1, v)))
            }}
          />
        </div>
        <Button type="submit" variant="primary" size="lg" disabled={isLoading || !prompt} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : <SparkleIcon size={18} />}
          {isLoading ? "Cocinando…" : "¡Generar!"}
        </Button>
      </form>
    )
  }

  return (
    <div className="space-y-4">
      <div className="font-display text-lg font-bold text-ink-800">Vista previa</div>
      <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
        {generatedWords.map((word, i) => {
          const status = savedStatus[i]
          return (
            <div
              key={i}
              className={`rounded-[14px] border-2 p-3 ${
                status === "saved"
                  ? "border-jade-300 bg-jade-50"
                  : status === "error"
                    ? "border-rosa-300 bg-rosa-50"
                    : "border-ink-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-bold tracking-tight text-ink-800">
                    {word.term}
                  </div>
                  <div className="text-sm text-ink-500">{getDisplayTranslation(word.translations)}</div>
                  {word.context_sentence && (
                    <div className="mt-1 text-xs italic text-ink-400">
                      {word.context_sentence}
                    </div>
                  )}
                  {word.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {word.tags.map((tag, j) => (
                        <Badge key={j} color="jacaranda" variant="soft" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {status === "saved" && <CheckIcon size={20} className="text-jade-600" />}
                {status === "error" && <XIcon size={20} className="text-rosa-600" />}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={handleReset} disabled={isSaving} className="flex-1">
          {Object.keys(savedStatus).length > 0 ? "Listo" : "Cancelar"}
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveAll}
          disabled={isSaving || generatedWords.every((_, i) => savedStatus[i] === "saved")}
          className="flex-1"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <CheckIcon size={18} />}
          {isSaving ? "Guardando…" : "¡Guardar todas!"}
        </Button>
      </div>
    </div>
  )
}
