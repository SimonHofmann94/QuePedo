"use client"

import { Purchases, LogLevel } from "@revenuecat/purchases-js"

const RC_WEB_KEY = process.env.NEXT_PUBLIC_REVENUECAT_WEB_KEY

/**
 * Initialise RevenueCat Web Billing for the current Supabase user.
 *
 * Idempotent: if Purchases is already configured for the same `appUserId`
 * we return the existing instance. If it's configured for a *different*
 * user (e.g. fast user switch), we call `changeUser` so subsequent calls
 * to `getOfferings` / `getCustomerInfo` reflect the right entitlements.
 *
 * Returns `null` when the key is missing — callers should treat that as
 * "RevenueCat unavailable" and fall back to the server-side premium gate.
 */
export async function initRevenueCat(appUserId: string): Promise<Purchases | null> {
  if (!RC_WEB_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[revenuecat] NEXT_PUBLIC_REVENUECAT_WEB_KEY is not set — paywall disabled"
      )
    }
    return null
  }

  if (typeof window === "undefined") {
    // Web SDK is browser-only.
    return null
  }

  try {
    if (Purchases.isConfigured()) {
      const instance = Purchases.getSharedInstance()
      if (instance.getAppUserId() !== appUserId) {
        await instance.changeUser(appUserId)
      }
      return instance
    }

    if (process.env.NODE_ENV !== "production") {
      Purchases.setLogLevel(LogLevel.Debug)
    }

    return Purchases.configure({
      apiKey: RC_WEB_KEY,
      appUserId,
    })
  } catch (err) {
    console.error("[revenuecat] initialisation failed", err)
    return null
  }
}

export function getPurchasesInstance(): Purchases | null {
  try {
    return Purchases.isConfigured() ? Purchases.getSharedInstance() : null
  } catch {
    return null
  }
}
