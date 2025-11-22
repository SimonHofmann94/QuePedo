'use server'

import { aiGeneratorSchema } from "@/types/schemas"

export async function generateVocabulary(topic: string) {
    // Mock implementation for now
    console.log(`Generating vocabulary for topic: ${topic}`)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return [
        {
            term: "El aeropuerto",
            translation: "The airport",
            context_sentence: "Voy al aeropuerto.",
            difficulty_rating: 1,
            tags: [topic, "travel"]
        },
        {
            term: "El avión",
            translation: "The plane",
            context_sentence: "El avión despega.",
            difficulty_rating: 1,
            tags: [topic, "travel"]
        },
        {
            term: "El pasaporte",
            translation: "The passport",
            context_sentence: "Necesito mi pasaporte.",
            difficulty_rating: 1,
            tags: [topic, "travel"]
        }
    ]
}
