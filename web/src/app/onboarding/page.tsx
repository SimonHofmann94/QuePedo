"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUserProfile } from "@/actions/profile"
import { MessageCircle, ArrowRight, ArrowLeft } from "lucide-react"

const LANGUAGES = ["English", "German", "French", "Italian", "Portuguese", "Mandarin", "Other"]
const PROFICIENCY_LEVELS = [
    { value: "beginner", label: "Beginner", description: "I'm just starting out" },
    { value: "intermediate", label: "Intermediate", description: "I know some basics" },
    { value: "advanced", label: "Advanced", description: "I'm quite comfortable" },
]
const LEARNING_GOALS = ["Travel", "Work/Career", "Social", "Culture", "Education", "Family"]
const LEARNING_STYLES = [
    { value: "visual", label: "Visual", description: "I learn best with images and videos" },
    { value: "auditory", label: "Auditory", description: "I prefer listening and speaking" },
    { value: "reading", label: "Reading/Writing", description: "I like text and written exercises" },
    { value: "kinesthetic", label: "Hands-on", description: "I learn by doing and practicing" },
    { value: "mixed", label: "Mixed", description: "I enjoy a variety of methods" },
]
const CONTENT_TYPES = ["Video", "Text", "Audio", "Interactive Exercises", "Games"]
const INTERESTS = [
    "Food & Cooking", "Travel", "Business", "Sports", "Music", "Movies & TV",
    "Art & Culture", "Technology", "History", "Literature"
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        native_language: "",
        target_language: "Spanish",
        proficiency_level: "",
        learning_goals: [] as string[],
        daily_study_minutes: 15,
        learning_style: "",
        preferred_content_types: [] as string[],
        interests: [] as string[],
    })

    const totalSteps = 4

    const toggleArrayItem = (field: "learning_goals" | "preferred_content_types" | "interests", value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter((item) => item !== value)
                : [...prev[field], value],
        }))
    }

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const result = await updateUserProfile(formData)
            if (result.error) {
                console.error("Error saving profile:", result.error)
            } else {
                router.push("/dashboard")
            }
        } catch (error) {
            console.error("Submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.native_language && formData.proficiency_level
            case 2:
                return formData.learning_goals.length > 0
            case 3:
                return formData.learning_style
            case 4:
                return formData.preferred_content_types.length > 0 && formData.interests.length > 0
            default:
                return false
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="bg-orange-500 p-2 rounded-lg">
                            <MessageCircle className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Chingón</h1>
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">Let's Personalize Your Experience</h2>
                    <p className="text-slate-600">Help us tailor Chingón to your learning style</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 flex-1 rounded-full ${i < step ? "bg-orange-500" : "bg-slate-200"
                                }`}
                        />
                    ))}
                </div>

                {/* Step 1: Languages & Proficiency */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label>What's your native language?</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {LANGUAGES.map((lang) => (
                                    <Button
                                        key={lang}
                                        type="button"
                                        variant={formData.native_language === lang ? "default" : "outline"}
                                        className={formData.native_language === lang ? "bg-orange-500 hover:bg-orange-600" : ""}
                                        onClick={() => setFormData({ ...formData, native_language: lang })}
                                    >
                                        {lang}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>What's your Spanish proficiency level?</Label>
                            <div className="space-y-2">
                                {PROFICIENCY_LEVELS.map((level) => (
                                    <Card
                                        key={level.value}
                                        className={`p-4 cursor-pointer transition-colors ${formData.proficiency_level === level.value
                                                ? "border-orange-500 bg-orange-50"
                                                : "hover:border-slate-300"
                                            }`}
                                        onClick={() => setFormData({ ...formData, proficiency_level: level.value })}
                                    >
                                        <div className="font-medium text-slate-900">{level.label}</div>
                                        <div className="text-sm text-slate-600">{level.description}</div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Goals */}
                {step === 2 && (
                    <div className="space-y-3">
                        <Label>What are your learning goals? (Select all that apply)</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {LEARNING_GOALS.map((goal) => (
                                <Button
                                    key={goal}
                                    type="button"
                                    variant={formData.learning_goals.includes(goal) ? "default" : "outline"}
                                    className={formData.learning_goals.includes(goal) ? "bg-orange-500 hover:bg-orange-600" : ""}
                                    onClick={() => toggleArrayItem("learning_goals", goal)}
                                >
                                    {goal}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Learning Style & Study Time */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label>What's your preferred learning style?</Label>
                            <div className="space-y-2">
                                {LEARNING_STYLES.map((style) => (
                                    <Card
                                        key={style.value}
                                        className={`p-4 cursor-pointer transition-colors ${formData.learning_style === style.value
                                                ? "border-orange-500 bg-orange-50"
                                                : "hover:border-slate-300"
                                            }`}
                                        onClick={() => setFormData({ ...formData, learning_style: style.value })}
                                    >
                                        <div className="font-medium text-slate-900">{style.label}</div>
                                        <div className="text-sm text-slate-600">{style.description}</div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>How many minutes can you study per day?</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="range"
                                    min="5"
                                    max="120"
                                    step="5"
                                    value={formData.daily_study_minutes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, daily_study_minutes: parseInt(e.target.value) })
                                    }
                                    className="flex-1"
                                />
                                <span className="text-2xl font-semibold text-orange-600 w-20 text-right">
                                    {formData.daily_study_minutes} min
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Content & Interests */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label>What type of content do you prefer? (Select all that apply)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {CONTENT_TYPES.map((type) => (
                                    <Button
                                        key={type}
                                        type="button"
                                        variant={formData.preferred_content_types.includes(type) ? "default" : "outline"}
                                        className={formData.preferred_content_types.includes(type) ? "bg-orange-500 hover:bg-orange-600" : ""}
                                        onClick={() => toggleArrayItem("preferred_content_types", type)}
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>What are your interests? (Select all that apply)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {INTERESTS.map((interest) => (
                                    <Button
                                        key={interest}
                                        type="button"
                                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                                        className={formData.interests.includes(interest) ? "bg-orange-500 hover:bg-orange-600" : ""}
                                        onClick={() => toggleArrayItem("interests", interest)}
                                    >
                                        {interest}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>

                    {step < totalSteps ? (
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="bg-orange-500 hover:bg-orange-600 gap-2"
                        >
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canProceed() || isSubmitting}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            {isSubmitting ? "Saving..." : "Get Started"}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    )
}
