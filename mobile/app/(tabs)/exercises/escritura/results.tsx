import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { RotateCcw, Home } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { WritingResult } from '@chingon/shared'
import { colors, fontFamily, surface } from '@/constants/theme'

function accentFor(score: number): string {
  if (score >= 90) return colors.jade[500]
  if (score >= 70) return colors.cielo[500]
  if (score >= 50) return colors.maiz[400]
  return colors.rosa[500]
}

export default function EscrituraResultsScreen() {
  const router = useRouter()
  const { result: resultParam } = useLocalSearchParams<{ result: string }>()
  const [result, setResult] = useState<WritingResult | null>(null)

  useEffect(() => {
    if (!resultParam) {
      router.replace('/(tabs)/exercises/escritura')
      return
    }
    setResult(JSON.parse(resultParam))
  }, [resultParam, router])

  if (!result) return null

  const { prompt, text, feedback } = result
  const score = Math.round(feedback.score)
  const accent = accentFor(score)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.emojiCircle}>
            <Text style={{ fontSize: 34 }}>✍️</Text>
          </View>
          <Text style={styles.title}>¡Texto revisado!</Text>
        </View>

        {/* Score + note */}
        <Card style={styles.scoreCard}>
          <Text style={[styles.score, { color: accent }]}>{score}</Text>
          <Text style={styles.scoreSubtext}>de 100</Text>
          <Text style={[styles.note, { color: accent }]}>{feedback.note}</Text>
        </Card>

        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <Card style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.jade[600] }]}>✓ Lo que hiciste bien</Text>
            {feedback.strengths.map((s) => (
              <Text key={s} style={styles.bullet}>• {s}</Text>
            ))}
          </Card>
        )}

        {/* Corrections */}
        {feedback.corrections.length > 0 && (
          <Card style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.rosa[600] }]}>⚠ Correcciones</Text>
            {feedback.corrections.map((c, i) => (
              <View key={i} style={styles.correction}>
                <View style={styles.correctionRow}>
                  <Text style={styles.wrong}>{c.wrong}</Text>
                  <Text style={styles.arrow}> → </Text>
                  <Text style={styles.correct}>{c.correct}</Text>
                </View>
                {!!c.explanation && <Text style={styles.explanation}>{c.explanation}</Text>}
              </View>
            ))}
          </Card>
        )}

        {/* Your text */}
        <Card style={styles.section}>
          <Text style={styles.sectionLabel}>Tu texto · {prompt.chapterTitle}</Text>
          <Text style={styles.userText}>{text}</Text>
        </Card>

        {/* Actions */}
        <View style={styles.actionRow}>
          <Button
            variant="outline"
            onPress={() =>
              router.replace({
                pathname: '/(tabs)/exercises/escritura/play',
                params: { level: prompt.level, chapter: String(prompt.chapterId) },
              })
            }
            style={{ flex: 1 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <RotateCcw size={18} color={colors.ink[700]} />
              <Text style={{ color: colors.ink[700], fontFamily: fontFamily.bodyBold, fontSize: 15 }}>
                Otra vez
              </Text>
            </View>
          </Button>
          <Button onPress={() => router.replace('/(tabs)/exercises')} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Home size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodyBold, fontSize: 15 }}>
                Ejercicios
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 18, paddingBottom: 40 },
  headerSection: { alignItems: 'center', gap: 12 },
  emojiCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.jacaranda[100],
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 28, color: colors.ink[800] },
  scoreCard: { alignItems: 'center', gap: 4, paddingVertical: 28 },
  score: { fontFamily: fontFamily.displayExtraBold, fontSize: 60 },
  scoreSubtext: { fontFamily: fontFamily.mono, fontSize: 13, color: colors.ink[500] },
  note: { fontFamily: fontFamily.bodyBold, fontSize: 14, textAlign: 'center', marginTop: 6 },
  section: { gap: 8 },
  sectionLabel: { fontFamily: fontFamily.monoBold, fontSize: 11, letterSpacing: 1, color: colors.ink[500], textTransform: 'uppercase' },
  bullet: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[700], lineHeight: 20 },
  correction: {
    backgroundColor: surface.bg, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 12, padding: 12, gap: 4,
  },
  correctionRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  wrong: { fontFamily: fontFamily.bodyBold, fontSize: 14, color: colors.rosa[600], textDecorationLine: 'line-through' },
  arrow: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[400] },
  correct: { fontFamily: fontFamily.bodyBold, fontSize: 14, color: colors.jade[600] },
  explanation: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ink[500], lineHeight: 18 },
  userText: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[600], fontStyle: 'italic', lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: 12 },
})
