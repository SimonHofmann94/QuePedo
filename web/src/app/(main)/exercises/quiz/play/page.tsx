"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ArrowLeft, Send, SkipForward } from "lucide-react"
import { getUserVocabulary } from "@/actions/vocabulary"
import { UserVocabulary } from "@/types/schemas"
import { StyledButton } from "@/components/ui/StyledButton"
import { StyledCard } from "@/components/ui/StyledCard"

import 'swiper/css'
import 'swiper/css/effect-cards'

interface QuizSettings {
    wordCount: number
    difficulty: number[]
    level: string[]
    quizType: 'term_to_translation' | 'translation_to_term'
    showContext: boolean
    showTags: boolean
}

interface QuizResult {
    word: UserVocabulary
    correct: boolean
    userAnswer: string
    correctAnswer: string
}

function getDisplayTranslation(translations: Record<string, string>): string {
    if (!translations || typeof translations !== 'object') return ''
    if (translations.de) return translations.de
    if (translations.en) return translations.en
    const keys = Object.keys(translations)
    return keys.length > 0 ? translations[keys[0]] : ''
}

function normalizeAnswer(answer: string): string {
    return answer
        .toLowerCase()
        .trim()
        .replace(/^(el|la|los|las|un|una|unos|unas|der|die|das|ein|eine)\s+/i, '')
        .replace(/[.,!?¿¡'"]/g, '')
        .trim()
}

function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
    const normalizedUser = normalizeAnswer(userAnswer)
    const normalizedCorrect = normalizeAnswer(correctAnswer)

    // Exact match
    if (normalizedUser === normalizedCorrect) return true

    // Check if user answer is contained (for partial matches)
    if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 3) return true

    return false
}

