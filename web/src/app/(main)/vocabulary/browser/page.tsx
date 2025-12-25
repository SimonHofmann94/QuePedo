"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Filter } from "lucide-react"
import { StyledSearch } from "@/components/ui/StyledSearch"
import { StyledTable } from "@/components/ui/StyledTable"
import { getUserVocabulary, deleteMultipleVocabulary } from "@/actions/vocabulary"
import { UserVocabulary } from "@/types/schemas"

// Helper to search within translations object
function translationsMatch(translations: Record<string, string>, search: string): boolean {
    if (!translations || typeof translations !== 'object') return false
    return Object.values(translations).some(t =>
        t.toLowerCase().includes(search.toLowerCase())
    )
}

export default function VocabularyBrowserPage() {
    const router = useRouter()
    const [vocab, setVocab] = useState<UserVocabulary[]>([])
    const [search, setSearch] = useState("")
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [difficultyFilter, setDifficultyFilter] = useState<number[]>([1, 2, 3, 4, 5])
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        getUserVocabulary().then((data) => {
            setVocab(data)
            setIsLoading(false)
        })
    }, [])

    const filteredVocab = vocab.filter(item => {
        const matchesSearch =
            item.term.toLowerCase().includes(search.toLowerCase()) ||
            translationsMatch(item.translations, search) ||
            item.synonyms?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
            item.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))

        const matchesDifficulty = difficultyFilter.includes(item.difficulty_rating || 1)

        return matchesSearch && matchesDifficulty
    })

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return
        setIsDeleting(true)
        try {
            const result = await deleteMultipleVocabulary(Array.from(selectedIds))
            if (result.success) {
                setSelectedIds(new Set())
                const newVocab = await getUserVocabulary()
                setVocab(newVocab)
            }
        } finally {
            setIsDeleting(false)
        }
    }

    const toggleDifficulty = (d: number) => {
        setDifficultyFilter(prev =>
            prev.includes(d)
                ? prev.filter(x => x !== d)
                : [...prev, d]
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/vocabulary')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back</span>
                </button>
                <h1 className="text-2xl font-bold tracking-tight">Vocabulary Browser</h1>
            </div>

            {/* Search and Filter Row */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <StyledSearch
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by term, translation, synonyms, or tags..."
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                        showFilters
                            ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                            : 'bg-[#222] border-[#333] text-gray-400 hover:border-orange-500/50'
                    }`}
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="p-4 bg-[#1a1a1a] border border-[#333] rounded-xl space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 uppercase tracking-wide mb-2 block">
                            Difficulty Level
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(d => (
                                <button
                                    key={d}
                                    onClick={() => toggleDifficulty(d)}
                                    className={`w-10 h-10 rounded-full font-bold transition-all border-2 ${
                                        difficultyFilter.includes(d)
                                            ? 'bg-orange-500 border-orange-500 text-white'
                                            : 'bg-transparent border-[#444] text-gray-400 hover:border-orange-500/50'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Row */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    Showing <span className="text-orange-500 font-bold">{filteredVocab.length}</span> of <span className="text-white font-bold">{vocab.length}</span> words
                </span>
                {selectedIds.size > 0 && (
                    <span className="text-sm text-orange-500">
                        {selectedIds.size} selected
                    </span>
                )}
            </div>

            {/* Table */}
            <StyledTable
                data={filteredVocab}
                selectable={true}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
            />

            {/* Delete Selected Button */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-4 sticky bottom-6 bg-[#0a0a0a] p-4 rounded-xl border border-[#333]">
                    <button
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? 'Deleting...' : `Delete ${selectedIds.size} words`}
                    </button>
                    <button
                        onClick={() => setSelectedIds(new Set())}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Clear selection
                    </button>
                </div>
            )}

            {/* Empty State */}
            {filteredVocab.length === 0 && !isLoading && (
                <div className="text-center py-12 text-gray-500">
                    {vocab.length === 0
                        ? "No vocabulary yet. Add some words to get started!"
                        : "No words match your search or filters."}
                </div>
            )}
        </div>
    )
}
