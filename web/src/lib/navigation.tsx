import {
    LayoutDashboard,
    Book,
    BrainCircuit,
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

export const navigationItems: NavigationItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Vocabulary",
        href: "/vocabulary",
        icon: Book,
    },
    {
        title: "Quiz",
        href: "/quiz",
        icon: BrainCircuit,
    },
    {
        title: "Grammar",
        href: "/grammar",
        icon: Library,
    },
    {
        title: "Exercises",
        href: "/exercises",
        icon: Dumbbell,
    },
    {
        title: "Culture",
        href: "/culture",
        icon: Globe,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
]
