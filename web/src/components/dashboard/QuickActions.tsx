import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, MessageSquare, TrendingUp, PlusCircle } from "lucide-react"

const actions = [
    {
        title: "Start Learning",
        description: "Continue where you left off",
        icon: BookOpen,
        href: "/vocabulary",
        color: "bg-orange-500 hover:bg-orange-600"
    },
    {
        title: "Take Quiz",
        description: "Test your knowledge",
        icon: MessageSquare,
        href: "/quiz",
        color: "bg-blue-500 hover:bg-blue-600"
    },
    {
        title: "Add Vocabulary",
        description: "Expand your wordbank",
        icon: PlusCircle,
        href: "/vocabulary",
        color: "bg-green-500 hover:bg-green-600"
    },
    {
        title: "View Progress",
        description: "See your improvement",
        icon: TrendingUp,
        href: "/profile",
        color: "bg-purple-500 hover:bg-purple-600"
    }
]

export function QuickActions() {
    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <Link key={action.title} href={action.href}>
                        <Button
                            variant="outline"
                            className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:border-slate-400"
                        >
                            <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                                <action.icon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-slate-900">{action.title}</div>
                                <div className="text-xs text-slate-600">{action.description}</div>
                            </div>
                        </Button>
                    </Link>
                ))}
            </div>
        </Card>
    )
}
