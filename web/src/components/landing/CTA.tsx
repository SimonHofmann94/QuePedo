import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
    return (
        <section className="px-6 py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                    Ready to Become Fluent?
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Join thousands of learners and start your journey with Spanish today. Your first lesson is on us.
                </p>
                <Link href="/signup">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-14 text-lg">
                        Start Your Free Trial Now
                    </Button>
                </Link>
            </div>
        </section>
    )
}
