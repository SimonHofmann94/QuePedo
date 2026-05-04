import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — ¡Qué Pedo!",
  description: "Privacy Policy for the ¡Qué Pedo! Spanish learning app.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--surface-bg)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-ink-500 hover:text-chili-500 transition-colors"
        >
          &larr; Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-ink-800 mt-8 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-ink-500 mb-10">
          Last updated: May 4, 2026 · Effective date: May 4, 2026
        </p>

        <div className="prose prose-stone max-w-none space-y-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink-800 [&_h2]:mt-0 [&_p]:text-ink-600 [&_p]:leading-relaxed [&_li]:text-ink-600">
          <section>
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy describes how ¡Qué Pedo! (also marketed as
              &quot;Chingón&quot;, hereinafter &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses,
              shares, and protects personal information when you use the
              ¡Qué Pedo! web application at{" "}
              <a
                href="https://que-pedo.vercel.app"
                className="text-chili-500 hover:text-chili-600"
              >
                que-pedo.vercel.app
              </a>{" "}
              and the ¡Qué Pedo! mobile app for iOS and Android (collectively,
              the &quot;Service&quot;).
            </p>
            <p>
              By using the Service you acknowledge that you have read and
              understood this Privacy Policy. If you do not agree with our
              practices, please do not use the Service.
            </p>
            <p>
              <strong>Data controller:</strong> Simon Hofmann, located in
              Germany. Full contact and address information can be found in
              our{" "}
              <Link
                href="/impressum"
                className="text-chili-500 hover:text-chili-600"
              >
                Impressum
              </Link>
              . For privacy questions or to exercise your rights, contact{" "}
              <a
                href="mailto:privacy@chingon.app"
                className="text-chili-500 hover:text-chili-600"
              >
                privacy@chingon.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              2.1 Account information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address (required for authentication).</li>
              <li>Display name (optional, set during onboarding).</li>
              <li>
                Profile information such as native language, Spanish
                proficiency level, learning goals, and daily study minutes —
                all collected during onboarding to personalize your experience.
              </li>
              <li>
                If you sign in with Google: your Google profile email and
                public profile picture (we do not access your Gmail, Drive, or
                other Google services).
              </li>
            </ul>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              2.2 Learning data
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vocabulary entries you create or save.</li>
              <li>
                Quiz results, answers, and spaced-repetition progress
                (intervals, ease, repetition counts).
              </li>
              <li>Activity dates and streaks.</li>
              <li>
                Achievements you unlock, with timestamps.
              </li>
              <li>
                Prompts you submit to our AI vocabulary or grammar features and
                the resulting generated content.
              </li>
              <li>
                Speaking-exercise audio: when you use the speaking exercises,
                short audio snippets are processed for speech-to-text and
                discarded; we do not store the recordings.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              2.3 Subscription and payment data
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Subscription tier (free or premium) and entitlement status.
              </li>
              <li>
                A pseudonymous RevenueCat identifier linked to your account.
              </li>
              <li>
                <strong>We never see your full card number or bank details.</strong>{" "}
                Payments are processed by Stripe (web), Apple App Store (iOS),
                or Google Play Store (Android). We only receive subscription
                status events from these providers via RevenueCat.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              2.4 Technical and usage data
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                IP address, device type, operating system, and browser version.
              </li>
              <li>
                Pages visited, features used, errors encountered, approximate
                geolocation derived from IP.
              </li>
              <li>
                Anonymous product-analytics events (e.g. quiz_started,
                paywall_viewed) used to understand how the Service is used.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Legal Basis for Processing (GDPR)</h2>
            <p>
              If you are in the European Economic Area, the United Kingdom, or
              Switzerland, we process your personal data on the following legal
              bases:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Performance of contract</strong> (Art. 6(1)(b) GDPR) —
                creating and managing your account, processing subscriptions,
                providing the learning features.
              </li>
              <li>
                <strong>Legitimate interest</strong> (Art. 6(1)(f) GDPR) —
                product analytics, error monitoring, fraud prevention, and
                improving the Service. You can object at any time.
              </li>
              <li>
                <strong>Consent</strong> (Art. 6(1)(a) GDPR) — optional cookies
                or marketing communications, where applicable. You can withdraw
                consent at any time.
              </li>
              <li>
                <strong>Legal obligation</strong> (Art. 6(1)(c) GDPR) — tax
                records and complying with lawful requests.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain the Service.</li>
              <li>
                Personalize lessons, exercises, and content based on your
                proficiency level and goals.
              </li>
              <li>
                Track your progress, streaks, and achievements; power the
                spaced-repetition algorithm.
              </li>
              <li>
                Generate AI vocabulary and grammar exercises in response to
                your prompts.
              </li>
              <li>
                Manage subscriptions, entitlements, and free-tier limits.
              </li>
              <li>
                Detect, prevent, and respond to security incidents, abuse, and
                violations of our Terms of Service.
              </li>
              <li>
                Communicate with you about your account, security, and
                significant Service changes.
              </li>
              <li>
                Analyze usage patterns to improve the Service (aggregated and
                pseudonymous where possible).
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Third-Party Services (Sub-Processors)</h2>
            <p>
              We rely on the following third-party providers to operate the
              Service. Each provider is bound by their own privacy policy and
              acts as a data processor on our behalf:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Supabase Inc.</strong> (USA, with EU data residency
                where applicable) — authentication, database, and backend
                infrastructure.
              </li>
              <li>
                <strong>Vercel Inc.</strong> (USA) — web hosting and edge
                delivery.
              </li>
              <li>
                <strong>Google LLC — Gemini API</strong> (USA) — AI vocabulary
                and grammar generation. Prompts you submit are sent to Google
                for processing. Google&apos;s API terms apply to that processing.
              </li>
              <li>
                <strong>RevenueCat Inc.</strong> (USA) — subscription state
                management across web, iOS, and Android.
              </li>
              <li>
                <strong>Stripe Inc.</strong> (USA, with EU entity) — payment
                processing for web purchases.
              </li>
              <li>
                <strong>Apple Inc.</strong> — payment processing for iOS
                purchases.
              </li>
              <li>
                <strong>Google LLC — Play Store</strong> — payment processing
                for Android purchases.
              </li>
              <li>
                <strong>Sentry (Functional Software, Inc.)</strong> (USA, with
                EU region available) — crash and error monitoring.
              </li>
              <li>
                <strong>PostHog Inc.</strong> (data hosted in the EU) — product
                analytics. Configured with EU data residency.
              </li>
            </ul>
            <p>
              Where any provider is located outside the European Economic Area,
              we rely on the EU Standard Contractual Clauses or other approved
              transfer mechanisms to safeguard your data.
            </p>
          </section>

          <section>
            <h2>6. Cookies and Local Storage</h2>
            <p>
              We use a small number of strictly necessary cookies and local
              storage entries to keep you signed in (Supabase auth tokens),
              remember your preferences, and run the spaced-repetition state.
              We use pseudonymous analytics cookies (PostHog) to understand
              usage; these are anonymized and respect Do-Not-Track signals.
            </p>
            <p>
              We do not use advertising cookies or share your data with
              advertising networks.
            </p>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Account and learning data: retained for as long as your account
                is active.
              </li>
              <li>
                If you delete your account, we delete or anonymize your
                personal data within 30 days, except where we are legally
                required to retain certain records (e.g. tax records for
                Stripe payments — typically 10 years under German law).
              </li>
              <li>
                Crash and error logs: retained for up to 90 days.
              </li>
              <li>
                Analytics events: aggregated and retained for up to 24 months.
              </li>
            </ul>
          </section>

          <section>
            <h2>8. Your Privacy Rights</h2>
            <p>
              Subject to applicable law (notably GDPR and CCPA), you have the
              right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access</strong> the personal data we hold about you.
              </li>
              <li>
                <strong>Rectify</strong> inaccurate or incomplete data.
              </li>
              <li>
                <strong>Erase</strong> your data (&quot;right to be forgotten&quot;).
              </li>
              <li>
                <strong>Restrict</strong> or <strong>object</strong> to certain
                processing.
              </li>
              <li>
                <strong>Receive</strong> your data in a portable, machine-readable
                format.
              </li>
              <li>
                <strong>Withdraw consent</strong> at any time, where processing
                is based on consent.
              </li>
              <li>
                <strong>Lodge a complaint</strong> with your local data
                protection authority. In Germany, that is the Federal
                Commissioner for Data Protection and Freedom of Information
                (BfDI).
              </li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a
                href="mailto:privacy@chingon.app"
                className="text-chili-500 hover:text-chili-600"
              >
                privacy@chingon.app
              </a>{" "}
              from the address linked to your account. We will respond within
              30 days.
            </p>
          </section>

          <section>
            <h2>9. Data Security</h2>
            <p>
              We use industry-standard measures to protect your data, including
              TLS/HTTPS encryption in transit, encrypted storage at rest, and
              row-level security policies that prevent users from accessing
              other users&apos; data. No system is 100% secure; if we detect a
              breach affecting your data, we will notify you and the relevant
              authorities as required by law.
            </p>
          </section>

          <section>
            <h2>10. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed at children under 13 (or 16 in the
              EU, where applicable). We do not knowingly collect personal data
              from children under that age. If you believe a child has provided
              us with data, please contact{" "}
              <a
                href="mailto:privacy@chingon.app"
                className="text-chili-500 hover:text-chili-600"
              >
                privacy@chingon.app
              </a>{" "}
              and we will promptly delete it.
            </p>
          </section>

          <section>
            <h2>11. International Data Transfers</h2>
            <p>
              Some of our service providers are located in the United States.
              Where personal data is transferred outside the European Economic
              Area, we rely on the EU Standard Contractual Clauses approved by
              the European Commission, supplementary safeguards, and
              adequacy decisions where applicable.
            </p>
          </section>

          <section>
            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by email and by posting the
              updated policy in the Service with a new &quot;Last updated&quot; date.
              Your continued use of the Service after the effective date
              constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2>13. Contact</h2>
            <p>
              For privacy questions, requests, or complaints, contact:
            </p>
            <p>
              <strong>¡Qué Pedo! / Chingón</strong>
              <br />
              Simon Hofmann
              <br />
              Email:{" "}
              <a
                href="mailto:privacy@chingon.app"
                className="text-chili-500 hover:text-chili-600"
              >
                privacy@chingon.app
              </a>
              <br />
              General support:{" "}
              <a
                href="mailto:support@chingon.app"
                className="text-chili-500 hover:text-chili-600"
              >
                support@chingon.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
