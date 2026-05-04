import PostHog from 'posthog-react-native'

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com'

/**
 * Singleton PostHog client. Returns null when no key is configured (local
 * dev) so callers can defensively guard against capture / identify calls.
 *
 * One instance is shared across `_layout.tsx` (provider mount) and
 * `AuthContext.tsx` (identify on sign-in) — never construct a second one.
 */
export const posthog = POSTHOG_KEY
  ? new PostHog(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      // Safe defaults for the free tier.
      flushAt: 20,
      flushInterval: 30_000,
      enableSessionReplay: false,
      captureAppLifecycleEvents: true,
      disabled: __DEV__,
    })
  : null
