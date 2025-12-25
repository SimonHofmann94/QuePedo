"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trophy, RotateCcw, Home, Target, TrendingUp, AlertTriangle } from "lucide-react"
import { UserVocabulary } from "@/types/schemas"

interface QuizResult {
    word: UserVocabulary
    correct: boolean
}

interface QuizData {
    results: QuizResult[]
    settings: {
        wordCount: number
        quizType: string
    }
}

function getDisplayTranslation(translations: Record<string, string>): string {
    if (!translations || typeof translations !== 'object') return ''
    if (translations.de) return translations.de
    if (translations.en) return translations.en
    const keys = Object.keys(translations)
    return keys.length > 0 ? translations[keys[0]] : ''
}

export default function QuizResultsPage() {
    const router = useRouter()
    const [quizData, setQuizData] = useState<QuizData | null>(null)

    useEffect(() => {
        const savedResults = sessionStorage.getItem('quizResults')
        if (!savedResults) {
            router.push('/exercises/quiz')
            return
        }

        setQuizData(JSON.parse(savedResults))
    }, [router])

    if (!quizData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    const { results } = quizData
    const correctCount = results.filter(r => r.correct).length
    const incorrectCount = results.filter(r => !r.correct).length
    const totalCount = results.length
    const percentage = Math.round((correctCount / totalCount) * 100)

    const incorrectWords = results.filter(r => !r.correct).map(r => r.word)

    // Determine performance level
    let performanceLevel: 'excellent' | 'good' | 'needs_work' | 'struggling'
    let performanceColor: string
    let performanceMessage: string

    if (percentage >= 90) {
        performanceLevel = 'excellent'
        performanceColor = 'text-green-500'
        performanceMessage = 'Excellent work! You\'re mastering these words!'
    } else if (percentage >= 70) {
        performanceLevel = 'good'
        performanceColor = 'text-blue-500'
        performanceMessage = 'Good job! Keep practicing to perfect your skills.'
    } else if (percentage >= 50) {
        performanceLevel = 'needs_work'
        performanceColor = 'text-yellow-500'
        performanceMessage = 'You\'re getting there! Focus on the words you missed.'
    } else {
        performanceLevel = 'struggling'
        performanceColor = 'text-red-500'
        performanceMessage = 'Don\'t give up! Review these words and try again.'
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
                    <Trophy className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Quiz Complete!</h1>
            </div>

            {/* Score Card */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-8 text-center">
                <div className={`text-7xl font-bold ${performanceColor} mb-2`}>
                    {percentage}%
                </div>
                <div className="text-gray-400 mb-4">
                    {correctCount} of {totalCount} correct
                </div>
                <p className={`${performanceColor} font-medium`}>
                    {performanceMessage}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-4 text-center">
                    <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{totalCount}</div>
                    <div className="text-xs text-gray-500">Total Words</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-500">{correctCount}</div>
                    <div className="text-xs text-gray-500">Correct</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-500">{incorrectCount}</div>
                    <div className="text-xs text-gray-500">To Review</div>
                </div>
            </div>

            {/* Words to Review */}
            {incorrectWords.length > 0 && (
                <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Words to Review
                    </h2>
                    <div className="space-y-3">
                        {incorrectWords.map((word, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-[#222] rounded-lg border border-[#333]"
                            >
                                <div>
                                    <div className="font-medium text-orange-500">{word.term}</div>
                                    <div className="text-sm text-gray-400">
                                        {getDisplayTranslation(word.translations)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(d => (
                                        <div
                                            key={d}
                                            className={`w-2 h-2 rounded-full ${
                                                d <= (word.difficulty_rating || 1)
                                                    ? 'bg-orange-500'
                                                    : 'bg-[#333]'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => router.push('/exercises/quiz')}
                    className="flex-1 py-4 px-6 bg-[#333] hover:bg-[#444] rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                    <RotateCcw className="h-5 w-5" />
                    Try Again
                </button>
                <button
                    onClick={() => router.push('/exercises')}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                    <Home className="h-5 w-5" />
                    Exercises
                </button>
            </div>
        </div>
    )
}
