"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addVocabulary } from "@/actions/vocabulary"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "@/components/ui/icons"

const addVocabFormSchema = z.object({
  term: z.string().min(1, "El término es obligatorio"),
  translation_de: z.string().optional(),
  translation_en: z.string().optional(),
  context_sentence: z.string().optional(),
  difficulty_rating: z.number().min(1).max(5).default(1),
  tags: z.array(z.string()).default([]),
  synonyms: z.array(z.string()).default([]),
}).refine((d) => d.translation_de || d.translation_en, {
  message: "Pon al menos una traducción",
  path: ["translation_de"],
})

type FormValues = z.infer<typeof addVocabFormSchema>

export function AddVocabForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(addVocabFormSchema),
    defaultValues: {
      term: "",
      translation_de: "",
      translation_en: "",
      context_sentence: "",
      difficulty_rating: 1,
      tags: [],
      synonyms: [],
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setError(null)
    const translations: Record<string, string> = {}
    if (data.translation_de) translations.de = data.translation_de
    if (data.translation_en) translations.en = data.translation_en
    const result = await addVocabulary(
      {
        term: data.term,
        translations,
        context_sentence: data.context_sentence,
        difficulty_rating: data.difficulty_rating,
        tags: data.tags,
        synonyms: data.synonyms,
      },
      "manual",
    )
    setIsSubmitting(false)
    if (result.error) setError(result.error)
    else {
      form.reset()
      onSuccess?.()
    }
  }

  const labelCls = "font-body text-[13px] font-semibold text-ink-700"

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Término en español</label>
        <Input {...form.register("term")} placeholder="la casa" />
        {form.formState.errors.term && (
          <div className="text-xs font-semibold text-rosa-600">
            {form.formState.errors.term.message}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Traducción alemana</label>
        <Input {...form.register("translation_de")} placeholder="das Haus" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Traducción inglesa (opcional)</label>
        <Input {...form.register("translation_en")} placeholder="the house" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Sinónimos</label>
        <Input
          placeholder="hogar, vivienda"
          onChange={(e) => {
            const val = e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            form.setValue("synonyms", val)
          }}
        />
        <div className="text-xs text-ink-400">Separados por coma</div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Frase de contexto</label>
        <Input
          {...form.register("context_sentence")}
          placeholder="Vivo en una casa grande."
        />
      </div>

      {error && (
        <div className="rounded-[12px] border-2 border-rosa-200 bg-rosa-50 px-3 py-2 text-sm font-semibold text-rosa-700">
          ¡Ay, no! {error}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
        <PlusIcon size={18} />
        {isSubmitting ? "Cocinando…" : "¡Añadir!"}
      </Button>
    </form>
  )
}
