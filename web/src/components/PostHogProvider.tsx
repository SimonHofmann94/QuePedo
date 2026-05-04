"use client"

import { useEffect } from "react"
import posthog from "posthog-js"
import { PostHogProvider as Provider } from "posthog-js/react"
import { createClient } from "@/utils/supabase/client"
import { initPostHog } from "@/lib/posthog"

/**
 * Initializes PostHog once on mount and identifies the current Supabase user
 * whenever the auth state changes. Mount inside `(main)/layout.tsx` so it
 * loads only after the user is past the marketing pages.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()

    const supabase = createClient()
    let mounted = true

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted || !user) return
      posthog.identify(user.id, {
        email: user.email,
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === "SIGNED_OUT") {
        posthog.reset()
      } else if (session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email,
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return <Provider client={posthog}>{children}</Provider>
}
