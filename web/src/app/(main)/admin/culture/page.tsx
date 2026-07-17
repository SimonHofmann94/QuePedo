import Link from "next/link"
import { redirect } from "next/navigation"
import { getAllCultureCountries } from "@chingon/shared"
import { isCallerAdmin } from "@/actions/admin"
import { Badge } from "@/components/ui/badge"

// Culture CMS index — the 21 country pages, each linking into the editor.
// Server-side gated like /admin; the save RPC re-checks admin anyway.
export default async function AdminCulturePage() {
  const admin = await isCallerAdmin()
  if (!admin) redirect("/dashboard")

  const countries = getAllCultureCountries()

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
            Solo admins
          </div>
          <h1 className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800">
            Contenido cultural
          </h1>
          <p className="mt-3 text-base text-ink-500">
            Elige un país para editar su intro, slang, vocabulario y lugares.
          </p>
        </div>

        <div className="divide-y divide-ink-100 rounded-[20px] border border-ink-100 bg-white shadow-sm">
          {countries.map((c) => (
            <Link
              key={c.id}
              href={`/admin/culture/${c.id}`}
              className="group flex items-center gap-4 px-5 py-3.5 first:rounded-t-[20px] last:rounded-b-[20px] hover:bg-masa-50"
            >
              <span className="text-3xl">{c.flag}</span>
              <span className="flex-1">
                <span className="block font-display text-lg font-extrabold leading-tight text-ink-800">
                  {c.name.en}
                </span>
                <span className="block text-sm text-ink-500">{c.nameEs}</span>
              </span>
              <Badge color="ink" variant="outline" size="sm">
                {c.id}
              </Badge>
              <span className="font-display text-sm font-bold text-chili-500 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
