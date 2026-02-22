import { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Lock, Sparkles } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getChapterExercises } from '@/data/grammar/exercises'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { checkAnswer } from '@chingon/shared'
import type {
  GrammarQuestion,
  MultipleChoiceQuestion,
  FillInBlankQuestion,
  GrammarTestResult,
} from '@/data/grammar/exerciseTypes'
import {
  GrammarAIError,
  generateGrammarQuestions,
  getGrammarAIRemaining,
} from '@/services/grammarTest'

export default function GrammarTestScreen() {
  const router = useRouter()
  const { level, chapter: chapterParam } = useLocalSearchParams<{ level: string; chapter: string }>()
  const inputRef = useRef<TextInput>(null)

  const { isPremium, presentPaywall } = useSubscription()

  const chapterId = parseInt(chapterParam || '0', 10)
  const hardcodedExercises = getChapterExercises(level || '', chapterId)

  const [questions, setQuestions] = useState<GrammarQuestion[]>(hardcodedExercises || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [results, setResults] = useState<GrammarTestResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiRemaining, setAiRemaining] = useState<number | null>(null)
  const [hardcodedCount] = useState(hardcodedExercises?.length || 0)

  // Load AI remaining count when results screen appears
  useEffect(() => {
    if (showResults && isPremium) {
      loadAIRemaining()
    }
  }, [showResults, isPremium])

  const question = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0

  const handleCheckAnswer = () => {
    if (!question) return

    let correct = false
    let answer = ''

    if (question.type === 'multiple_choice') {
      answer = selectedOption || ''
      correct = answer === question.correctAnswer
    } else if (question.type === 'fill_in_blank') {
      answer = userAnswer.trim()
      correct = checkAnswer(answer, question.correctAnswer)
      if (!correct && question.acceptableAnswers) {
        correct = question.acceptableAnswers.some((a: string) => checkAnswer(answer, a))
      }
    }

    setIsCorrect(correct)
    setShowFeedback(true)
    setResults((prev) => [...prev, { question, userAnswer: answer, correct }])
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setUserAnswer('')
      setShowFeedback(false)
    } else {
      setShowFeedback(false)
      setShowResults(true)
    }
  }

  const correctCount = results.filter((r) => r.correct).length

  const handleGenerateAI = async () => {
    setAiError(null)
    setAiLoading(true)

    try {
      const newQuestions = await generateGrammarQuestions(level || '', chapterId, 3)
      setQuestions((prev) => [...prev, ...newQuestions])
      setShowResults(false)
      setCurrentIndex(results.length)
      setSelectedOption(null)
      setUserAnswer('')

      // Refresh remaining count
      try {
        const remaining = await getGrammarAIRemaining()
        setAiRemaining(remaining)
      } catch {}
    } catch (e) {
      if (e instanceof GrammarAIError) {
        switch (e.code) {
          case 'DAILY_LIMIT':
            setAiError('You\'ve reached your daily limit of 3 AI-generated grammar tests.')
            break
          case 'NOT_PREMIUM':
            setAiError('AI questions are available for premium users only.')
            break
          case 'NETWORK_ERROR':
            setAiError('Could not reach the server. Check your connection.')
            break
          default:
            setAiError(e.message)
        }
      } else {
        setAiError('Something went wrong. Please try again.')
      }
    } finally {
      setAiLoading(false)
    }
  }

  const loadAIRemaining = async () => {
    try {
      const remaining = await getGrammarAIRemaining()
      setAiRemaining(remaining)
    } catch {}
  }

  if (!hardcodedExercises || hardcodedExercises.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyState}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#292524" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.emptyTitle}>No exercises yet</Text>
          <Text style={styles.emptySubtext}>Exercises for this chapter are coming soon.</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Results screen
  if (showResults) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.resultsScroll}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#292524" />
            <Text style={styles.backText}>Back to Lesson</Text>
          </TouchableOpacity>

          <Card style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Test Results</Text>
            <Text style={styles.resultsScore}>
              {correctCount} / {results.length}
            </Text>
            <Text style={styles.resultsSubtext}>
              {correctCount === results.length
                ? 'Perfect score!'
                : correctCount >= results.length / 2
                  ? 'Good job! Keep practicing.'
                  : 'Keep studying — you\'ll get there!'}
            </Text>
          </Card>

          {/* Result breakdown */}
          {results.map((r, i) => (
            <Card key={i} style={{ ...styles.resultItem, ...(r.correct ? styles.resultItemCorrect : styles.resultItemWrong) }}>
              <Text style={styles.resultItemLabel}>Question {i + 1}</Text>
              <Text style={styles.resultItemPrompt}>
                {r.question.type === 'multiple_choice' ? r.question.prompt : r.question.type === 'fill_in_blank' ? r.question.sentenceWithBlank : ''}
              </Text>
              <Text style={[styles.resultItemAnswer, { color: r.correct ? '#22C55E' : '#EF4444' }]}>
                Your answer: {r.userAnswer || '(empty)'}
              </Text>
              {!r.correct && (
                <Text style={styles.resultItemCorrectAnswer}>
                  Correct: {'correctAnswer' in r.question ? r.question.correctAnswer : ''}
                </Text>
              )}
            </Card>
          ))}

          {/* AI section */}
          <View style={styles.aiSection}>
            {isPremium ? (
              <>
                <Button
                  onPress={handleGenerateAI}
                  loading={aiLoading}
                  disabled={aiLoading || aiRemaining === 0}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={18} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
                      Generate More Questions
                    </Text>
                  </View>
                </Button>
                {aiRemaining !== null && (
                  <Text style={styles.aiRemainingText}>
                    {aiRemaining} AI generation{aiRemaining !== 1 ? 's' : ''} remaining today
                  </Text>
                )}
                {aiError && <Text style={styles.aiErrorText}>{aiError}</Text>}
              </>
            ) : (
              <Card style={styles.upgradeCard}>
                <Lock size={24} color="#F97316" />
                <Text style={styles.upgradeTitle}>Want more practice?</Text>
                <Text style={styles.upgradeSubtext}>
                  Upgrade to Premium for AI-generated questions tailored to each chapter.
                </Text>
                <Button onPress={presentPaywall}>Upgrade</Button>
              </Card>
            )}
          </View>

          <Button variant="outline" onPress={() => router.back()}>
            Back to Lesson
          </Button>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // Question play screen
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#78716C" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.progressCount}>
            <Text style={styles.progressCurrent}>{currentIndex + 1}</Text>
            <Text style={styles.progressTotal}> / {totalQuestions}</Text>
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.questionScroll} keyboardShouldPersistTaps="handled">
          {question && question.type === 'multiple_choice' && (
            <MultipleChoiceView
              question={question}
              selectedOption={selectedOption}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onSelectOption={setSelectedOption}
            />
          )}

          {question && question.type === 'fill_in_blank' && (
            <FillInBlankView
              question={question}
              userAnswer={userAnswer}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onChangeAnswer={setUserAnswer}
              inputRef={inputRef}
              onSubmit={handleCheckAnswer}
            />
          )}

          {/* Feedback */}
          {showFeedback && question && (
            <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
              <Text style={[styles.feedbackTitle, { color: isCorrect ? '#22C55E' : '#EF4444' }]}>
                {isCorrect ? 'Correct!' : 'Not quite...'}
              </Text>
              {!isCorrect && (
                <Text style={styles.feedbackDetail}>
                  Correct answer: <Text style={{ color: '#22C55E', fontWeight: '600' }}>{'correctAnswer' in question ? question.correctAnswer : ''}</Text>
                </Text>
              )}
              {question.explanation && (
                <Text style={styles.feedbackExplanation}>{question.explanation}</Text>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom action */}
        <View style={styles.bottomAction}>
          {!showFeedback ? (
            <Button
              onPress={handleCheckAnswer}
              disabled={
                (question?.type === 'multiple_choice' && !selectedOption) ||
                (question?.type === 'fill_in_blank' && !userAnswer.trim())
              }
            >
              Check
            </Button>
          ) : (
            <Button onPress={handleNext}>
              {currentIndex < totalQuestions - 1 ? 'Next' : 'See Results'}
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function MultipleChoiceView({
  question,
  selectedOption,
  showFeedback,
  isCorrect,
  onSelectOption,
}: {
  question: MultipleChoiceQuestion
  selectedOption: string | null
  showFeedback: boolean
  isCorrect: boolean
  onSelectOption: (option: string) => void
}) {
  return (
    <View style={styles.questionContent}>
      <Text style={styles.questionPrompt}>{question.prompt}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option, i) => {
          let optionStyle = styles.optionDefault
          if (showFeedback) {
            if (option === question.correctAnswer) {
              optionStyle = styles.optionCorrect
            } else if (option === selectedOption && !isCorrect) {
              optionStyle = styles.optionWrong
            }
          } else if (option === selectedOption) {
            optionStyle = styles.optionSelected
          }

          return (
            <TouchableOpacity
              key={i}
              style={[styles.optionBtn, optionStyle]}
              onPress={() => !showFeedback && onSelectOption(option)}
              disabled={showFeedback}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  showFeedback && option === question.correctAnswer && styles.optionTextCorrect,
                  showFeedback && option === selectedOption && !isCorrect && option !== question.correctAnswer && styles.optionTextWrong,
                  !showFeedback && option === selectedOption && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

function FillInBlankView({
  question,
  userAnswer,
  showFeedback,
  isCorrect,
  onChangeAnswer,
  inputRef,
  onSubmit,
}: {
  question: FillInBlankQuestion
  userAnswer: string
  showFeedback: boolean
  isCorrect: boolean
  onChangeAnswer: (text: string) => void
  inputRef: React.RefObject<TextInput | null>
  onSubmit: () => void
}) {
  const parts = question.sentenceWithBlank.split('___')

  return (
    <View style={styles.questionContent}>
      <View style={styles.fillSentence}>
        <Text style={styles.fillSentenceText}>
          {parts[0]}
          <Text style={styles.fillBlank}>{'_____'}</Text>
          {parts[1] || ''}
        </Text>
      </View>
      {question.hint && !showFeedback && (
        <Text style={styles.hintText}>Hint: {question.hint}</Text>
      )}
      <TextInput
        ref={inputRef}
        style={[
          styles.answerInput,
          showFeedback && isCorrect && styles.answerInputCorrect,
          showFeedback && !isCorrect && styles.answerInputWrong,
        ]}
        value={userAnswer}
        onChangeText={onChangeAnswer}
        placeholder="Type your answer..."
        placeholderTextColor="#78716C"
        autoCorrect={false}
        autoCapitalize="none"
        editable={!showFeedback}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
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
  progressCount: {
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
  questionScroll: {
    padding: 20,
    paddingBottom: 8,
    flexGrow: 1,
  },
  questionContent: {
    gap: 20,
    marginTop: 12,
  },
  questionPrompt: {
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionBtn: {
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionDefault: {
    borderColor: '#E7E5E4',
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  optionCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  optionWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionText: {
    fontSize: 16,
    color: '#292524',
  },
  optionTextSelected: {
    color: '#F97316',
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#22C55E',
    fontWeight: '600',
  },
  optionTextWrong: {
    color: '#EF4444',
    fontWeight: '600',
  },
  fillSentence: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 14,
    padding: 20,
  },
  fillSentenceText: {
    fontSize: 18,
    color: '#292524',
    lineHeight: 28,
  },
  fillBlank: {
    color: '#F97316',
    fontWeight: '700',
  },
  hintText: {
    fontSize: 14,
    color: '#78716C',
    fontStyle: 'italic',
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
  answerInputCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  answerInputWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  feedbackBox: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    marginTop: 16,
  },
  feedbackCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  feedbackWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  feedbackDetail: {
    fontSize: 14,
    color: '#78716C',
  },
  feedbackExplanation: {
    fontSize: 14,
    color: '#292524',
    marginTop: 4,
    lineHeight: 20,
  },
  bottomAction: {
    padding: 20,
    paddingBottom: 12,
  },
  // Results
  resultsScroll: {
    padding: 20,
    gap: 12,
    paddingBottom: 40,
  },
  resultsCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#78716C',
  },
  resultsScore: {
    fontSize: 48,
    fontWeight: '800',
    color: '#292524',
  },
  resultsSubtext: {
    fontSize: 16,
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
  // AI section
  aiSection: {
    gap: 8,
    marginTop: 4,
  },
  aiRemainingText: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
  },
  aiErrorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  upgradeCard: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
  },
  upgradeSubtext: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Empty state
  emptyState: {
    padding: 20,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#292524',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#78716C',
  },
})
