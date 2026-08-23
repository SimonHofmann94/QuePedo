"use client"

import { useCallback } from "react"
import { buildGenderItems, getVocabList, type CEFR } from "@chingon/shared"
import { DecisionGame } from "../DecisionGame"

// Every gender rule the explanation can name lives in A1 chapter 1
// ("Substantive und Artikel"); the link is the same for all of them.
const NOUNS_CHAPTER = { level: "A1" as const, chapterId: 1 }

export default function ElOLaPage() {
  const buildPool = useCallback(
    (level: CEFR) => buildGenderItems(getVocabList(level)?.words ?? [], level),
    [],
  )
  return (
    <DecisionGame
      gameId="el_o_la"
      emoji="⚖️"
      title="¿El o La?"
      instructions="Aparece un sustantivo — toca el artículo correcto. Sesenta segundos, sin vidas: cada acierto sube el combo, cada fallo lo reinicia. En A2 y arriba también hay plurales."
      buildPool={buildPool}
      ruleRef={() => NOUNS_CHAPTER}
    />
  )
}
