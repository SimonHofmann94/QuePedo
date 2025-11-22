import { Card } from "@/components/ui/card"
import { BookOpen, Trophy, Flame, Clock } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: string
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
                    {trend && (
                        <p className="text-sm text-green-600 mt-1">{trend}</p>
                    )}
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                    {icon}
                </div>
            </div>
        </Card>
    )
}

// Pre-configured stat cards
export function VocabularyStats({ count }: { count: number }) {
    return (
        <StatsCard
            title="Vocabulary Learned"
            value={count}
            icon={<BookOpen className="h-6 w-6 text-orange-600" />}
            trend={count > 0 ? `+${Math.min(count, 10)} this week` : undefined}
        />
    )
}

export function StreakStats({ days }: { days: number }) {
    return (
        <StatsCard
            title="Current Streak"
            value={`${days} days`}
            icon={<Flame className="h-6 w-6 text-orange-600" />}
        />
    )
}

export function QuizStats({ score }: { score: number }) {
    return (
        <StatsCard
            title="Average Score"
            value={`${score}%`}
            icon={<Trophy className="h-6 w-6 text-orange-600" />}
        />
    )
}

export function StudyTimeStats({ minutes }: { minutes: number }) {
    return (
        <StatsCard
            title="Time This Week"
            value={`${minutes} min`}
            icon={<Clock className="h-6 w-6 text-orange-600" />}
        />
    )
}
