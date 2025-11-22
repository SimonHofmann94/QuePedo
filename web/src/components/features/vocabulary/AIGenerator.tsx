'use client'

import { useState } from "react"
import { generateVocabulary } from "@/actions/ai"
import { addVocabulary } from "@/actions/vocabulary"
import { Loader2 } from "lucide-react"
import styles from "@/components/ui/StyledForm.module.css"

export function AIGenerator({ onSuccess }: { onSuccess?: () => void }) {
    const [prompt, setPrompt] = useState("")
    const [count, setCount] = useState(5)
    const [isLoading, setIsLoading] = useState(false)
    const [generatedWords, setGeneratedWords] = useState<any[]>([])

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt) return

        // Word count validation
        const wordCount = prompt.trim().split(/\s+/).length
        if (wordCount > 50) {
            alert("Please limit your description to 50 words.")
            return
        }

        setIsLoading(true)
        try {
            const words = await generateVocabulary(prompt, count)
            setGeneratedWords(words)
        } catch (error) {
            console.error(error)
            alert("Failed to generate vocabulary")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveAll = async () => {
        setIsLoading(true)
        for (const word of generatedWords) {
            await addVocabulary(word)
        }
        setIsLoading(false)
        setGeneratedWords([])
        setPrompt("")
        onSuccess?.()
    }

    return (
        <div className={styles.container}>
            <div className={styles.formArea}>
                {!generatedWords.length ? (
                    <form onSubmit={handleGenerate} className="w-full">
                        <div className={styles.formGroup}>
                            <label className={styles.subTitle}>Describe what you want (max 50 words)</label>
                            <textarea
                                className={styles.formStyle}
                                placeholder="I want to learn words related to ordering food in a restaurant in Mexico..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.subTitle}>Number of words</label>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                className={styles.formStyle}
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value))}
                            />
                        </div>

                        <button type="submit" className={styles.btn} disabled={isLoading || !prompt}>
                            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "GENERATE"}
                        </button>
                    </form>
                ) : (
                    <div className="w-full space-y-4">
                        <h3 className={styles.title}>Preview</h3>
                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                            {generatedWords.map((word, i) => (
                                <div key={i} className="p-3 rounded bg-[#222] border border-[#333]">
                                    <div className="font-bold text-[#ff9966]">{word.term}</div>
                                    <div className="text-sm text-gray-300">{word.translation}</div>
                                    <div className="text-xs text-gray-500 mt-1">{word.context_sentence}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setGeneratedWords([])} className={styles.btn} style={{ background: '#333', color: 'white' }}>
                                CANCEL
                            </button>
                            <button onClick={handleSaveAll} className={styles.btn}>
                                SAVE ALL
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
