import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Lock } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useSubscription } from '@/contexts/SubscriptionContext'

const GRAMMAR_LEVELS = [
  { level: 'A1', title: 'Beginner', chapters: 10, unlocked: true },
  { level: 'A2', title: 'Elementary', chapters: 0, unlocked: false },
  { level: 'B1', title: 'Intermediate', chapters: 0, unlocked: false },
  { level: 'B2', title: 'Upper Intermediate', chapters: 0, unlocked: false },
  { level: 'C1', title: 'Advanced', chapters: 0, unlocked: false },
  { level: 'C2', title: 'Mastery', chapters: 0, unlocked: false },
]

export default function GrammarScreen() {
  const router = useRouter()
  const { isPremium, presentPaywall } = useSubscription()

  const handleLevelPress = (level: typeof GRAMMAR_LEVELS[0]) => {
    if (!level.unlocked) return
    if (!isPremium) {
      presentPaywall()
      return
    }
    router.push({ pathname: '/(tabs)/grammar/chapters', params: { level: level.level.toLowerCase() } })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Grammar</Text>
          <Text style={styles.subtitle}>Master Spanish grammar step by step</Text>
        </View>

        {!isPremium && (
          <Card style={styles.lockBanner}>
            <Lock size={28} color="#D97706" />
            <Text style={styles.lockTitle}>Premium Feature</Text>
            <Text style={styles.lockDesc}>Unlock grammar lessons with Premium</Text>
          </Card>
        )}

        {GRAMMAR_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.level}
            onPress={() => handleLevelPress(level)}
            activeOpacity={level.unlocked ? 0.7 : 1}
          >
            <Card style={{ ...styles.levelCard, ...(!level.unlocked ? styles.lockedCard : {}) }}>
              <View style={styles.levelHeader}>
                <Badge variant={level.unlocked ? 'default' : 'premium'}>{level.level}</Badge>
                {!level.unlocked && <Lock size={16} color="#78716C" />}
              </View>
              <Text style={[styles.levelTitle, !level.unlocked && styles.lockedText]}>
                {level.title}
              </Text>
              {level.unlocked ? (
                <Text style={styles.chapterCount}>{level.chapters} chapters</Text>
              ) : (
                <Text style={styles.lockedLabel}>Coming soon</Text>
              )}
            </Card>
          </TouchableOpacity>
        ))}
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
    gap: 12,
    paddingBottom: 40,
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  subtitle: {
    fontSize: 15,
    color: '#78716C',
  },
  lockBanner: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  lockTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
  },
  lockDesc: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
  },
  levelCard: {
    gap: 8,
  },
  lockedCard: {
    opacity: 0.5,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
  },
  lockedText: {
    color: '#78716C',
  },
  chapterCount: {
    fontSize: 13,
    color: '#78716C',
  },
  lockedLabel: {
    fontSize: 13,
    color: '#A8A29E',
  },
})