export default function QuizPlayPage() {
    const router = useRouter()
    const swiperRef = useRef<SwiperType | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [words, setWords] = useState<UserVocabulary[]>([])
    const [settings, setSettings] = useState<QuizSettings | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [userAnswer, setUserAnswer] = useState("")
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [results, setResults] = useState<QuizResult[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadQuiz = async () => {
            const savedSettings = sessionStorage.getItem('quizSettings')
            if (!savedSettings) {
                router.push('/exercises/quiz')
                return
            }

            const parsedSettings: QuizSettings = JSON.parse(savedSettings)
            setSettings(parsedSettings)

            const vocab = await getUserVocabulary()
            let filtered = vocab.filter(v =>
                parsedSettings.difficulty.includes(v.difficulty_rating || 1)
            )

            const shuffled = filtered.sort(() => Math.random() - 0.5)
            const selected = shuffled.slice(0, parsedSettings.wordCount)

            if (selected.length === 0) {
                alert('No vocabulary found matching your criteria. Please add some words first!')
                router.push('/vocabulary')
                return
            }

            setWords(selected)
            setIsLoading(false)
        }

        loadQuiz()
    }, [router])

    useEffect(() => {
        // Focus input when card changes
        if (!showResult && inputRef.current) {
            inputRef.current.focus()
        }
    }, [currentIndex, showResult])

    const getCurrentWord = () => words[currentIndex]

    const getQuestion = () => {
        const word = getCurrentWord()
        if (!word) return ''
        return settings?.quizType === 'term_to_translation'
            ? word.term
            : getDisplayTranslation(word.translations)
    }

    const getCorrectAnswer = () => {
        const word = getCurrentWord()
        if (!word) return ''
        return settings?.quizType === 'term_to_translation'
            ? getDisplayTranslation(word.translations)
            : word.term
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!userAnswer.trim()) return

        const correctAnswer = getCorrectAnswer()
        const correct = checkAnswer(userAnswer, correctAnswer)

        setIsCorrect(correct)
        setShowResult(true)

        const result: QuizResult = {
            word: getCurrentWord(),
            correct,
            userAnswer,
            correctAnswer
        }
        setResults(prev => [...prev, result])
    }

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            swiperRef.current?.slideNext()
            setUserAnswer("")
            setShowResult(false)
        } else {
            // Quiz complete
            sessionStorage.setItem('quizResults', JSON.stringify({
                results,
                settings
            }))
            router.push('/exercises/quiz/results')
        }
    }

    const handleSkip = () => {
        const result: QuizResult = {
            word: getCurrentWord(),
            correct: false,
            userAnswer: "(skipped)",
            correctAnswer: getCorrectAnswer()
        }
        setResults(prev => [...prev, result])
        handleNext()
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (!settings || words.length === 0) {
        return null
    }

    const word = getCurrentWord()

    return (
        <div className="p-6 max-w-lg mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.push('/exercises/quiz')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back</span>
                </button>
                <div className="text-sm text-gray-400">
                    <span className="text-orange-500 font-bold text-lg">{currentIndex + 1}</span>
                    <span className="text-gray-600"> / {words.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#222] rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
                />
            </div>

            {/* Swiper Carousel */}
            <Swiper
                effect="cards"
                grabCursor={false}
                modules={[EffectCards, Keyboard]}
                allowTouchMove={false}
                onSwiper={(swiper) => { swiperRef.current = swiper }}
                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                className="quiz-swiper"
                style={{ width: '100%', height: '320px' }}
            >
                {words.map((w, index) => (
                    <SwiperSlide key={w.id}>
                        <StyledCard className="w-full h-full flex flex-col justify-center items-center text-center">
                            {/* Question */}
                            <div className="text-3xl font-bold text-white mb-4">
                                {settings.quizType === 'term_to_translation' ? w.term : getDisplayTranslation(w.translations)}
                            </div>

                            {/* Context hint */}
                            {settings.showContext && w.context_sentence && (
                                <div className="text-sm text-gray-500 italic mb-4">
                                    💡 {w.context_sentence}
                                </div>
                            )}

                            {/* Tags */}
                            {settings.showTags && w.tags && w.tags.length > 0 && (
                                <div className="flex gap-2 flex-wrap justify-center mb-4">
                                    {w.tags.map((tag, i) => (
                                        <span key={i} className="text-xs px-3 py-1 bg-[#333] text-gray-400 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Difficulty indicator */}
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map(d => (
                                    <div
                                        key={d}
                                        className={`w-2 h-2 rounded-full ${
                                            d <= (w.difficulty_rating || 1)
                                                ? 'bg-orange-500'
                                                : 'bg-[#333]'
                                        }`}
                                    />
                                ))}
                            </div>
                        </StyledCard>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Answer Section */}
            <div className="mt-6">
                {!showResult ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder={settings.quizType === 'term_to_translation'
                                    ? "Type the translation..."
                                    : "Escribe en español..."}
                                className="w-full px-6 py-4 bg-[#1a1a1a] border-2 border-[#333] rounded-xl text-white text-lg placeholder:text-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="px-6 py-3 bg-[#222] hover:bg-[#333] border border-[#333] rounded-xl text-gray-400 transition-all flex items-center gap-2"
                            >
                                <SkipForward className="h-4 w-4" />
                                Skip
                            </button>
                            <StyledButton type="submit" disabled={!userAnswer.trim()}>
                                <span className="flex items-center gap-2 justify-center">
                                    <Send className="h-4 w-4" />
                                    Check Answer
                                </span>
                            </StyledButton>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        {/* Result feedback */}
                        <div className={`p-4 rounded-xl border-2 ${
                            isCorrect
                                ? 'bg-green-500/10 border-green-500'
                                : 'bg-red-500/10 border-red-500'
                        }`}>
                            <div className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                {isCorrect ? '✓ Correct!' : '✗ Not quite...'}
                            </div>
                            {!isCorrect && (
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-400">
                                        Your answer: <span className="text-red-400">{userAnswer}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Correct answer: <span className="text-green-400">{getCorrectAnswer()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <StyledButton onClick={handleNext}>
                            {currentIndex < words.length - 1 ? 'Next Word' : 'See Results'}
                        </StyledButton>
                    </div>
                )}
            </div>
        </div>
    )
}
