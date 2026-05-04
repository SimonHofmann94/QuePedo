/**
 * Browser-side PostHog client.
 *
 * Server code MUST NOT import from this file — `posthog-js` is bundled for
 * the client only. For server actions / route handlers use
 * `@/lib/posthog-server`.
 */
import posthog from "posthog-js"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com"

let initialized = false

/**
 * Initialize the browser PostHog client exactly once. Safe to call from any
 * "use client" boundary — module-level guards prevent double-init. Returns
 * `null` when no key is configured (local dev) so callers can defensively
 * skip captures.
 */
export function initPostHog(): typeof posthog | null {
  if (typeof window === "undefined") return null
  if (!POSTHOG_KEY) return null
  if (initialized) return posthog

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: "history_change",
    capture_pageleave: true,
    person_profiles: "identified_only",
    autocapture: false,
    disable_session_recording: true,
    loaded: (ph) => {
      if (process.env.NODE_ENV !== "production") ph.opt_out_capturing()
    },
  })
  initialized = true
  return posthog
}
