import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import { PostHogProvider } from "@/components/PostHogProvider"
import { SubscriptionProvider } from "@/contexts/SubscriptionProvider"
import { getUserAccess } from "@/lib/premium"

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Seed the client SubscriptionProvider with the DB-side premium flag so
    // the UI doesn't flash "free" on first paint while RC initialises.
    const { isPremium: initialIsPremium, isAdmin } = await getUserAccess()

    return (
        <PostHogProvider>
            <SubscriptionProvider initialIsPremium={initialIsPremium}>
                <div className="flex min-h-screen flex-col bg-[var(--surface-bg)] md:flex-row">
                    <Sidebar isAdmin={isAdmin} />
                    <main className="flex-1 pb-20 md:pb-0">{children}</main>
                    <BottomNav />
                </div>
            </SubscriptionProvider>
        </PostHogProvider>
    )
}
