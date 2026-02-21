import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Chingón",
  description: "Privacy Policy for the Chingón Spanish learning app.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-stone-500 hover:text-orange-500 transition-colors"
        >
          &larr; Back to home
        </Link>

        <h1 className="text-3xl font-bold text-stone-800 mt-8 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-stone-500 mb-10">
          Last updated: February 21, 2026
        </p>

        <div className="prose prose-stone max-w-none space-y-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stone-800 [&_h2]:mt-0 [&_p]:text-stone-600 [&_p]:leading-relaxed [&_li]:text-stone-600">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Chingón (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Chingón application
              (&quot;App&quot;). This Privacy Policy explains how we collect, use, and
              protect your personal information when you use our App.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We collect the following types of information:</p>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              Account Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address</li>
              <li>Name (if provided)</li>
              <li>Profile information (language preferences, proficiency level, learning goals)</li>
            </ul>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              Usage Data
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vocabulary entries you create</li>
              <li>Quiz results and learning progress</li>
              <li>Activity dates and streak information</li>
              <li>AI generation prompts and results</li>
            </ul>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              Subscription Data
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscription status (free or premium)</li>
              <li>
                Purchase history is managed by Apple App Store or Google Play
                Store — we do not store payment details
              </li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve the App&apos;s features and functionality.</li>
              <li>Personalize your learning experience based on your preferences.</li>
              <li>Track your progress, streaks, and quiz performance.</li>
              <li>Generate AI-powered vocabulary tailored to your requests.</li>
              <li>Manage your subscription and enforce tier-based limits.</li>
              <li>Communicate with you about your account or service updates.</li>
            </ul>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Supabase</strong> — Authentication, database, and
                backend infrastructure. Your data is stored securely in
                Supabase&apos;s cloud infrastructure.
              </li>
              <li>
                <strong>Google Gemini API</strong> — AI vocabulary generation.
                Your prompts are sent to Google&apos;s API to generate learning
                content. Google&apos;s privacy policy applies to this data processing.
              </li>
              <li>
                <strong>RevenueCat</strong> — Subscription management. RevenueCat
                processes your subscription status and anonymous purchase data.
              </li>
              <li>
                <strong>Apple App Store / Google Play Store</strong> — Payment
                processing. We do not have access to your payment details.
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Data Storage and Security</h2>
            <p>
              Your data is stored in secure cloud infrastructure provided by
              Supabase. We implement row-level security policies to ensure that
              your data is only accessible to you. We use industry-standard
              encryption for data in transit and at rest.
            </p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you
              delete your account, we will delete your personal data within 30
              days, except where we are required by law to retain it.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Export your data in a portable format.</li>
              <li>Withdraw consent for data processing.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at the email address
              below.
            </p>
          </section>

          <section>
            <h2>8. Children&apos;s Privacy</h2>
            <p>
              The App is not directed at children under 13 years of age. We do
              not knowingly collect personal information from children under 13.
              If you believe we have collected such information, please contact
              us and we will promptly delete it.
            </p>
          </section>

          <section>
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by posting the updated policy in
              the App. Your continued use of the App after changes constitutes
              acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <a
                href="mailto:support@chingon.app"
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                support@chingon.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
