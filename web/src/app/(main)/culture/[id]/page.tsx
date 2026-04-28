import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const COUNTRY_NAMES: Record<string, { flag: string; name: string }> = {
  mx: { flag: "🇲🇽", name: "México" },
  ar: { flag: "🇦🇷", name: "Argentina" },
  es: { flag: "🇪🇸", name: "España" },
  co: { flag: "🇨🇴", name: "Colombia" },
  cl: { flag: "🇨🇱", name: "Chile" },
  pe: { flag: "🇵🇪", name: "Perú" },
  cu: { flag: "🇨🇺", name: "Cuba" },
  ve: { flag: "🇻🇪", name: "Venezuela" },
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const country = COUNTRY_NAMES[id] ?? { flag: "🌎", name: id.toUpperCase() }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/culture"
          className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver al mapa</span>
        </Link>

        <div className="rounded-[24px] border border-ink-100 bg-white p-8 shadow-sm md:p-10">
          <div className="text-7xl">{country.flag}</div>
          <div className="mt-3 font-display text-5xl font-extrabold tracking-tight text-ink-800">
            {country.name}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge color="chili" variant="soft">slang</Badge>
            <Badge color="jade" variant="soft">comida</Badge>
            <Badge color="cielo" variant="soft">música</Badge>
          </div>
          <p className="mt-6 text-base text-ink-500">
            Próximamente — slang, comida, costumbres y conversaciones reales de {country.name}.
          </p>
        </div>
      </div>
    </div>
  )
}
