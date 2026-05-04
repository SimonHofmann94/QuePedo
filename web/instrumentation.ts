/**
 * Next.js instrumentation hook — runs once at server boot for both Node.js
 * and Edge runtimes. Replaces the legacy `sentry.server.config.ts` /
 * `sentry.edge.config.ts` pair. See:
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const isProd = process.env.NODE_ENV === "production"

export async function register() {
  if (!SENTRY_DSN || !isProd) return

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
    })
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
    })
  }
}

// Captures errors thrown inside React Server Components / route handlers
// — Next.js 15+ requires this export for full server-side coverage.
export const onRequestError = Sentry.captureRequestError
