import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ct, type CultureImage as CultureImageData } from "@chingon/shared"
import { getLocale } from "next-intl/server"
import { getCountry } from "@/lib/culture"
import { CountrySections } from "@/components/features/culture/CountrySections"
import { PhotoCredit, type FlatImage } from "@/components/features/culture/CultureImage"
import { PapelPicado } from "@/components/ui/motifs"

/** Localize an image's alt text so client components only ever see strings. */
function flatImage(img: CultureImageData | undefined, locale: string): FlatImage | undefined {
  if (!img) return undefined
  return { ...img, alt: ct(img.alt, locale) }
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [country, locale] = await Promise.all([getCountry(id), getLocale()])
  if (!country) notFound()

  const name = ct(country.name, locale)
  const hero = flatImage(country.heroImage, locale)
  const tagline = country.tagline ? ct(country.tagline, locale) : null

  return (
    <div>
      {hero ? (
        /* Full-bleed hero. Papel picado strung across the top of the photo —
           the mercado motif the rest of the app uses, finally in Culture. */
        <header className="relative h-[clamp(320px,52vh,520px)] w-full overflow-hidden bg-ink-800">
          <Image
            src={hero.url}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-ink-900/20"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 opacity-90" aria-hidden>
            <PapelPicado height={46} />
          </div>

          <Link
            href="/culture"
            className="absolute left-6 top-14 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white md:left-10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-wider">Volver al mapa</span>
          </Link>

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="mx-auto max-w-5xl">
              <div className="text-5xl leading-none drop-shadow-lg md:text-6xl">{country.flag}</div>
              <h1 className="mt-2 font-marker text-[44px] leading-[0.95] tracking-tight text-white md:text-[68px]">
                {name}
              </h1>
              <div className="mt-1 font-display text-lg italic text-white/70">
                {country.nameEs}
              </div>
              {tagline ? (
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85 md:text-base">
                  {tagline}
                </p>
              ) : null}
            </div>
          </div>

          <PhotoCredit image={hero} className="absolute bottom-2 right-3" />
        </header>
      ) : (
        /* Legacy country — no photo sourced yet. Keep the old card hero so the
           page never renders a grey hole. */
        <header className="px-6 pt-6 md:px-10 md:pt-10">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/culture"
              className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">Volver al mapa</span>
            </Link>
            <div className="rounded-[24px] border border-ink-100 bg-white p-8 shadow-sm md:p-10">
              <div className="text-6xl">{country.flag}</div>
              <h1 className="mt-3 font-marker text-4xl tracking-tight text-ink-800 md:text-5xl">
                {name}
              </h1>
              <div className="mt-1 font-display text-lg italic text-ink-400">{country.nameEs}</div>
            </div>
          </div>
        </header>
      )}

      <div className="px-6 pb-10 md:px-10">
        <div className="mx-auto max-w-5xl">
          <CountrySections
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
              image: flatImage(s.image, locale),
            }))}
            food={(country.food ?? []).map((d) => ({
              name: d.name,
              description: ct(d.description, locale),
              image: flatImage(d.image, locale),
            }))}
            festivals={(country.festivals ?? []).map((f) => ({
              name: f.name,
              when: ct(f.when, locale),
              description: ct(f.description, locale),
              image: flatImage(f.image, locale),
            }))}
            etiquette={(country.etiquette ?? []).map((e) => ({
              title: e.title,
              text: ct(e.text, locale),
            }))}
          />

          <div className="mt-10 flex justify-end">
            <Link href="/culture">
              <Button variant="ghost">← Otro país</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
