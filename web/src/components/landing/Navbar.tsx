import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
                <div className="bg-orange-500 p-1.5 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Chingón</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <Link href="#features" className="hover:text-orange-600 transition-colors">Features</Link>
                <Link href="#how-it-works" className="hover:text-orange-600 transition-colors">How it Works</Link>
                <Link href="#pricing" className="hover:text-orange-600 transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/login">
                    <Button variant="ghost" className="text-slate-600 hover:text-orange-600">Log In</Button>
                </Link>
                <Link href="/signup">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">Sign Up Free</Button>
                </Link>
            </div>
        </nav>
    )
}
