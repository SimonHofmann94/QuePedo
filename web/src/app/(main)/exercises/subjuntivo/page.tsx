"use client"

import { useCallback } from "react"
import { getDecisionBank, RULES_DE, type DecisionRuleTag } from "@chingon/shared"
import { DecisionGame } from "@/app/(main)/games/DecisionGame"

export default function Page() {
  const buildPool = useCallback(() => getDecisionBank("subjuntivo"), [])
  return (
    <DecisionGame
      gameId="subjuntivo"
      emoji="🔮"
      title="¿Subjuntivo?"
      instructions="Indicativo o subjuntivo. Busca el disparador en la frase. Diez rondas; cada fallo te enseña la regla."
      buildPool={buildPool}
      ruleRef={(tag) => RULES_DE[tag as DecisionRuleTag]}
    />
  )
}
