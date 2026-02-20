// Navigation tab/route names — platform-agnostic (no JSX or icons)
export const TAB_NAMES = {
    DASHBOARD: 'Dashboard',
    VOCABULARY: 'Vocabulary',
    EXERCISES: 'Exercises',
    CULTURE: 'Culture',
    PROFILE: 'Profile',
} as const

export const ROUTES = {
    // Auth
    LOGIN: '/login',
    SIGNUP: '/signup',
    ONBOARDING: '/onboarding',

    // Main tabs
    DASHBOARD: '/dashboard',
    VOCABULARY: '/vocabulary',
    VOCABULARY_BROWSER: '/vocabulary/browser',
    GRAMMAR: '/grammar',
    EXERCISES: '/exercises',
    QUIZ_SETTINGS: '/exercises/quiz',
    QUIZ_PLAY: '/exercises/quiz/play',
    QUIZ_RESULTS: '/exercises/quiz/results',
    CULTURE: '/culture',
    PROFILE: '/profile',
} as const
