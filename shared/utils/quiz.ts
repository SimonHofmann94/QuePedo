/**
 * Get the best display translation from a translations record.
 * Prefers German, then English, then first available.
 */
export function getDisplayTranslation(translations: Record<string, string>): string {
    if (!translations || typeof translations !== 'object') return ''
    if (translations.de) return translations.de
    if (translations.en) return translations.en
    const keys = Object.keys(translations)
    return keys.length > 0 ? translations[keys[0]] : ''
}

/**
 * Normalize an answer for comparison:
 * - lowercase + trim
 * - strip leading articles (Spanish & German)
 * - remove punctuation
 */
export function normalizeAnswer(answer: string): string {
    return answer
        .toLowerCase()
        .trim()
        .replace(/^(el|la|los|las|un|una|unos|unas|der|die|das|ein|eine)\s+/i, '')
        .replace(/[.,!?¿¡'"]/g, '')
        .trim()
}

/**
 * Check if a user answer matches the correct answer.
 * Supports exact match and partial containment (for answers > 3 chars).
 */
export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
    const normalizedUser = normalizeAnswer(userAnswer)
    const normalizedCorrect = normalizeAnswer(correctAnswer)

    // Exact match
    if (normalizedUser === normalizedCorrect) return true

    // Check if user answer is contained (for partial matches)
    if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 3) return true

    return false
}
