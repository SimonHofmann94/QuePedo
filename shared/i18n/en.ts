// English UI catalog. This file is the STRUCTURAL SOURCE OF TRUTH:
// `Messages` (see ./types) is derived from `typeof en`, so `de` and `es`
// must match its shape exactly — missing or extra keys fail typecheck.
//
// NOTE: Brand "flavor" interjections (¡Dale!, ¡Órale!, Ándale, chingón,
// ¿Qué pedo?…) are NOT translated — they live in `voice` (design/tokens)
// and stay Spanish in every locale. Only functional/explanatory copy
// belongs here.
//
// Phase 3 fills the remaining namespaces (dashboard, vocab, grammar, …).
// Seeded here: `nav` + `common` to prove the pipeline end-to-end.
export const en = {
  nav: {
    dashboard: "Dashboard",
    vocabulary: "Vocabulary",
    grammar: "Grammar",
    exercises: "Exercises",
    games: "Games",
    culture: "Culture",
    profile: "Profile",
  },
  common: {
    settings: "Settings",
    language: "Language",
    appLanguage: "App language",
    save: "Save",
    back: "Back",
    search: "Search",
    close: "Close",
  },
}
