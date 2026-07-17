import { View, StyleSheet } from 'react-native'
// ponytail: folder stays "(tabs)" despite being a drawer now — renaming the route
// group would churn every router.push('/(tabs)/...') string for zero user value.
import { Drawer } from 'expo-router/drawer'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Book, Dumbbell, BookOpenText, Globe, User } from 'lucide-react-native'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { colors, fontFamily, radii, surface } from '@/constants/theme'

export default function DrawerLayout() {
  const { isPremium } = useSubscription()
  const { t } = useTranslation('nav')

  return (
    <Drawer
      screenOptions={{
        // Screens render their own SafeAreaView headers — the drawer header is a
        // minimal, title-less bar whose only job is the hamburger button.
        headerTitle: '',
        headerStyle: { backgroundColor: surface.bg },
        headerShadowVisible: false,
        headerTintColor: colors.ink[700],
        sceneStyle: { backgroundColor: surface.bg },
        drawerStyle: { backgroundColor: surface.bg },
        drawerActiveTintColor: colors.chili[700],
        drawerActiveBackgroundColor: colors.chili[100],
        drawerInactiveTintColor: colors.ink[500],
        drawerItemStyle: { borderRadius: radii.md },
        drawerLabelStyle: {
          fontFamily: fontFamily.monoBold,
          fontSize: 12,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: t('dashboard'),
          drawerIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="vocabulary"
        options={{
          title: t('vocabulary'),
          drawerIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="exercises"
        options={{
          title: t('exercises'),
          drawerIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="grammar"
        options={{
          title: t('grammar'),
          drawerIcon: ({ color, size }) => (
            <View>
              <BookOpenText size={size} color={color} />
              {!isPremium && <View style={drawerStyles.lockDot} />}
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="culture"
        options={{
          title: t('culture'),
          drawerIcon: ({ color, size }) => (
            <View>
              <Globe size={size} color={color} />
              {!isPremium && <View style={drawerStyles.lockDot} />}
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: t('profile'),
          drawerIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Drawer>
  )
}

const drawerStyles = StyleSheet.create({
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
