import { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Volume2, Eye } from 'lucide-react-native'
import * as Speech from 'expo-speech'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  generateListeningItems,
  gradeListening,
  type ListeningResult,
} from '@chingon/shared'
import { colors, fontFamily, surface } from '@/constants/theme'

const TOTAL = 6

export default function EscuchaPlayScreen() {
  const router = useRouter()
  const { level } = useLocalSearchParams<{ level: string }>()

  const [items] = useState(() => generateListeningItems(level || 'a1', TOTAL))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [results, setResults] = useState<ListeningResult[]>([])
  const [revealText, setRevealText] = useState(false)

  const item = items[index]

  const speak = useCallback(() => {
    if (!item) return
    Speech.stop()
    Speech.speak(item.spanish, { language: 'es-ES', rate: 0.9 })
  }, [item])

  // Auto-play when a new item appears.
  useEffect(() => {
    if (item) speak()
    return () => {
      Speech.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // Empty / bad-level guard.
  if (items.length === 0 || !item) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.ink[700]} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
          <Text style={styles.errorTitle}>¡Ay, no! No hay frases para este nivel.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const answered = selected !== null
  const isCorrect = answered ? gradeListening(selected, item.answer) : false
  const progress = ((index + 1) / items.length) * 100

  const handleSelect = (option: string) => {
    if (answered) return
    setSelected(option)
    setResults((p) => [
      ...p,
      { item, selected: option, correct: gradeListening(option, item.answer) },
    ])
  }

  const handleNext = () => {
    if (index < items.length - 1) {
      setIndex((i) => i + 1)
      setSelected(null)
      setRevealText(false)
    } else {
      router.replace({
        pathname: '/(tabs)/exercises/escucha/results',
        params: { results: JSON.stringify(results), level: level || '' },
      })
    }
  }

  const optionStyle = (option: string) => {
    if (!answered) return styles.option
    if (option === item.answer) return [styles.option, styles.optionCorrect]
    if (option === selected) return [styles.option, styles.optionWrong]
    return [styles.option, styles.optionMuted]
  }

  const optionTextStyle = (option: string) => {
    if (!answered) return styles.optionText
    if (option === item.answer) return [styles.optionText, { color: colors.jade[700] }]
    if (option === selected) return [styles.optionText, { color: colors.rosa[700] }]
    return [styles.optionText, { color: colors.ink[400] }]
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.ink[500]} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.progressCount}>
          <Text style={styles.progressCurrent}>{index + 1}</Text>
          <Text style={styles.progressTotal}> / {items.length}</Text>
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Listen card */}
        <Card style={styles.listenCard}>
          <Text style={styles.eyebrow}>¿QUÉ ESCUCHASTE?</Text>
          <TouchableOpacity style={styles.playButton} onPress={speak} activeOpacity={0.8}>
            <Volume2 size={32} color="#FFFFFF" />
          </TouchableOpacity>

          {revealText || answered ? (
            <Text style={styles.spanishText}>{item.spanish}</Text>
          ) : (
            <TouchableOpacity onPress={() => setRevealText(true)} style={styles.showTextBtn}>
              <Eye size={16} color={colors.ink[400]} />
              <Text style={styles.showTextLabel}>Ver texto</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Options */}
        <View style={styles.optionsWrap}>
          {item.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={optionStyle(option)}
              onPress={() => handleSelect(option)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={optionTextStyle(option)}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback */}
        {answered && (
          <View
            style={[
              styles.feedbackBox,
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}
          >
            <Text
              style={[
                styles.feedbackTitle,
                { color: isCorrect ? colors.jade[700] : colors.rosa[700] },
              ]}
            >
              {isCorrect ? '✓ ¡Órale!' : '✗ ¡Ay, no!'}
            </Text>
            {!isCorrect && (
              <Text style={styles.feedbackMeaning}>
                Significa: <Text style={{ color: colors.jade[600] }}>{item.answer}</Text>
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom action */}
      {answered && (
        <View style={styles.bottomAction}>
          <Button onPress={handleNext}>
            {index < items.length - 1 ? 'Ándale, siguiente' : 'Ver resultados'}
          </Button>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  errorContainer: { padding: 20, gap: 16 },
  errorTitle: { fontFamily: fontFamily.body, fontSize: 16, color: colors.rosa[600], marginTop: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 8,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: fontFamily.body, fontSize: 15, color: colors.ink[500] },
  progressCount: { fontFamily: fontFamily.mono, fontSize: 16 },
  progressCurrent: { color: colors.cielo[500], fontFamily: fontFamily.displayExtraBold, fontSize: 20 },
  progressTotal: { color: colors.ink[400] },
  progressBar: {
    height: 6, backgroundColor: colors.ink[100], borderRadius: 3,
    marginHorizontal: 20, marginTop: 12, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.cielo[500], borderRadius: 3 },
  scrollContent: { padding: 20, paddingBottom: 8, gap: 16 },
  listenCard: { alignItems: 'center', gap: 14, paddingVertical: 24 },
  eyebrow: {
    fontFamily: fontFamily.monoBold, fontSize: 11, letterSpacing: 1.5,
    color: colors.cielo[600], textTransform: 'uppercase',
  },
  playButton: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.cielo[500],
    alignItems: 'center', justifyContent: 'center',
  },
  spanishText: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 20,
    color: colors.ink[800], textAlign: 'center',
  },
  showTextBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  showTextLabel: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[400] },
  optionsWrap: { gap: 10 },
  option: {
    borderWidth: 2, borderColor: colors.ink[200], backgroundColor: surface.card,
    borderRadius: 14, paddingHorizontal: 18, paddingVertical: 16,
  },
  optionCorrect: { borderColor: colors.jade[400], backgroundColor: colors.jade[50] },
  optionWrong: { borderColor: colors.rosa[400], backgroundColor: colors.rosa[50] },
  optionMuted: { opacity: 0.6 },
  optionText: { fontFamily: fontFamily.bodyBold, fontSize: 16, color: colors.ink[700] },
  feedbackBox: { borderWidth: 2, borderRadius: 14, padding: 16, gap: 6 },
  feedbackCorrect: { borderColor: colors.jade[300], backgroundColor: colors.jade[50] },
  feedbackWrong: { borderColor: colors.rosa[300], backgroundColor: colors.rosa[50] },
  feedbackTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 18 },
  feedbackMeaning: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[600] },
  bottomAction: { padding: 20, paddingBottom: 12 },
})
