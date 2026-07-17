import { notFound, redirect } from "next/navigation"
import { getCultureCountry } from "@chingon/shared"
import { adminGetCultureCountry, isCallerAdmin } from "@/actions/admin"
import { CultureEditor } from "./CultureEditor"

// Culture CMS editor page — loads DB override (or bundled base) as initial
// state, plus the pristine bundled content for "Restaurar original".
export default async function AdminCultureEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const admin = await isCallerAdmin()
  if (!admin) redirect("/dashboard")

  const { id } = await params
  const data = await adminGetCultureCountry(id)
  if (!data) notFound()

  return (
    <CultureEditor
      initial={data.country}
      initialSource={data.source}
      bundled={getCultureCountry(id)}
    />
  )
}
