import {
    LayoutDashboard,
    Book,
    Library,
    Globe,
    User,
    Dumbbell,
    Gamepad2,
} from "lucide-react"
import type { Messages } from "@chingon/shared"

// Keys into the `nav` catalog namespace — resolved to localized labels at the
// call site via useTranslations("nav"). Keeps titles out of this file so the
// shared catalog is the single source of truth.
export type NavKey = keyof Messages["nav"]

export type NavigationItem = {
    titleKey: NavKey
    href: string
    icon: React.ComponentType<{ className?: string }>
}

export const navigationItems: NavigationItem[] = [
    { titleKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    { titleKey: "vocabulary", href: "/vocabulary", icon: Book },
    { titleKey: "grammar", href: "/grammar", icon: Library },
    { titleKey: "exercises", href: "/exercises", icon: Dumbbell },
    { titleKey: "games", href: "/games", icon: Gamepad2 },
    { titleKey: "culture", href: "/culture", icon: Globe },
    { titleKey: "profile", href: "/profile", icon: User },
]
