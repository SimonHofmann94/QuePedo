import { useState, useRef } from 'react'
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
import { ArrowLeft } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { checkAnswer, normalizeAnswer, getChapterExercises } from '@chingon/shared'
import type {
  GrammarQuestion,
  MultipleChoiceQuestion,
  FillInBlankQuestion,
  SentenceReorderQuestion,
  ErrorCorrectionQuestion,
} from '@chingon/shared'

interface ExerciseResult {
  question: GrammarQuestion
  userAnswer: string
  correct: boolean
}

export default function GrammarExercisePlayScreen() {
  const router = useRouter()
  const { level, chapter: chapterParam } = useLocalSearchParams<{ level: string; chapter: string }>()
  const inputRef = useRef<TextInput>(null)
  const chapterId = parseInt(chapterParam || '0', 10)

  const [questions, setQuestions] = useState<GrammarQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sentence reorder state
  const [placedWords, setPlacedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>([])

  // Error correction state
  const [selectedErrorWord, setSelectedErrorWord] = useState<string | null>(null)
  const [correctionInput, setCorrectionInput] = useState('')

  // Load exercises synchronously from baked JSON in @chingon/shared.
  // No async / no edge function on first open — that path now lives in
  // a future "Generar nuevos" button (Phase 2).
  const [initialized, setInitialized] = useState(false)
  if (!initialized) {
    setInitialized(true)
    const exercises = getChapterExercises(level || 'a1', chapterId) ?? []
    if (exercises.length === 0) {
      setError('No exercises available for this chapter yet.')
    } else {
      setQuestions(exercises.slice(0, 8))
      if (exercises[0].type === 'sentence_reorder') {
        setAvailableWords([...exercises[0].shuffledWords])
        setPlacedWords([])
      }
    }
    setLoading(false)
  }

  const question = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0

  const handleCheckAnswer = () => {
    if (!question) return

    let correct = false
    let answer = ''

    switch (question.type) {
      case 'multiple_choice': {
        answer = selectedOption || ''
        correct = answer === question.correctAnswer
        break
      }
      case 'fill_in_blank': {
        answer = userAnswer.trim()
        correct = checkAnswer(answer, question.correctAnswer)
        if (!correct && question.acceptableAnswers) {
          correct = question.acceptableAnswers.some((a) => checkAnswer(answer, a))
        }
        break
      }
      case 'sentence_reorder': {
        answer = placedWords.join(' ')
        const normalizedPlaced = normalizeAnswer(answer)
        const normalizedCorrect = normalizeAnswer(question.correctSentence)
        correct = normalizedPlaced === normalizedCorrect
        break
      }
      case 'error_correction': {
        answer = `${selectedErrorWord} → ${correctionInput.trim()}`
        const wordCorrect = selectedErrorWord === question.errorWord
        let correctionCorrect = checkAnswer(correctionInput.trim(), question.correctedWord)
        if (!correctionCorrect && question.acceptableCorrections) {
          correctionCorrect = question.acceptableCorrections.some((a) => checkAnswer(correctionInput.trim(), a))
        }
        correct = wordCorrect && correctionCorrect
        break
      }
    }

    setIsCorrect(correct)
    setShowFeedback(true)
    setResults((prev) => [...prev, { question, userAnswer: answer, correct }])
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1
      const nextQuestion = questions[nextIndex]
      setCurrentIndex(nextIndex)
      setSelectedOption(null)
      setUserAnswer('')
      setShowFeedback(false)
      setSelectedErrorWord(null)
      setCorrectionInput('')

      if (nextQuestion?.type === 'sentence_reorder') {
        setAvailableWords([...nextQuestion.shuffledWords])
        setPlacedWords([])
      } else {
        setAvailableWords([])
        setPlacedWords([])
      }
    } else {
      // Navigate to results
      router.replace({
        pathname: '/(tabs)/exercises/grammar/results',
        params: {
          results: JSON.stringify([...results]),
          level: level || '',
          chapter: chapterParam || '',
        },
      })
    }
  }

  const canCheck = (): boolean => {
    if (!question) return false
    switch (question.type) {
      case 'multiple_choice':
        return !!selectedOption
      case 'fill_in_blank':
        return !!userAnswer.trim()
      case 'sentence_reorder':
        return placedWords.length === question.shuffledWords.length
      case 'error_correction':
        return !!selectedErrorWord && !!correctionInput.trim()
    }
  }

  const getCorrectAnswerDisplay = (): string => {
    if (!question) return ''
    switch (question.type) {
      case 'multiple_choice':
        return question.correctAnswer
      case 'fill_in_blank':
        return question.correctAnswer
      case 'sentence_reorder':
        return question.correctSentence
      case 'error_correction':
        return `${question.errorWord} → ${question.correctedWord}`
    }
  }

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F97316" />
          <Text style={styles.loadingText}>Generating exercises...</Text>
          <Text style={styles.loadingSubtext}>This may take a moment on first load</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Error state
  if (error || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#292524" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.errorTitle}>
            {error || 'No exercises available for this chapter.'}
          </Text>
          <Button onPress={() => router.back()}>Volver</Button>
        </View>
      </SafeAreaView>
    )
  }

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
          {question?.type === 'multiple_choice' && (
            <MultipleChoiceView
              question={question}
              selectedOption={selectedOption}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onSelectOption={setSelectedOption}
            />
          )}

          {question?.type === 'fill_in_blank' && (
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

          {question?.type === 'sentence_reorder' && (
            <SentenceReorderView
              question={question}
              placedWords={placedWords}
              availableWords={availableWords}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onPlaceWord={(word, index) => {
                const newAvailable = [...availableWords]
                newAvailable.splice(index, 1)
                setAvailableWords(newAvailable)
                setPlacedWords([...placedWords, word])
              }}
              onRemoveWord={(word, index) => {
                const newPlaced = [...placedWords]
                newPlaced.splice(index, 1)
                setPlacedWords(newPlaced)
                setAvailableWords([...availableWords, word])
              }}
            />
          )}

          {question?.type === 'error_correction' && (
            <ErrorCorrectionView
              question={question}
              selectedErrorWord={selectedErrorWord}
              correctionInput={correctionInput}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onSelectWord={setSelectedErrorWord}
              onChangeCorrection={setCorrectionInput}
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
                  Correct answer:{' '}
                  <Text style={{ color: '#22C55E', fontWeight: '600' }}>{getCorrectAnswerDisplay()}</Text>
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
            <Button onPress={handleCheckAnswer} disabled={!canCheck()}>
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

// ── Multiple Choice View ──────────────────────────────────────────

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

// ── Fill in Blank View ────────────────────────────────────────────

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

// ── Sentence Reorder View ─────────────────────────────────────────

function SentenceReorderView({
  question,
  placedWords,
  availableWords,
  showFeedback,
  isCorrect,
  onPlaceWord,
  onRemoveWord,
}: {
  question: SentenceReorderQuestion
  placedWords: string[]
  availableWords: string[]
  showFeedback: boolean
  isCorrect: boolean
  onPlaceWord: (word: string, index: number) => void
  onRemoveWord: (word: string, index: number) => void
}) {
  return (
    <View style={styles.questionContent}>
      <Text style={styles.questionPrompt}>Arrange the words into the correct sentence:</Text>

      {question.hint && !showFeedback && (
        <Text style={styles.hintText}>Hint: {question.hint}</Text>
      )}

      {/* Answer area */}
      <View
        style={[
          styles.reorderAnswerArea,
          showFeedback && isCorrect && styles.reorderAreaCorrect,
          showFeedback && !isCorrect && styles.reorderAreaWrong,
        ]}
      >
        {placedWords.length === 0 ? (
          <Text style={styles.reorderPlaceholder}>Tap words below to build the sentence</Text>
        ) : (
          <View style={styles.wordChipRow}>
            {placedWords.map((word, i) => (
              <TouchableOpacity
                key={`placed-${i}`}
                style={[styles.wordChip, styles.wordChipPlaced]}
                onPress={() => !showFeedback && onRemoveWord(word, i)}
                disabled={showFeedback}
                activeOpacity={0.7}
              >
                <Text style={styles.wordChipPlacedText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Word pool */}
      <View style={styles.wordChipRow}>
        {availableWords.map((word, i) => (
          <TouchableOpacity
            key={`available-${i}`}
            style={styles.wordChip}
            onPress={() => !showFeedback && onPlaceWord(word, i)}
            disabled={showFeedback}
            activeOpacity={0.7}
          >
            <Text style={styles.wordChipText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

// ── Error Correction View ─────────────────────────────────────────

function ErrorCorrectionView({
  question,
  selectedErrorWord,
  correctionInput,
  showFeedback,
  isCorrect,
  onSelectWord,
  onChangeCorrection,
  onSubmit,
}: {
  question: ErrorCorrectionQuestion
  selectedErrorWord: string | null
  correctionInput: string
  showFeedback: boolean
  isCorrect: boolean
  onSelectWord: (word: string) => void
  onChangeCorrection: (text: string) => void
  onSubmit: () => void
}) {
  const words = question.sentenceWithError.split(/\s+/)

  return (
    <View style={styles.questionContent}>
      <Text style={styles.questionPrompt}>Find the error and correct it:</Text>

      {/* Sentence with tappable words */}
      <View style={styles.errorSentenceContainer}>
        <View style={styles.wordChipRow}>
          {words.map((word, i) => {
            let chipStyle = styles.wordChip
            if (showFeedback) {
              if (word === question.errorWord) {
                chipStyle = { ...styles.wordChip, ...styles.wordChipError }
              }
            } else if (word === selectedErrorWord) {
              chipStyle = { ...styles.wordChip, ...styles.wordChipSelected }
            }

            return (
              <TouchableOpacity
                key={i}
                style={chipStyle}
                onPress={() => !showFeedback && onSelectWord(word)}
                disabled={showFeedback}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.wordChipText,
                    !showFeedback && word === selectedErrorWord && styles.wordChipSelectedText,
                    showFeedback && word === question.errorWord && styles.wordChipErrorText,
                  ]}
                >
                  {word}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Correction input */}
      {selectedErrorWord && (
        <View style={styles.correctionSection}>
          <Text style={styles.correctionLabel}>
            Replace "<Text style={{ color: '#F97316', fontWeight: '600' }}>{selectedErrorWord}</Text>" with:
          </Text>
          <TextInput
            style={[
              styles.answerInput,
              showFeedback && isCorrect && styles.answerInputCorrect,
              showFeedback && !isCorrect && styles.answerInputWrong,
            ]}
            value={correctionInput}
            onChangeText={onChangeCorrection}
            placeholder="Type the correction..."
            placeholderTextColor="#78716C"
            autoCorrect={false}
            autoCapitalize="none"
            editable={!showFeedback}
            onSubmitEditing={onSubmit}
            returnKeyType="done"
          />
        </View>
      )}
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#78716C',
  },
  errorContainer: {
    padding: 20,
    gap: 16,
  },
  errorTitle: {
    fontSize: 16,
    color: '#EF4444',
    marginTop: 20,
    lineHeight: 22,
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
  // Multiple choice
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
  // Fill in blank
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
  // Sentence reorder
  reorderAnswerArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E7E5E4',
    borderRadius: 14,
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  reorderAreaCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  reorderAreaWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  reorderPlaceholder: {
    fontSize: 15,
    color: '#A8A29E',
    textAlign: 'center',
  },
  wordChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  wordChipPlaced: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F97316',
  },
  wordChipPlacedText: {
    fontSize: 15,
    color: '#F97316',
    fontWeight: '600',
  },
  wordChipText: {
    fontSize: 15,
    color: '#292524',
  },
  wordChipSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F97316',
    borderWidth: 2,
  },
  wordChipSelectedText: {
    color: '#F97316',
    fontWeight: '600',
  },
  wordChipError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  wordChipErrorText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  // Error correction
  errorSentenceContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 14,
    padding: 16,
  },
  correctionSection: {
    gap: 8,
  },
  correctionLabel: {
    fontSize: 15,
    color: '#292524',
  },
  // Feedback
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
})
