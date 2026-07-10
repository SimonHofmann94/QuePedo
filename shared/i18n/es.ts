import type { Messages } from "./types"

// Spanish UI catalog. Must match the shape of `en` (enforced by `Messages`).
// ES values mirror the app's current (Spanish-first) copy — so the `es`
// locale is a near-zero-regression reproduction of today's UI.
export const es: Messages = {
  nav: {
    dashboard: "Inicio",
    vocabulary: "Vocabulario",
    grammar: "Gramática",
    exercises: "Ejercicios",
    culture: "Cultura",
    profile: "Perfil",
  },
  common: {
    settings: "Ajustes",
    language: "Idioma",
    appLanguage: "Idioma de la app",
    save: "Guardar",
    back: "Volver",
    search: "Buscar",
    close: "Cerrar",
  },
}
