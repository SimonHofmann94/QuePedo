"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"
import { StyledCard } from "@/components/ui/StyledCard"
import { StyledButton } from "@/components/ui/StyledButton"
import { StyledCheckbox } from "@/components/ui/StyledCheckbox"

type QuizType = 'term_to_translation' | 'translation_to_term'

interface QuizSettings {
    wordCount: number
    difficulty: number[]
    level: string[]
    quizType: QuizType
    showContext: boolean
    showTags: boolean
}

export default function QuizSettingsPage() {
    const router = useRouter()
    const [settings, setSettings] = useState<QuizSettings>({
        wordCount: 10,
        difficulty: [1, 2, 3, 4, 5],
        level: ['A1', 'A2', 'B1', 'B2'],
        quizType: 'term_to_translation',
        showContext: true,
        showTags: false,
    })
    const [isLoading, setIsLoading] = useState(false)

    const difficulties = [1, 2, 3, 4, 5]
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

    const toggleDifficulty = (d: number) => {
        setSettings(prev => ({
            ...prev,
            difficulty: prev.difficulty.includes(d)
                ? prev.difficulty.filter(x => x !== d)
                : [...prev.difficulty, d]
        }))
    }

    const toggleLevel = (l: string) => {
        setSettings(prev => ({
            ...prev,
            level: prev.level.includes(l)
                ? prev.level.filter(x => x !== l)
                : [...prev.level, l]
        }))
    }

    const handleStartQuiz = () => {
        setIsLoading(true)
        sessionStorage.setItem('quizSettings', JSON.stringify(settings))
        router.push('/exercises/quiz/play')
    }

    return (
        <div className="p-6 max-w-xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 justify-center">
                <Settings className="h-8 w-8 text-orange-500" />
                <h1 className="text-3xl font-bold tracking-tight text-white">Quiz Settings</h1>
            </div>

            <StyledCard>
                <h2 className="card-title">Configure Your Quiz</h2>

                {/* Word Count */}
                <div className="card-section">
                    <label className="section-label">
                        Number of Words: <span className="text-orange-500 font-bold">{settings.wordCount}</span>
                    </label>
                    <input
                        type="range"
                        min={5}
                        max={50}
                        step={5}
                        value={settings.wordCount}
                        onChange={(e) => setSettings(prev => ({ ...prev, wordCount: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>5</span>
                        <span>25</span>
                        <span>50</span>
                    </div>
                </div>

                {/* Difficulty */}
                <div className="card-section">
                    <label className="section-label">Difficulty Level</label>
                    <div className="flex gap-3">
                        {difficulties.map(d => (
                            <button
                                key={d}
                                onClick={() => toggleDifficulty(d)}
                                className={`w-12 h-12 rounded-full font-bold transition-all border-2 ${
                                    settings.difficulty.includes(d)
                                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                                        : 'bg-transparent border-[#444] text-gray-400 hover:border-orange-500/50'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Level */}
                <div className="card-section">
                    <label className="section-label">CEFR Level</label>
                    <div className="flex flex-wrap gap-2">
                        {levels.map(l => (
                            <button
                                key={l}
                                onClick={() => toggleLevel(l)}
                                className={`px-4 py-2 rounded-full font-medium transition-all border-2 ${
                                    settings.level.includes(l)
                                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                                        : 'bg-transparent border-[#444] text-gray-400 hover:border-orange-500/50'
                                }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quiz Type */}
                <div className="card-section">
                    <label className="section-label">Quiz Direction</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setSettings(prev => ({ ...prev, quizType: 'term_to_translation' }))}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                settings.quizType === 'term_to_translation'
                                    ? 'border-orange-500 bg-orange-500/10'
                                    : 'border-[#333] hover:border-[#444]'
                            }`}
                        >
                            <div className="font-medium text-white">ES → DE</div>
                            <div className="text-xs text-gray-500 mt-1">See Spanish, type German</div>
                        </button>
                        <button
                            onClick={() => setSettings(prev => ({ ...prev, quizType: 'translation_to_term' }))}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                settings.quizType === 'translation_to_term'
                                    ? 'border-orange-500 bg-orange-500/10'
                                    : 'border-[#333] hover:border-[#444]'
                            }`}
                        >
                            <div className="font-medium text-white">DE → ES</div>
                            <div className="text-xs text-gray-500 mt-1">See German, type Spanish</div>
                        </button>
                    </div>
                </div>

                {/* Options */}
                <div className="card-section">
                    <label className="section-label">Options</label>
                    <div className="space-y-4">
                        <StyledCheckbox
                            checked={settings.showContext}
                            onChange={(checked) => setSettings(prev => ({ ...prev, showContext: checked }))}
                            label="Show context sentences as hints"
                            id="showContext"
                        />
                        <StyledCheckbox
                            checked={settings.showTags}
                            onChange={(checked) => setSettings(prev => ({ ...prev, showTags: checked }))}
                            label="Show word tags"
                            id="showTags"
                        />
                    </div>
                </div>
            </StyledCard>

            {/* Start Button */}
            <StyledButton
                onClick={handleStartQuiz}
                disabled={isLoading || settings.difficulty.length === 0}
            >
                {isLoading ? 'Loading...' : 'Start Quiz'}
            </StyledButton>
        </div>
    )
}
