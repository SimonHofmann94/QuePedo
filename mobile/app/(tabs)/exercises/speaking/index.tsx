import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ArrowLeft, Mic } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { grammarA1 } from '@chingon/shared'
import { grammarA2 } from '@chingon/shared'
import { grammarB1 } from '@chingon/shared'
import { grammarB2 } from '@chingon/shared'
import { grammarC1 } from '@chingon/shared'
import { grammarC2 } from '@chingon/shared'

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const

const LEVEL_DATA: Record<string, typeof grammarA1> = {
  a1: grammarA1,
  a2: grammarA2,
  b1: grammarB1,
  b2: grammarB2,
  c1: grammarC1,
  c2: grammarC2,
}

export default function SpeakingExerciseSettingsScreen() {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState<string>('a1')

  const levelData = LEVEL_DATA[selectedLevel]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#292524" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Mic size={28} color="#F97316" />
          <Text style={styles.title}>Speaking Exercise</Text>
        </View>
        <Text style={styles.subtitle}>Pick a level and chapter to practice</Text>

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

        {/* Chapter list */}
        {levelData?.chapters.map((chapter) => (
          <TouchableOpacity
            key={chapter.id}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/exercises/speaking/play',
                params: { level: selectedLevel, chapter: String(chapter.id) },
              })
            }
            activeOpacity={0.7}
          >
            <Card style={styles.chapterCard}>
              <View style={styles.chapterLeft}>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{chapter.id + 1}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.sectionCount}>
                    {chapter.sections.length} {chapter.sections.length === 1 ? 'section' : 'sections'}
                  </Text>
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
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  scroll: {
    padding: 20,
    gap: 12,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 15,
    color: '#292524',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  subtitle: {
    fontSize: 15,
    color: '#78716C',
    marginBottom: 4,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  levelChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#E7E5E4',
  },
  levelChipActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  levelChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78716C',
  },
  levelChipTextActive: {
    color: '#FFFFFF',
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78716C',
  },
  chapterInfo: {
    flex: 1,
    gap: 2,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292524',
  },
  sectionCount: {
    fontSize: 13,
    color: '#78716C',
  },
})
