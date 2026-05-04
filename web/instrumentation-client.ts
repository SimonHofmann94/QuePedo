/**
 * Sentry browser SDK initialization.
 *
 * Replaces the legacy `sentry.client.config.ts` file. Loaded automatically
 * by Next.js for client-side bundles. See:
 * https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */
import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const isProd = process.env.NODE_ENV === "production"

if (SENTRY_DSN && isProd) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Send the smallest possible payload — free tier targets <1K errors/day.
    sendDefaultPii: false,
  })
}

// Required for App Router navigation tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
