import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts as useFraunces, Fraunces_700Bold, Fraunces_800ExtraBold } from '@expo-google-fonts/fraunces'
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans'
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo'
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Sentry from '@sentry/react-native'
import { PostHogProvider } from 'posthog-react-native'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { surface } from '@/constants/theme'
import { posthog } from '@/lib/posthog'
import { bootstrapLocale } from '@/lib/i18n'

// Applies the startup locale (AsyncStorage → profile → device → default) and
// re-resolves whenever the signed-in user changes. Renders nothing.
function LocaleBootstrap() {
  const { user } = useAuth()
  useEffect(() => {
    bootstrapLocale(user?.id)
  }, [user?.id])
  return null
}

// Initialise Sentry as early as possible — before the first render — so
// crashes in font-loading code are captured.
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN_MOBILE
if (SENTRY_DSN && !__DEV__) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    sendDefaultPii: false,
  })
}

function RootLayout() {
  const [fontsLoaded] = useFraunces({
    Fraunces_700Bold,
    Fraunces_800ExtraBold,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Caprasimo_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  })

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: surface.bg }} />
  }

  const tree = (
    <AuthProvider>
      <LocaleBootstrap />
      <SubscriptionProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: surface.bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        </Stack>
      </SubscriptionProvider>
    </AuthProvider>
  )

  // Wrap in PostHogProvider only when a client exists — local dev without
  // EXPO_PUBLIC_POSTHOG_KEY just renders the bare tree.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {posthog ? <PostHogProvider client={posthog}>{tree}</PostHogProvider> : tree}
    </GestureHandlerRootView>
  )
}

export default Sentry.wrap(RootLayout)
