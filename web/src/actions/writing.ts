'use server'

import { GoogleGenerativeAI } from "@google/generative-ai"
import { z } from "zod"
import {
  buildWritingPrompt,
  evaluateWriting,
  serializeChapterContent,
  getChapter,
  type WritingFeedback,
  type WritingPrompt,
} from "@chingon/shared"
import { isUserPremium } from "@/lib/premium"

const feedbackSchema = z.object({
  score: z.number().min(0).max(100),
  note: z.string().min(1),
  corrections: z
    .array(
      z.object({
        wrong: z.string(),
        correct: z.string(),
        explanation: z.string(),
      }),
    )
    .default([]),
  strengths: z.array(z.string()).default([]),
})

/**
 * Grade a piece of Spanish writing with Gemini. Premium-gated.
 * Never throws: on any failure (not premium, no key, AI error, bad JSON) it
 * falls back to the shared offline `evaluateWriting` heuristic so the UI always
 * has something to show.
 */
export async function getWritingFeedback(
  level: string,
  chapterId: number,
  text: string,
): Promise<WritingFeedback> {
  const prompt: WritingPrompt | null = buildWritingPrompt(level, chapterId)
  // No prompt = unknown chapter; grade against a minimal stand-in so we never crash.
  const safePrompt: WritingPrompt =
    prompt ?? {
      id: `${level}-${chapterId}`,
      level: level.toLowerCase(),
      chapterId,
      chapterTitle: "",
      prompt: "",
      minWords: 40,
      guidance: [],
    }

  const premium = await isUserPremium()
  if (!premium) {
    return {
      score: 0,
      note: "¡Ay, no! La escritura con feedback de AI es Premium. Hazte Premium para que te califiquemos.",
      corrections: [],
      strengths: [],
    }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || !text.trim()) {
    return evaluateWriting(text, safePrompt)
  }

  try {
    const chapter = getChapter(level, chapterId)
    const chapterContent = chapter ? serializeChapterContent(chapter) : ""

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

    const aiPrompt = `
You are a warm, encouraging Mexican Spanish teacher grading a short student text.

Grammar focus (chapter "${safePrompt.chapterTitle}"):
${chapterContent || "(general Spanish)"}

The student was asked: "${safePrompt.prompt}"

The student wrote:
"""
${text}
"""

Grade it and return ONLY a JSON object (no markdown) with this exact shape:
{
  "score": <integer 0-100, based on grammar, vocabulary and how well it fits the task>,
  "note": "<one short encouraging note in MEXICAN SPANISH, e.g. uses '¡Órale!', '¡chingón!', '¡Ándale!'>",
  "corrections": [
    { "wrong": "<student fragment>", "correct": "<fixed Spanish>", "explanation": "<short reason in Spanish>" }
  ],
  "strengths": ["<short thing they did well, in Spanish>"]
}

Rules:
- Up to 5 corrections, only real mistakes. Empty array if the text is clean.
- The note MUST be Mexican Spanish and encouraging, never English.
- score reflects this level (${safePrompt.level.toUpperCase()}).
`.trim()

    const result = await model.generateContent(aiPrompt)
    const raw = (await result.response).text()
    const jsonStr = raw.replace(/```json\n?|\n?```/g, "").trim()
    const parsed = feedbackSchema.parse(JSON.parse(jsonStr))
    return parsed
  } catch (error) {
    console.error("[getWritingFeedback] falling back to offline grader:", error)
    return evaluateWriting(text, safePrompt)
  }
}
