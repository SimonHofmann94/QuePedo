import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — Chingón",
  description: "Terms of Service for the Chingón Spanish learning app.",
}

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-stone-500 mb-10">
          Last updated: February 21, 2026
        </p>

        <div className="prose prose-stone max-w-none space-y-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stone-800 [&_h2]:mt-0 [&_p]:text-stone-600 [&_p]:leading-relaxed [&_li]:text-stone-600">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Chingón application (&quot;App&quot;), operated by
              Chingón (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms
              of Service. If you do not agree, please do not use the App.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Chingón is a Spanish language learning application that provides
              vocabulary management, AI-powered word generation, quizzes, grammar
              exercises, and cultural content. The App is available as a web
              application and mobile application for iOS and Android.
            </p>
          </section>

          <section>
            <h2>3. Accounts</h2>
            <p>
              To use certain features, you must create an account. You are
              responsible for maintaining the confidentiality of your login
              credentials and for all activity under your account. You must
              provide accurate information and promptly update it if it changes.
            </p>
          </section>

          <section>
            <h2>4. Subscriptions and Payments</h2>
            <p>
              Chingón offers both free and premium subscription tiers. Premium
              subscriptions are available as monthly, yearly, or lifetime plans.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Payments are processed through Apple App Store or Google Play
                Store, depending on your device.
              </li>
              <li>
                Subscriptions automatically renew unless cancelled at least 24
                hours before the end of the current billing period.
              </li>
              <li>
                You can manage or cancel your subscription through your App
                Store or Play Store account settings.
              </li>
              <li>
                Refunds are handled according to the policies of Apple or
                Google, as applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Free Tier Limitations</h2>
            <p>
              Free accounts are subject to usage limits, including a maximum
              number of vocabulary words, daily quiz attempts, and AI generation
              credits. These limits may change at our discretion.
            </p>
          </section>

          <section>
            <h2>6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Use the App for any unlawful purpose or in violation of any
                applicable laws.
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users&apos; accounts.
              </li>
              <li>
                Interfere with or disrupt the operation of the App.
              </li>
              <li>
                Reverse-engineer, decompile, or disassemble any part of the App.
              </li>
            </ul>
          </section>

          <section>
            <h2>7. AI-Generated Content</h2>
            <p>
              The App uses artificial intelligence to generate vocabulary and
              learning content. While we strive for accuracy, AI-generated
              content may contain errors. We do not guarantee the accuracy,
              completeness, or suitability of AI-generated content for any
              purpose.
            </p>
          </section>

          <section>
            <h2>8. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the App are owned by
              Chingón and are protected by copyright, trademark, and other
              intellectual property laws. Your user-generated content (such as
              vocabulary entries) remains yours.
            </p>
          </section>

          <section>
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              The App is provided &quot;as is&quot; and &quot;as available&quot; without warranties
              of any kind, express or implied. We do not warrant that the App
              will be uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Chingón shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the App.
            </p>
          </section>

          <section>
            <h2>11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of
              material changes by posting the updated Terms in the App. Your
              continued use of the App after changes constitutes acceptance of
              the revised Terms.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
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
