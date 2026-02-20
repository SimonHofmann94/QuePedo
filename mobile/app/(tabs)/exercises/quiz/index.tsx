import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Settings } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { FREE_TIER_LIMITS, type QuizSettings } from '@chingon/shared'

export default function QuizSettingsScreen() {
  const router = useRouter()
  const { isPremium, dailyQuizCount, canTakeQuiz, presentPaywall } = useSubscription()
  const [settings, setSettings] = useState<QuizSettings>({
    wordCount: 10,
    difficulty: [1, 2, 3, 4, 5],
    level: ['A1', 'A2', 'B1', 'B2'],
    quizType: 'term_to_translation',
    showContext: true,
    showTags: false,
  })

  const difficulties = [1, 2, 3, 4, 5]
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  const quizzesRemaining = Math.max(0, FREE_TIER_LIMITS.maxDailyQuizzes - dailyQuizCount)

  const toggleDifficulty = (d: number) => {
    setSettings(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(d)
        ? prev.difficulty.filter(x => x !== d)
        : [...prev.difficulty, d],
    }))
  }

  const toggleLevel = (l: string) => {
    setSettings(prev => ({
      ...prev,
      level: prev.level.includes(l)
        ? prev.level.filter(x => x !== l)
        : [...prev.level, l],
    }))
  }

  const handleStartQuiz = async () => {
    const allowed = await canTakeQuiz()
    if (!allowed) {
      Alert.alert(
        'Quiz Limit Reached',
        'You\'ve used all 3 free quizzes for today. Upgrade to Premium for unlimited quizzes!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => presentPaywall() },
        ]
      )
      return
    }

    router.push({
      pathname: '/(tabs)/exercises/quiz/play',
      params: { settings: JSON.stringify(settings) },
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Settings size={28} color="#F97316" />
          <Text style={styles.title}>Quiz Settings</Text>
        </View>

        {/* Quiz limit indicator for free users */}
        {!isPremium && (
          <View style={styles.quizLimitRow}>
            <Text style={styles.quizLimitText}>
              {quizzesRemaining} / {FREE_TIER_LIMITS.maxDailyQuizzes} quizzes remaining today
            </Text>
          </View>
        )}

        <Card>
          {/* Word Count */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Number of Words: <Text style={styles.labelValue}>{settings.wordCount}</Text>
            </Text>
            <View style={styles.wordCountRow}>
              {[5, 10, 15, 20, 25, 50].map(n => (
                <TouchableOpacity
                  key={n}
                  style={[styles.chip, settings.wordCount === n && styles.chipActive]}
                  onPress={() => setSettings(prev => ({ ...prev, wordCount: n }))}
                >
                  <Text style={[styles.chipText, settings.wordCount === n && styles.chipTextActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty */}
          <View style={styles.section}>
            <Text style={styles.label}>Difficulty Level</Text>
            <View style={styles.row}>
              {difficulties.map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.circle, settings.difficulty.includes(d) && styles.circleActive]}
                  onPress={() => toggleDifficulty(d)}
                >
                  <Text style={[styles.circleText, settings.difficulty.includes(d) && styles.circleTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CEFR Level */}
          <View style={styles.section}>
            <Text style={styles.label}>CEFR Level</Text>
            <View style={styles.row}>
              {levels.map(l => (
                <TouchableOpacity
                  key={l}
                  style={[styles.chip, settings.level.includes(l) && styles.chipActive]}
                  onPress={() => toggleLevel(l)}
                >
                  <Text style={[styles.chipText, settings.level.includes(l) && styles.chipTextActive]}>
                    {l}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quiz Direction */}
          <View style={styles.section}>
            <Text style={styles.label}>Quiz Direction</Text>
            <View style={styles.directionRow}>
              <TouchableOpacity
                style={[styles.dirCard, settings.quizType === 'term_to_translation' && styles.dirCardActive]}
                onPress={() => setSettings(prev => ({ ...prev, quizType: 'term_to_translation' }))}
              >
                <Text style={[styles.dirTitle, settings.quizType === 'term_to_translation' && styles.dirTitleActive]}>
                  ES {'\u2192'} DE
                </Text>
                <Text style={styles.dirDesc}>See Spanish, type German</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dirCard, settings.quizType === 'translation_to_term' && styles.dirCardActive]}
                onPress={() => setSettings(prev => ({ ...prev, quizType: 'translation_to_term' }))}
              >
                <Text style={[styles.dirTitle, settings.quizType === 'translation_to_term' && styles.dirTitleActive]}>
                  DE {'\u2192'} ES
                </Text>
                <Text style={styles.dirDesc}>See German, type Spanish</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Options */}
          <View style={styles.section}>
            <Text style={styles.label}>Options</Text>
            <TouchableOpacity
              style={styles.toggle}
              onPress={() => setSettings(prev => ({ ...prev, showContext: !prev.showContext }))}
            >
              <View style={[styles.checkbox, settings.showContext && styles.checkboxActive]} />
              <Text style={styles.toggleText}>Show context sentences as hints</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggle}
              onPress={() => setSettings(prev => ({ ...prev, showTags: !prev.showTags }))}
            >
              <View style={[styles.checkbox, settings.showTags && styles.checkboxActive]} />
              <Text style={styles.toggleText}>Show word tags</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Button onPress={handleStartQuiz} disabled={settings.difficulty.length === 0}>
          Start Quiz
        </Button>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#292524',
  },
  quizLimitRow: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  quizLimitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EA580C',
  },
  section: {
    gap: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#78716C',
  },
  labelValue: {
    color: '#F97316',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  wordCountRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E7E5E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  circleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#78716C',
  },
  circleTextActive: {
    color: '#FFFFFF',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#E7E5E4',
  },
  chipActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#78716C',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  directionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dirCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E7E5E4',
  },
  dirCardActive: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  dirTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292524',
  },
  dirTitleActive: {
    color: '#F97316',
  },
  dirDesc: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 4,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E7E5E4',
  },
  checkboxActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  toggleText: {
    fontSize: 14,
    color: '#292524',
  },
})
