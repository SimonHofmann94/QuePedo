import React from 'react';
import styles from './StyledTable.module.css';
import { Vocabulary } from '@/types/schemas';

interface StyledTableProps {
    data: Vocabulary[];
    selectable?: boolean;
    selectedIds?: Set<string>;
    onSelectionChange?: (selectedIds: Set<string>) => void;
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

export function StyledTable({ data, selectable = false, selectedIds = new Set(), onSelectionChange }: StyledTableProps) {
    const allSelected = data.length > 0 && data.every(item => selectedIds.has(item.id!));
    const someSelected = data.some(item => selectedIds.has(item.id!));

    const handleSelectAll = () => {
        if (!onSelectionChange) return;
        if (allSelected) {
            // Deselect all
            const newSelection = new Set(selectedIds);
            data.forEach(item => newSelection.delete(item.id!));
            onSelectionChange(newSelection);
        } else {
            // Select all
            const newSelection = new Set(selectedIds);
            data.forEach(item => newSelection.add(item.id!));
            onSelectionChange(newSelection);
        }
    };

    const handleSelectItem = (id: string) => {
        if (!onSelectionChange) return;
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        onSelectionChange(newSelection);
    };

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
                        {selectable && (
                            <th className={`${styles.th} ${styles.checkboxCell}`}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={allSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = someSelected && !allSelected;
                                    }}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        <th className={styles.th}>Term</th>
                        <th className={styles.th}>Translation</th>
                        <th className={styles.th}>Synonyms</th>
                        <th className={styles.th}>Difficulty</th>
                        <th className={styles.th}>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        const isSelected = selectedIds.has(item.id!);
                        return (
                            <tr
                                key={item.id}
                                className={`${styles.tr} ${isSelected ? styles.selectedRow : ''}`}
                            >
                                {selectable && (
                                    <td className={`${styles.td} ${styles.checkboxCell}`}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={isSelected}
                                            onChange={() => handleSelectItem(item.id!)}
                                        />
                                    </td>
                                )}
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
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
