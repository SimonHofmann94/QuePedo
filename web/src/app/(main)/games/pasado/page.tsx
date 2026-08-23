"use client"

import { useCallback } from "react"
import { getDecisionBank, RULES_DE, type DecisionRuleTag } from "@chingon/shared"
import { DecisionGame } from "../DecisionGame"

export default function Page() {
  const buildPool = useCallback(() => getDecisionBank("pasado"), [])
  return (
    <DecisionGame
      gameId="pasado"
      emoji="⏳"
      title="Pasado"
      instructions="Indefinido, perfecto o imperfecto — la decisión que más cuesta. Diez frases; cada fallo te explica el porqué."
      buildPool={buildPool}
      ruleRef={(tag) => RULES_DE[tag as DecisionRuleTag]}
    />
  )
}
