// ¡Qué Pedo! Mobile theme — re-exported from @chingon/shared
// Single source of truth: shared/design/tokens.ts
import { colors, surface, semantic, fonts, radii, shadows, chunky, voice } from "@chingon/shared"

export { colors, surface, semantic, fonts, radii, shadows, chunky, voice }

// CEFR → color family mapping (used across Mobile screens)
export const LEVEL_COLOR = {
  A1: colors.chili[500],
  A2: colors.jade[500],
  B1: colors.cielo[500],
  B2: colors.maiz[400],
  C1: colors.jacaranda[500],
  C2: colors.rosa[500],
} as const

export type ColorFamily = "chili" | "rosa" | "jade" | "cielo" | "maiz" | "jacaranda" | "masa" | "ink"

// React Native font names. When the system font is missing, RN falls back to platform default.
// Fonts are registered via expo-font in the root layout.
export const fontFamily = {
  display: "Fraunces_700Bold",
  displayExtraBold: "Fraunces_800ExtraBold",
  body: "PlusJakartaSans_500Medium",
  bodyBold: "PlusJakartaSans_700Bold",
  bodyExtraBold: "PlusJakartaSans_800ExtraBold",
  marker: "Caprasimo_400Regular",
  mono: "JetBrainsMono_500Medium",
  monoBold: "JetBrainsMono_700Bold",
} as const

// React Native has no CSS shadow — use iOS/Android shadow props.
export const elevation = {
  sm:  { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  md:  { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  lg:  { shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 6 },
} as const

// Signature chunky shadow for buttons — approximated with iOS shadow (Android uses elevation fallback)
export const chunkyShadow = (color: string) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
})
