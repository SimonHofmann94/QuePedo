import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Platform } from 'react-native'
import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases'
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui'
import { useAuth } from './AuthContext'
import { supabase } from '@/lib/supabase'
import {
  getSubscriptionInfo,
  consumeTaco as consumeTacoRpc,
  checkAndIncrementQuiz as checkAndIncrementQuizRpc,
  getVocabularyCount as getVocabularyCountService,
} from '@/services/subscription'
import { FREE_TIER_LIMITS, RC_ENTITLEMENT_ID, type FeatureId } from '@chingon/shared'

interface SubscriptionContextType {
  isPremium: boolean
  isLoading: boolean
  tacoBalance: number
  dailyQuizCount: number
  vocabularyCount: number
  maxVocabulary: number
  consumeTaco: () => Promise<boolean>
  canTakeQuiz: () => Promise<boolean>
  canAddVocabulary: () => boolean
  isFeatureLocked: (feature: FeatureId) => boolean
  presentPaywall: () => Promise<boolean>
  presentCustomerCenter: () => Promise<void>
  refreshSubscription: () => Promise<void>
  refreshTacoBalance: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  isLoading: true,
  tacoBalance: 0,
  dailyQuizCount: 0,
  vocabularyCount: 0,
  maxVocabulary: FREE_TIER_LIMITS.maxVocabulary,
  consumeTaco: async () => false,
  canTakeQuiz: async () => false,
  canAddVocabulary: () => false,
  isFeatureLocked: () => true,
  presentPaywall: async () => false,
  presentCustomerCenter: async () => {},
  refreshSubscription: async () => {},
  refreshTacoBalance: async () => {},
})

const RC_API_KEY = process.env.EXPO_PUBLIC_RC_API_KEY

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tacoBalance, setTacoBalance] = useState(0)
  const [dailyQuizCount, setDailyQuizCount] = useState(0)
  const [vocabularyCount, setVocabularyCount] = useState(0)
  const [rcInitialized, setRcInitialized] = useState(false)

  // Initialize RevenueCat SDK once on mount
  useEffect(() => {
    async function initRC() {
      if (!RC_API_KEY) {
        console.warn('RevenueCat API key not configured — running in free-tier-only mode')
        setRcInitialized(false)
        return
      }

      try {
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG)
        }
        Purchases.configure({ apiKey: RC_API_KEY })
        setRcInitialized(true)
      } catch (error) {
        console.error('Failed to initialize RevenueCat:', error)
        setRcInitialized(false)
      }
    }

    initRC()
  }, [])

  // Load subscription data when user or RC readiness changes
  useEffect(() => {
    if (!user) {
      setIsPremium(false)
      setTacoBalance(0)
      setDailyQuizCount(0)
      setVocabularyCount(0)
      setIsLoading(false)
      return
    }

    loadSubscriptionData(user.id)
  }, [user, rcInitialized])

  // Listen for real-time entitlement changes from RevenueCat
  useEffect(() => {
    if (!rcInitialized) return

    const listener = (info: CustomerInfo) => {
      const hasEntitlement = info.entitlements.active[RC_ENTITLEMENT_ID] !== undefined
      setIsPremium(hasEntitlement)

      if (user) {
        syncSubscriptionTier(user.id, hasEntitlement ? 'premium' : 'free')
      }
    }

    Purchases.addCustomerInfoUpdateListener(listener)

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener)
    }
  }, [rcInitialized, user])

  async function loadSubscriptionData(userId: string) {
    setIsLoading(true)

    try {
      // Identify the user to RevenueCat
      if (rcInitialized) {
        try {
          const { customerInfo } = await Purchases.logIn(userId)
          const hasEntitlement = customerInfo.entitlements.active[RC_ENTITLEMENT_ID] !== undefined
          setIsPremium(hasEntitlement)

          await syncSubscriptionTier(userId, hasEntitlement ? 'premium' : 'free')
        } catch (error) {
          console.error('RevenueCat login error:', error)
        }
      }

      // Load profile data from Supabase
      const [info, vocabCount] = await Promise.all([
        getSubscriptionInfo(userId),
        getVocabularyCountService(userId),
      ])

      if (info) {
        // Admins always get premium access regardless of tier or RevenueCat
        if (info.is_admin) {
          setIsPremium(true)
        } else if (!rcInitialized) {
          // If RC not initialized, use Supabase tier as source of truth
          setIsPremium(info.subscription_tier === 'premium')
        }
        setTacoBalance(info.taco_balance)
        setDailyQuizCount(info.daily_quiz_count)
      }
      setVocabularyCount(vocabCount)
    } catch (error) {
      console.error('Error loading subscription data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function syncSubscriptionTier(userId: string, tier: string) {
    const { data } = await supabase
      .from('user_profiles')
      .select('subscription_tier, is_admin')
      .eq('id', userId)
      .single()

    // Never downgrade an admin
    if (data?.is_admin) return

    if (data && data.subscription_tier !== tier) {
      await supabase
        .from('user_profiles')
        .update({ subscription_tier: tier, updated_at: new Date().toISOString() })
        .eq('id', userId)
    }
  }

  const refreshSubscription = useCallback(async () => {
    if (!user) return
    await loadSubscriptionData(user.id)
  }, [user, rcInitialized])

  const refreshTacoBalance = useCallback(async () => {
    if (!user) return
    const info = await getSubscriptionInfo(user.id)
    if (info) {
      setTacoBalance(info.taco_balance)
    }
  }, [user])

  const consumeTaco = useCallback(async (): Promise<boolean> => {
    if (!user) return false
    if (isPremium) return true

    const success = await consumeTacoRpc(user.id)
    if (success) {
      setTacoBalance(prev => Math.max(0, prev - 1))
    }
    return success
  }, [user, isPremium])

  const canTakeQuiz = useCallback(async (): Promise<boolean> => {
    if (!user) return false
    if (isPremium) return true

    const success = await checkAndIncrementQuizRpc(user.id)
    if (success) {
      setDailyQuizCount(prev => prev + 1)
    }
    return success
  }, [user, isPremium])

  const canAddVocabulary = useCallback((): boolean => {
    if (isPremium) return true
    return vocabularyCount < FREE_TIER_LIMITS.maxVocabulary
  }, [isPremium, vocabularyCount])

  const isFeatureLocked = useCallback((feature: FeatureId): boolean => {
    if (isPremium) return false
    return true
  }, [isPremium])

  const presentPaywall = useCallback(async (): Promise<boolean> => {
    if (!rcInitialized) {
      console.warn('RevenueCat not initialized — cannot present paywall')
      return false
    }

    try {
      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: RC_ENTITLEMENT_ID,
      })

      if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
        await refreshSubscription()
        return true
      }
      return false
    } catch (error) {
      console.error('Error presenting paywall:', error)
      return false
    }
  }, [rcInitialized, refreshSubscription])

  const presentCustomerCenter = useCallback(async (): Promise<void> => {
    if (!rcInitialized) {
      console.warn('RevenueCat not initialized — cannot present customer center')
      return
    }

    try {
      await RevenueCatUI.presentCustomerCenter()
    } catch (error) {
      console.error('Error presenting customer center:', error)
    }
  }, [rcInitialized])

  const maxVocabulary = isPremium ? Infinity : FREE_TIER_LIMITS.maxVocabulary

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        isLoading,
        tacoBalance,
        dailyQuizCount,
        vocabularyCount,
        maxVocabulary,
        consumeTaco,
        canTakeQuiz,
        canAddVocabulary,
        isFeatureLocked,
        presentPaywall,
        presentCustomerCenter,
        refreshSubscription,
        refreshTacoBalance,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
