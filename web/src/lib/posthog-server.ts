import "server-only"

import { PostHog as PostHogServer } from "posthog-node"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com"

let serverClient: PostHogServer | null = null

/**
 * Lazily-constructed server-side PostHog client. Returns `null` outside of
 * production so dev/test runs don't ship events. Call `await client.shutdown()`
 * after critical events in short-lived server actions so the in-memory
 * batch actually flushes before the request ends.
 */
export function getPostHogServer(): PostHogServer | null {
  if (!POSTHOG_KEY) return null
  if (process.env.NODE_ENV !== "production") return null
  if (!serverClient) {
    serverClient = new PostHogServer(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return serverClient
}
