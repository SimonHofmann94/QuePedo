import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@chingon/shared"],
  // Culture photos come from Wikimedia Commons. `pathname` is scoped to
  // /wikipedia/commons/** on purpose: the /wikipedia/en/** tree holds non-free
  // fair-use files, and keeping it unservable enforces the license rule at the
  // CDN layer, not just in the content check.
  images: {
    // Wikimedia rate-limits (429) when many images are optimized at once — a cold
    // cache loading 21 country heroes is exactly that shape. A long TTL means each
    // (image, size) is pulled from Commons at most once a month instead of on every
    // cache eviction. If cold-start 429s still surface in production, the fix is to
    // mirror the files into Supabase Storage rather than hotlinking Commons.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
    ],
  },
  // The four grammar-decision drills moved from /games to /exercises. Old
  // links (bookmarks, anything shared) keep working.
  async redirects() {
    return ["el-o-la", "ser-o-estar", "pasado", "subjuntivo"].map((slug) => ({
      source: `/games/${slug}`,
      destination: `/exercises/${slug}`,
      permanent: true,
    }));
  },

  // Defense-in-depth headers. CSP is intentionally omitted for now — a strict
  // policy would need to allowlist PostHog, Supabase, RevenueCat, Sentry, Google
  // OAuth and amCharts; add it as Content-Security-Policy-Report-Only first.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=()" },
        ],
      },
    ];
  },
};

// Wrap the Next config so Sentry can upload source maps and inject the
// Sentry SDK at build time. `SENTRY_AUTH_TOKEN` only needs to be set in CI
// / Vercel — local builds skip the upload step gracefully.
export default withSentryConfig(withNextIntl(nextConfig), {
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
