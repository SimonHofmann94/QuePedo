import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ct } from "@chingon/shared"
import { getLocale } from "next-intl/server"
import { getCountry } from "@/lib/culture"
import { CountryTabs } from "@/components/features/culture/CountryTabs"

export default async function CountryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [country, locale] = await Promise.all([getCountry(id), getLocale()])
  if (!country) notFound()

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/culture"
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver al mapa</span>
        </Link>

        {/* Hero */}
        <div className="rounded-[24px] border border-ink-100 bg-white p-8 shadow-sm md:p-10">
          <div className="text-6xl">{country.flag}</div>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink-800 md:text-5xl">
            {ct(country.name, locale)}
          </h1>
          <div className="mt-1 font-display text-lg italic text-ink-400">
            {country.nameEs}
          </div>
        </div>

        <CountryTabs
          countryId={country.id}
          capital={country.capital}
          population={country.population}
          intro={ct(country.intro, locale)}
          funFact={ct(country.funFact, locale)}
          slang={country.slang.map((s) => ({
            term: s.term,
            meaning: ct(s.meaning, locale),
            example: s.example,
          }))}
          vocabulary={country.vocabulary.map((v) => ({
            es: v.es,
            translation: ct(v.translation, locale),
            note: v.note ? ct(v.note, locale) : undefined,
          }))}
          sights={country.sights.map((s) => ({
            name: s.name,
            description: ct(s.description, locale),
            lat: s.lat,
            lng: s.lng,
            emoji: s.emoji,
          }))}
        />

        <div className="mt-8 flex justify-end">
          <Link href="/culture">
            <Button variant="ghost">← Otro país</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
