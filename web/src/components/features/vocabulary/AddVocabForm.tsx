'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userVocabularySchema } from "@/types/schemas"
import { addVocabulary } from "@/actions/vocabulary"
import { useState } from "react"
import { z } from "zod"
import styles from "@/components/ui/StyledForm.module.css"

// Extended schema for the form with separate translation fields
const addVocabFormSchema = z.object({
    term: z.string().min(1, "Term is required"),
    translation_de: z.string().optional(),
    translation_en: z.string().optional(),
    context_sentence: z.string().optional(),
    difficulty_rating: z.number().min(1).max(5).default(1),
    tags: z.array(z.string()).default([]),
    synonyms: z.array(z.string()).default([]),
}).refine(data => data.translation_de || data.translation_en, {
    message: "At least one translation is required",
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

        // Build translations object
        const translations: Record<string, string> = {}
        if (data.translation_de) translations.de = data.translation_de
        if (data.translation_en) translations.en = data.translation_en

        const vocabData = {
            term: data.term,
            translations,
            context_sentence: data.context_sentence,
            difficulty_rating: data.difficulty_rating,
            tags: data.tags,
            synonyms: data.synonyms,
        }

        const result = await addVocabulary(vocabData, 'manual')

        setIsSubmitting(false)

        if (result.error) {
            setError(result.error)
        } else {
            form.reset()
            onSuccess?.()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formArea}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className={styles.formGroup}>
                        <label className={styles.subTitle}>Spanish Term</label>
                        <input
                            {...form.register("term")}
                            className={styles.formStyle}
                            placeholder="La casa"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.subTitle}>German Translation</label>
                        <input
                            {...form.register("translation_de")}
                            className={styles.formStyle}
                            placeholder="Das Haus"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.subTitle}>English Translation (Optional)</label>
                        <input
                            {...form.register("translation_en")}
                            className={styles.formStyle}
                            placeholder="The house"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.subTitle}>Synonyms (comma separated)</label>
                        <input
                            className={styles.formStyle}
                            placeholder="hogar, vivienda"
                            onChange={(e) => {
                                const val = e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                form.setValue("synonyms", val)
                            }}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.subTitle}>Tags (comma separated)</label>
                        <input
                            className={styles.formStyle}
                            placeholder="noun, building"
                            onChange={(e) => {
                                const val = e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                form.setValue("tags", val)
                            }}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.subTitle}>Context Sentence (Optional)</label>
                        <input
                            {...form.register("context_sentence")}
                            className={styles.formStyle}
                            placeholder="Vivo en una casa grande."
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mb-4">{error}</div>
                    )}

                    <button type="submit" className={styles.btn} disabled={isSubmitting}>
                        {isSubmitting ? "ADDING..." : "ADD WORD"}
                    </button>
                </form>
            </div>
        </div>
    )
}
