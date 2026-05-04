import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  transpilePackages: ["@chingon/shared"],
};

// Wrap the Next config so Sentry can upload source maps and inject the
// Sentry SDK at build time. `SENTRY_AUTH_TOKEN` only needs to be set in CI
// / Vercel — local builds skip the upload step gracefully.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Skip source-map upload entirely when no auth token is set so local
  // builds don't fail. CI / Vercel sets SENTRY_AUTH_TOKEN to enable upload.
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
    deleteSourcemapsAfterUpload: true,
  },
  // Don't break the build if Sentry is unreachable (free tier safety net).
  errorHandler: (err) => {
    console.warn("[sentry] build plugin warning:", err.message)
  },
  telemetry: false,
});
