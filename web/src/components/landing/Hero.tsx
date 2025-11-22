import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                    Unlock the Spanish-Speaking World
                </h1>
                <p className="text-lg text-slate-600 max-w-lg">
                    Master Spanish with our fun, interactive lessons designed to get you speaking from day one. Join the Chingón community today.
                </p>
                <div className="flex gap-4">
                    <Link href="/signup">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 text-lg">
                            Start Your Free Trial
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative h-[400px] w-full bg-orange-50 rounded-3xl overflow-hidden flex items-center justify-center">
                {/* Placeholder for the generated image - in a real app we'd use the actual file */}
                <Image
                    src="/hero-illustration.png"
                    alt="Spanish learning illustration"
                    width={600}
                    height={400}
                    className="object-contain p-4"
                />
            </div>
        </section>
    )
}
