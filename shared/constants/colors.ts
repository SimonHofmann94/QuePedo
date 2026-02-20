// Sunny Minimal Design System — Color Tokens
export const colors = {
    primary: '#F97316',       // orange-500
    accent: '#FB923C',        // orange-400
    background: '#FFF7ED',    // orange-50
    surface: '#FFFFFF',       // white
    text: '#292524',          // stone-800
    textMuted: '#78716C',     // stone-500
    border: '#E7E5E4',        // stone-200
    success: '#22C55E',       // green-500
    error: '#EF4444',         // red-500
} as const

export type ColorToken = keyof typeof colors
