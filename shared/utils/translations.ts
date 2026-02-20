/**
 * Check if any translation value in a translations record matches a search string.
 * Case-insensitive substring match.
 */
export function translationsMatch(translations: Record<string, string>, search: string): boolean {
    if (!translations || typeof translations !== 'object') return false
    return Object.values(translations).some(t =>
        t.toLowerCase().includes(search.toLowerCase())
    )
}
