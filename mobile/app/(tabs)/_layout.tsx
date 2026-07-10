import { View, StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Book, Dumbbell, BookOpenText, Globe, User } from 'lucide-react-native'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { colors, fontFamily, surface } from '@/constants/theme'

export default function TabLayout() {
  const { isPremium } = useSubscription()
  const { t } = useTranslation('nav')

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.chili[600],
        tabBarInactiveTintColor: colors.ink[400],
        tabBarStyle: {
          backgroundColor: surface.card,
          borderTopColor: colors.ink[100],
          borderTopWidth: 1,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.monoBold,
          fontSize: 10,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: t('vocabulary'),
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: t('exercises'),
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="grammar"
        options={{
          title: t('grammar'),
          tabBarIcon: ({ color, size }) => (
            <View>
              <BookOpenText size={size} color={color} />
              {!isPremium && <View style={tabStyles.lockDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="culture"
        options={{
          title: t('culture'),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Globe size={size} color={color} />
              {!isPremium && <View style={tabStyles.lockDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}

const tabStyles = StyleSheet.create({
  lockDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.maiz[500],
  },
})
