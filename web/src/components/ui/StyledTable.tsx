import React from 'react';
import styles from './StyledTable.module.css';
import { Vocabulary } from '@/types/schemas';

interface StyledTableProps {
    data: Vocabulary[];
}

// Helper to get the first available translation
function getDisplayTranslation(translations: Record<string, string>): string {
    if (!translations || typeof translations !== 'object') return '';
    // Prefer German, then English, then first available
    if (translations.de) return translations.de;
    if (translations.en) return translations.en;
    const keys = Object.keys(translations);
    return keys.length > 0 ? translations[keys[0]] : '';
}

export function StyledTable({ data }: StyledTableProps) {
    if (data.length === 0) {
        return (
            <div className={styles.container}>
                <div className="p-8 text-center text-gray-500">No vocabulary found.</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr className={styles.tr}>
                        <th className={styles.th}>Term</th>
                        <th className={styles.th}>Translation</th>
                        <th className={styles.th}>Synonyms</th>
                        <th className={styles.th}>Difficulty</th>
                        <th className={styles.th}>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className={styles.tr}>
                            <td className={styles.td}>
                                <span className="font-bold text-white">{item.term}</span>
                            </td>
                            <td className={styles.td}>{getDisplayTranslation(item.translations)}</td>
                            <td className={styles.td}>
                                {item.synonyms?.map((syn, i) => (
                                    <span key={i} className={styles.tag}>
                                        {syn}
                                    </span>
                                ))}
                            </td>
                            <td className={styles.td}>
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`${styles.difficultyDot} ${i < item.difficulty_rating ? styles.difficultyDotActive : ''
                                                }`}
                                        />
                                    ))}
                                </div>
                            </td>
                            <td className={styles.td}>
                                {item.tags?.map((tag, i) => (
                                    <span key={i} className={styles.tag}>
                                        {tag}
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
