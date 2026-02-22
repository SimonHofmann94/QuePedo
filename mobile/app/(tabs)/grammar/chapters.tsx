import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { grammarA1 } from '@/data/grammar/a1'
import { grammarA2 } from '@/data/grammar/a2'
import { grammarB1 } from '@/data/grammar/b1'
import { grammarB2 } from '@/data/grammar/b2'
import { grammarC1 } from '@/data/grammar/c1'
import { grammarC2 } from '@/data/grammar/c2'

const LEVEL_DATA: Record<string, typeof grammarA1> = {
  a1: grammarA1,
  a2: grammarA2,
  b1: grammarB1,
  b2: grammarB2,
  c1: grammarC1,
  c2: grammarC2,
}

const LEVEL_TITLES: Record<string, string> = {
  a1: 'A1 — Beginner',
  a2: 'A2 — Elementary',
  b1: 'B1 — Intermediate',
  b2: 'B2 — Upper Intermediate',
  c1: 'C1 — Advanced',
  c2: 'C2 — Mastery',
}

export default function GrammarChaptersScreen() {
  const router = useRouter()
  const { level } = useLocalSearchParams<{ level: string }>()
  const [completedChapters, setCompletedChapters] = useState<number[]>([])

  const levelData = LEVEL_DATA[level || '']
  const levelTitle = LEVEL_TITLES[level || ''] || level?.toUpperCase()

  const loadProgress = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(`grammar_progress_${level}`)
      if (stored) {
        setCompletedChapters(JSON.parse(stored))
      }
    } catch {}
  }, [level])

  useFocusEffect(
    useCallback(() => {
      loadProgress()
    }, [loadProgress])
  )

  if (!levelData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Level not found</Text>
      </SafeAreaView>
    )
  }

  const isChapterUnlocked = (chapterId: number) => {
    if (chapterId === 0) return true
    const prevChapterId = chapterId - 1
    return completedChapters.includes(prevChapterId)
  }

  const isChapterCompleted = (chapterId: number) => {
    return completedChapters.includes(chapterId)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#292524" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{levelTitle}</Text>
          <Text style={styles.subtitle}>
            {completedChapters.length} of {levelData.chapters.length} chapters completed
          </Text>
        </View>

        {levelData.chapters.map((chapter) => {
          const unlocked = isChapterUnlocked(chapter.id)
          const completed = isChapterCompleted(chapter.id)

          return (
            <TouchableOpacity
              key={chapter.id}
              onPress={() => {
                if (unlocked) {
                  router.push({
                    pathname: '/(tabs)/grammar/lesson',
                    params: { level: level!, chapter: String(chapter.id) },
                  })
                }
              }}
              activeOpacity={unlocked ? 0.7 : 1}
            >
              <Card style={{ ...styles.chapterCard, ...(!unlocked ? styles.lockedCard : {}) }}>
                <View style={styles.chapterLeft}>
                  <View style={[styles.chapterNumber, completed && styles.completedNumber]}>
                    <Text style={[styles.chapterNumberText, completed && styles.completedNumberText]}>
                      {chapter.id + 1}
                    </Text>
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text style={[styles.chapterTitle, !unlocked && styles.lockedText]}>
                      {chapter.title}
                    </Text>
                    <Text style={styles.sectionCount}>
                      {chapter.sections.length} {chapter.sections.length === 1 ? 'section' : 'sections'}
                    </Text>
                  </View>
                </View>
                {completed ? (
                  <CheckCircle2 size={22} color="#22C55E" />
                ) : !unlocked ? (
                  <Lock size={18} color="#A8A29E" />
                ) : null}
              </Card>
            </TouchableOpacity>
          )
        })}
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
  header: {
    gap: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  subtitle: {
    fontSize: 15,
    color: '#78716C',
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  lockedCard: {
    opacity: 0.5,
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
  completedNumber: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78716C',
  },
  completedNumberText: {
    color: '#22C55E',
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
  lockedText: {
    color: '#78716C',
  },
  sectionCount: {
    fontSize: 13,
    color: '#78716C',
  },
  backText: {
    fontSize: 15,
    color: '#292524',
  },
  notFound: {
    fontSize: 16,
    color: '#78716C',
    textAlign: 'center',
    marginTop: 40,
  },
})
