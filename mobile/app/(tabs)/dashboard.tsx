import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BookOpen, Trophy, Flame, Clock, Crown } from 'lucide-react-native'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { getUserProfile } from '@/services/profile'
import { getUserActivityDates, getUserStreak } from '@/services/activity'
import { getUserVocabulary } from '@/services/vocabulary'
import { colors, fontFamily, surface } from '@/constants/theme'

const GREETINGS_ES = [
  '¡Qué pedo, {name}!',
  '¡Qué onda, {name}!',
  '¡Hola, {name}!',
  '¡Epa, {name}!',
]

const DAY_LABELS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function pickGreeting(name: string) {
  const t = GREETINGS_ES[Math.floor(Math.random() * GREETINGS_ES.length)]
  return t.replace('{name}', name)
}

export default function DashboardScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { isPremium, tacoBalance, presentPaywall, refreshSubscription } = useSubscription()
  const [refreshing, setRefreshing] = useState(false)
  const [vocabCount, setVocabCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [activityDates, setActivityDates] = useState<string[]>([])

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'amigo'
  const [greeting] = useState(() => pickGreeting(displayName))

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

  const today = new Date()
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d)
  }

  const isActiveDay = (d: Date) => activityDates.includes(d.toISOString().split('T')[0])

  const todayEs = today.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.chili[500]} />
        }
      >
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subGreeting}>{todayEs}</Text>
          </View>
          <Badge color="maiz" variant="solid">🌮 {isPremium ? '∞' : tacoBalance}</Badge>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Vocab" value={vocabCount} sub="+12 esta sem." color={colors.chili[500]} icon={<BookOpen size={20} color="#FFFFFF" />} />
          <StatCard label="Racha" value={streak} sub="¡no la rompas!" color={colors.maiz[400]} icon={<Flame size={20} color="#FFFFFF" />} />
          <StatCard label="Promedio" value="85%" sub="últimos 30" color={colors.jade[500]} icon={<Trophy size={20} color="#FFFFFF" />} />
          <StatCard label="Tiempo" value="120m" sub="esta sem." color={colors.cielo[500]} icon={<Clock size={20} color="#FFFFFF" />} />
        </View>

        {/* Upgrade banner */}
        {!isPremium && (
          <TouchableOpacity onPress={presentPaywall} activeOpacity={0.8} style={styles.upgradeCard}>
            <View style={styles.upgradeIcon}>
              <Crown size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Vuélvete chingón Premium</Text>
              <Text style={styles.upgradeDesc}>Vocab ilimitado · quizzes · AI generación</Text>
            </View>
            <Text style={styles.upgradeArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Daily challenge */}
        <View style={styles.challengeCard}>
          <Badge color="maiz" variant="solid" size="sm">⚡ Reto del día</Badge>
          <Text style={styles.challengeTitle}>Ordena una torta en la esquina</Text>
          <Text style={styles.challengeDesc}>5 min · B1 · práctica de habla</Text>
          <View style={styles.challengeFooter}>
            <Text style={styles.challengeMeta}>+50 XP · +1 🔥</Text>
            <Button
              onPress={() => router.push('/(tabs)/exercises')}
              variant="secondary"
              size="sm"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <Text style={{ color: colors.chili[600], fontFamily: fontFamily.bodyBold, fontSize: 13 }}>
                ¡Dale! →
              </Text>
            </Button>
          </View>
        </View>

        {/* Quick actions */}
        <View>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.actionsGrid}>
            <QuickAction onPress={() => router.push('/(tabs)/exercises')} emoji="📚" color={colors.chili[500]} title="Continuar" sub="Subjuntivo" />
            <QuickAction onPress={() => router.push('/(tabs)/exercises/quiz')} emoji="🎯" color={colors.jade[500]} title="Quiz" sub="10 palabras" />
            <QuickAction onPress={() => router.push('/(tabs)/vocabulary')} emoji="➕" color={colors.cielo[500]} title="Añadir" sub="Nueva palabra" />
            <QuickAction onPress={() => router.push('/(tabs)/profile')} emoji="📊" color={colors.jacaranda[500]} title="Progreso" sub="Ruta a C2" />
          </View>
        </View>

        {/* Weekly streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View>
              <Text style={styles.streakTitle}>Tu semana</Text>
              <Text style={styles.streakSub}>¡mantén la racha!</Text>
            </View>
            <Badge color="maiz" variant="solid">🔥 {streak}</Badge>
          </View>
          <View style={styles.streakRow}>
            {days.map((date, i) => {
              const active = isActiveDay(date)
              return (
                <View key={i} style={styles.streakDay}>
                  <Text style={styles.streakDayLabel}>{DAY_LABELS_ES[date.getDay()]}</Text>
                  <View
                    style={[
                      styles.streakDot,
                      { backgroundColor: active ? colors.chili[500] : colors.ink[100] },
                    ]}
                  >
                    <Text style={{ fontSize: active ? 18 : 12, color: active ? '#FFF' : colors.ink[400] }}>
                      {active ? '🔥' : '·'}
                    </Text>
                  </View>
                  <Text style={styles.streakDayNum}>{date.getDate()}</Text>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function StatCard({
  label, value, sub, color, icon,
}: { label: string; value: number | string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>{icon}</View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  )
}

function QuickAction({
  onPress, emoji, color, title, sub,
}: { onPress: () => void; emoji: string; color: string; title: string; sub: string }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.action} activeOpacity={0.8}>
      <View style={[styles.actionEmoji, { backgroundColor: color }]}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDesc}>{sub}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greeting: { fontFamily: fontFamily.marker, fontSize: 32, color: colors.chili[500], lineHeight: 36 },
  subGreeting: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500], marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', flexGrow: 1, padding: 16, borderRadius: 16,
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    position: 'relative',
  },
  statIcon: {
    position: 'absolute', right: 14, top: 14, width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  statLabel: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 1,
    color: colors.ink[400], textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 32, color: colors.ink[800], lineHeight: 32, marginTop: 6,
  },
  statSub: { fontFamily: fontFamily.body, fontSize: 11, color: colors.ink[500], marginTop: 6 },

  upgradeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.jacaranda[500], padding: 18, borderRadius: 20,
  },
  upgradeIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  upgradeTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 17, color: '#FFFFFF' },
  upgradeDesc: { fontFamily: fontFamily.body, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  upgradeArrow: { fontFamily: fontFamily.displayExtraBold, fontSize: 22, color: '#FFFFFF' },

  challengeCard: {
    backgroundColor: colors.chili[500], padding: 20, borderRadius: 20, overflow: 'hidden',
  },
  challengeTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 22, color: '#FFFFFF', marginTop: 10, lineHeight: 26,
  },
  challengeDesc: { fontFamily: fontFamily.body, fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  challengeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  challengeMeta: { fontFamily: fontFamily.monoBold, fontSize: 11, color: 'rgba(255,255,255,0.9)' },

  sectionTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 20, color: colors.ink[800], marginBottom: 12 },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: {
    width: '47%', flexGrow: 1, flexDirection: 'row', gap: 12, alignItems: 'center',
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 16, padding: 14,
  },
  actionEmoji: {
    width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  actionTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 15, color: colors.ink[800] },
  actionDesc: { fontFamily: fontFamily.body, fontSize: 11, color: colors.ink[500], marginTop: 2 },

  streakCard: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 20, padding: 18,
  },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  streakTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.ink[800] },
  streakSub: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ink[500] },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDay: { alignItems: 'center', gap: 6 },
  streakDayLabel: {
    fontFamily: fontFamily.monoBold, fontSize: 9, letterSpacing: 1,
    color: colors.ink[400], textTransform: 'uppercase',
  },
  streakDot: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  streakDayNum: { fontFamily: fontFamily.monoBold, fontSize: 10, color: colors.ink[500] },
})
