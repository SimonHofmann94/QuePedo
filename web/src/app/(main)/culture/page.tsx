import { getLocale } from "next-intl/server"
import { ct } from "@chingon/shared"
import { getAllCountries } from "@/lib/culture"
import { CultureExplorer } from "@/components/features/culture/CultureExplorer"

export default async function CulturePage() {
  const [countries, locale] = await Promise.all([getAllCountries(), getLocale()])

  // Localize once on the server; the explorer only sees plain strings.
  const cards = countries.map((c) => ({
    id: c.id,
    flag: c.flag,
    name: ct(c.name, locale),
    nameEs: c.nameEs,
    capital: c.capital,
    population: c.population,
    hero: c.heroImage ? { ...c.heroImage, alt: ct(c.heroImage.alt, locale) } : null,
    tagline: c.tagline ? ct(c.tagline, locale) : null,
    teaser: c.slang[0]
      ? { term: c.slang[0].term, meaning: ct(c.slang[0].meaning, locale) }
      : null,
  }))

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
            21 países · 500M hablantes
          </div>
          <div className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800 md:text-5xl">
            Mapa cultural
          </div>
          <div className="mt-2 max-w-xl text-[15px] text-ink-500">
            Un idioma, mil formas de decirlo. Explora slang, vocabulario y lugares por país.
          </div>
        </div>

        <CultureExplorer countries={cards} />
      </div>
    </div>
  )
}
