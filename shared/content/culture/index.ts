// Culture content registry — all 21 Spanish-speaking countries, en+de.
// Validated by culture.check.ts (schema, locale completeness, coordinates).
import type { CultureCountry } from './types'
import mx from './mx.json'
import es from './es.json'
import ar from './ar.json'
import co from './co.json'
import pe from './pe.json'
import cl from './cl.json'
import cu from './cu.json'
import ve from './ve.json'
import ec from './ec.json'
import gt from './gt.json'
import bo from './bo.json'
import dom from './do.json'
import hn from './hn.json'
import py from './py.json'
import sv from './sv.json'
import ni from './ni.json'
import cr from './cr.json'
import pa from './pa.json'
import uy from './uy.json'
import pr from './pr.json'
import gq from './gq.json'

export * from './types'
export * from './schema'

export const CULTURE_COUNTRIES: CultureCountry[] = [
  mx, es, ar, co, pe, cl, cu, ve, ec, gt, bo,
  dom, hn, py, sv, ni, cr, pa, uy, pr, gq,
] as CultureCountry[]

const byId = new Map(CULTURE_COUNTRIES.map((c) => [c.id, c]))

export function getCultureCountry(id: string): CultureCountry | null {
  return byId.get(id.toLowerCase()) ?? null
}

export function getAllCultureCountries(): CultureCountry[] {
  return CULTURE_COUNTRIES
}
