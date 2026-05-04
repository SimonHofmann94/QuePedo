import { AnalyticsEvent, type AnalyticsEventName, type AnalyticsProps } from '../constants/analytics'

/**
 * Minimal contract every platform's analytics client must implement.
 * Lets shared code stay platform-free (no `posthog-js` or
 * `posthog-react-native` deps in @chingon/shared).
 */
export interface AnalyticsClient {
  capture(event: string, properties?: AnalyticsProps): void
  identify?(distinctId: string, properties?: AnalyticsProps): void
  reset?(): void
}

/**
 * Build a typed `track()` helper bound to a platform-specific client.
 *
 * Usage:
 *   const track = createTracker(posthog)
 *   track(AnalyticsEvent.QUIZ_STARTED, { word_count: 10 })
 */
export function createTracker(client: AnalyticsClient | null | undefined) {
  return function track(event: AnalyticsEventName, properties?: AnalyticsProps): void {
    if (!client) return
    try {
      client.capture(event, properties)
    } catch {
      // Never let analytics throw into product code.
    }
  }
}

export { AnalyticsEvent }
export type { AnalyticsEventName, AnalyticsProps }
