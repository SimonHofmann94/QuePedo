// Baked item banks for the sentence-decision games. One JSON per game,
// authored by agents to the contract in bank.check.ts.
import { decisionItemSchema, type DecisionItem } from '../../games/decisionItems'
import type { DecisionGameId } from '../../games/types'
import serEstar from './ser_estar.json'
import pasado from './pasado.json'
import subjuntivo from './subjuntivo.json'

export * from './rules'

interface Bank {
  game: string
  items: DecisionItem[]
}

const BANKS: Record<Exclude<DecisionGameId, 'el_o_la'>, Bank> = {
  ser_estar: serEstar as Bank,
  pasado: pasado as Bank,
  subjuntivo: subjuntivo as Bank,
}

/** Every item for a sentence game. El/La is derived from vocab, not banked. */
export function getDecisionBank(gameId: Exclude<DecisionGameId, 'el_o_la'>): DecisionItem[] {
  return BANKS[gameId].items
}

/** Parse-time guard used by the check script; the app trusts the bundle. */
export function validateBank(gameId: Exclude<DecisionGameId, 'el_o_la'>): DecisionItem[] {
  return BANKS[gameId].items.map((it) => decisionItemSchema.parse(it))
}
