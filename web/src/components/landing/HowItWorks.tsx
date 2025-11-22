const steps = [
    {
        number: "1",
        title: "Sign Up For Free",
        description: "Create your account in just a few clicks. No credit card required."
    },
    {
        number: "2",
        title: "Take a Placement Test",
        description: "Answer a few quick questions to find the perfect starting point for you."
    },
    {
        number: "3",
        title: "Start Your Learning Path",
        description: "Dive into your lessons and begin your journey to fluency today."
    }
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="px-6 py-16 md:py-24 bg-white">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 text-center mb-16">
                    How It Works
                </h2>

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className="bg-yellow-400 text-slate-900 font-bold text-2xl w-14 h-14 rounded-full flex items-center justify-center">
                                    {step.number}
                                </div>
                            </div>
                            <div className="pt-2">
                                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-lg text-slate-600">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
