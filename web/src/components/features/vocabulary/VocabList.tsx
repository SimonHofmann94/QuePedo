'use client'

import { useEffect, useState } from "react"
import { getVocabulary } from "@/actions/vocabulary"
import { VocabCard } from "./VocabCard"
import { Input } from "@/components/ui/input"
import { Vocabulary } from "@/types/schemas"

export function VocabList() {
    const [vocab, setVocab] = useState<Vocabulary[]>([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        getVocabulary().then(setVocab)
    }, [])

    const filteredVocab = vocab.filter(item =>
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.translation.toLowerCase().includes(search.toLowerCase())
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
