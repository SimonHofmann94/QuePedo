import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BookOpen, Trophy, Flame, Clock, MessageSquare, TrendingUp, PlusCircle, Crown } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { TacoBalance } from '@/components/ui/TacoBalance'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { getUserProfile } from '@/services/profile'
import { getUserActivityDates, getUserStreak } from '@/services/activity'
import { getUserVocabulary } from '@/services/vocabulary'
import { getRandomGreeting } from '@chingon/shared'

export default function DashboardScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { isPremium, tacoBalance, presentPaywall, refreshSubscription } = useSubscription()
  const [refreshing, setRefreshing] = useState(false)
  const [vocabCount, setVocabCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [activityDates, setActivityDates] = useState<string[]>([])
  const [greeting] = useState(getRandomGreeting())

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'amigo'

  const loadData = useCallback(async () => {
    const [vocab, streakResult, activityResult] = await Promise.all([
      getUserVocabulary(),
      getUserStreak(),
      getUserActivityDates(),
    ])
    setVocabCount(vocab.length)
    setStreak(streakResult.streak || 0)
    setActivityDates(activityResult.data || [])
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([loadData(), refreshSubscription()])
    setRefreshing(false)
  }, [loadData, refreshSubscription])

  // 7-day streak calendar
  const today = new Date()
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d)
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const isActiveDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return activityDates.includes(dateStr)
  }

  const quickActions = [
    { title: 'Start Learning', desc: 'Continue where you left off', icon: BookOpen, color: '#F97316', href: '/(tabs)/vocabulary' as const },
    { title: 'Take Quiz', desc: 'Test your knowledge', icon: MessageSquare, color: '#3B82F6', href: '/(tabs)/exercises/quiz' as const },
    { title: 'Add Vocabulary', desc: 'Expand your wordbank', icon: PlusCircle, color: '#22C55E', href: '/(tabs)/vocabulary' as const },
    { title: 'View Progress', desc: 'See your improvement', icon: TrendingUp, color: '#8B5CF6', href: '/(tabs)/profile' as const },
  ]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
      >
        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.welcomeBack}>Welcome back, {displayName}!</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.statLabel}>Vocabulary</Text>
                <Text style={styles.statValue}>{vocabCount}</Text>
              </View>
              <View style={styles.statIcon}>
                <BookOpen size={22} color="#EA580C" />
              </View>
            </View>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.statLabel}>Streak</Text>
                <Text style={styles.statValue}>{streak} days</Text>
              </View>
              <View style={styles.statIcon}>
                <Flame size={22} color="#EA580C" />
              </View>
            </View>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.statLabel}>Tacos</Text>
                <TacoBalance balance={tacoBalance} isPremium={isPremium} />
              </View>
              <View style={styles.statIcon}>
                <Text style={{ fontSize: 22 }}>{'\u{1F32E}'}</Text>
              </View>
            </View>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.statLabel}>This Week</Text>
                <Text style={styles.statValue}>120 min</Text>
              </View>
              <View style={styles.statIcon}>
                <Clock size={22} color="#EA580C" />
              </View>
            </View>
          </Card>
        </View>

        {/* Upgrade Banner (free users only) */}
        {!isPremium && (
          <TouchableOpacity onPress={presentPaywall} activeOpacity={0.7}>
            <Card style={styles.upgradeBanner}>
              <View style={styles.upgradeIconBox}>
                <Crown size={22} color="#D97706" />
              </View>
              <View style={styles.upgradeContent}>
                <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeDesc}>Unlimited vocabulary, quizzes, AI generation & more</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}

        {/* Quick Actions */}
        <Card>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.title}
                style={styles.actionItem}
                onPress={() => router.push(action.href)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <action.icon size={20} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDesc}>{action.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Weekly Streak */}
        <Card>
          <Text style={styles.sectionTitle}>Weekly Streak</Text>
          <View style={styles.streakRow}>
            {days.map((date, i) => {
              const active = isActiveDay(date)
              const isToday = date.toDateString() === today.toDateString()
              return (
                <View key={i} style={styles.streakDay}>
                  <Text style={styles.streakDayLabel}>{dayNames[date.getDay()]}</Text>
                  <View style={[
                    styles.streakDot,
                    active && styles.streakDotActive,
                    isToday && styles.streakDotToday,
                  ]}>
                    {active ? (
                      <Flame size={18} color="#FFFFFF" />
                    ) : (
                      <View style={styles.streakDotInner} />
                    )}
                  </View>
                  <Text style={styles.streakDayNum}>{date.getDate()}</Text>
                </View>
              )
            })}
          </View>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyState}>
            <MessageSquare size={40} color="#D6D3D1" />
            <Text style={styles.emptyText}>No activity yet. Start learning to see your progress!</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  scroll: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    gap: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  welcomeBack: {
    fontSize: 18,
    color: '#78716C',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#78716C',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#292524',
    marginTop: 4,
  },
  statIcon: {
    backgroundColor: '#FFF7ED',
    padding: 8,
    borderRadius: 10,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  upgradeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeContent: {
    flex: 1,
    gap: 2,
  },
  upgradeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#292524',
  },
  upgradeDesc: {
    fontSize: 12,
    color: '#78716C',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    width: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#292524',
  },
  actionDesc: {
    fontSize: 11,
    color: '#78716C',
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakDay: {
    alignItems: 'center',
    gap: 6,
  },
  streakDayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#78716C',
  },
  streakDot: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDotActive: {
    backgroundColor: '#F97316',
  },
  streakDotToday: {
    borderWidth: 2,
    borderColor: '#FDBA74',
  },
  streakDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D6D3D1',
  },
  streakDayNum: {
    fontSize: 11,
    color: '#78716C',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
  },
})
