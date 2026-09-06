"use client"

import { useCallback } from "react"
import { getDecisionBank, RULES_DE, type DecisionRuleTag } from "@chingon/shared"
import { DecisionGame } from "@/app/(main)/games/DecisionGame"

export default function Page() {
  const buildPool = useCallback(() => getDecisionBank("ser_estar"), [])
  return (
    <DecisionGame
      gameId="ser_estar"
      emoji="🎭"
      title="Ser o Estar"
      instructions="Una frase, un hueco, dos verbos. ¿Esencia o estado? Diez rondas; cada fallo te explica la regla."
      buildPool={buildPool}
      ruleRef={(tag) => RULES_DE[tag as DecisionRuleTag]}
    />
  )
}
