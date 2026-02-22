import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Trophy, RotateCcw, Home, Target, TrendingUp, AlertTriangle } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { GrammarQuestion } from '@/data/grammar/exerciseTypes'

interface GrammarExerciseResult {
  question: GrammarQuestion
  userAnswer: string
  correct: boolean
}

function getQuestionPrompt(q: GrammarQuestion): string {
  switch (q.type) {
    case 'multiple_choice':
      return q.prompt
    case 'fill_in_blank':
      return q.sentenceWithBlank
    case 'sentence_reorder':
      return `Reorder: ${q.shuffledWords.join(' ')}`
    case 'error_correction':
      return q.sentenceWithError
  }
}

function getCorrectAnswer(q: GrammarQuestion): string {
  switch (q.type) {
    case 'multiple_choice':
      return q.correctAnswer
    case 'fill_in_blank':
      return q.correctAnswer
    case 'sentence_reorder':
      return q.correctSentence
    case 'error_correction':
      return `${q.errorWord} → ${q.correctedWord}`
  }
}

export default function GrammarExerciseResultsScreen() {
  const router = useRouter()
  const { results: resultsParam, level, chapter } = useLocalSearchParams<{
    results: string
    level: string
    chapter: string
  }>()
  const [results, setResults] = useState<GrammarExerciseResult[] | null>(null)

  useEffect(() => {
    if (!resultsParam) {
      router.replace('/(tabs)/exercises/grammar')
      return
    }
    setResults(JSON.parse(resultsParam))
  }, [resultsParam, router])

  if (!results) return null

  const correctCount = results.filter((r) => r.correct).length
  const incorrectCount = results.filter((r) => !r.correct).length
  const totalCount = results.length
  const percentage = Math.round((correctCount / totalCount) * 100)

  let performanceColor: string
  let performanceMessage: string

  if (percentage >= 90) {
    performanceColor = '#22C55E'
    performanceMessage = "Excellent work! You've mastered this chapter!"
  } else if (percentage >= 70) {
    performanceColor = '#3B82F6'
    performanceMessage = 'Good job! Keep practicing to perfect your skills.'
  } else if (percentage >= 50) {
    performanceColor = '#EAB308'
    performanceMessage = "You're getting there! Focus on the questions you missed."
  } else {
    performanceColor = '#EF4444'
    performanceMessage = "Don't give up! Review the chapter and try again."
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.trophyCircle}>
            <Trophy size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Exercise Complete!</Text>
        </View>

        {/* Score Card */}
        <Card style={styles.scoreCard}>
          <Text style={[styles.percentage, { color: performanceColor }]}>{percentage}%</Text>
          <Text style={styles.scoreSubtext}>
            {correctCount} of {totalCount} correct
          </Text>
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

        {/* Per-question breakdown */}
        {results.map((r, i) => (
          <Card key={i} style={{ ...styles.resultItem, ...(r.correct ? styles.resultItemCorrect : styles.resultItemWrong) }}>
            <Text style={styles.resultItemLabel}>Question {i + 1}</Text>
            <Text style={styles.resultItemPrompt}>{getQuestionPrompt(r.question)}</Text>
            <Text style={[styles.resultItemAnswer, { color: r.correct ? '#22C55E' : '#EF4444' }]}>
              Your answer: {r.userAnswer || '(empty)'}
            </Text>
            {!r.correct && (
              <Text style={styles.resultItemCorrectAnswer}>
                Correct: {getCorrectAnswer(r.question)}
              </Text>
            )}
          </Card>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button
            variant="outline"
            onPress={() =>
              router.replace({
                pathname: '/(tabs)/exercises/grammar/play',
                params: { level: level || '', chapter: chapter || '' },
              })
            }
            style={{ flex: 1 }}
          >
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
  resultItem: {
    gap: 4,
    borderWidth: 1,
  },
  resultItemCorrect: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  resultItemWrong: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  resultItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  resultItemPrompt: {
    fontSize: 15,
    color: '#292524',
    fontWeight: '500',
  },
  resultItemAnswer: {
    fontSize: 14,
  },
  resultItemCorrectAnswer: {
    fontSize: 14,
    color: '#22C55E',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
})
