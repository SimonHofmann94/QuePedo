'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateVocabulary } from "@/actions/ai"
import { addVocabulary } from "@/actions/vocabulary"
import { Loader2 } from "lucide-react"

export function AIGenerator({ onSuccess }: { onSuccess?: () => void }) {
    const [topic, setTopic] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [generatedWords, setGeneratedWords] = useState<any[]>([])

    const handleGenerate = async () => {
        if (!topic) return
        setIsLoading(true)
        const words = await generateVocabulary(topic)
        setGeneratedWords(words)
        setIsLoading(false)
    }

    const handleSaveAll = async () => {
        setIsLoading(true)
        for (const word of generatedWords) {
            await addVocabulary(word)
        }
        setIsLoading(false)
        setGeneratedWords([])
        setTopic("")
        onSuccess?.()
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Enter a topic (e.g. Travel, Food)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
                <Button onClick={handleGenerate} disabled={isLoading || !topic}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Generate"}
                </Button>
            </div>

            {generatedWords.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold">Preview:</h3>
                    <ul className="space-y-1 text-sm">
                        {generatedWords.map((word, i) => (
                            <li key={i} className="flex justify-between border p-2 rounded">
                                <span>{word.term} ({word.translation})</span>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={handleSaveAll} className="w-full">
                        Save All
                    </Button>
                </div>
            )}
        </div>
    )
}
