import { Card } from "@/components/ui/card"
import { BookOpen, Trophy, MessageSquare } from "lucide-react"

interface Activity {
    type: "vocabulary" | "quiz" | "completed"
    title: string
    time: string
    score?: number
}

interface RecentActivityProps {
    activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const getIcon = (type: Activity["type"]) => {
        switch (type) {
            case "vocabulary":
                return <BookOpen className="h-5 w-5 text-orange-600" />
            case "quiz":
                return <Trophy className="h-5 w-5 text-blue-600" />
            default:
                return <MessageSquare className="h-5 w-5 text-green-600" />
        }
    }

    if (activities.length === 0) {
        return (
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
                <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No activity yet. Start learning to see your progress!</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="bg-slate-100 p-2 rounded-lg flex-shrink-0">
                            {getIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-900">{activity.title}</p>
                            <p className="text-sm text-slate-600">{activity.time}</p>
                        </div>
                        {activity.score !== undefined && (
                            <div className="text-right flex-shrink-0">
                                <div className="text-lg font-semibold text-slate-900">{activity.score}%</div>
                                <div className="text-xs text-slate-500">Score</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    )
}
