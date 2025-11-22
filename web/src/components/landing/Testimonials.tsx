import { Quote } from "lucide-react"
import { Card } from "@/components/ui/card"

export function Testimonials() {
    return (
        <section className="px-6 py-16 md:py-24 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <Card className="p-8 md:p-12 bg-white">
                    <Quote className="h-12 w-12 text-yellow-400 mb-6 mx-auto" />
                    <blockquote className="text-center">
                        <p className="text-xl md:text-2xl text-slate-900 mb-6 italic">
                            "I've tried other apps, but Chingón is the only one that made me feel confident enough to actually speak with natives. The cultural lessons are a fantastic bonus!"
                        </p>
                        <footer className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                CM
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900">Carlos M.</div>
                                <div className="text-sm text-slate-600">Language Enthusiast</div>
                            </div>
                        </footer>
                    </blockquote>
                </Card>
            </div>
        </section>
    )
}
