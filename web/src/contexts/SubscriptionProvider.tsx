"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type {
  CustomerInfo,
  Offering,
  Package,
} from "@revenuecat/purchases-js"
import { RC_ENTITLEMENT_ID } from "@chingon/shared"
import { createClient } from "@/utils/supabase/client"
import { initRevenueCat, getPurchasesInstance } from "@/lib/revenuecat"

interface SubscriptionContextValue {
  /** True when the active RC entitlement is held OR the Supabase profile says so. */
  isPremium: boolean
  /** Initial loading + per-user identification in flight. */
  isLoading: boolean
  /** RC current offering (monthly + annual packages live on `availablePackages`). */
  currentOffering: Offering | null
  /** Trigger the RC purchase modal for a given package. Resolves true on success. */
  presentPaywall: (pkg: Package) => Promise<boolean>
  /** Refetch CustomerInfo from RC and recompute `isPremium`. */
  restorePurchases: () => Promise<boolean>
  /** Returns the RC-managed billing portal URL, or null if unavailable. */
  manageSubscription: () => Promise<string | null>
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  isPremium: false,
  isLoading: true,
  currentOffering: null,
  presentPaywall: async () => false,
  restorePurchases: async () => false,
  manageSubscription: async () => null,
})

interface ProviderProps {
  children: React.ReactNode
  /**
   * Optional initial premium flag — pass it from a server component that
   * already called `isUserPremium()` to avoid the brief "free" flash on
   * first paint while RC initialises.
   */
  initialIsPremium?: boolean
}

export function SubscriptionProvider({
  children,
  initialIsPremium = false,
}: ProviderProps) {
  const supabase = useMemo(() => createClient(), [])

  // undefined = auth not resolved yet, null = definitively signed out. The
  // distinction matters: the bootstrap below must NOT clear the server-seeded
  // `initialIsPremium` (which includes is_admin) while auth is still unknown —
  // admins have no RevenueCat entitlement, so a premature reset was permanent.
  const [userId, setUserId] = useState<string | null | undefined>(undefined)
  const [isPremium, setIsPremium] = useState<boolean>(initialIsPremium)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentOffering, setCurrentOffering] = useState<Offering | null>(null)
  const initRanForUser = useRef<string | null>(null)

  // Track the Supabase auth user (initial fetch + reactive auth state).
  useEffect(() => {
    let cancelled = false

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return
      setUserId(user?.id ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  const applyCustomerInfo = useCallback((info: CustomerInfo) => {
    const hasEntitlement =
      info.entitlements.active[RC_ENTITLEMENT_ID] !== undefined
    setIsPremium((prev) => prev || hasEntitlement)
    return hasEntitlement
  }, [])

  // Initialise RC for the signed-in user, fetch offerings + customer info.
  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (userId === undefined) return // auth still resolving — keep the seed
      if (userId === null) {
        // Real sign-out: now clearing premium is correct.
        setIsPremium(false)
        setCurrentOffering(null)
        setIsLoading(false)
        initRanForUser.current = null
        return
      }

      // Avoid re-initialising on every render if userId hasn't changed.
      if (initRanForUser.current === userId) {
        setIsLoading(false)
        return
      }
      initRanForUser.current = userId

      setIsLoading(true)
      try {
        const purchases = await initRevenueCat(userId)
        if (cancelled) return

        if (!purchases) {
          // Falling back to the DB-side gate — `initialIsPremium` from the
          // server stays authoritative until the user reloads.
          setIsLoading(false)
          return
        }

        const [offerings, customerInfo] = await Promise.all([
          purchases.getOfferings().catch((e) => {
            console.error("[revenuecat] getOfferings failed", e)
            return null
          }),
          purchases.getCustomerInfo().catch((e) => {
            console.error("[revenuecat] getCustomerInfo failed", e)
            return null
          }),
        ])

        if (cancelled) return
        if (offerings?.current) setCurrentOffering(offerings.current)
        if (customerInfo) applyCustomerInfo(customerInfo)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [userId, applyCustomerInfo])

  const presentPaywall = useCallback(
    async (pkg: Package): Promise<boolean> => {
      const purchases = getPurchasesInstance()
      if (!purchases) {
        console.warn("[revenuecat] presentPaywall called before init")
        return false
      }
      try {
        const result = await purchases.purchase({ rcPackage: pkg })
        const granted = applyCustomerInfo(result.customerInfo)
        return granted
      } catch (err: unknown) {
        // RC throws a UserCancelledError when the modal is dismissed —
        // treat that as a non-event, not a failure to log.
        const errorCode = (err as { errorCode?: number })?.errorCode
        if (errorCode !== 1) {
          console.error("[revenuecat] purchase failed", err)
        }
        return false
      }
    },
    [applyCustomerInfo]
  )

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    const purchases = getPurchasesInstance()
    if (!purchases) return false
    try {
      const info = await purchases.getCustomerInfo()
      return applyCustomerInfo(info)
    } catch (err) {
      console.error("[revenuecat] restorePurchases failed", err)
      return false
    }
  }, [applyCustomerInfo])

  const manageSubscription = useCallback(async (): Promise<string | null> => {
    const purchases = getPurchasesInstance()
    if (!purchases) return null
    try {
      const info = await purchases.getCustomerInfo()
      return info.managementURL ?? null
    } catch (err) {
      console.error("[revenuecat] manageSubscription failed", err)
      return null
    }
  }, [])

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      isPremium,
      isLoading,
      currentOffering,
      presentPaywall,
      restorePurchases,
      manageSubscription,
    }),
    [
      isPremium,
      isLoading,
      currentOffering,
      presentPaywall,
      restorePurchases,
      manageSubscription,
    ]
  )

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return ctx
}
