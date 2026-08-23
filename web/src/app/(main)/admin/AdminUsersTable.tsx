"use client"

import { useState } from "react"
import { SearchIcon } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  adminListUsers,
  adminUpdateUser,
  adminBanUser,
  adminDeleteUser,
  type AdminUser,
} from "@/actions/admin"

const PAGE = 50

function isBanned(u: AdminUser): boolean {
  return !!u.banned_until && new Date(u.banned_until) > new Date()
}

export function AdminUsersTable({
  initialUsers,
  callerId,
}: {
  initialUsers: AdminUser[]
  /** The admin viewing the page — their own row gets no destructive buttons. */
  callerId: string
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const [busy, setBusy] = useState(false)
  const [hasMore, setHasMore] = useState(initialUsers.length === PAGE)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [rowError, setRowError] = useState<{ id: string; msg: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)

  const runSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const rows = await adminListUsers(search)
      setUsers(rows)
      setActiveSearch(search)
      setHasMore(rows.length === PAGE)
    } finally {
      setBusy(false)
    }
  }

  const loadMore = async () => {
    setBusy(true)
    try {
      const rows = await adminListUsers(activeSearch, users.length)
      setUsers((prev) => [...prev, ...rows])
      setHasMore(rows.length === PAGE)
    } finally {
      setBusy(false)
    }
  }

  const save = async (
    u: AdminUser,
    patch: Partial<Pick<AdminUser, "subscription_tier" | "taco_balance" | "is_admin">>,
  ) => {
    setSavingId(u.id)
    setRowError(null)
    const res = await adminUpdateUser({
      userId: u.id,
      targetEmail: u.email,
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

  const toggleBan = async (u: AdminUser) => {
    const ban = !isBanned(u)
    setSavingId(u.id)
    setRowError(null)
    const res = await adminBanUser({ userId: u.id, ban })
    if (res.success) {
      // Mirror what the server did without a refetch; 100y ≈ "permanent".
      const until = ban ? new Date(Date.now() + 100 * 365 * 24 * 3600 * 1000).toISOString() : null
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, banned_until: until } : x)))
    } else {
      setRowError({ id: u.id, msg: res.error ?? "No se pudo cambiar el bloqueo" })
    }
    setSavingId(null)
  }

  const confirmDelete = async (confirmEmail: string) => {
    if (!deleteTarget) return
    const target = deleteTarget
    setSavingId(target.id)
    setRowError(null)
    const res = await adminDeleteUser({ userId: target.id, confirmEmail })
    if (res.success) {
      setUsers((prev) => prev.filter((x) => x.id !== target.id))
      setDeleteTarget(null)
    } else {
      setRowError({ id: target.id, msg: res.error ?? "No se pudo eliminar" })
      setDeleteTarget(null)
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
              {["Email", "Estado", "Plan", "Tacos", "Admin", "Último acceso", ""].map((h) => (
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
                isSelf={u.id === callerId}
                saving={savingId === u.id}
                error={rowError?.id === u.id ? rowError.msg : null}
                onSave={(patch) => save(u, patch)}
                onToggleBan={() => toggleBan(u)}
                onDelete={() => setDeleteTarget(u)}
              />
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-ink-400">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="border-t border-ink-100 p-3 text-center">
          <Button variant="ghost" size="sm" onClick={loadMore} disabled={busy}>
            {busy ? "Cocinando…" : "Cargar más"}
          </Button>
        </div>
      )}

      <DeleteDialog
        target={deleteTarget}
        busy={savingId === deleteTarget?.id}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function UserRow({
  user,
  isSelf,
  saving,
  error,
  onSave,
  onToggleBan,
  onDelete,
}: {
  user: AdminUser
  isSelf: boolean
  saving: boolean
  error: string | null
  onSave: (patch: Partial<Pick<AdminUser, "subscription_tier" | "taco_balance" | "is_admin">>) => void
  onToggleBan: () => void
  onDelete: () => void
}) {
  const [tier, setTier] = useState(user.subscription_tier ?? "free")
  const [tacos, setTacos] = useState(user.taco_balance ?? 0)
  const [admin, setAdmin] = useState(user.is_admin)
  const banned = isBanned(user)

  const dirty =
    tier !== (user.subscription_tier ?? "free") ||
    tacos !== (user.taco_balance ?? 0) ||
    admin !== user.is_admin

  return (
    <tr className={`hover:bg-masa-50 ${banned ? "bg-rosa-50/40" : ""}`}>
      <td className="px-4 py-3 text-sm text-ink-800">
        <div className="flex items-center gap-2">
          {user.email}
          {user.is_admin && (
            <Badge color="jacaranda" variant="soft" size="sm">
              admin
            </Badge>
          )}
          {isSelf && (
            <Badge color="ink" variant="outline" size="sm">
              tú
            </Badge>
          )}
        </div>
        {error && <div className="mt-1 text-xs text-rosa-600">{error}</div>}
      </td>
      <td className="px-4 py-3">
        {banned ? (
          <Badge color="rosa" variant="solid" size="sm">
            Bloqueado
          </Badge>
        ) : (
          <Badge color="jade" variant="soft" size="sm">
            Activo
          </Badge>
        )}
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
        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant={dirty ? "primary" : "ghost"}
            disabled={!dirty || saving}
            onClick={() => onSave({ subscription_tier: tier, taco_balance: tacos, is_admin: admin })}
          >
            {saving ? "…" : "Guardar"}
          </Button>
          {/* Nobody gets to lock themselves out or delete themselves from here. */}
          {!isSelf && (
            <>
              <Button
                size="sm"
                variant={banned ? "outline" : "secondary"}
                disabled={saving}
                onClick={onToggleBan}
                title={
                  banned
                    ? "Permite que vuelva a iniciar sesión"
                    : "Rechaza nuevos inicios de sesión. Una sesión ya abierta puede durar hasta que expire su token (≈1 h)."
                }
              >
                {banned ? "Desbloquear" : "Bloquear"}
              </Button>
              <Button size="sm" variant="danger" disabled={saving} onClick={onDelete}>
                Eliminar
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

function DeleteDialog({
  target,
  busy,
  onCancel,
  onConfirm,
}: {
  target: AdminUser | null
  busy: boolean
  onCancel: () => void
  onConfirm: (confirmEmail: string) => void
}) {
  const [typed, setTyped] = useState("")
  const matches = !!target && typed.trim().toLowerCase() === target.email.toLowerCase()

  return (
    <Dialog
      open={target !== null}
      onOpenChange={(open) => {
        if (!open) {
          setTyped("")
          onCancel()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar cuenta</DialogTitle>
          <DialogDescription>
            Esto borra la cuenta de <strong>{target?.email}</strong> y todo lo suyo: vocabulario,
            progreso, partidas. No hay vuelta atrás. Escribe el email para confirmar.
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          placeholder={target?.email ?? ""}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && matches && !busy) onConfirm(typed)
          }}
        />
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setTyped("")
              onCancel()
            }}
            disabled={busy}
          >
            Cancelar
          </Button>
          <Button variant="danger" disabled={!matches || busy} onClick={() => onConfirm(typed)}>
            {busy ? "Eliminando…" : "Eliminar para siempre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
