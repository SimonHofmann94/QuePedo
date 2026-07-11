"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Package } from "@revenuecat/purchases-js"
import { PackageType } from "@revenuecat/purchases-js"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sunburst, TalaveraTile } from "@/components/ui/motifs"
import { useSubscription } from "@/contexts/SubscriptionProvider"
import { initPostHog } from "@/lib/posthog"
import { AnalyticsEvent, createTracker, PREMIUM_FEATURES } from "@chingon/shared"

const FEATURE_COPY: Record<(typeof PREMIUM_FEATURES)[number], string> = {
  grammar: "Gramática completa (A1 → C2)",
  culture: "Cultura mexicana y mapas",
  writing_exercise: "Ejercicios de escritura con AI",
  speaking_exercise: "Práctica de habla con feedback",
  listening_exercise: "Ejercicios de escucha",
  ai_generation: "Vocabulario generado con AI",
  unlimited_vocabulary: "Vocabulario ilimitado",
  unlimited_quizzes: "Quizzes ilimitados al día",
}

const trackPricing = createTracker(initPostHog())

export default function PricingPage() {
  const router = useRouter()
  const { isPremium, isLoading, currentOffering, presentPaywall } =
    useSubscription()
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    trackPricing(AnalyticsEvent.PAYWALL_VIEWED, { source: "pricing_page" })
  }, [])

  const packages = useMemo(() => {
    if (!currentOffering) return [] as Package[]
    // Order: Annual first (best value), then Monthly, then everything else.
    return [...currentOffering.availablePackages].sort((a, b) => {
      const order = (p: Package) =>
        p.packageType === PackageType.Annual
          ? 0
          : p.packageType === PackageType.Monthly
          ? 1
          : 2
      return order(a) - order(b)
    })
  }, [currentOffering])

  async function handlePurchase(pkg: Package) {
    setError(null)
    setPurchasingId(pkg.identifier)
    const planType =
      pkg.packageType === PackageType.Annual
        ? "annual"
        : pkg.packageType === PackageType.Monthly
          ? "monthly"
          : String(pkg.packageType).toLowerCase()
    trackPricing(AnalyticsEvent.PAYWALL_PURCHASE_STARTED, {
      source: "pricing_page",
      plan: planType,
      package_id: pkg.identifier,
      price: pkg.webBillingProduct.currentPrice.formattedPrice,
    })
    try {
      const success = await presentPaywall(pkg)
      if (success) {
        trackPricing(AnalyticsEvent.PAYWALL_PURCHASE_COMPLETED, {
          source: "pricing_page",
          plan: planType,
          package_id: pkg.identifier,
          price: pkg.webBillingProduct.currentPrice.formattedPrice,
        })
        router.push("/dashboard")
      } else {
        trackPricing(AnalyticsEvent.PAYWALL_DISMISSED, {
          source: "pricing_page",
          plan: planType,
          reason: "cancelled",
        })
      }
    } catch (err) {
      console.error(err)
      setError("¡Ay, no! Algo salió mal con la compra. Intenta de nuevo.")
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-[24px] p-8 text-white md:p-10"
          style={{
            background:
              "linear-gradient(135deg, var(--chili-500), var(--rosa-500))",
          }}
        >
          <div className="pointer-events-none absolute -right-12 -top-12 opacity-20">
            <TalaveraTile size={260} />
          </div>
          <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-15">
            <Sunburst size={200} color="var(--maiz-200)" />
          </div>
          <div className="relative">
            <Badge color="maiz" variant="solid" size="md">
              Hazte Premium
            </Badge>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Desbloquea todo
            </h1>
            <p className="mt-3 max-w-xl font-body text-base text-white/90 md:text-lg">
              Gramática, cultura, ejercicios de habla y vocabulario sin límites.
              Aprende como un chingón.
            </p>
          </div>
        </div>

        {/* Already premium */}
        {isPremium && (
          <div className="rounded-[20px] border-[3px] border-jade-500 bg-white p-6 shadow-[0_4px_0_0_var(--jade-500)]">
            <div className="font-display text-2xl font-extrabold text-ink-800">
              ¡Órale! Ya eres Premium
            </div>
            <p className="mt-2 text-sm text-ink-500">
              Tienes acceso a todo. Si quieres gestionar tu suscripción, ve a tu
              perfil.
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.push("/profile")}>
                Ir al perfil
              </Button>
            </div>
          </div>
        )}

        {/* Plans */}
        {!isPremium && (
          <>
            {isLoading && (
              <div className="rounded-[20px] border border-ink-100 bg-white p-8 text-center shadow-sm">
                <div className="font-marker text-2xl text-ink-700">
                  Cocinando…
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-wider text-ink-400">
                  Cargando los planes
                </div>
              </div>
            )}

            {!isLoading && packages.length === 0 && (
              <div className="rounded-[20px] border-2 border-dashed border-ink-200 bg-white p-8 text-center">
                <div className="font-display text-xl font-bold text-ink-800">
                  Los planes no están disponibles ahora mismo
                </div>
                <p className="mt-2 text-sm text-ink-500">
                  Verifica tu conexión o vuelve en un rato.
                </p>
              </div>
            )}

            {!isLoading && packages.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">
                {packages.map((pkg) => (
                  <PlanCard
                    key={pkg.identifier}
                    pkg={pkg}
                    isPurchasing={purchasingId === pkg.identifier}
                    disabled={purchasingId !== null}
                    onPurchase={() => handlePurchase(pkg)}
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-[14px] border-2 border-rosa-300 bg-rosa-50 px-4 py-3 text-sm font-medium text-rosa-700">
                {error}
              </div>
            )}
          </>
        )}

        {/* Features list */}
        <div className="rounded-[20px] border border-ink-100 bg-white p-6 shadow-sm md:p-8">
          <div className="font-display text-2xl font-extrabold text-ink-800">
            Lo que incluye Premium
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {PREMIUM_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-ink-700"
              >
                <span
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jade-500 text-xs font-bold text-white"
                  aria-hidden
                >
                  ✓
                </span>
                <span>{FEATURE_COPY[feature]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function PlanCard({
  pkg,
  isPurchasing,
  disabled,
  onPurchase,
}: {
  pkg: Package
  isPurchasing: boolean
  disabled: boolean
  onPurchase: () => void
}) {
  const product = pkg.webBillingProduct
  const isAnnual = pkg.packageType === PackageType.Annual
  const accent = isAnnual ? "var(--chili-500)" : "var(--cielo-500)"
  const periodLabel = describePeriod(pkg.packageType)

  return (
    <div
      className="relative overflow-hidden rounded-[20px] bg-white p-6 md:p-7"
      style={{
        border: `3px solid ${accent}`,
        boxShadow: `0 4px 0 ${accent}`,
      }}
    >
      {isAnnual && (
        <div className="absolute right-4 top-4">
          <Badge color="maiz" variant="solid" size="sm">
            Mejor valor
          </Badge>
        </div>
      )}
      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-400">
        {periodLabel}
      </div>
      <div className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink-800">
        {product.title}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <div className="font-display text-4xl font-extrabold text-ink-800">
          {product.currentPrice.formattedPrice}
        </div>
        {pkg.packageType === PackageType.Monthly && (
          <div className="font-mono text-xs text-ink-400">/ mes</div>
        )}
        {isAnnual && (
          <div className="font-mono text-xs text-ink-400">/ año</div>
        )}
      </div>
      {product.description && (
        <p className="mt-2 text-sm text-ink-500">{product.description}</p>
      )}
      <div className="mt-5">
        <Button
          variant={isAnnual ? "primary" : "secondary"}
          size="lg"
          className="w-full"
          disabled={disabled}
          onClick={onPurchase}
        >
          {isPurchasing ? "Cocinando…" : "¡Dale!"}
        </Button>
      </div>
    </div>
  )
}

function describePeriod(type: PackageType): string {
  switch (type) {
    case PackageType.Annual:
      return "Anual"
    case PackageType.SixMonth:
      return "6 meses"
    case PackageType.ThreeMonth:
      return "3 meses"
    case PackageType.TwoMonth:
      return "2 meses"
    case PackageType.Monthly:
      return "Mensual"
    case PackageType.Weekly:
      return "Semanal"
    case PackageType.Lifetime:
      return "De por vida"
    default:
      return "Plan"
  }
}
