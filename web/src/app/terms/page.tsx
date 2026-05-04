import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — ¡Qué Pedo!",
  description: "Terms of Service for the ¡Qué Pedo! Spanish learning app.",
}

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-ink-500 mb-10">
          Last updated: May 4, 2026 · Effective date: May 4, 2026
        </p>

        <div className="prose prose-stone max-w-none space-y-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink-800 [&_h2]:mt-0 [&_p]:text-ink-600 [&_p]:leading-relaxed [&_li]:text-ink-600">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) form a binding agreement
              between you and ¡Qué Pedo! (also marketed as &quot;Chingón&quot;,
              hereinafter &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) governing your access to
              and use of the ¡Qué Pedo! web application at{" "}
              <a
                href="https://que-pedo.vercel.app"
                className="text-chili-500 hover:text-chili-600"
              >
                que-pedo.vercel.app
              </a>{" "}
              and the ¡Qué Pedo! mobile applications for iOS and Android
              (collectively, the &quot;Service&quot;).
            </p>
            <p>
              By creating an account or using the Service, you confirm that you
              have read, understood, and agreed to these Terms and to our{" "}
              <Link
                href="/privacy"
                className="text-chili-500 hover:text-chili-600"
              >
                Privacy Policy
              </Link>
              . If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2>2. Eligibility and Age Requirements</h2>
            <p>
              You must be at least 13 years old (16 in the European Economic
              Area) to create an account. By registering, you confirm that you
              meet the minimum age requirement in your jurisdiction. Users
              under 18 should review these Terms with a parent or legal
              guardian.
            </p>
          </section>

          <section>
            <h2>3. Description of Service</h2>
            <p>
              The Service is a Spanish-language learning platform that
              provides:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal vocabulary management.</li>
              <li>AI-generated vocabulary and grammar exercises.</li>
              <li>
                Quizzes, spaced-repetition reviews, and progress tracking.
              </li>
              <li>Curated grammar lessons across CEFR levels A1 to C2.</li>
              <li>Speaking exercises with speech-to-text feedback.</li>
              <li>Cultural content and lessons.</li>
              <li>Achievements and streak tracking.</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part
              of the Service at any time, with or without notice.
            </p>
          </section>

          <section>
            <h2>4. Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                To use most features you must create an account using an email
                address or supported single sign-on provider (e.g. Google).
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                login credentials and for all activity under your account.
              </li>
              <li>
                You must provide accurate information and promptly update it if
                it changes.
              </li>
              <li>
                You may not share your account, sell access, or transfer your
                account to another person.
              </li>
              <li>
                You may delete your account at any time from your profile
                page or by contacting{" "}
                <a
                  href="mailto:support@chingon.app"
                  className="text-chili-500 hover:text-chili-600"
                >
                  support@chingon.app
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Subscriptions and Payments</h2>
            <p>
              The Service offers a free tier and a paid &quot;Premium&quot;
              subscription, available as monthly or annual plans. Pricing,
              currency, and applicable taxes are displayed at checkout.
            </p>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              5.1 Payment processors
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Web purchases</strong> are processed by Stripe via
                RevenueCat.
              </li>
              <li>
                <strong>iOS purchases</strong> are processed by Apple via the
                App Store.
              </li>
              <li>
                <strong>Android purchases</strong> are processed by Google via
                the Play Store.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              5.2 Auto-renewal
            </h3>
            <p>
              Subscriptions automatically renew at the end of each billing
              period at the then-current price unless cancelled at least 24
              hours before the renewal date. You authorize the relevant
              payment processor to charge the payment method on file at each
              renewal.
            </p>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              5.3 Cancellation and refunds
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You can cancel at any time:
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>
                    <strong>Web</strong>: from your profile page, which opens
                    the Stripe customer portal.
                  </li>
                  <li>
                    <strong>iOS</strong>: through your App Store subscription
                    settings.
                  </li>
                  <li>
                    <strong>Android</strong>: through your Play Store
                    subscription settings.
                  </li>
                </ul>
              </li>
              <li>
                After cancellation, you keep premium access until the end of
                the current billing period.
              </li>
              <li>
                <strong>Statutory right of withdrawal (EU consumers):</strong>{" "}
                If you reside in the EEA, you have a 14-day right of withdrawal
                from the contract under Directive 2011/83/EU. By starting to
                use the premium content immediately, you expressly consent to
                begin performance and acknowledge that you lose the right of
                withdrawal once digital content has been delivered.
              </li>
              <li>
                Refunds for App Store and Play Store purchases are handled by
                Apple and Google respectively, according to their policies.
              </li>
              <li>
                For web (Stripe) purchases, refund requests can be submitted to{" "}
                <a
                  href="mailto:support@chingon.app"
                  className="text-chili-500 hover:text-chili-600"
                >
                  support@chingon.app
                </a>{" "}
                and are reviewed case-by-case.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-stone-700 mt-4">
              5.4 Price changes
            </h3>
            <p>
              We may change subscription prices. Any change applies only to
              future billing periods and we will notify you in advance. If you
              do not agree to a price change, you may cancel before the next
              renewal.
            </p>
          </section>

          <section>
            <h2>6. Free Tier</h2>
            <p>
              Free accounts have limited access:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vocabulary entries are capped at 50.</li>
              <li>
                Up to 3 vocabulary quizzes per day; AI generation limited.
              </li>
              <li>
                Grammar levels A1 and A2 are free; B1 to C2 require Premium.
              </li>
              <li>
                Cultural content, speaking exercises, listening exercises, and
                games require Premium.
              </li>
            </ul>
            <p>
              We may change free-tier limits at any time. We will give existing
              users reasonable notice of significant reductions.
            </p>
          </section>

          <section>
            <h2>7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Use the Service for any unlawful purpose or in violation of
                any applicable law.
              </li>
              <li>
                Attempt to gain unauthorized access to our systems, accounts,
                or data of other users.
              </li>
              <li>
                Probe, scan, or test the vulnerability of the Service except
                under a written security-research agreement with us.
              </li>
              <li>
                Interfere with or disrupt the operation of the Service,
                including via denial-of-service attacks, scraping, or
                excessive automated requests.
              </li>
              <li>
                Reverse-engineer, decompile, disassemble, or attempt to derive
                the source code of any part of the Service, except as
                permitted by mandatory law.
              </li>
              <li>
                Use the AI generation features to produce content that is
                unlawful, harmful, deceptive, harassing, hateful, or sexually
                explicit, or to attempt to bypass any safety filters.
              </li>
              <li>
                Resell, sublicense, or commercially exploit the Service or its
                content without our written permission.
              </li>
              <li>
                Submit false or misleading information, including impersonating
                another person or entity.
              </li>
            </ul>
            <p>
              We may suspend or terminate accounts that violate these rules,
              with or without notice.
            </p>
          </section>

          <section>
            <h2>8. AI-Generated Content</h2>
            <p>
              Some features use Google&apos;s Gemini API to generate vocabulary,
              translations, grammar exercises, and feedback. While we strive
              for accuracy, AI output may contain errors, omissions, or
              culturally inappropriate phrasing. We do not warrant the
              accuracy, completeness, or suitability of AI-generated content
              for any purpose, and you should not rely on it for legal,
              medical, financial, or safety-critical decisions.
            </p>
          </section>

          <section>
            <h2>9. User Content</h2>
            <p>
              You retain ownership of vocabulary entries, prompts, and other
              content you submit (&quot;User Content&quot;). By submitting User
              Content, you grant us a worldwide, non-exclusive, royalty-free
              license to host, store, display, and process it solely to provide
              and improve the Service. You are responsible for ensuring you
              have the right to submit your User Content.
            </p>
          </section>

          <section>
            <h2>10. Intellectual Property</h2>
            <p>
              The Service, including its design, code, branding (such as the
              ¡Qué Pedo! and Chingón names), curated content (vocabulary
              lists, grammar lessons, cultural content), and any other
              materials we provide, is owned by us or our licensors and is
              protected by copyright, trademark, and other intellectual
              property laws. We grant you a limited, revocable,
              non-transferable license to use the Service for your personal,
              non-commercial learning use.
            </p>
          </section>

          <section>
            <h2>11. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, express or implied, including warranties
              of merchantability, fitness for a particular purpose, and
              non-infringement. We do not warrant that the Service will be
              uninterrupted, error-free, secure, or that any defects will be
              corrected. Some jurisdictions do not allow the exclusion of
              implied warranties; in those jurisdictions our liability is
              limited to the maximum extent permitted by law.
            </p>
          </section>

          <section>
            <h2>12. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable
              for any indirect, incidental, special, consequential, exemplary,
              or punitive damages, including loss of data, profits, or
              goodwill, arising out of or in connection with your use of the
              Service. Our total cumulative liability for any claim arising
              under these Terms is limited to the greater of (a) the amount
              you paid us in the 12 months preceding the claim, or (b) EUR 50.
            </p>
            <p>
              Nothing in these Terms excludes or limits liability that cannot
              be excluded or limited under applicable law (such as liability
              for gross negligence, intentional misconduct, or personal
              injury caused by negligence under German law).
            </p>
          </section>

          <section>
            <h2>13. Termination</h2>
            <p>
              You may stop using the Service and delete your account at any
              time. We may suspend or terminate your access if you breach
              these Terms, if continued provision is unlawful, or if we
              discontinue the Service. Upon termination, your right to use
              the Service ceases immediately. Sections that by their nature
              should survive termination (intellectual property, disclaimers,
              limitation of liability, indemnification, governing law) will
              survive.
            </p>
          </section>

          <section>
            <h2>14. Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from any claims,
              losses, liabilities, and expenses (including reasonable
              attorneys&apos; fees) arising from (a) your breach of these Terms,
              (b) your violation of any law or third-party right, or (c) your
              User Content.
            </p>
          </section>

          <section>
            <h2>15. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you
              of material changes by email and by posting the updated Terms
              in the Service with a new &quot;Last updated&quot; date. If you do not
              agree to the changes, you must stop using the Service before
              they take effect; continued use after the effective date
              constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>16. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of
              Germany, excluding its conflict-of-laws rules. The UN Convention
              on Contracts for the International Sale of Goods does not apply.
            </p>
            <p>
              For consumers residing in the EEA, mandatory consumer-protection
              laws of your country of residence still apply. The European
              Commission provides an Online Dispute Resolution platform at{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                className="text-chili-500 hover:text-chili-600"
              >
                ec.europa.eu/consumers/odr
              </a>
              . We are not obliged and not willing to participate in
              alternative dispute-resolution proceedings before a consumer
              arbitration board.
            </p>
            <p>
              Place of jurisdiction for disputes with merchants and legal
              entities is the courts competent at our registered office in
              Germany.
            </p>
          </section>

          <section>
            <h2>17. Contact</h2>
            <p>
              For questions about these Terms, contact:
            </p>
            <p>
              <strong>¡Qué Pedo! / Chingón</strong>
              <br />
              Simon Hofmann
              <br />
              Email:{" "}
              <a
                href="mailto:support@chingon.app"
                className="text-chili-500 hover:text-chili-600"
              >
                support@chingon.app
              </a>
              <br />
              Full address and legal information:{" "}
              <Link
                href="/impressum"
                className="text-chili-500 hover:text-chili-600"
              >
                Impressum
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
