import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Trophy, RotateCcw, Home, Target, TrendingUp, AlertTriangle } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { SpeakingResult, WordResult } from '@/data/speaking/exerciseTypes'

function getExerciseTypeLabel(type: string): string {
  switch (type) {
    case 'read_aloud': return 'Read Aloud'
    case 'translate_speak': return 'Translate & Speak'
    case 'listen_repeat': return 'Listen & Repeat'
    default: return type
  }
}

export default function SpeakingExerciseResultsScreen() {
  const router = useRouter()
  const { results: resultsParam, level, chapter } = useLocalSearchParams<{
    results: string
    level: string
    chapter: string
  }>()
  const [results, setResults] = useState<SpeakingResult[] | null>(null)

  useEffect(() => {
    if (!resultsParam) {
      router.replace('/(tabs)/exercises/speaking')
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
    performanceMessage = "Excellent pronunciation! You're speaking like a native!"
  } else if (percentage >= 70) {
    performanceColor = '#3B82F6'
    performanceMessage = 'Good job! Keep practicing to perfect your speaking.'
  } else if (percentage >= 50) {
    performanceColor = '#EAB308'
    performanceMessage = "You're getting there! Focus on the sentences you missed."
  } else {
    performanceColor = '#EF4444'
    performanceMessage = "Don't give up! Practice makes perfect."
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

        {/* Per-exercise breakdown */}
        {results.map((r, i) => (
          <Card key={i} style={{ ...styles.resultItem, ...(r.correct ? styles.resultItemCorrect : styles.resultItemWrong) }}>
            <View style={styles.resultItemHeader}>
              <Text style={styles.resultItemLabel}>Exercise {i + 1}</Text>
              <View style={styles.resultTypeBadge}>
                <Text style={styles.resultTypeBadgeText}>{getExerciseTypeLabel(r.exercise.type)}</Text>
              </View>
            </View>

            <View style={styles.resultExpectedSection}>
              <Text style={styles.resultSectionLabel}>Expected:</Text>
              <Text style={styles.resultExpectedText}>{r.expectedText}</Text>
            </View>

            <View style={styles.resultTranscriptionSection}>
              <Text style={styles.resultSectionLabel}>You said:</Text>
              <Text style={[styles.resultTranscriptionText, { color: r.correct ? '#22C55E' : '#EF4444' }]}>
                {r.transcription || '(nothing detected)'}
              </Text>
            </View>

            {/* Word diff */}
            {r.wordResults.length > 0 && (
              <View style={styles.wordDiffRow}>
                {r.wordResults.map((wr, j) => (
                  <Text
                    key={j}
                    style={[styles.wordDiffWord, wordColor(wr.status)]}
                  >
                    {wr.word}
                  </Text>
                ))}
              </View>
            )}

            {r.aiFeedback && (
              <Text style={styles.resultAiFeedback}>{r.aiFeedback}</Text>
            )}
          </Card>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button
            variant="outline"
            onPress={() =>
              router.replace({
                pathname: '/(tabs)/exercises/speaking/play',
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

function wordColor(status: WordResult['status']) {
  switch (status) {
    case 'correct': return { color: '#22C55E' }
    case 'incorrect': return { color: '#EF4444' }
    case 'missing': return { color: '#D97706' }
    case 'extra': return { color: '#EF4444', textDecorationLine: 'line-through' as const }
  }
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
    gap: 8,
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
  resultItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  resultTypeBadge: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  resultTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F97316',
  },
  resultExpectedSection: {
    gap: 2,
  },
  resultSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  resultExpectedText: {
    fontSize: 15,
    color: '#292524',
    fontWeight: '500',
  },
  resultTranscriptionSection: {
    gap: 2,
  },
  resultTranscriptionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  wordDiffRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  wordDiffWord: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultAiFeedback: {
    fontSize: 13,
    color: '#78716C',
    lineHeight: 18,
    marginTop: 2,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
})
