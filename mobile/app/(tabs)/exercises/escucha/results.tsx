import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Trophy, RotateCcw, Home, Target, TrendingUp, AlertTriangle } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { ListeningResult } from '@chingon/shared'
import { colors, fontFamily, surface } from '@/constants/theme'

export default function EscuchaResultsScreen() {
  const router = useRouter()
  const { results: resultsParam, level } = useLocalSearchParams<{
    results: string
    level: string
  }>()
  const [results, setResults] = useState<ListeningResult[] | null>(null)

  useEffect(() => {
    if (!resultsParam) {
      router.replace('/(tabs)/exercises/escucha')
      return
    }
    setResults(JSON.parse(resultsParam))
  }, [resultsParam, router])

  if (!results) return null

  const correctCount = results.filter((r) => r.correct).length
  const incorrectCount = results.length - correctCount
  const totalCount = results.length
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  let performanceColor: string
  let performanceMessage: string
  if (percentage >= 90) {
    performanceColor = colors.jade[500]
    performanceMessage = '¡Eres un chingón! Tu oído está afinadísimo.'
  } else if (percentage >= 70) {
    performanceColor = colors.cielo[500]
    performanceMessage = '¡Bien hecho! Sigue entrenando el oído.'
  } else if (percentage >= 50) {
    performanceColor = colors.maiz[400]
    performanceMessage = 'Vas bien — repasa las frases que se te escaparon.'
  } else {
    performanceColor = colors.rosa[500]
    performanceMessage = '¡No te rajes! Vuelve a escuchar y dale otra vez.'
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerSection}>
          <View style={styles.trophyCircle}>
            <Trophy size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>¡Escucha completa!</Text>
        </View>

        <Card style={styles.scoreCard}>
          <Text style={[styles.percentage, { color: performanceColor }]}>{percentage}%</Text>
          <Text style={styles.scoreSubtext}>
            {correctCount} de {totalCount} correctas
          </Text>
          <Text style={[styles.message, { color: performanceColor }]}>{performanceMessage}</Text>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.miniStat}>
            <Target size={22} color={colors.cielo[500]} />
            <Text style={styles.miniStatValue}>{totalCount}</Text>
            <Text style={styles.miniStatLabel}>Total</Text>
          </Card>
          <Card style={styles.miniStat}>
            <TrendingUp size={22} color={colors.jade[500]} />
            <Text style={[styles.miniStatValue, { color: colors.jade[500] }]}>{correctCount}</Text>
            <Text style={styles.miniStatLabel}>Correctas</Text>
          </Card>
          <Card style={styles.miniStat}>
            <AlertTriangle size={22} color={colors.rosa[500]} />
            <Text style={[styles.miniStatValue, { color: colors.rosa[500] }]}>{incorrectCount}</Text>
            <Text style={styles.miniStatLabel}>A repasar</Text>
          </Card>
        </View>

        {/* Per-item breakdown */}
        {results.map((r, i) => (
          <Card
            key={i}
            style={{ ...styles.resultItem, ...(r.correct ? styles.resultItemCorrect : styles.resultItemWrong) }}
          >
            <Text style={styles.resultSpanish}>{r.item.spanish}</Text>
            <Text style={styles.resultAnswer}>{r.item.answer}</Text>
            {!r.correct && r.selected ? (
              <Text style={styles.resultSelected}>Tú elegiste: {r.selected}</Text>
            ) : null}
          </Card>
        ))}

        <View style={styles.actionRow}>
          <Button
            variant="outline"
            onPress={() =>
              router.replace({
                pathname: '/(tabs)/exercises/escucha/play',
                params: { level: level || '' },
              })
            }
            style={{ flex: 1 }}
          >
            <View style={styles.btnInner}>
              <RotateCcw size={18} color={colors.ink[800]} />
              <Text style={styles.btnOutlineText}>Otra vez</Text>
            </View>
          </Button>
          <Button onPress={() => router.replace('/(tabs)/exercises')} style={{ flex: 1 }}>
            <View style={styles.btnInner}>
              <Home size={18} color="#FFFFFF" />
              <Text style={styles.btnPrimaryText}>Ejercicios</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  headerSection: { alignItems: 'center', gap: 12 },
  trophyCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.cielo[500],
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 28, color: colors.ink[800] },
  scoreCard: { alignItems: 'center', gap: 8, paddingVertical: 28 },
  percentage: { fontFamily: fontFamily.displayExtraBold, fontSize: 60 },
  scoreSubtext: { fontFamily: fontFamily.body, fontSize: 15, color: colors.ink[500] },
  message: { fontFamily: fontFamily.bodyBold, fontSize: 14, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 12 },
  miniStat: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 14 },
  miniStatValue: { fontFamily: fontFamily.displayExtraBold, fontSize: 22, color: colors.ink[800] },
  miniStatLabel: { fontFamily: fontFamily.body, fontSize: 11, color: colors.ink[500] },
  resultItem: { gap: 4, borderWidth: 1 },
  resultItemCorrect: { borderColor: colors.jade[300], backgroundColor: colors.jade[50] },
  resultItemWrong: { borderColor: colors.rosa[300], backgroundColor: colors.rosa[50] },
  resultSpanish: { fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: colors.ink[800] },
  resultAnswer: { fontFamily: fontFamily.body, fontSize: 13, color: colors.jade[600] },
  resultSelected: { fontFamily: fontFamily.body, fontSize: 12, color: colors.rosa[500] },
  actionRow: { flexDirection: 'row', gap: 12 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnOutlineText: { color: colors.ink[800], fontFamily: fontFamily.bodyBold, fontSize: 15 },
  btnPrimaryText: { color: '#FFFFFF', fontFamily: fontFamily.bodyBold, fontSize: 15 },
})
