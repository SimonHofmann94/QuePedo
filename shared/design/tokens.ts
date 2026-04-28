// ¡Qué Pedo! Design System — Tokens
// Mexican-inspired palette: mercado warmth, papel picado colors,
// cantina neons. Single source of truth for web + mobile.

export const colors = {
  // Chili — primary action / brand
  chili: {
    50:  '#fff4ee',
    100: '#ffe3d1',
    200: '#ffc39b',
    300: '#ff9a62',
    400: '#ff7537',
    500: '#ef5a1c',
    600: '#d94a0e',
    700: '#b33a08',
    800: '#8f2e08',
    900: '#6a2208',
  },
  // Rosa Mexicano — celebration / streaks / rewards
  rosa: {
    50:  '#fff0f7',
    100: '#ffd6ea',
    200: '#ffa8d2',
    300: '#ff73b5',
    400: '#ff3e94',
    500: '#e91e7a',
    600: '#c11462',
    700: '#96104c',
  },
  // Jade — success / verbs / nature
  jade: {
    50:  '#ecfbf2',
    100: '#c8f5db',
    200: '#8eeab6',
    300: '#4fd78b',
    400: '#1fbd67',
    500: '#089a4f',
    600: '#067b40',
    700: '#055e33',
  },
  // Cielo — info / culture / water
  cielo: {
    50:  '#eef6ff',
    100: '#d5e8ff',
    200: '#aacfff',
    300: '#78b1ff',
    400: '#4a8eff',
    500: '#2563eb',
    600: '#1c4dc4',
    700: '#153c99',
  },
  // Maíz — warning / streaks fire / highlight
  maiz: {
    50:  '#fff9e5',
    100: '#ffefb0',
    200: '#ffe071',
    300: '#ffcf3d',
    400: '#f5b81f',
    500: '#d69811',
    600: '#a6760b',
    700: '#7a5608',
  },
  // Jacaranda — secondary accent (purple-violet, Mexican street trees)
  jacaranda: {
    50:  '#f5f0ff',
    100: '#e5d9ff',
    200: '#cab3ff',
    300: '#a880ff',
    400: '#8a5cf7',
    500: '#6f3ff0',
    600: '#5a2bd6',
    700: '#4621a8',
  },
  // Masa — warm neutrals (corn dough beige)
  masa: {
    50:  '#fcf9f3',
    100: '#f5efe0',
    200: '#ebe2cc',
    300: '#dccdaa',
    400: '#c4b087',
    500: '#a48d66',
    600: '#7a6a4d',
  },
  // Ink — text & dark surfaces
  ink: {
    50:  '#f7f6f3',
    100: '#ebe9e3',
    200: '#d4d1c7',
    300: '#a8a396',
    400: '#6d6a60',
    500: '#3d3b35',
    600: '#26251f',
    700: '#1a1915',
    800: '#100f0c',
    900: '#08080a',
  },
} as const

export const surface = {
  bg:        '#fcf9f3', // masa-50 — app background (light)
  card:      '#ffffff',
  cardAlt:   '#fcf9f3',
  muted:     '#f5efe0',
  dark:      '#1a1915',
  darker:    '#100f0c',
  darkCard:  '#26251f',
} as const

// Semantic role mapping (for theming primitives)
export const semantic = {
  primary:    colors.chili[500],
  primaryFg:  '#ffffff',
  success:    colors.jade[500],
  info:       colors.cielo[500],
  warning:    colors.maiz[400],
  danger:     colors.rosa[500],
  accent:     colors.jacaranda[500],
  text:       colors.ink[800],
  textMuted:  colors.ink[500],
  textSubtle: colors.ink[400],
  border:     colors.ink[100],
  borderStrong: colors.ink[200],
} as const

export const fonts = {
  display: '"Fraunces", "Recoleta", Georgia, serif',
  body:    '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
  mono:    '"JetBrains Mono", ui-monospace, monospace',
  marker:  '"Caprasimo", "Fraunces", Georgia, serif',
} as const

export const radii = {
  xs:   6,
  sm:   10,
  md:   14,
  lg:   20,
  xl:   28,
  full: 999,
} as const

export const shadows = {
  sm:         '0 1px 2px rgba(26,25,21,.06), 0 1px 3px rgba(26,25,21,.08)',
  md:         '0 4px 6px -1px rgba(26,25,21,.08), 0 2px 4px -2px rgba(26,25,21,.1)',
  lg:         '0 12px 24px -6px rgba(26,25,21,.12), 0 4px 8px -4px rgba(26,25,21,.08)',
  xl:         '0 24px 48px -12px rgba(26,25,21,.18)',
  // Signature gamified shadows (bottom offset, no blur)
  chunky:     '0 5px 0 0 rgba(26,25,21,.12)',
  chunkyDark: '0 5px 0 0 rgba(26,25,21,.35)',
} as const

// Helper: chunky shadow in any color
export const chunky = (hex: string) => `0 4px 0 0 ${hex}`

// Voice & copy guidelines (use across UI strings)
export const voice = {
  // We say
  cta:           '¡Dale!',
  loading:       'Cocinando…',
  loadingShort:  'Cargando…',
  error:         '¡Ay, no!',
  success:       '¡Órale!',
  next:          'Ándale',
  greet:         '¿Qué pedo?',
  badass:        'chingón',
  retry:         'Otra vez',
  cancel:        'Cancelar',
} as const

export type ColorFamily = keyof typeof colors

export const tokens = {
  colors,
  surface,
  semantic,
  fonts,
  radii,
  shadows,
  chunky,
  voice,
} as const

export default tokens
