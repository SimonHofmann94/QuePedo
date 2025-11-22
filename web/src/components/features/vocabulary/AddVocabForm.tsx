'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { vocabularySchema } from "@/types/schemas"
import { addVocabulary } from "@/actions/vocabulary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import { z } from "zod"

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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Spanish Term</FormLabel>
                            <FormControl>
                                <Input placeholder="La casa" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="translation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Translation</FormLabel>
                            <FormControl>
                                <Input placeholder="The house" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="context_sentence"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Context Sentence (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Vivo en una casa grande." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Word"}
                </Button>
            </form>
        </Form>
    )
}
