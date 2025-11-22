'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { vocabularySchema } from "@/types/schemas"
import { addVocabulary } from "@/actions/vocabulary"
import { useState } from "react"
import { z } from "zod"
import styles from "@/components/ui/StyledForm.module.css"

type FormValues = z.infer<typeof vocabularySchema>

export function AddVocabForm({ onSuccess }: { onSuccess?: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(vocabularySchema),
        defaultValues: {
            term: "",
            translation: "",
            context_sentence: "",
            difficulty_rating: 1,
            tags: [],
            synonyms: [],
        },
    })

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        await addVocabulary(data)
        setIsSubmitting(false)
        form.reset()
        onSuccess?.()
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
                        <label className={styles.subTitle}>Translation</label>
                        <input
                            {...form.register("translation")}
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

                    <button type="submit" className={styles.btn} disabled={isSubmitting}>
                        {isSubmitting ? "ADDING..." : "ADD WORD"}
                    </button>
                </form>
            </div>
        </div>
    )
}
