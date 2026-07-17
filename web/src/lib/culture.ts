// Server-side culture content resolution: DB override → bundled fallback.
// The culture_content table is the CMS layer (admin-edited); the bundled
// JSON in @chingon/shared is the base. Invalid/malformed DB rows are
// ignored in favor of the bundle — the site can never break on a bad edit.
import { createClient } from "@/utils/supabase/server"
import {
  getCultureCountry,
  getAllCultureCountries,
  cultureCountrySchema,
  type CultureCountry,
} from "@chingon/shared"

export async function getCountry(id: string): Promise<CultureCountry | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("culture_content")
      .select("content")
      .eq("id", id.toLowerCase())
      .maybeSingle()
    if (data?.content) {
      const parsed = cultureCountrySchema.safeParse(data.content)
      if (parsed.success) return parsed.data as CultureCountry
      console.error(`[culture] invalid DB content for ${id} — using bundled fallback`)
    }
  } catch (err) {
    console.error("[culture] DB read failed — using bundled fallback:", err)
  }
  return getCultureCountry(id)
}

export async function getAllCountries(): Promise<CultureCountry[]> {
  const base = getAllCultureCountries()
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("culture_content").select("id, content")
    if (!data?.length) return base
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
