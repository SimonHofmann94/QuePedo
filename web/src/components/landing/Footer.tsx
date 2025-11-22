import Link from "next/link"
import { MessageCircle, Facebook, Twitter, Linkedin } from "lucide-react"

const footerLinks = {
    product: [
        { label: "Features", href: "#features" },
        { label: "Lessons", href: "#lessons" },
        { label: "Pricing", href: "#pricing" }
    ],
    company: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" }
    ],
    resources: [
        { label: "Support", href: "/support" },
        { label: "FAQ", href: "/faq" },
        { label: "Community", href: "/community" }
    ],
    legal: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" }
    ]
}

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 px-6 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-5 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-orange-500 p-1.5 rounded-lg">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Chingón</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Master Spanish with confidence.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">
                        © 2025 Chingón. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-orange-400 transition-colors">
                            <Facebook className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="hover:text-orange-400 transition-colors">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="hover:text-orange-400 transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
