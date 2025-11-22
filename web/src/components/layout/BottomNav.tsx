"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigationItems } from "@/lib/navigation"

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
            <div className="flex h-16 items-center justify-around px-2">
                {navigationItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span>{item.title}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
