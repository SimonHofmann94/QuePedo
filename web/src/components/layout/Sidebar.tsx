"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigationItems } from "@/lib/navigation"

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-background md:flex">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold">
                    <span className="text-xl">LingoApp</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-2">
                    {navigationItems.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t p-4">
                {/* Future User Profile or Settings could go here */}
                <div className="text-xs text-muted-foreground">
                    &copy; 2024 LingoApp
                </div>
            </div>
        </aside>
    )
}
