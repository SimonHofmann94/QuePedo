import React from 'react';
import { Search } from 'lucide-react';
import styles from './StyledSearch.module.css';

interface StyledSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function StyledSearch({ value, onChange, placeholder = "Search..." }: StyledSearchProps) {
    return (
        <div className={styles.container}>
            <input
                type="text"
                className={styles.input}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <Search className={styles.icon} size={20} />
        </div>
    );
}
