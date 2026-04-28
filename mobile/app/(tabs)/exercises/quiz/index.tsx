import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { FREE_TIER_LIMITS, type QuizSettings } from '@chingon/shared'
import { colors, fontFamily, surface, LEVEL_COLOR } from '@/constants/theme'

type Level = keyof typeof LEVEL_COLOR

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
  const levels: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const quizzesRemaining = Math.max(0, FREE_TIER_LIMITS.maxDailyQuizzes - dailyQuizCount)

  const toggleDifficulty = (d: number) => {
    setSettings(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(d) ? prev.difficulty.filter(x => x !== d) : [...prev.difficulty, d],
    }))
  }

  const toggleLevel = (l: string) => {
    setSettings(prev => ({
      ...prev,
      level: prev.level.includes(l) ? prev.level.filter(x => x !== l) : [...prev.level, l],
    }))
  }

  const handleStartQuiz = async () => {
    const allowed = await canTakeQuiz()
    if (!allowed) {
      Alert.alert(
        '¡Ay, no!',
        'Ya usaste los 3 quizzes gratis de hoy. ¿Vuélvete Premium para quizzes ilimitados?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Premium', onPress: () => presentPaywall() },
        ],
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
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={{ fontSize: 30 }}>🎯</Text>
          </View>
          <Text style={styles.title}>Configura tu quiz</Text>
          <Text style={styles.subtitle}>Ajústalo a tu mood · dale cuando estés listo</Text>
        </View>

        {!isPremium && (
          <View style={styles.quizLimitRow}>
            <Text style={styles.quizLimitText}>
              {quizzesRemaining} / {FREE_TIER_LIMITS.maxDailyQuizzes} quizzes hoy
            </Text>
          </View>
        )}

        <View style={styles.card}>
          {/* Word count */}
          <Section label={`Número de palabras · ${settings.wordCount}`}>
            <View style={styles.chipRow}>
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
          </Section>

          {/* Difficulty */}
          <Section label="Dificultad">
            <View style={styles.chipRow}>
              {difficulties.map(d => {
                const active = settings.difficulty.includes(d)
                return (
                  <TouchableOpacity
                    key={d}
                    style={[styles.diffChip, active && styles.chipActive]}
                    onPress={() => toggleDifficulty(d)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {'🌶'.repeat(d)}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </Section>

          {/* CEFR */}
          <Section label="Nivel CEFR">
            <View style={styles.chipRow}>
              {levels.map(l => {
                const active = settings.level.includes(l)
                return (
                  <TouchableOpacity
                    key={l}
                    style={[
                      styles.chip,
                      active && { backgroundColor: LEVEL_COLOR[l], borderColor: LEVEL_COLOR[l] },
                    ]}
                    onPress={() => toggleLevel(l)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </Section>

          {/* Direction */}
          <Section label="Dirección del quiz">
            <View style={styles.directionRow}>
              <TouchableOpacity
                style={[styles.dirCard, settings.quizType === 'term_to_translation' && styles.dirCardActive]}
                onPress={() => setSettings(prev => ({ ...prev, quizType: 'term_to_translation' }))}
              >
                <Text style={[styles.dirTitle, settings.quizType === 'term_to_translation' && styles.dirTitleActive]}>
                  ES → DE
                </Text>
                <Text style={styles.dirDesc}>Ves español · escribes alemán</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dirCard, settings.quizType === 'translation_to_term' && styles.dirCardActive]}
                onPress={() => setSettings(prev => ({ ...prev, quizType: 'translation_to_term' }))}
              >
                <Text style={[styles.dirTitle, settings.quizType === 'translation_to_term' && styles.dirTitleActive]}>
                  DE → ES
                </Text>
                <Text style={styles.dirDesc}>Ves alemán · escribes español</Text>
              </TouchableOpacity>
            </View>
          </Section>

          {/* Options */}
          <Section label="Opciones">
            <CheckRow
              checked={settings.showContext}
              onToggle={() => setSettings(p => ({ ...p, showContext: !p.showContext }))}
              label="Mostrar frases de contexto como pistas"
            />
            <CheckRow
              checked={settings.showTags}
              onToggle={() => setSettings(p => ({ ...p, showTags: !p.showTags }))}
              label="Mostrar etiquetas de palabras"
            />
          </Section>
        </View>

        <Button onPress={handleStartQuiz} disabled={settings.difficulty.length === 0} variant="primary" size="lg">
          ¡Dale! Empezar quiz
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10, marginBottom: 18 }}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  )
}

function CheckRow({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <TouchableOpacity style={styles.toggle} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxActive]} />
      <Text style={styles.toggleText}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 18, paddingBottom: 40 },
  header: { alignItems: 'center', gap: 8 },
  headerIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.chili[500],
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 26, color: colors.ink[800], textAlign: 'center' },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500], textAlign: 'center' },
  quizLimitRow: {
    backgroundColor: colors.maiz[100], borderWidth: 2, borderColor: colors.maiz[300],
    borderRadius: 14, padding: 12, alignItems: 'center',
  },
  quizLimitText: { fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.ink[800] },
  card: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 20, padding: 20,
  },
  sectionLabel: {
    fontFamily: fontFamily.monoBold, fontSize: 11, letterSpacing: 1.5,
    color: colors.ink[600], textTransform: 'uppercase',
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    borderWidth: 2, borderColor: colors.ink[200], backgroundColor: '#FFFFFF',
  },
  chipActive: { backgroundColor: colors.chili[500], borderColor: colors.chili[500] },
  chipText: { fontFamily: fontFamily.displayExtraBold, fontSize: 14, color: colors.ink[600] },
  chipTextActive: { color: '#FFFFFF' },
  diffChip: {
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12,
    borderWidth: 2, borderColor: colors.ink[200], backgroundColor: '#FFFFFF',
  },
  directionRow: { flexDirection: 'row', gap: 10 },
  dirCard: {
    flex: 1, padding: 14, borderRadius: 14, borderWidth: 2, borderColor: colors.ink[200],
    backgroundColor: '#FFFFFF',
  },
  dirCardActive: { borderColor: colors.chili[500], backgroundColor: colors.chili[50] },
  dirTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: colors.ink[700] },
  dirTitleActive: { color: colors.chili[700] },
  dirDesc: { fontFamily: fontFamily.body, fontSize: 11, color: colors.ink[500], marginTop: 4 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.ink[300],
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: { backgroundColor: colors.chili[500], borderColor: colors.chili[500] },
  toggleText: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[700] },
})
