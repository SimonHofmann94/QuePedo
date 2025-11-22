"use client"

import { ActionCard } from "@/components/features/vocabulary/ActionCard"
import { BookOpen, Lock } from "lucide-react"

export default function GrammarPage() {
    const userLevel = "A2" // Mock user level
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]

    const isLocked = (level: string) => {
        const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"]
        return levelOrder.indexOf(level) > levelOrder.indexOf(userLevel)
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Grammar</h1>
                <div className="bg-secondary px-4 py-2 rounded-lg">
                    <span className="text-sm text-muted-foreground">Current Level: </span>
                    <span className="font-bold text-primary">{userLevel}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                {levels.map((level) => {
                    const locked = isLocked(level)
                    return (
                        <div key={level} className={`w-[190px] ${locked ? "opacity-60 grayscale" : ""}`}>
                            <ActionCard
                                title={`Level ${level}`}
                                description={locked ? "Complete previous levels to unlock." : `Master ${level} grammar concepts.`}
                                icon={locked ? <Lock className="h-8 w-8 text-white" /> : <BookOpen className="h-8 w-8 text-white" />}
                                badge={locked ? "Locked" : "Available"}
                                onClick={() => !locked && console.log(`Level ${level} clicked`)}
                                className={locked ? "cursor-not-allowed" : ""}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
