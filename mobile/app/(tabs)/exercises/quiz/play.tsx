import { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Send, SkipForward } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getUserVocabulary } from '@/services/vocabulary'
import { getDisplayTranslation, checkAnswer, type QuizSettings, type QuizResult, type UserVocabulary } from '@chingon/shared'

export default function QuizPlayScreen() {
  const router = useRouter()
  const { settings: settingsParam } = useLocalSearchParams<{ settings: string }>()
  const inputRef = useRef<TextInput>(null)

  const [words, setWords] = useState<UserVocabulary[]>([])
  const [settings, setSettings] = useState<QuizSettings | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [results, setResults] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadQuiz = async () => {
      if (!settingsParam) {
        router.replace('/(tabs)/exercises/quiz')
        return
      }

      const parsed: QuizSettings = JSON.parse(settingsParam)
      setSettings(parsed)

      const vocab = await getUserVocabulary()
      let filtered = vocab.filter((v: UserVocabulary) =>
        parsed.difficulty.includes(v.difficulty_rating || 1)
      )

      const shuffled = filtered.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, parsed.wordCount)

      if (selected.length === 0) {
        alert('No vocabulary found matching your criteria.')
        router.replace('/(tabs)/vocabulary')
        return
      }

      setWords(selected)
      setIsLoading(false)
    }

    loadQuiz()
  }, [settingsParam, router])

  useEffect(() => {
    if (!showResult && inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentIndex, showResult])

  const word = words[currentIndex]
  const getQuestion = () => {
    if (!word) return ''
    return settings?.quizType === 'term_to_translation'
      ? word.term
      : getDisplayTranslation(word.translations)
  }

  const getCorrectAnswer = () => {
    if (!word) return ''
    return settings?.quizType === 'term_to_translation'
      ? getDisplayTranslation(word.translations)
      : word.term
  }

  const handleSubmit = () => {
    if (!userAnswer.trim()) return

    const correctAnswer = getCorrectAnswer()
    const correct = checkAnswer(userAnswer, correctAnswer)

    setIsCorrect(correct)
    setShowResult(true)

    setResults(prev => [...prev, { word, correct, userAnswer, correctAnswer }])
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      // Quiz complete — navigate to results
      router.replace({
        pathname: '/(tabs)/exercises/quiz/results',
        params: { results: JSON.stringify({ results: [...results], settings }) },
      })
    }
  }

  const handleSkip = () => {
    setResults(prev => [...prev, { word, correct: false, userAnswer: '(skipped)', correctAnswer: getCorrectAnswer() }])
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      router.replace({
        pathname: '/(tabs)/exercises/quiz/results',
        params: { results: JSON.stringify({ results: [...results, { word, correct: false, userAnswer: '(skipped)', correctAnswer: getCorrectAnswer() }], settings }) },
      })
    }
  }

  if (isLoading || !settings || words.length === 0) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    )
  }

  const progress = ((currentIndex + 1) / words.length) * 100

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#78716C" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.progress}>
            <Text style={styles.progressCurrent}>{currentIndex + 1}</Text>
            <Text style={styles.progressTotal}> / {words.length}</Text>
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        {/* Question Card */}
        <View style={styles.cardSection}>
          <Card style={styles.questionCard}>
            <Text style={styles.questionText}>{getQuestion()}</Text>
            {settings.showContext && word.context_sentence && (
              <Text style={styles.contextText}>{word.context_sentence}</Text>
            )}
            {settings.showTags && word.tags && word.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {word.tags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.diffRow}>
              {[1, 2, 3, 4, 5].map(d => (
                <View
                  key={d}
                  style={[styles.diffDot, d <= (word.difficulty_rating || 1) && styles.diffDotActive]}
                />
              ))}
            </View>
          </Card>
        </View>

        {/* Answer Section */}
        <View style={styles.answerSection}>
          {!showResult ? (
            <>
              <TextInput
                ref={inputRef}
                style={styles.answerInput}
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder={
                  settings.quizType === 'term_to_translation'
                    ? 'Type the translation...'
                    : 'Escribe en español...'
                }
                placeholderTextColor="#78716C"
                autoCorrect={false}
                autoCapitalize="none"
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                  <SkipForward size={16} color="#78716C" />
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
                <Button onPress={handleSubmit} disabled={!userAnswer.trim()} style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Send size={16} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Check</Text>
                  </View>
                </Button>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.resultBox, isCorrect ? styles.resultCorrect : styles.resultWrong]}>
                <Text style={[styles.resultTitle, { color: isCorrect ? '#22C55E' : '#EF4444' }]}>
                  {isCorrect ? 'Correct!' : 'Not quite...'}
                </Text>
                {!isCorrect && (
                  <View style={{ gap: 4 }}>
                    <Text style={styles.resultDetail}>
                      Your answer: <Text style={{ color: '#EF4444' }}>{userAnswer}</Text>
                    </Text>
                    <Text style={styles.resultDetail}>
                      Correct answer: <Text style={{ color: '#22C55E' }}>{getCorrectAnswer()}</Text>
                    </Text>
                  </View>
                )}
              </View>
              <Button onPress={handleNext}>
                {currentIndex < words.length - 1 ? 'Next Word' : 'See Results'}
              </Button>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
  },
  loadingText: {
    fontSize: 16,
    color: '#78716C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 15,
    color: '#78716C',
  },
  progress: {
    fontSize: 16,
  },
  progressCurrent: {
    color: '#F97316',
    fontWeight: '700',
    fontSize: 20,
  },
  progressTotal: {
    color: '#78716C',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E7E5E4',
    borderRadius: 3,
    marginHorizontal: 20,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 3,
  },
  cardSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  questionCard: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  questionText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#292524',
    textAlign: 'center',
  },
  contextText: {
    fontSize: 14,
    color: '#78716C',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    color: '#EA580C',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  diffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E7E5E4',
  },
  diffDotActive: {
    backgroundColor: '#F97316',
  },
  answerSection: {
    padding: 20,
    gap: 12,
  },
  answerInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E7E5E4',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    color: '#292524',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 14,
  },
  skipText: {
    fontSize: 14,
    color: '#78716C',
  },
  resultBox: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  resultCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  resultWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  resultDetail: {
    fontSize: 14,
    color: '#78716C',
  },
})
