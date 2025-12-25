'use client'

import { useEffect, useState } from "react"
import { getUserVocabulary } from "@/actions/vocabulary"
import { VocabCard } from "./VocabCard"
import { Input } from "@/components/ui/input"
import { UserVocabulary } from "@/types/schemas"

// Helper to search within translations object
function translationsMatch(translations: Record<string, string>, search: string): boolean {
    if (!translations || typeof translations !== 'object') return false
    return Object.values(translations).some(t =>
        t.toLowerCase().includes(search.toLowerCase())
    )
}

export function VocabList() {
    const [vocab, setVocab] = useState<UserVocabulary[]>([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        getUserVocabulary().then(setVocab)
    }, [])

    const filteredVocab = vocab.filter(item =>
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        translationsMatch(item.translations, search)
    )

    return (
        <div className="space-y-6">
            <Input
                placeholder="Search vocabulary..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredVocab.map((item) => (
                    <VocabCard key={item.id} item={item} />
                ))}
            </div>

            {filteredVocab.length === 0 && (
                <p className="text-center text-muted-foreground">No words found.</p>
            )}
        </div>
    )
}
