"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigationItems } from "@/lib/navigation"

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink-100 bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
            <div className="flex h-[68px] items-stretch justify-around px-1.5 pt-1.5">
                {navigationItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-1 rounded-[12px] px-1 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider transition-colors",
                                isActive
                                    ? "text-chili-600"
                                    : "text-ink-400 hover:text-ink-700",
                            )}
                        >
                            <div
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                                    isActive && "bg-chili-100",
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                            </div>
                            <span>{item.title}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
