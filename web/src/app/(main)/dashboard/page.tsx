import { getCurrentUser } from "@/actions/auth"
import { getUserProfile } from "@/actions/profile"
import { getUserActivityDates, getUserStreak } from "@/actions/activity"
import { VocabularyStats, StreakStats, QuizStats, StudyTimeStats } from "@/components/dashboard/StatsCard"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { StreakCalendar } from "@/components/dashboard/StreakCalendar"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { redirect } from "next/navigation"

// Fun Spanish greetings
const GREETINGS = [
    "¡Qué pedo, carnal!",
    "¡Qué onda, compa!",
    "¡Hola, campeón!",
    "¡Buenas, crack!",
    "¡Epa, amigo!",
    "¡Saludos, jefe!",
    "¡Hey, colega!",
]

function getRandomGreeting() {
    return GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
}

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    // Get user profile
    const profileResult = await getUserProfile()
    const profile = profileResult.data

    // Check if onboarding is complete
    if (profile && !profile.onboarding_completed) {
        redirect("/onboarding")
    }

    // Get user activity
    const activityResult = await getUserActivityDates()
    const activityDates = activityResult.data || []

    // Get streak
    const streakResult = await getUserStreak()
    const currentStreak = streakResult.streak || 0

    // Extract first name from email
    const displayName = user.user_metadata?.name || user.email?.split('@')[0] || "amigo"

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900">
                        {getRandomGreeting()}
                    </h1>
                    <p className="text-xl text-slate-600">
                        Welcome back, {displayName}!
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <VocabularyStats count={profile?.vocabulary_count || 0} />
                    <StreakStats days={currentStreak} />
                    <QuizStats score={85} />
                    <StudyTimeStats minutes={120} />
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <QuickActions />
                        <StreakCalendar activityDates={activityDates} />
                    </div>

                    {/* Right Column */}
                    <div>
                        <RecentActivity activities={[]} />
                    </div>
                </div>
            </div>
        </div>
    )
}
