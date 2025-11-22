"use client"

import { ProfileCard } from "@/components/features/profile/ProfileCard"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="p-6 h-full flex flex-col items-center justify-center gap-8">
            <div className="w-full max-w-lg flex justify-between items-center">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Button
                    variant="destructive"
                    size="sm"
                    className="md:hidden flex items-center gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </Button>
            </div>

            <ProfileCard />

            <Button
                variant="ghost"
                className="text-muted-foreground hover:text-destructive md:hidden"
                onClick={handleLogout}
            >
                Sign out
            </Button>
        </div>
    )
}
