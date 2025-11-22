"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = (await headers()).get("origin")

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error("Google sign-in error:", error)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.message }
    }

    redirect("/")
}

export async function getCurrentUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

export async function signUpWithEmail(email: string, password: string) {
    const supabase = await createClient()
    const origin = (await headers()).get("origin")

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function signInWithEmail(email: string, password: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Record activity on login
    if (data.user) {
        await supabase.rpc('record_user_activity', { p_user_id: data.user.id })
    }

    redirect("/dashboard")
}
