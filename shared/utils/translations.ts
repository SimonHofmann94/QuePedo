import { toMeanings, type Translations } from './quiz'

/**
 * Check if any translation value in a translations record matches a search string.
 * Case-insensitive substring match, across every meaning of every language.
 */
export function translationsMatch(translations: Translations, search: string): boolean {
    if (!translations || typeof translations !== 'object') return false
    const q = search.toLowerCase()
    return Object.values(translations).some(value =>
        toMeanings(value).some(meaning => meaning.toLowerCase().includes(q))
    )
}
