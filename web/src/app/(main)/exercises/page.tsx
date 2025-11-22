"use client"

import { ActionCard } from "@/components/features/vocabulary/ActionCard"
import {
    BrainCircuit,
    PenTool,
    Mic,
    Headphones,
    BookOpen,
    Gamepad2
} from "lucide-react"

export default function ExercisesPage() {
    const exercises = [
        {
            title: "Vocabulary Quiz",
            description: "Test your knowledge with flashcards and multiple choice questions.",
            icon: <BrainCircuit className="h-8 w-8 text-white" />,
            badge: "Practice",
            onClick: () => console.log("Vocabulary Quiz clicked")
        },
        {
            title: "Writing Exercise",
            description: "Practice your writing skills with AI-guided prompts and corrections.",
            icon: <PenTool className="h-8 w-8 text-white" />,
            badge: "AI Feedback",
            onClick: () => console.log("Writing Exercise clicked")
        },
        {
            title: "Speaking Exercise",
            description: "Improve your pronunciation with real-time speech analysis.",
            icon: <Mic className="h-8 w-8 text-white" />,
            badge: "Interactive",
            onClick: () => console.log("Speaking Exercise clicked")
        },
        {
            title: "Listening Exercise",
            description: "Train your ear with native audio clips and comprehension questions.",
            icon: <Headphones className="h-8 w-8 text-white" />,
            badge: "Audio",
            onClick: () => console.log("Listening Exercise clicked")
        },
        {
            title: "Grammar Exercise",
            description: "Master Spanish grammar rules with structured lessons and drills.",
            icon: <BookOpen className="h-8 w-8 text-white" />,
            badge: "Core",
            onClick: () => console.log("Grammar Exercise clicked")
        },
        {
            title: "Games",
            description: "Learn while having fun with interactive language games.",
            icon: <Gamepad2 className="h-8 w-8 text-white" />,
            badge: "Fun",
            onClick: () => console.log("Games clicked")
        }
    ]

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>

            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                {exercises.map((exercise, index) => (
                    <div key={index} className="w-[190px]">
                        <ActionCard
                            title={exercise.title}
                            description={exercise.description}
                            icon={exercise.icon}
                            badge={exercise.badge}
                            onClick={exercise.onClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
