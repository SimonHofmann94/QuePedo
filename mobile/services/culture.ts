// Culture content resolution: CMS override (culture_content table) → bundled
// fallback. Mirrors web/src/lib/culture.ts — invalid/malformed DB rows are
// ignored so the screens can never break on a bad edit or while offline.
import { supabase } from '@/lib/supabase'
import {
  getCultureCountry,
  getAllCultureCountries,
  cultureCountrySchema,
  type CultureCountry,
} from '@chingon/shared'

export async function fetchCultureCountries(): Promise<CultureCountry[]> {
  const base = getAllCultureCountries()
  try {
    const { data, error } = await supabase.from('culture_content').select('id, content')
    if (error || !data?.length) return base
    const overrides = new Map<string, CultureCountry>()
    for (const row of data) {
      const parsed = cultureCountrySchema.safeParse(row.content)
      if (parsed.success) overrides.set(row.id as string, parsed.data as CultureCountry)
    }
    return base.map((c) => overrides.get(c.id) ?? c)
  } catch {
    return base
  }
}

export async function fetchCultureCountry(id: string): Promise<CultureCountry | null> {
  try {
    const { data } = await supabase
      .from('culture_content')
      .select('content')
      .eq('id', id.toLowerCase())
      .maybeSingle()
    if (data?.content) {
      const parsed = cultureCountrySchema.safeParse(data.content)
      if (parsed.success) return parsed.data as CultureCountry
      console.error(`[culture] invalid DB content for ${id} — using bundled fallback`)
    }
  } catch (err) {
    console.error('[culture] DB read failed — using bundled fallback:', err)
  }
  return getCultureCountry(id)
}
