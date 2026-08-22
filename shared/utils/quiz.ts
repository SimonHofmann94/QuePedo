/**
 * A translation value is either a single meaning or a list of distinct meanings.
 * Spanish words routinely carry several unrelated senses (`el banco` = bank/bench),
 * so newer data ships arrays. Older rows are plain strings and stay valid — the
 * union is what keeps the JSONB column migration-free.
 */
export type TranslationValue = string | string[]
export type Translations = Record<string, TranslationValue>

/** Normalize a translation value to a clean list of meanings. */
export function toMeanings(value: TranslationValue | undefined | null): string[] {
    if (!value) return []
    const list = Array.isArray(value) ? value : [value]
    return list.filter((m): m is string => typeof m === 'string' && m.trim().length > 0)
}

/**
 * Pick the raw translation value for the active locale.
 * Priority: active locale → German → English → first available.
 * `locale` is optional so unwired callers keep the legacy de→en→first behavior.
 */
function pickForLocale(translations: Translations, locale?: string): TranslationValue | undefined {
    if (!translations || typeof translations !== 'object') return undefined
    if (locale && translations[locale]) return translations[locale]
    if (translations.de) return translations.de
    if (translations.en) return translations.en
    const keys = Object.keys(translations)
    return keys.length > 0 ? translations[keys[0]] : undefined
}

/**
 * Every meaning for the active locale — use where the alternatives matter:
 * vocabulary lists, answer reveals, and grading.
 */
export function getTranslationMeanings(translations: Translations, locale?: string): string[] {
    return toMeanings(pickForLocale(translations, locale))
}

/**
 * The primary (most common) meaning for the active locale.
 * Deliberately one string — quiz prompts, game tiles and cards need a short label,
 * not a dictionary entry. Use `getTranslationMeanings` when all senses matter.
 */
export function getDisplayTranslation(translations: Translations, locale?: string): string {
    return getTranslationMeanings(translations, locale)[0] ?? ''
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
 * Accepts a list of alternatives — ANY of them counts, which is what makes
 * multi-meaning words answerable at all.
 * Supports exact match and partial containment (for answers > 3 chars).
 */
export function checkAnswer(userAnswer: string, correctAnswer: TranslationValue): boolean {
    const normalizedUser = normalizeAnswer(userAnswer)
    if (!normalizedUser) return false

    return toMeanings(correctAnswer).some((candidate) => {
        const normalizedCorrect = normalizeAnswer(candidate)

        // Exact match
        if (normalizedUser === normalizedCorrect) return true

        // Check if user answer is contained (for partial matches)
        if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 3) return true

        return false
    })
}
