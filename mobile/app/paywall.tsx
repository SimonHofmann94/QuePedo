import { View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import RevenueCatUI from 'react-native-purchases-ui'
import { useSubscription } from '@/contexts/SubscriptionContext'

export default function PaywallScreen() {
  const router = useRouter()
  const { refreshSubscription } = useSubscription()

  return (
    <View style={styles.container}>
      <RevenueCatUI.Paywall
        options={{ displayCloseButton: true }}
        onPurchaseCompleted={async () => {
          await refreshSubscription()
          router.back()
        }}
        onRestoreCompleted={async () => {
          await refreshSubscription()
          router.back()
        }}
        onPurchaseCancelled={() => router.back()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
