import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { grammarA1 } from '@/data/grammar/a1'
import { grammarA2 } from '@/data/grammar/a2'
import { grammarB1 } from '@/data/grammar/b1'
import { grammarB2 } from '@/data/grammar/b2'
import { grammarC1 } from '@/data/grammar/c1'
import { grammarC2 } from '@/data/grammar/c2'
import type { GrammarContentBlock, GrammarChapter } from '@/data/grammar/types'

const LEVEL_DATA: Record<string, typeof grammarA1> = {
  a1: grammarA1,
  a2: grammarA2,
  b1: grammarB1,
  b2: grammarB2,
  c1: grammarC1,
  c2: grammarC2,
}

function TextBlock({ content }: { content: string }) {
  return <Text style={styles.textBlock}>{content}</Text>
}

function RulesBlock({ items }: { items: string[] }) {
  return (
    <Card style={styles.rulesCard}>
      <Text style={styles.rulesTitle}>Key Rules</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.ruleRow}>
          <Text style={styles.bullet}>{'\u2022'}</Text>
          <Text style={styles.ruleText}>{item}</Text>
        </View>
      ))}
    </Card>
  )
}

function ExamplesBlock({ examples }: { examples: { es: string; en: string }[] }) {
  return (
    <Card style={styles.examplesCard}>
      <Text style={styles.examplesTitle}>Examples</Text>
      {examples.map((ex, i) => (
        <View key={i} style={styles.exampleRow}>
          <Text style={styles.exampleEs}>{ex.es}</Text>
          <Text style={styles.exampleEn}>{ex.en}</Text>
        </View>
      ))}
    </Card>
  )
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          {headers.map((h, i) => (
            <View key={i} style={[styles.tableCell, styles.tableHeaderCell, i === 0 && styles.tableFirstCol]}>
              <Text style={styles.tableHeaderText}>{h}</Text>
            </View>
          ))}
        </View>
        {rows.map((row, ri) => (
          <View key={ri} style={[styles.tableRow, ri % 2 === 1 && styles.tableRowAlt]}>
            {row.map((cell, ci) => (
              <View key={ci} style={[styles.tableCell, ci === 0 && styles.tableFirstCol]}>
                <Text style={styles.tableCellText}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

function ContentBlockRenderer({ block }: { block: GrammarContentBlock }) {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.content || ''} />
    case 'rules':
      return <RulesBlock items={block.items || []} />
    case 'examples':
      return <ExamplesBlock examples={block.examples || []} />
    case 'table':
      return <TableBlock headers={block.headers || []} rows={block.rows || []} />
    default:
      return null
  }
}

export default function GrammarLessonScreen() {
  const router = useRouter()
  const { level, chapter: chapterParam } = useLocalSearchParams<{ level: string; chapter: string }>()
  const [isCompleted, setIsCompleted] = useState(false)

  const levelData = LEVEL_DATA[level || '']
  const chapterId = parseInt(chapterParam || '0', 10)
  const chapter = levelData?.chapters.find((c) => c.id === chapterId)

  useEffect(() => {
    checkCompleted()
  }, [level, chapterId])

  const checkCompleted = async () => {
    try {
      const stored = await AsyncStorage.getItem(`grammar_progress_${level}`)
      if (stored) {
        const completed: number[] = JSON.parse(stored)
        setIsCompleted(completed.includes(chapterId))
      }
    } catch {}
  }

  const markAsComplete = async () => {
    try {
      const stored = await AsyncStorage.getItem(`grammar_progress_${level}`)
      const completed: number[] = stored ? JSON.parse(stored) : []
      if (!completed.includes(chapterId)) {
        completed.push(chapterId)
        await AsyncStorage.setItem(`grammar_progress_${level}`, JSON.stringify(completed))
        setIsCompleted(true)

        const nextChapter = levelData?.chapters.find((c) => c.id === chapterId + 1)
        if (nextChapter) {
          Alert.alert(
            'Chapter Complete!',
            `You've unlocked Chapter ${chapterId + 2}: ${nextChapter.title}`,
            [{ text: 'Continue', onPress: () => router.back() }]
          )
        } else {
          Alert.alert(
            'Congratulations!',
            "You've completed all chapters in this level!",
            [{ text: 'Back to Chapters', onPress: () => router.back() }]
          )
        }
      }
    } catch {}
  }

  if (!chapter) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Chapter not found</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#292524" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Badge>{`Chapter ${chapterId + 1}`}</Badge>
          <Text style={styles.title}>{chapter.title}</Text>
        </View>

        {chapter.sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.blocks.map((block, i) => (
              <ContentBlockRenderer key={`${section.id}-${i}`} block={block} />
            ))}
          </View>
        ))}

        <View style={styles.bottomActions}>
          <Button
            onPress={() => Alert.alert('Coming Soon', 'Tests will be available in a future update.')}
            variant="outline"
          >
            Start Test
          </Button>
          {!isCompleted && (
            <Button onPress={markAsComplete}>
              Mark as Complete
            </Button>
          )}
          {isCompleted && (
            <Card style={styles.completedBanner}>
              <Text style={styles.completedText}>Chapter completed</Text>
            </Card>
          )}
        </View>
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
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#292524',
  },
  section: {
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
    marginTop: 8,
  },
  textBlock: {
    fontSize: 15,
    color: '#292524',
    lineHeight: 24,
  },
  rulesCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    gap: 8,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EA580C',
    marginBottom: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    fontSize: 15,
    color: '#F97316',
    lineHeight: 22,
  },
  ruleText: {
    fontSize: 14,
    color: '#292524',
    lineHeight: 22,
    flex: 1,
  },
  examplesCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    gap: 12,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    marginBottom: 4,
  },
  exampleRow: {
    gap: 2,
  },
  exampleEs: {
    fontSize: 15,
    fontWeight: '600',
    color: '#292524',
  },
  exampleEn: {
    fontSize: 14,
    color: '#78716C',
  },
  tableScroll: {
    marginVertical: 4,
  },
  table: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F4',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  tableRowAlt: {
    backgroundColor: '#FAFAF9',
  },
  tableCell: {
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: '#E7E5E4',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
  },
  tableFirstCol: {
    minWidth: 120,
  },
  tableHeaderCell: {
    backgroundColor: '#F5F5F4',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  tableCellText: {
    fontSize: 14,
    color: '#292524',
  },
  bottomActions: {
    gap: 12,
    marginTop: 16,
  },
  completedBanner: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    paddingVertical: 14,
  },
  completedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16A34A',
  },
  notFound: {
    fontSize: 16,
    color: '#78716C',
    textAlign: 'center',
    marginTop: 40,
  },
})
