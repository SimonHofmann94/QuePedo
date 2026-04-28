"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { navigationItems } from "@/lib/navigation"
import { createClient } from "@/utils/supabase/client"
import { Logo } from "@/components/ui/logo"
import { Avatar } from "@/components/ui/avatar"

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <aside className="sticky top-0 hidden h-screen w-60 flex-col border-r border-ink-100 bg-card p-5 md:flex">
            <Link href="/dashboard" className="mb-5 px-3 py-2">
                <Logo size={36} />
            </Link>

            <nav className="flex flex-1 flex-col gap-0.5">
                {navigationItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-[12px] px-3.5 py-3 font-body text-sm font-semibold transition-all",
                                isActive
                                    ? "bg-chili-500 text-white shadow-[0_3px_0_var(--chili-700)]"
                                    : "text-ink-600 hover:bg-ink-100",
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            {/* Streak footer */}
            <div className="mb-2.5 rounded-[14px] border-2 border-maiz-300 bg-maiz-100 p-3.5">
                <div className="flex items-center gap-2">
                    <div className="text-2xl">🔥</div>
                    <div>
                        <div className="font-display text-[22px] font-extrabold leading-none text-ink-800">
                            14
                        </div>
                        <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-ink-500">
                            día racha
                        </div>
                    </div>
                </div>
            </div>

            {/* User row */}
            <div className="flex items-center gap-2.5 rounded-[10px] p-2.5">
                <Avatar name="H" color="var(--jacaranda-500)" size={36} />
                <div className="flex-1 min-w-0">
                    <div className="truncate font-body text-[13px] font-bold text-ink-800">
                        Habs Borsch
                    </div>
                    <div className="font-mono text-[10px] text-ink-400">A2 · 1,240 XP</div>
                </div>
                <button
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                    className="rounded-md p-1.5 text-ink-400 transition-colors hover:bg-rosa-50 hover:text-rosa-500"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </aside>
    )
}
