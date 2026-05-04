import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import RevenueCatUI from 'react-native-purchases-ui'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { posthog } from '@/lib/posthog'
import { AnalyticsEvent, createTracker } from '@chingon/shared'

const track = createTracker(posthog)

export default function PaywallScreen() {
  const router = useRouter()
  const { refreshSubscription } = useSubscription()
  const { source } = useLocalSearchParams<{ source?: string }>()

  // Fire `paywall_viewed` once on mount with whatever entry point opened
  // the modal (e.g. ?source=feature_gate, ?source=upgrade_button).
  useEffect(() => {
    track(AnalyticsEvent.PAYWALL_VIEWED, { source: source ?? 'unknown' })
  }, [source])

  return (
    <View style={styles.container}>
      <RevenueCatUI.Paywall
        options={{ displayCloseButton: true }}
        onPurchaseStarted={() => {
          track(AnalyticsEvent.PAYWALL_PURCHASE_STARTED, { source: source ?? 'unknown' })
        }}
        onPurchaseCompleted={async ({ customerInfo }) => {
          track(AnalyticsEvent.PAYWALL_PURCHASE_COMPLETED, {
            source: source ?? 'unknown',
            entitlements: Object.keys(customerInfo?.entitlements?.active ?? {}).join(',') || null,
          })
          await refreshSubscription()
          router.back()
        }}
        onRestoreCompleted={async () => {
          await refreshSubscription()
          router.back()
        }}
        onPurchaseCancelled={() => {
          track(AnalyticsEvent.PAYWALL_DISMISSED, { source: source ?? 'unknown', reason: 'cancelled' })
          router.back()
        }}
        onDismiss={() => {
          track(AnalyticsEvent.PAYWALL_DISMISSED, { source: source ?? 'unknown', reason: 'dismissed' })
          router.back()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
