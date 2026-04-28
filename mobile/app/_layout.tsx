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
import { AuthProvider } from '@/contexts/AuthContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { surface } from '@/constants/theme'

export default function RootLayout() {
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

  return (
    <AuthProvider>
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
}
