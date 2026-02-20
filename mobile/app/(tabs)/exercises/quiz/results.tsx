import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Trophy, RotateCcw, Home, Target, TrendingUp, AlertTriangle } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getDisplayTranslation, type QuizResult, type UserVocabulary } from '@chingon/shared'

export default function QuizResultsScreen() {
  const router = useRouter()
  const { results: resultsParam } = useLocalSearchParams<{ results: string }>()
  const [quizData, setQuizData] = useState<{ results: QuizResult[]; settings: any } | null>(null)

  useEffect(() => {
    if (!resultsParam) {
      router.replace('/(tabs)/exercises/quiz')
      return
    }
    setQuizData(JSON.parse(resultsParam))
  }, [resultsParam, router])

  if (!quizData) return null

  const { results } = quizData
  const correctCount = results.filter(r => r.correct).length
  const incorrectCount = results.filter(r => !r.correct).length
  const totalCount = results.length
  const percentage = Math.round((correctCount / totalCount) * 100)

  const incorrectWords = results.filter(r => !r.correct).map(r => r.word)

  let performanceColor: string
  let performanceMessage: string

  if (percentage >= 90) {
    performanceColor = '#22C55E'
    performanceMessage = "Excellent work! You're mastering these words!"
  } else if (percentage >= 70) {
    performanceColor = '#3B82F6'
    performanceMessage = 'Good job! Keep practicing to perfect your skills.'
  } else if (percentage >= 50) {
    performanceColor = '#EAB308'
    performanceMessage = "You're getting there! Focus on the words you missed."
  } else {
    performanceColor = '#EF4444'
    performanceMessage = "Don't give up! Review these words and try again."
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.trophyCircle}>
            <Trophy size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Quiz Complete!</Text>
        </View>

        {/* Score Card */}
        <Card style={styles.scoreCard}>
          <Text style={[styles.percentage, { color: performanceColor }]}>{percentage}%</Text>
          <Text style={styles.scoreSubtext}>{correctCount} of {totalCount} correct</Text>
          <Text style={[styles.message, { color: performanceColor }]}>{performanceMessage}</Text>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.miniStat}>
            <Target size={22} color="#3B82F6" />
            <Text style={styles.miniStatValue}>{totalCount}</Text>
            <Text style={styles.miniStatLabel}>Total</Text>
          </Card>
          <Card style={styles.miniStat}>
            <TrendingUp size={22} color="#22C55E" />
            <Text style={[styles.miniStatValue, { color: '#22C55E' }]}>{correctCount}</Text>
            <Text style={styles.miniStatLabel}>Correct</Text>
          </Card>
          <Card style={styles.miniStat}>
            <AlertTriangle size={22} color="#EF4444" />
            <Text style={[styles.miniStatValue, { color: '#EF4444' }]}>{incorrectCount}</Text>
            <Text style={styles.miniStatLabel}>Review</Text>
          </Card>
        </View>

        {/* Words to Review */}
        {incorrectWords.length > 0 && (
          <Card>
            <View style={styles.reviewHeader}>
              <AlertTriangle size={18} color="#EF4444" />
              <Text style={styles.reviewTitle}>Words to Review</Text>
            </View>
            {incorrectWords.map((word, i) => (
              <View key={i} style={styles.reviewRow}>
                <View style={styles.reviewMain}>
                  <Text style={styles.reviewTerm}>{word.term}</Text>
                  <Text style={styles.reviewTranslation}>{getDisplayTranslation(word.translations)}</Text>
                </View>
                <View style={styles.diffRow}>
                  {[1, 2, 3, 4, 5].map(d => (
                    <View
                      key={d}
                      style={[styles.diffDot, d <= (word.difficulty_rating || 1) && styles.diffDotActive]}
                    />
                  ))}
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button variant="outline" onPress={() => router.replace('/(tabs)/exercises/quiz')} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <RotateCcw size={18} color="#292524" />
              <Text style={{ color: '#292524', fontWeight: '600', fontSize: 15 }}>Try Again</Text>
            </View>
          </Button>
          <Button onPress={() => router.replace('/(tabs)/exercises')} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Home size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>Exercises</Text>
            </View>
          </Button>
        </View>
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
  headerSection: {
    alignItems: 'center',
    gap: 12,
  },
  trophyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  scoreCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 28,
  },
  percentage: {
    fontSize: 60,
    fontWeight: '700',
  },
  scoreSubtext: {
    fontSize: 15,
    color: '#78716C',
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  miniStatValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
  },
  miniStatLabel: {
    fontSize: 11,
    color: '#78716C',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292524',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
  },
  reviewMain: {
    gap: 2,
  },
  reviewTerm: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F97316',
  },
  reviewTranslation: {
    fontSize: 13,
    color: '#78716C',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 3,
  },
  diffDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E7E5E4',
  },
  diffDotActive: {
    backgroundColor: '#F97316',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
})
