import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Mic, MicOff, Volume2, Eye } from 'lucide-react-native'
import * as Speech from 'expo-speech'
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from '@jamsch/expo-speech-recognition'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  getSpeakingExercises,
  evaluateSpeaking,
  compareTexts,
  SpeakingExerciseError,
} from '@/services/speakingExercise'
import type {
  SpeakingExercise,
  SpeakingResult,
  ReadAloudExercise,
  TranslateSpeakExercise,
  ListenRepeatExercise,
  WordResult,
} from '@/data/speaking/exerciseTypes'
import { grammarA1 } from '@chingon/shared'
import { grammarA2 } from '@chingon/shared'
import { grammarB1 } from '@chingon/shared'
import { grammarB2 } from '@chingon/shared'
import { grammarC1 } from '@chingon/shared'
import { grammarC2 } from '@chingon/shared'

const LEVEL_DATA: Record<string, typeof grammarA1> = {
  a1: grammarA1, a2: grammarA2, b1: grammarB1,
  b2: grammarB2, c1: grammarC1, c2: grammarC2,
}

export default function SpeakingExercisePlayScreen() {
  const router = useRouter()
  const { level, chapter: chapterParam } = useLocalSearchParams<{ level: string; chapter: string }>()
  const chapterId = parseInt(chapterParam || '0', 10)
  const chapterTitle = LEVEL_DATA[level?.toLowerCase() || 'a1']?.chapters.find((c) => c.id === chapterId)?.title || ''

  const [exercises, setExercises] = useState<SpeakingExercise[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<SpeakingResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [partialTranscription, setPartialTranscription] = useState('')

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false)
  const [wordResults, setWordResults] = useState<WordResult[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<{ feedback: string; corrections: any[]; tip: string } | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  // Listen & Repeat state
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasListened, setHasListened] = useState(false)
  const [showSpanishText, setShowSpanishText] = useState(false)

  // Pulse animation for recording
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Speech recognition events
  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript || ''
    if (event.isFinal) {
      setTranscription(transcript)
      setPartialTranscription('')
      setIsRecording(false)
      ExpoSpeechRecognitionModule.stop()
    } else {
      setPartialTranscription(transcript)
    }
  })

  useSpeechRecognitionEvent('end', () => {
    setIsRecording(false)
  })

  useSpeechRecognitionEvent('error', (event) => {
    console.error('[STT Error]', event.error, event.message)
    setIsRecording(false)
    // If we got partial results, use them
    if (partialTranscription) {
      setTranscription(partialTranscription)
      setPartialTranscription('')
    }
  })

  // Load exercises
  const [loaded, setLoaded] = useState(false)
  if (!loaded) {
    setLoaded(true)
    loadExercises()
  }

  async function loadExercises() {
    setLoading(true)
    setError(null)
    try {
      const data = await getSpeakingExercises(level || 'a1', chapterId, 6)
      setExercises(data)
    } catch (e) {
      if (e instanceof SpeakingExerciseError) {
        setError(e.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const exercise = exercises[currentIndex]
  const totalExercises = exercises.length
  const progress = totalExercises > 0 ? ((currentIndex + 1) / totalExercises) * 100 : 0

  // Pulse animation for mic
  useEffect(() => {
    if (isRecording) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      )
      animation.start()
      return () => animation.stop()
    } else {
      pulseAnim.setValue(1)
    }
  }, [isRecording, pulseAnim])

  const getExpectedText = useCallback((): string => {
    if (!exercise) return ''
    switch (exercise.type) {
      case 'read_aloud':
        return exercise.spanishText
      case 'translate_speak':
        return exercise.expectedSpanish
      case 'listen_repeat':
        return exercise.spanishText
    }
  }, [exercise])

  const startRecording = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync()
    if (!result.granted) {
      setError('Microphone permission is required for speaking exercises.')
      return
    }

    setTranscription('')
    setPartialTranscription('')
    setShowFeedback(false)
    setWordResults([])
    setAiFeedback(null)
    setIsRecording(true)

    ExpoSpeechRecognitionModule.start({
      lang: 'es',
      interimResults: true,
      continuous: false,
    })
  }

  const stopRecording = () => {
    ExpoSpeechRecognitionModule.stop()
    setIsRecording(false)
    // Use partial transcription if no final result yet
    if (!transcription && partialTranscription) {
      setTranscription(partialTranscription)
      setPartialTranscription('')
    }
  }

  const handleCheckResults = async () => {
    if (!exercise || !transcription) return

    const expectedText = getExpectedText()

    // Check acceptable variations for translate_speak
    let comparison = compareTexts(expectedText, transcription)

    if (!comparison.isCorrect && exercise.type === 'translate_speak' && exercise.acceptableVariations) {
      for (const variation of exercise.acceptableVariations) {
        const altComparison = compareTexts(variation, transcription)
        if (altComparison.isCorrect) {
          comparison = altComparison
          break
        }
      }
    }

    setWordResults(comparison.wordResults)
    setIsCorrect(comparison.isCorrect)
    setShowFeedback(true)

    // If there are errors, get AI feedback
    if (!comparison.isCorrect) {
      setIsEvaluating(true)
      try {
        const feedback = await evaluateSpeaking(
          expectedText,
          transcription,
          exercise.type,
          (level || 'a1').toUpperCase(),
          chapterTitle,
        )
        setAiFeedback(feedback)
      } catch (e) {
        console.error('[Evaluate Error]', e)
        // Non-fatal — just don't show AI feedback
      } finally {
        setIsEvaluating(false)
      }
    }

    setResults((prev) => [
      ...prev,
      {
        exercise,
        transcription,
        expectedText,
        correct: comparison.isCorrect,
        wordResults: comparison.wordResults,
        aiFeedback: comparison.isCorrect ? undefined : undefined, // Will be updated after evaluation
      },
    ])
  }

  const handleNext = () => {
    // Update the last result with AI feedback if available
    if (aiFeedback) {
      setResults((prev) => {
        const updated = [...prev]
        if (updated.length > 0) {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            aiFeedback: aiFeedback.feedback,
          }
        }
        return updated
      })
    }

    if (currentIndex < totalExercises - 1) {
      setCurrentIndex((prev) => prev + 1)
      setTranscription('')
      setPartialTranscription('')
      setShowFeedback(false)
      setWordResults([])
      setAiFeedback(null)
      setIsCorrect(false)
      setHasListened(false)
      setShowSpanishText(false)
    } else {
      // Build final results with AI feedback
      const finalResults = [...results]
      if (aiFeedback && finalResults.length > 0) {
        finalResults[finalResults.length - 1] = {
          ...finalResults[finalResults.length - 1],
          aiFeedback: aiFeedback.feedback,
        }
      }

      router.replace({
        pathname: '/(tabs)/exercises/speaking/results',
        params: {
          results: JSON.stringify(finalResults),
          level: level || '',
          chapter: chapterParam || '',
        },
      })
    }
  }

  const playTTS = () => {
    if (!exercise || exercise.type !== 'listen_repeat') return
    setIsPlaying(true)
    Speech.speak(exercise.spanishText, {
      language: 'es',
      rate: 0.85,
      onDone: () => {
        setIsPlaying(false)
        setHasListened(true)
      },
      onError: () => setIsPlaying(false),
    })
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
  if (error || exercises.length === 0) {
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
          <Button onPress={loadExercises}>Try Again</Button>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#78716C" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.progressCount}>
          <Text style={styles.progressCurrent}>{currentIndex + 1}</Text>
          <Text style={styles.progressTotal}> / {totalExercises}</Text>
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Exercise Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {exercise?.type === 'read_aloud' && 'Read Aloud'}
            {exercise?.type === 'translate_speak' && 'Translate & Speak'}
            {exercise?.type === 'listen_repeat' && 'Listen & Repeat'}
          </Text>
        </View>

        {/* Exercise Content */}
        {exercise?.type === 'read_aloud' && (
          <ReadAloudView exercise={exercise} />
        )}
        {exercise?.type === 'translate_speak' && (
          <TranslateSpeakView exercise={exercise} />
        )}
        {exercise?.type === 'listen_repeat' && (
          <ListenRepeatView
            exercise={exercise}
            isPlaying={isPlaying}
            hasListened={hasListened}
            showSpanishText={showSpanishText || showFeedback}
            onPlay={playTTS}
            onShowText={() => setShowSpanishText(true)}
          />
        )}

        {/* Transcription Display */}
        {(transcription || partialTranscription) && (
          <Card style={styles.transcriptionCard}>
            <Text style={styles.transcriptionLabel}>What you said:</Text>
            <Text style={styles.transcriptionText}>
              {transcription || partialTranscription}
            </Text>
            {isRecording && (
              <Text style={styles.listeningHint}>Still listening...</Text>
            )}
          </Card>
        )}

        {/* Recording UI */}
        {!showFeedback && (
          <View style={styles.recordSection}>
            <Animated.View style={[styles.micButtonOuter, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity
                style={[styles.micButton, isRecording && styles.micButtonRecording]}
                onPress={isRecording ? stopRecording : startRecording}
                activeOpacity={0.7}
                disabled={exercise?.type === 'listen_repeat' && !hasListened}
              >
                {isRecording ? (
                  <MicOff size={32} color="#FFFFFF" />
                ) : (
                  <Mic size={32} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.micLabel}>
              {isRecording
                ? 'Tap to stop'
                : exercise?.type === 'listen_repeat' && !hasListened
                  ? 'Listen first, then record'
                  : 'Tap to speak'}
            </Text>
          </View>
        )}

        {/* Word-by-word results */}
        {showFeedback && wordResults.length > 0 && (
          <View style={styles.wordResultsContainer}>
            <Text style={styles.wordResultsLabel}>Word-by-word comparison:</Text>
            <View style={styles.wordResultsRow}>
              {wordResults.map((wr, i) => (
                <View key={i} style={[styles.wordChip, wordStatusStyle(wr.status)]}>
                  <Text style={[styles.wordChipText, wordStatusTextStyle(wr.status)]}>
                    {wr.word}
                  </Text>
                  {wr.status === 'incorrect' && wr.expected && (
                    <Text style={styles.wordExpected}>{wr.expected}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Feedback Card */}
        {showFeedback && (
          <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={[styles.feedbackTitle, { color: isCorrect ? '#22C55E' : '#EF4444' }]}>
              {isCorrect ? 'Perfect!' : 'Not quite...'}
            </Text>

            {!isCorrect && (
              <View style={styles.expectedSection}>
                <Text style={styles.expectedLabel}>Expected:</Text>
                <Text style={styles.expectedText}>{getExpectedText()}</Text>
              </View>
            )}

            {exercise?.explanation && (
              <Text style={styles.feedbackExplanation}>{exercise.explanation}</Text>
            )}

            {isEvaluating && (
              <View style={styles.evaluatingRow}>
                <ActivityIndicator size="small" color="#F97316" />
                <Text style={styles.evaluatingText}>Getting feedback...</Text>
              </View>
            )}

            {aiFeedback && (
              <View style={styles.aiFeedbackSection}>
                <Text style={styles.aiFeedbackText}>{aiFeedback.feedback}</Text>
                {aiFeedback.corrections.length > 0 && (
                  <View style={styles.correctionsContainer}>
                    {aiFeedback.corrections.map((c, i) => (
                      <View key={i} style={styles.correctionRow}>
                        <Text style={styles.correctionWrong}>{c.wrong}</Text>
                        <Text style={styles.correctionArrow}>{' → '}</Text>
                        <Text style={styles.correctionCorrect}>{c.correct}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {aiFeedback.tip && (
                  <Text style={styles.tipText}>{aiFeedback.tip}</Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.bottomAction}>
        {!showFeedback ? (
          <Button onPress={handleCheckResults} disabled={!transcription || isRecording}>
            Check Results
          </Button>
        ) : (
          <Button onPress={handleNext}>
            {currentIndex < totalExercises - 1 ? 'Next' : 'See Results'}
          </Button>
        )}
      </View>
    </SafeAreaView>
  )
}

// ── Read Aloud View ─────────────────────────────────────────────

function ReadAloudView({ exercise }: { exercise: ReadAloudExercise }) {
  return (
    <View style={styles.exerciseContent}>
      <Text style={styles.exerciseInstruction}>Read this sentence aloud in Spanish:</Text>
      <Card style={styles.sentenceCard}>
        <Text style={styles.spanishSentence}>{exercise.spanishText}</Text>
        <Text style={styles.translationHint}>{exercise.translation}</Text>
      </Card>
    </View>
  )
}

// ── Translate & Speak View ──────────────────────────────────────

function TranslateSpeakView({ exercise }: { exercise: TranslateSpeakExercise }) {
  return (
    <View style={styles.exerciseContent}>
      <Text style={styles.exerciseInstruction}>Translate and say it in Spanish:</Text>
      <Card style={styles.sentenceCard}>
        <Text style={styles.promptSentence}>{exercise.promptText}</Text>
      </Card>
    </View>
  )
}

// ── Listen & Repeat View ────────────────────────────────────────

function ListenRepeatView({
  exercise,
  isPlaying,
  hasListened,
  showSpanishText,
  onPlay,
  onShowText,
}: {
  exercise: ListenRepeatExercise
  isPlaying: boolean
  hasListened: boolean
  showSpanishText: boolean
  onPlay: () => void
  onShowText: () => void
}) {
  return (
    <View style={styles.exerciseContent}>
      <Text style={styles.exerciseInstruction}>Listen, then repeat what you hear:</Text>
      <Card style={styles.sentenceCard}>
        <TouchableOpacity style={styles.playButton} onPress={onPlay} disabled={isPlaying}>
          <Volume2 size={28} color={isPlaying ? '#78716C' : '#F97316'} />
          <Text style={[styles.playButtonText, isPlaying && { color: '#78716C' }]}>
            {isPlaying ? 'Playing...' : hasListened ? 'Play Again' : 'Tap to Listen'}
          </Text>
        </TouchableOpacity>
        {showSpanishText ? (
          <View style={styles.revealedText}>
            <Text style={styles.spanishSentence}>{exercise.spanishText}</Text>
            <Text style={styles.translationHint}>{exercise.translation}</Text>
          </View>
        ) : hasListened ? (
          <TouchableOpacity onPress={onShowText} style={styles.showTextBtn}>
            <Eye size={16} color="#78716C" />
            <Text style={styles.showTextLabel}>Show text</Text>
          </TouchableOpacity>
        ) : null}
      </Card>
    </View>
  )
}

// ── Helper functions ────────────────────────────────────────────

function wordStatusStyle(status: WordResult['status']) {
  switch (status) {
    case 'correct':
      return { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }
    case 'incorrect':
      return { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }
    case 'missing':
      return { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }
    case 'extra':
      return { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }
  }
}

function wordStatusTextStyle(status: WordResult['status']) {
  switch (status) {
    case 'correct':
      return { color: '#22C55E' }
    case 'incorrect':
      return { color: '#EF4444' }
    case 'missing':
      return { color: '#D97706' }
    case 'extra':
      return { color: '#EF4444', textDecorationLine: 'line-through' as const }
  }
}

// ── Styles ──────────────────────────────────────────────────────

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
  scrollContent: {
    padding: 20,
    paddingBottom: 8,
    flexGrow: 1,
    gap: 16,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F97316',
  },
  exerciseContent: {
    gap: 12,
  },
  exerciseInstruction: {
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
    lineHeight: 30,
  },
  sentenceCard: {
    gap: 10,
    paddingVertical: 20,
  },
  spanishSentence: {
    fontSize: 20,
    fontWeight: '600',
    color: '#292524',
    lineHeight: 28,
  },
  promptSentence: {
    fontSize: 20,
    fontWeight: '600',
    color: '#292524',
    lineHeight: 28,
  },
  translationHint: {
    fontSize: 14,
    color: '#78716C',
    marginTop: 4,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  revealedText: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    gap: 4,
  },
  showTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
  },
  showTextLabel: {
    fontSize: 13,
    color: '#78716C',
  },
  // Recording
  recordSection: {
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  micButtonOuter: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonRecording: {
    backgroundColor: '#EF4444',
  },
  micLabel: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '500',
  },
  // Transcription
  transcriptionCard: {
    gap: 4,
  },
  transcriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  transcriptionText: {
    fontSize: 18,
    color: '#292524',
    lineHeight: 26,
  },
  listeningHint: {
    fontSize: 12,
    color: '#F97316',
    fontStyle: 'italic',
  },
  // Word results
  wordResultsContainer: {
    gap: 8,
  },
  wordResultsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  wordResultsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wordChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  wordChipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  wordExpected: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  // Feedback
  feedbackBox: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    gap: 10,
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
  expectedSection: {
    gap: 2,
  },
  expectedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  expectedText: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '600',
  },
  feedbackExplanation: {
    fontSize: 14,
    color: '#292524',
    lineHeight: 20,
  },
  evaluatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  evaluatingText: {
    fontSize: 13,
    color: '#78716C',
  },
  aiFeedbackSection: {
    gap: 8,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
  },
  aiFeedbackText: {
    fontSize: 14,
    color: '#292524',
    lineHeight: 20,
  },
  correctionsContainer: {
    gap: 4,
  },
  correctionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  correctionWrong: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  correctionArrow: {
    fontSize: 14,
    color: '#78716C',
  },
  correctionCorrect: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  tipText: {
    fontSize: 13,
    color: '#78716C',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  bottomAction: {
    padding: 20,
    paddingBottom: 12,
  },
})
