"use client"

import { VocabList } from "@/components/features/vocabulary/VocabList"
import { AddVocabForm } from "@/components/features/vocabulary/AddVocabForm"
import { AIGenerator } from "@/components/features/vocabulary/AIGenerator"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Sparkles } from "lucide-react"
import { useState } from "react"

export default function VocabularyPage() {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isAiOpen, setIsAiOpen] = useState(false)

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Vocabulary</h1>
                <div className="flex gap-2">
                    <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Sparkles className="mr-2 h-4 w-4" />
                                AI Generate
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate Vocabulary</DialogTitle>
                            </DialogHeader>
                            <AIGenerator onSuccess={() => setIsAiOpen(false)} />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Word
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Word</DialogTitle>
                            </DialogHeader>
                            <AddVocabForm onSuccess={() => setIsAddOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <VocabList />
        </div>
    )
}
