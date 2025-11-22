"use client"

import { useState, useEffect } from "react"
import { AddVocabForm } from "@/components/features/vocabulary/AddVocabForm"
import { AIGenerator } from "@/components/features/vocabulary/AIGenerator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Sparkles, Coins } from "lucide-react"
import { ActionCard } from "@/components/features/vocabulary/ActionCard"
import { StyledSearch } from "@/components/ui/StyledSearch"
import { StyledTable } from "@/components/ui/StyledTable"
import { getVocabulary } from "@/actions/vocabulary"
import { Vocabulary } from "@/types/schemas"

export default function VocabularyPage() {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isAiOpen, setIsAiOpen] = useState(false)
    const [coins, setCoins] = useState(100) // Mock coins
    const [vocab, setVocab] = useState<Vocabulary[]>([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        getVocabulary().then(setVocab)
    }, [])

    const filteredVocab = vocab.filter(item =>
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.translation.toLowerCase().includes(search.toLowerCase()) ||
        item.synonyms?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    )

    // Limit to 10 rows
    const displayVocab = filteredVocab.slice(0, 10)

    return (
        <div className="p-6 space-y-8">
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

            {/* Table */}
            <StyledTable data={displayVocab} />

            {/* Action Cards */}
            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
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
                            getVocabulary().then(setVocab)
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
                            getVocabulary().then(setVocab)
                        }} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
