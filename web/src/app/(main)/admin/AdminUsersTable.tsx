"use client"

import { useState } from "react"
import { SearchIcon } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminListUsers, adminUpdateUser, type AdminUser } from "@/actions/admin"

export function AdminUsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [busy, setBusy] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [rowError, setRowError] = useState<{ id: string; msg: string } | null>(null)

  const runSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      setUsers(await adminListUsers(search))
    } finally {
      setBusy(false)
    }
  }

  const save = async (u: AdminUser, patch: Partial<Pick<AdminUser, "subscription_tier" | "taco_balance" | "is_admin">>) => {
    setSavingId(u.id)
    setRowError(null)
    const res = await adminUpdateUser({
      userId: u.id,
      tier: patch.subscription_tier as "free" | "premium" | undefined,
      tacoBalance: patch.taco_balance,
      isAdmin: patch.is_admin,
    })
    if (res.success) {
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...patch } : x)))
    } else {
      setRowError({ id: u.id, msg: res.error ?? "No se pudo guardar" })
    }
    setSavingId(null)
  }

  return (
    <div className="rounded-[20px] border border-ink-100 bg-white shadow-sm">
      {/* Search */}
      <form onSubmit={runSearch} className="flex gap-2 border-b border-ink-100 p-4">
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <Input
            placeholder="Buscar por email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary" disabled={busy}>
          {busy ? "Buscando…" : "Buscar"}
        </Button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-ink-100 bg-masa-50">
            <tr>
              {["Email", "Plan", "Tacos", "Admin", "Registro", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-ink-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {users.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                saving={savingId === u.id}
                error={rowError?.id === u.id ? rowError.msg : null}
                onSave={(patch) => save(u, patch)}
              />
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-400">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserRow({
  user,
  saving,
  error,
  onSave,
}: {
  user: AdminUser
  saving: boolean
  error: string | null
  onSave: (patch: Partial<Pick<AdminUser, "subscription_tier" | "taco_balance" | "is_admin">>) => void
}) {
  const [tier, setTier] = useState(user.subscription_tier ?? "free")
  const [tacos, setTacos] = useState(user.taco_balance ?? 0)
  const [admin, setAdmin] = useState(user.is_admin)

  const dirty =
    tier !== (user.subscription_tier ?? "free") ||
    tacos !== (user.taco_balance ?? 0) ||
    admin !== user.is_admin

  return (
    <tr className="hover:bg-masa-50">
      <td className="px-4 py-3 text-sm text-ink-800">
        <div className="flex items-center gap-2">
          {user.email}
          {user.is_admin && (
            <Badge color="jacaranda" variant="soft" size="sm">
              admin
            </Badge>
          )}
        </div>
        {error && <div className="mt-1 text-xs text-rosa-600">{error}</div>}
      </td>
      <td className="px-4 py-3">
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="rounded-[8px] border-2 border-ink-200 bg-white px-2 py-1 text-sm font-bold text-ink-700"
        >
          <option value="free">free</option>
          <option value="premium">premium</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          max={10000}
          value={tacos}
          onChange={(e) => setTacos(Math.max(0, parseInt(e.target.value || "0", 10)))}
          className="w-20 rounded-[8px] border-2 border-ink-200 bg-white px-2 py-1 text-sm font-bold text-ink-700"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={admin}
          onChange={(e) => setAdmin(e.target.checked)}
          className="h-4 w-4 accent-[var(--jacaranda-500)]"
        />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-ink-500">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          size="sm"
          variant={dirty ? "primary" : "ghost"}
          disabled={!dirty || saving}
          onClick={() => onSave({ subscription_tier: tier, taco_balance: tacos, is_admin: admin })}
        >
          {saving ? "…" : "Guardar"}
        </Button>
      </td>
    </tr>
  )
}
