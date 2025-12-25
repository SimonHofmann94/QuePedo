import { z } from "zod"

// User vocabulary schema (personal words)
export const userVocabularySchema = z.object({
    id: z.string().uuid().optional(),
    term: z.string().min(1, "Term is required"),
    translations: z.record(z.string()).default({}), // { "de": "...", "en": "..." }
    context_sentence: z.string().optional(),
    difficulty_rating: z.number().min(1).max(5).default(1),
    tags: z.array(z.string()).default([]),
    synonyms: z.array(z.string()).default([]),
    source: z.enum(["manual", "ai_generated"]).default("manual"),
    ai_prompt: z.string().optional(),
    notes: z.string().optional(),
})

export type UserVocabulary = z.infer<typeof userVocabularySchema> & {
    id: string
    user_id: string
    created_at: string
    updated_at: string
}

// Master vocabulary schema (curated content)
export const masterVocabularySchema = z.object({
    id: z.string().uuid().optional(),
    term: z.string().min(1, "Term is required"),
    translations: z.record(z.string()).default({}),
    context_sentence: z.string().optional(),
    context_translations: z.record(z.string()).optional(),
    part_of_speech: z.enum(["noun", "verb", "adjective", "adverb", "phrase", "preposition", "conjunction", "pronoun", "interjection"]).optional(),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
    category: z.string().optional(),
    difficulty_rating: z.number().min(1).max(5).default(1),
    synonyms: z.array(z.string()).default([]),
    gender: z.enum(["m", "f"]).optional(),
    conjugation_group: z.enum(["-ar", "-er", "-ir", "irregular"]).optional(),
    audio_url: z.string().optional(),
    image_url: z.string().optional(),
})

export type MasterVocabulary = z.infer<typeof masterVocabularySchema> & {
    id: string
    created_at: string
    updated_at: string
}

// Backwards compatibility alias
export const vocabularySchema = userVocabularySchema
export type Vocabulary = UserVocabulary

export const aiGeneratorSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
})

export type AIGeneratorInput = z.infer<typeof aiGeneratorSchema>

// User Profile Schema
export const userProfileSchema = z.object({
    native_language: z.string().min(1, "Native language is required"),
    target_language: z.string().default("Spanish"),
    proficiency_level: z.enum(["beginner", "intermediate", "advanced"]),
    learning_goals: z.array(z.string()).default([]),
    daily_study_minutes: z.number().min(5).max(240).default(15),
    learning_style: z.enum(["visual", "auditory", "reading", "kinesthetic", "mixed"]).optional(),
    preferred_content_types: z.array(z.string()).default([]),
    interests: z.array(z.string()).default([]),
    timezone: z.string().optional(),
})

export type UserProfileInput = z.infer<typeof userProfileSchema>

export type UserProfile = UserProfileInput & {
    id: string
    subscription_tier: "free" | "premium" | "enterprise"
    trial_started_at: string | null
    trial_ends_at: string | null
    is_trial_active: boolean
    onboarding_completed: boolean
    onboarding_completed_at: string | null
    created_at: string
    updated_at: string
}
