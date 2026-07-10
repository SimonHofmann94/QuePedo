import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    // Only allow same-origin relative paths — reject absolute ("https://evil.com")
    // and protocol-relative ("//evil.com") URLs to prevent open redirects.
    const rawNext = searchParams.get("next") ?? "/dashboard"
    const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard"

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Check if user has completed onboarding
            const { data: profile } = await supabase
                .from("user_profiles")
                .select("onboarding_completed")
                .eq("id", data.user.id)
                .single()

            if (!profile || !profile.onboarding_completed) {
                return NextResponse.redirect(new URL("/onboarding", request.url))
            }

            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // Return the user to an error page with some instructions
    return NextResponse.redirect(new URL("/auth/error", request.url))
}
