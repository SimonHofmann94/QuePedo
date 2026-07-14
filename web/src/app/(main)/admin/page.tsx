import { redirect } from "next/navigation"
import { isCallerAdmin, adminListUsers, adminStats } from "@/actions/admin"
import { AdminUsersTable } from "./AdminUsersTable"

// Admin dashboard v1 — users + subscriptions. Server-side gated; every RPC
// underneath re-checks is_admin, so the redirect is UX, not the security
// boundary.
export default async function AdminPage() {
  const admin = await isCallerAdmin()
  if (!admin) redirect("/dashboard")

  const [stats, users] = await Promise.all([adminStats(), adminListUsers()])

  const kpis = [
    { label: "Usuarios", value: stats?.total_users ?? "—", color: "cielo" },
    { label: "Premium", value: stats?.premium_users ?? "—", color: "maiz" },
    { label: "Nuevos (7d)", value: stats?.new_users_7d ?? "—", color: "jade" },
    { label: "Partidas (7d)", value: stats?.games_7d ?? "—", color: "chili" },
    { label: "Jugadores (7d)", value: stats?.game_players_7d ?? "—", color: "jacaranda" },
  ]

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500">
            Solo admins
          </div>
          <h1 className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800">
            Admin
          </h1>
        </div>

        {/* KPIs */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-[16px] border border-ink-100 bg-white p-4 shadow-sm"
            >
              <div
                className="font-mono text-[10px] font-bold uppercase tracking-[1.5px]"
                style={{ color: `var(--${k.color}-600)` }}
              >
                {k.label}
              </div>
              <div className="mt-1 font-display text-3xl font-extrabold text-ink-800">
                {k.value}
              </div>
            </div>
          ))}
        </div>

        <AdminUsersTable initialUsers={users} />
      </div>
    </div>
  )
}
