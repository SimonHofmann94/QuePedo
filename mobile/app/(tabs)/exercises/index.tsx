import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { BrainCircuit, PenTool, Mic, Headphones, BookOpen, Gamepad2, Lock } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useSubscription } from '@/contexts/SubscriptionContext'

export default function ExercisesScreen() {
  const router = useRouter()
  const { isPremium, presentPaywall } = useSubscription()

  const exercises = [
    { title: 'Vocabulary Quiz', desc: 'Test your knowledge with flashcards.', icon: BrainCircuit, badge: 'Practice', locked: false, onPress: () => router.push('/(tabs)/exercises/quiz') },
    { title: 'Writing Exercise', desc: 'Practice writing with AI feedback.', icon: PenTool, badge: 'AI Feedback', locked: !isPremium, onPress: () => {} },
    { title: 'Speaking Exercise', desc: 'Improve pronunciation.', icon: Mic, badge: 'Interactive', locked: !isPremium, onPress: () => {} },
    { title: 'Listening Exercise', desc: 'Train your ear with audio.', icon: Headphones, badge: 'Audio', locked: !isPremium, onPress: () => {} },
    { title: 'Grammar Exercise', desc: 'Master grammar rules.', icon: BookOpen, badge: 'Core', locked: !isPremium, onPress: () => {} },
    { title: 'Games', desc: 'Learn while having fun.', icon: Gamepad2, badge: 'Fun', locked: !isPremium, onPress: () => {} },
  ]

  const handlePress = (exercise: typeof exercises[number]) => {
    if (exercise.locked) {
      presentPaywall()
    } else {
      exercise.onPress()
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Exercises</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {exercises.map((ex, i) => (
          <TouchableOpacity key={i} onPress={() => handlePress(ex)} activeOpacity={0.7}>
            <Card style={styles.card}>
              {ex.locked && (
                <View style={styles.lockOverlay}>
                  <Lock size={24} color="#D97706" />
                  <Text style={styles.lockText}>Premium</Text>
                </View>
              )}
              <View style={[ex.locked && styles.lockedContent]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, ex.locked && styles.iconBoxLocked]}>
                    <ex.icon size={26} color="#FFFFFF" />
                  </View>
                  {ex.locked ? (
                    <Badge variant="premium">Premium</Badge>
                  ) : (
                    <Badge>{ex.badge}</Badge>
                  )}
                </View>
                <Text style={styles.cardTitle}>{ex.title}</Text>
                <Text style={styles.cardDesc}>{ex.desc}</Text>
              </View>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  grid: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    gap: 10,
    overflow: 'hidden',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    gap: 4,
  },
  lockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  lockedContent: {
    opacity: 0.4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxLocked: {
    backgroundColor: '#A8A29E',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#292524',
  },
  cardDesc: {
    fontSize: 13,
    color: '#78716C',
  },
})
