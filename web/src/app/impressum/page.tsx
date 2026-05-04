import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum — ¡Qué Pedo!",
  description:
    "Impressum gemäß § 5 TMG für die ¡Qué Pedo! Spanisch-Lern-App.",
  robots: { index: true, follow: true },
}

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-[var(--surface-bg)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-ink-500 hover:text-chili-500 transition-colors"
        >
          &larr; Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-ink-800 mt-8 mb-2">Impressum</h1>
        <p className="text-sm text-ink-500 mb-10">
          Angaben gemäß § 5 TMG (Telemediengesetz)
        </p>

        <div className="prose prose-stone max-w-none space-y-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink-800 [&_h2]:mt-0 [&_p]:text-ink-600 [&_p]:leading-relaxed [&_li]:text-ink-600">
          <section>
            <h2>Diensteanbieter</h2>
            <p>
              <strong>Simon Hofmann</strong>
              <br />
              {/* TODO: Vollständige Postanschrift eintragen — gesetzlich Pflicht */}
              [Straße und Hausnummer]
              <br />
              [PLZ Ort]
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2>Kontakt</h2>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:support@chingon.app"
                className="text-chili-500 hover:text-chili-600"
              >
                support@chingon.app
              </a>
              <br />
              Datenschutz:{" "}
              <a
                href="mailto:privacy@chingon.app"
                className="text-chili-500 hover:text-chili-600"
              >
                privacy@chingon.app
              </a>
              <br />
              {/* Telefon ist nicht zwingend erforderlich, aber für die "schnelle elektronische Kommunikation"
                  empfohlen. Wenn du keine Nummer veröffentlichen willst, reicht E-Mail. */}
              {/* Telefon: [optional] */}
            </p>
          </section>

          <section>
            <h2>Umsatzsteuer-ID</h2>
            <p>
              {/*
                Falls du eine USt-IdNr. nach § 27 a UStG hast, hier eintragen.
                Falls du als Kleinunternehmer nach § 19 UStG agierst, ist
                keine USt-ID erforderlich — dann kannst du diesen Block
                weglassen oder durch den Kleinunternehmer-Hinweis ersetzen:
                "Hinweis: Als Kleinunternehmer im Sinne von § 19 Abs. 1
                UStG wird keine Umsatzsteuer berechnet."
              */}
              [USt-IdNr. eintragen — z. B. &bdquo;DE123456789&ldquo; — oder Block entfernen,
              falls Kleinunternehmer]
            </p>
          </section>

          <section>
            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              Simon Hofmann
              <br />
              {/* Anschrift identisch mit Diensteanbieter */}
              [Straße und Hausnummer]
              <br />
              [PLZ Ort]
            </p>
          </section>

          <section>
            <h2>EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-chili-500 hover:text-chili-600"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              .
              <br />
              Unsere E-Mail-Adresse findest du oben im Impressum.
            </p>
          </section>

          <section>
            <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
              möglich. Bei Bekanntwerden von entsprechenden
              Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2>Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar.
            </p>
            <p>
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
              jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
              derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechts bedürfen
              der schriftlichen Zustimmung des jeweiligen Autors bzw.
              Erstellers. Downloads und Kopien dieser Seite sind nur für den
              privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p>
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber
              erstellt wurden, werden die Urheberrechte Dritter beachtet.
              Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
              Solltest du trotzdem auf eine Urheberrechtsverletzung
              aufmerksam werden, bitten wir um einen entsprechenden Hinweis.
              Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
              Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2>Marken und Drittinhalte</h2>
            <p>
              &bdquo;Stripe&ldquo;, &bdquo;Apple&ldquo;, &bdquo;App Store&ldquo;,
              &bdquo;Google&ldquo;, &bdquo;Google Play&ldquo;,
              &bdquo;Supabase&ldquo;, &bdquo;RevenueCat&ldquo;,
              &bdquo;PostHog&ldquo;, &bdquo;Sentry&ldquo; und &bdquo;Vercel&ldquo;
              sind Marken ihrer jeweiligen Inhaber. Die Verwendung erfolgt
              ausschließlich zu Informationszwecken und stellt keine
              Verbindung oder Empfehlung dar.
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-ink-400">
          Stand:{" "}
          <time dateTime="2026-05-04">4. Mai 2026</time>
        </p>
      </div>
    </main>
  )
}
