"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AddVocabForm } from "@/components/features/vocabulary/AddVocabForm"
import { AIGenerator } from "@/components/features/vocabulary/AIGenerator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Sparkles, Coins, Trash2, BookOpen } from "lucide-react"
import { ActionCard } from "@/components/features/vocabulary/ActionCard"
import { StyledSearch } from "@/components/ui/StyledSearch"
import { StyledTable } from "@/components/ui/StyledTable"
import { StyledButton } from "@/components/ui/StyledButton"
import { getUserVocabulary, deleteMultipleVocabulary } from "@/actions/vocabulary"
import { UserVocabulary } from "@/types/schemas"

// Helper to search within translations object
function translationsMatch(translations: Record<string, string>, search: string): boolean {
    if (!translations || typeof translations !== 'object') return false
    return Object.values(translations).some(t =>
        t.toLowerCase().includes(search.toLowerCase())
    )
}

export default function VocabularyPage() {
    const router = useRouter()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isAiOpen, setIsAiOpen] = useState(false)
    const [coins, setCoins] = useState(100) // Mock coins
    const [vocab, setVocab] = useState<UserVocabulary[]>([])
    const [search, setSearch] = useState("")
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        getUserVocabulary().then(setVocab)
    }, [])

    const filteredVocab = vocab.filter(item =>
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        translationsMatch(item.translations, search) ||
        item.synonyms?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    )

    // Limit to 10 rows
    const displayVocab = filteredVocab.slice(0, 10)

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

    return (
        <div className="p-6 space-y-6">
            {/* Header & Coins */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Vocabulary</h1>
                <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-1 text-yellow-700">
                    <Coins className="h-4 w-4" />
                    <span className="font-bold">{coins}</span>
                </div>
            </div>

            {/* Search Bar */}
            <StyledSearch
                value={search}
                onChange={setSearch}
                placeholder="Search vocabulary..."
            />

            {/* Info Row */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    Showing <span className="text-orange-500 font-bold">{displayVocab.length}</span> of <span className="text-white font-bold">{vocab.length}</span> words
                </span>
                <div className="w-48">
                    <StyledButton onClick={() => router.push('/vocabulary/browser')}>
                        <span className="flex items-center gap-2 justify-center">
                            <BookOpen className="h-4 w-4" />
                            View All
                        </span>
                    </StyledButton>
                </div>
            </div>

            {/* Table with Selection */}
            <StyledTable
                data={displayVocab}
                selectable={true}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
            />

            {/* Delete Selected Button */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 rounded-lg text-red-500 transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
                    </button>
                    <button
                        onClick={() => setSelectedIds(new Set())}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Clear selection
                    </button>
                </div>
            )}

            {/* Action Cards */}
            <div className="flex flex-wrap gap-8 justify-center md:justify-start pt-4">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <div className="w-[190px]">
                            <ActionCard
                                title="Add Word"
                                description="Manually add a new word to your collection."
                                icon={<Plus className="h-8 w-8 text-white" />}
                                badge="Manual"
                            />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="bg-[#151515] border-[#333] text-white p-0 overflow-hidden sm:max-w-[425px]">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle>Add New Word</DialogTitle>
                        </DialogHeader>
                        <AddVocabForm onSuccess={() => {
                            setIsAddOpen(false)
                            getUserVocabulary().then(setVocab)
                        }} />
                    </DialogContent>
                </Dialog>

                <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
                    <DialogTrigger asChild>
                        <div className="w-[190px]">
                            <ActionCard
                                title="AI Generate"
                                description="Generate words by topic using Gemini AI."
                                icon={<Sparkles className="h-8 w-8 text-white" />}
                                badge="AI Powered"
                            />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="bg-[#151515] border-[#333] text-white p-0 overflow-hidden sm:max-w-[425px]">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle>Generate Vocabulary</DialogTitle>
                        </DialogHeader>
                        <AIGenerator onSuccess={() => {
                            setIsAiOpen(false)
                            getUserVocabulary().then(setVocab)
                        }} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
