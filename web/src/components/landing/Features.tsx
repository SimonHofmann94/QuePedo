import { Video, Mic, Globe, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
    {
        icon: Video,
        title: "Interactive Lessons",
        description: "Engage with dynamic video tutorials that make learning fun and effective."
    },
    {
        icon: Mic,
        title: "Real Conversations",
        description: "Practice speaking with our AI tutors and get real-time feedback."
    },
    {
        icon: Globe,
        title: "Cultural Insights",
        description: "Explore the culture, culture traditions, and customs of Spanish-speaking countries."
    },
    {
        icon: TrendingUp,
        title: "Progress Tracking",
        description: "Track your journey to fluency with detailed progress reports and achievements."
    }
]

export function Features() {
    return (
        <section id="features" className="px-6 py-16 md:py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Everything You Need to Succeed
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Our platform builds everything you need to ensure you learn more effectively and stay motivated.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow">
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <feature.icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
