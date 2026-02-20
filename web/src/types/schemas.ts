// Re-export all schemas and types from the shared package.
// This file exists so existing web imports from "@/types/schemas" continue to work.
export {
    userVocabularySchema,
    type UserVocabulary,
    masterVocabularySchema,
    type MasterVocabulary,
    vocabularySchema,
    type Vocabulary,
    aiGeneratorSchema,
    type AIGeneratorInput,
    userProfileSchema,
    type UserProfileInput,
    type UserProfile,
    type QuizSettings,
    type QuizResult,
} from '@chingon/shared'
