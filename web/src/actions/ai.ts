'use server'

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function generateVocabulary(userPrompt: string, count: number = 5) {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set")
        throw new Error("API key not configured")
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `
        Analyze the language of the user request: "${userPrompt}".
        Generate ${count} Spanish vocabulary words based on the request.
        
        Return ONLY a JSON array with objects containing:
        - term (Spanish word)
        - translation (Translation of the term into the language of the user request. If the request is in German, translate to German. If English, to English, etc.)
        - context_sentence (A simple Spanish sentence using the word)
        - difficulty_rating (1-5 integer based on complexity)
        - tags (Array of strings relevant to the word)
        - synonyms (Array of Spanish synonyms, empty if none)
        
        Example format:
        [
          {
            "term": "El gato",
            "translation": "The cat", // or "Die Katze" if request was German
            "context_sentence": "El gato duerme.",
            "difficulty_rating": 1,
            "tags": ["animals", "pets"],
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
        throw new Error("Failed to generate vocabulary")
    }
}
