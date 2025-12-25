'use server'

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generateVocabulary(userPrompt: string, count: number = 5) {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set in environment")
        throw new Error("API key not configured")
    }

    console.log("API Key present:", apiKey.substring(0, 8) + "..." + apiKey.substring(apiKey.length - 4))

    try {
        // Initialize client inside function to ensure env is loaded
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

        const prompt = `
        Analyze the language of the user request: "${userPrompt}".
        Generate ${count} Spanish vocabulary words based on the request.

        IMPORTANT: Detect the language of the user's request (e.g., German, English, French).
        Use the ISO 639-1 language code (de, en, fr, etc.) for the translations object.

        Return ONLY a JSON array with objects containing:
        - term (Spanish word/phrase)
        - translations (Object with language codes as keys, e.g., {"de": "Die Katze", "en": "The cat"})
          Always include the detected language. Include English too if the request wasn't in English.
        - context_sentence (A simple Spanish sentence using the word)
        - difficulty_rating (1-5 integer based on complexity)
        - tags (Array of strings relevant to the word, in English)
        - synonyms (Array of Spanish synonyms, empty array if none)

        Example format for a German request:
        [
          {
            "term": "el gato",
            "translations": {"de": "die Katze", "en": "the cat"},
            "context_sentence": "El gato duerme en el sofá.",
            "difficulty_rating": 1,
            "tags": ["animals", "pets", "nouns"],
            "synonyms": ["minino"]
          }
        ]

        Example format for an English request:
        [
          {
            "term": "el gato",
            "translations": {"en": "the cat"},
            "context_sentence": "El gato duerme en el sofá.",
            "difficulty_rating": 1,
            "tags": ["animals", "pets", "nouns"],
            "synonyms": ["minino"]
          }
        ]
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim()

        return JSON.parse(jsonStr)
    } catch (error) {
        console.error("Error generating vocabulary:", error)
        // Provide more detailed error info
        if (error instanceof Error) {
            throw new Error(`Failed to generate vocabulary: ${error.message}`)
        }
        throw new Error("Failed to generate vocabulary: Unknown error")
    }
}
