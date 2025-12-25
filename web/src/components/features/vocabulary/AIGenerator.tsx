'use client'

import { useState } from "react"
import { generateVocabulary } from "@/actions/ai"
import { addVocabulary } from "@/actions/vocabulary"
import { Loader2, Check, X } from "lucide-react"
import styles from "@/components/ui/StyledForm.module.css"

interface GeneratedWord {
    term: string
    translations: Record<string, string>
    context_sentence?: string
    difficulty_rating: number
    tags: string[]
    synonyms: string[]
}

// Helper to get the first available translation
function getDisplayTranslation(translations: Record<string, string>): string {
    // Prefer German, then English, then first available
    if (translations.de) return translations.de
    if (translations.en) return translations.en
    const keys = Object.keys(translations)
    return keys.length > 0 ? translations[keys[0]] : ''
}

export function AIGenerator({ onSuccess }: { onSuccess?: () => void }) {
    const [prompt, setPrompt] = useState("")
    const [count, setCount] = useState(5)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [generatedWords, setGeneratedWords] = useState<GeneratedWord[]>([])
    const [savedStatus, setSavedStatus] = useState<Record<number, 'saved' | 'error' | null>>({})

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
        setSavedStatus({})
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

    const handleSaveWord = async (word: GeneratedWord, index: number) => {
        const result = await addVocabulary(word, 'ai_generated', prompt)
        if (result.error) {
            setSavedStatus(prev => ({ ...prev, [index]: 'error' }))
        } else {
            setSavedStatus(prev => ({ ...prev, [index]: 'saved' }))
        }
        return result
    }

    const handleSaveAll = async () => {
        setIsSaving(true)
        for (let i = 0; i < generatedWords.length; i++) {
            if (!savedStatus[i]) {
                await handleSaveWord(generatedWords[i], i)
            }
        }
        setIsSaving(false)

        // Check if all were saved successfully
        const allSaved = generatedWords.every((_, i) => savedStatus[i] === 'saved')
        if (allSaved) {
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
                                onChange={(e) => {
                                    const val = parseInt(e.target.value)
                                    setCount(isNaN(val) ? 5 : Math.min(20, Math.max(1, val)))
                                }}
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
                                <div
                                    key={i}
                                    className={`p-3 rounded border ${
                                        savedStatus[i] === 'saved'
                                            ? 'bg-green-900/20 border-green-700'
                                            : savedStatus[i] === 'error'
                                            ? 'bg-red-900/20 border-red-700'
                                            : 'bg-[#222] border-[#333]'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-bold text-[#ff9966]">{word.term}</div>
                                            <div className="text-sm text-gray-300">
                                                {getDisplayTranslation(word.translations)}
                                            </div>
                                            {word.context_sentence && (
                                                <div className="text-xs text-gray-500 mt-1 italic">
                                                    {word.context_sentence}
                                                </div>
                                            )}
                                            {word.tags.length > 0 && (
                                                <div className="flex gap-1 mt-2 flex-wrap">
                                                    {word.tags.map((tag, j) => (
                                                        <span key={j} className="text-xs px-2 py-0.5 bg-[#333] rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-2">
                                            {savedStatus[i] === 'saved' ? (
                                                <Check className="w-5 h-5 text-green-500" />
                                            ) : savedStatus[i] === 'error' ? (
                                                <X className="w-5 h-5 text-red-500" />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleReset}
                                className={styles.btn}
                                style={{ background: '#333', color: 'white' }}
                                disabled={isSaving}
                            >
                                {Object.keys(savedStatus).length > 0 ? 'DONE' : 'CANCEL'}
                            </button>
                            <button
                                onClick={handleSaveAll}
                                className={styles.btn}
                                disabled={isSaving || generatedWords.every((_, i) => savedStatus[i] === 'saved')}
                            >
                                {isSaving ? <Loader2 className="animate-spin mx-auto" /> : "SAVE ALL"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
