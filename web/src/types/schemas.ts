import { z } from "zod"

export const vocabularySchema = z.object({
    id: z.string().uuid().optional(),
    term: z.string().min(1, "Term is required"),
    translation: z.string().min(1, "Translation is required"),
    context_sentence: z.string().optional(),
    difficulty_rating: z.number().min(1).max(5).default(1),
    tags: z.array(z.string()).default([]),
    synonyms: z.array(z.string()).default([]),
})

export type Vocabulary = z.infer<typeof vocabularySchema> & {
    id: string
    user_id: string
    created_at: string
}

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
