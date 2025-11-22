"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, Plane, Wine, Briefcase, Home, GraduationCap, Gamepad2, Headphones, Eye, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

export default function OnboardingPage() {
    const router = useRouter()
    const supabase = createClient()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    // Form Data
    const [formData, setFormData] = useState({
        firstName: "",
        nativeLanguage: "English",
        location: "",
        proficiencyLevel: "",
        learningGoals: [] as string[],
        learningStyle: "",
        dailyStudyMinutes: 15,
    })

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        getUser()
    }, [])

    const handleNext = () => setStep(s => s + 1)
    const handleBack = () => setStep(s => s - 1)

    const updateData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const toggleGoal = (goal: string) => {
        setFormData(prev => {
            const goals = prev.learningGoals.includes(goal)
                ? prev.learningGoals.filter(g => g !== goal)
                : [...prev.learningGoals, goal].slice(0, 3)
            return { ...prev, learningGoals: goals }
        })
    }

    const finishOnboarding = async () => {
        if (!userId) return
        setIsLoading(true)

        // Simulate "Magic Calculation"
        await new Promise(resolve => setTimeout(resolve, 2000))

        const { error } = await supabase
            .from('user_profiles')
            .upsert({
                id: userId,
                first_name: formData.firstName,
                native_language: formData.nativeLanguage,
                location: formData.location,
                proficiency_level: formData.proficiencyLevel,
                learning_goals: formData.learningGoals,
                learning_style: formData.learningStyle,
                daily_study_minutes: formData.dailyStudyMinutes,
                onboarding_completed: true,
                onboarding_completed_at: new Date().toISOString()
            })

        if (error) {
            console.error("Error saving profile:", error)
            alert("Failed to save profile. Please try again.")
            setIsLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    // --- Steps Components ---

    const Step1Identity = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">¡Hola! Let’s get to know you.</h1>
                <p className="text-muted-foreground">We need a few details to personalize your experience.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>What should we call you?</Label>
                    <Input
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => updateData('firstName', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>What is your native language?</Label>
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.nativeLanguage}
                        onChange={(e) => updateData('nativeLanguage', e.target.value)}
                    >
                        <option value="English">English</option>
                        <option value="German">German</option>
                        <option value="French">French</option>
                        <option value="Italian">Italian</option>
                        <option value="Portuguese">Portuguese</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Where are you located?</Label>
                    <div className="grid grid-cols-1 gap-2">
                        {["I am already in Spain", "I am planning to go", "Just learning for fun"].map((opt) => (
                            <div
                                key={opt}
                                className={cn(
                                    "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                    formData.location === opt ? "border-primary bg-primary/10" : "border-input"
                                )}
                                onClick={() => updateData('location', opt)}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Button className="w-full" onClick={handleNext} disabled={!formData.firstName || !formData.location}>Next</Button>
        </div>
    )

    const Step2Assessment = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">How much Spanish do you know?</h1>
                <p className="text-muted-foreground">Don't worry, we won't judge!</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {[
                    { id: "newbie", label: "Newbie", desc: "Hola is the only word I know." },
                    { id: "dabbler", label: "Dabbler", desc: "I can order a beer and say thanks." },
                    { id: "conversational", label: "Conversational", desc: "I can have basic chats about my day." },
                    { id: "pro", label: "Pro", desc: "I can watch La Casa de Papel without subtitles." }
                ].map((level) => (
                    <div
                        key={level.id}
                        className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all hover:border-primary flex flex-col",
                            formData.proficiencyLevel === level.id ? "border-primary bg-primary/10" : "border-input"
                        )}
                        onClick={() => updateData('proficiencyLevel', level.id)}
                    >
                        <span className="font-bold">{level.label}</span>
                        <span className="text-sm text-muted-foreground">{level.desc}</span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full">Back</Button>
                <Button className="w-full" onClick={handleNext} disabled={!formData.proficiencyLevel}>Next</Button>
            </div>
        </div>
    )

    const Step3Motivation = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Why are you learning Spanish?</h1>
                <p className="text-muted-foreground">Select up to 3.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {[
                    { id: "tourism", label: "Tourism", icon: Plane },
                    { id: "social", label: "Social & Dating", icon: Wine },
                    { id: "business", label: "Business", icon: Briefcase },
                    { id: "living", label: "Living in Spain", icon: Home },
                    { id: "culture", label: "Culture", icon: GraduationCap },
                ].map((goal) => (
                    <div
                        key={goal.id}
                        className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all hover:border-primary flex flex-col items-center gap-2 text-center",
                            formData.learningGoals.includes(goal.id) ? "border-primary bg-primary/10" : "border-input"
                        )}
                        onClick={() => toggleGoal(goal.id)}
                    >
                        <goal.icon className="h-6 w-6" />
                        <span className="font-medium text-sm">{goal.label}</span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full">Back</Button>
                <Button className="w-full" onClick={handleNext} disabled={formData.learningGoals.length === 0}>Next</Button>
            </div>
        </div>
    )

    const Step4Style = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">How do you learn best?</h1>
                <p className="text-muted-foreground">We'll adapt the content for you.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {[
                    { id: "gamer", label: "The Gamer", desc: "Quizzes, streaks, competitions.", icon: Gamepad2 },
                    { id: "listener", label: "The Listener", desc: "Podcasts and audio.", icon: Headphones },
                    { id: "visualizer", label: "The Visualizer", desc: "Flashcards and reading.", icon: Eye },
                    { id: "speaker", label: "The Speaker", desc: "Pronunciation and speaking.", icon: Mic },
                ].map((style) => (
                    <div
                        key={style.id}
                        className={cn(
                            "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary flex items-center gap-4",
                            formData.learningStyle === style.id ? "border-primary bg-primary/10" : "border-input"
                        )}
                        onClick={() => updateData('learningStyle', style.id)}
                    >
                        <div className="p-2 bg-secondary rounded-full">
                            <style.icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">{style.label}</span>
                            <span className="text-xs text-muted-foreground">{style.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-2 pt-4">
                <Label>How much time do you have per day?</Label>
                <div className="flex gap-2">
                    {[5, 15, 30].map((min) => (
                        <div
                            key={min}
                            className={cn(
                                "flex-1 p-2 border rounded-lg text-center cursor-pointer hover:border-primary",
                                formData.dailyStudyMinutes === min ? "border-primary bg-primary/10 font-bold" : "border-input"
                            )}
                            onClick={() => updateData('dailyStudyMinutes', min)}
                        >
                            {min} min
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full">Back</Button>
                <Button className="w-full" onClick={handleNext} disabled={!formData.learningStyle}>Next</Button>
            </div>
        </div>
    )

    const Step5Magic = () => {
        useEffect(() => {
            finishOnboarding()
        }, [])

        return (
            <div className="flex flex-col items-center justify-center space-y-6 py-10 animate-in fade-in duration-1000">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                    <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Analyzing your level...</h2>
                    <p className="text-muted-foreground">Curating Castilian vocabulary...</p>
                    <p className="text-muted-foreground">Building your custom path...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {step === 1 && <Step1Identity />}
                {step === 2 && <Step2Assessment />}
                {step === 3 && <Step3Motivation />}
                {step === 4 && <Step4Style />}
                {step === 5 && <Step5Magic />}

                {step < 5 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-2 w-2 rounded-full transition-all",
                                    step >= i ? "bg-primary w-4" : "bg-muted"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
