import {
    LayoutDashboard,
    Book,
    Library,
    Globe,
    User,
    Dumbbell,
} from "lucide-react"

export type NavigationItem = {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
}

// Spanish UI strings
export const navigationItems: NavigationItem[] = [
    {
        title: "Inicio",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Vocabulario",
        href: "/vocabulary",
        icon: Book,
    },
    {
        title: "Gramática",
        href: "/grammar",
        icon: Library,
    },
    {
        title: "Ejercicios",
        href: "/exercises",
        icon: Dumbbell,
    },
    {
        title: "Cultura",
        href: "/culture",
        icon: Globe,
    },
    {
        title: "Perfil",
        href: "/profile",
        icon: User,
    },
]
