import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--surface-bg)] md:flex-row">
            <Sidebar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <BottomNav />
        </div>
    )
}
