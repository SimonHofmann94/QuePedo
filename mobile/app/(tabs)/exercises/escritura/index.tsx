import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ArrowLeft, PenTool } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { listWritingPrompts } from '@chingon/shared'
import { colors, fontFamily, surface } from '@/constants/theme'

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const

export default function EscrituraSettingsScreen() {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState<string>('a1')

  const prompts = listWritingPrompts(selectedLevel)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.ink[700]} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <PenTool size={28} color={colors.jacaranda[500]} />
          <Text style={styles.title}>Escritura</Text>
        </View>
        <Text style={styles.subtitle}>Escoge un tema · escribe · la AI te corrige</Text>

        {/* Level chips */}
        <View style={styles.levelRow}>
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.levelChip, selectedLevel === level && styles.levelChipActive]}
              onPress={() => setSelectedLevel(level)}
            >
              <Text style={[styles.levelChipText, selectedLevel === level && styles.levelChipTextActive]}>
                {level.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Prompt list */}
        {prompts.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/exercises/escritura/play',
                params: { level: p.level, chapter: String(p.chapterId) },
              })
            }
            activeOpacity={0.7}
          >
            <Card style={styles.chapterCard}>
              <View style={styles.chapterLeft}>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{p.chapterId + 1}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>{p.chapterTitle}</Text>
                  <Text style={styles.sectionCount}>Mínimo {p.minWords} palabras</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: fontFamily.body, fontSize: 15, color: colors.ink[700] },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 28, color: colors.ink[800] },
  subtitle: { fontFamily: fontFamily.body, fontSize: 15, color: colors.ink[500], marginBottom: 4 },
  levelRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  levelChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999,
    borderWidth: 2, borderColor: colors.ink[200],
  },
  levelChipActive: { backgroundColor: colors.jacaranda[500], borderColor: colors.jacaranda[500] },
  levelChipText: { fontFamily: fontFamily.bodyBold, fontSize: 14, color: colors.ink[500] },
  levelChipTextActive: { color: '#FFFFFF' },
  chapterCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  chapterNumber: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.jacaranda[50],
    alignItems: 'center', justifyContent: 'center',
  },
  chapterNumberText: { fontFamily: fontFamily.displayExtraBold, fontSize: 14, color: colors.jacaranda[600] },
  chapterInfo: { flex: 1, gap: 2 },
  chapterTitle: { fontFamily: fontFamily.bodyBold, fontSize: 16, color: colors.ink[800] },
  sectionCount: { fontFamily: fontFamily.mono, fontSize: 13, color: colors.ink[500] },
})
