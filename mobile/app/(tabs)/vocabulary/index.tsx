import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, Sparkles, Trash2, BookOpen } from 'lucide-react-native'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TacoBalance } from '@/components/ui/TacoBalance'
import { getUserVocabulary, deleteMultipleVocabulary } from '@/services/vocabulary'
import { translationsMatch, getDisplayTranslation, FREE_TIER_LIMITS, type UserVocabulary } from '@chingon/shared'
import { AddVocabModal } from '@/components/vocabulary/AddVocabModal'
import { AIGeneratorModal } from '@/components/vocabulary/AIGeneratorModal'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { colors, fontFamily, surface, LEVEL_COLOR } from '@/constants/theme'

type Level = keyof typeof LEVEL_COLOR
function levelFromDifficulty(d: number): Level {
  return (['A1', 'A2', 'B1', 'B2', 'C1'][Math.max(0, Math.min(4, d - 1))] as Level)
}

const LEVEL_FAMILY = {
  A1: 'chili', A2: 'jade', B1: 'cielo', B2: 'maiz', C1: 'jacaranda', C2: 'rosa',
} as const

export default function VocabularyScreen() {
  const { isPremium, tacoBalance, canAddVocabulary, presentPaywall, refreshSubscription } = useSubscription()
  const [vocab, setVocab] = useState<UserVocabulary[]>([])
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [aiModalVisible, setAiModalVisible] = useState(false)

  const loadVocab = useCallback(async () => {
    const data = await getUserVocabulary()
    setVocab(data)
  }, [])

  useEffect(() => {
    loadVocab()
  }, [loadVocab])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([loadVocab(), refreshSubscription()])
    setRefreshing(false)
  }, [loadVocab, refreshSubscription])

  const filteredVocab = vocab.filter(item =>
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    translationsMatch(item.translations, search) ||
    item.synonyms?.some(s => s.toLowerCase().includes(search.toLowerCase())),
  )

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDeleteSelected = async () => {
    Alert.alert(
      'Borrar palabras',
      `¿Borrar ${selectedIds.size} palabra(s) seleccionada(s)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true)
            const result = await deleteMultipleVocabulary(Array.from(selectedIds))
            if (result.success) {
              setSelectedIds(new Set())
              await loadVocab()
              await refreshSubscription()
            }
            setIsDeleting(false)
          },
        },
      ],
    )
  }

  const handleAddWord = () => {
    if (!canAddVocabulary()) {
      presentPaywall()
      return
    }
    setAddModalVisible(true)
  }

  const handleAiGenerate = () => {
    if (!isPremium && tacoBalance <= 0) {
      presentPaywall()
      return
    }
    setAiModalVisible(true)
  }

  const renderItem = ({ item }: { item: UserVocabulary }) => {
    const isSelected = selectedIds.has(item.id)
    const level = levelFromDifficulty(item.difficulty_rating)
    const colorFamily = LEVEL_FAMILY[level]
    return (
      <TouchableOpacity
        style={[styles.vocabItem, isSelected && styles.vocabItemSelected]}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.levelStripe, { backgroundColor: LEVEL_COLOR[level] }]} />
        <View style={styles.vocabMain}>
          <View style={styles.vocabHeader}>
            {item.tags && item.tags[0] && (
              <Badge color="jacaranda" variant="soft" size="sm">{item.tags[0]}</Badge>
            )}
            <Text style={styles.levelTag}>{level}</Text>
          </View>
          <Text style={styles.vocabTerm}>{item.term}</Text>
          <Text style={styles.vocabTranslation}>{getDisplayTranslation(item.translations)}</Text>
        </View>
        <View style={styles.difficultyRow}>
          {[1, 2, 3, 4, 5].map(d => (
            <View
              key={d}
              style={[
                styles.diffDot,
                d <= (item.difficulty_rating || 1) && { backgroundColor: colors.chili[500] },
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    )
  }

  const countDisplay = isPremium
    ? `${vocab.length} palabras`
    : `${vocab.length} / ${FREE_TIER_LIMITS.maxVocabulary} palabras`

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TU CUADERNO</Text>
          <Text style={styles.title}>Vocabulario</Text>
        </View>
        <Text style={styles.count}>{countDisplay}</Text>
      </View>

      <View style={styles.searchRow}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar palabra…"
          style={{ flex: 1 }}
        />
      </View>

      {selectedIds.size > 0 && (
        <View style={styles.selectionBar}>
          <Button variant="danger" onPress={handleDeleteSelected} loading={isDeleting} size="sm">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Trash2 size={14} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodyBold, fontSize: 13 }}>
                Borrar ({selectedIds.size})
              </Text>
            </View>
          </Button>
          <TouchableOpacity onPress={() => setSelectedIds(new Set())}>
            <Text style={styles.clearText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredVocab}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.chili[500]} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌶</Text>
            <Text style={styles.emptyTitle}>Tu cuaderno está vacío</Text>
            <Text style={styles.emptyText}>Añade tu primera palabra o pídele a la IA que te genere unas.</Text>
          </View>
        }
      />

      <View style={styles.actionRow}>
        <Button onPress={handleAddWord} variant="primary" size="md" style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Plus size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodyBold, fontSize: 14 }}>Añadir</Text>
          </View>
        </Button>
        <Button onPress={handleAiGenerate} variant="secondary" size="md" style={{ flex: 1, backgroundColor: colors.jacaranda[500] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodyBold, fontSize: 14 }}>IA generar</Text>
            {!isPremium && <TacoBalance balance={tacoBalance} style={styles.tacoPill} />}
          </View>
        </Button>
      </View>

      <AddVocabModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={() => {
          setAddModalVisible(false)
          loadVocab()
          refreshSubscription()
        }}
      />

      <AIGeneratorModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onSuccess={() => {
          setAiModalVisible(false)
          loadVocab()
          refreshSubscription()
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  eyebrow: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 2,
    color: colors.chili[500], textTransform: 'uppercase', marginBottom: 2,
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 32, color: colors.ink[800], lineHeight: 34 },
  count: { fontFamily: fontFamily.monoBold, fontSize: 11, color: colors.ink[500] },
  searchRow: { paddingHorizontal: 20, paddingBottom: 12 },
  selectionBar: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 20, paddingBottom: 12,
  },
  clearText: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
  list: { paddingHorizontal: 20, gap: 10, paddingBottom: 100 },
  vocabItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 16, padding: 14, overflow: 'hidden',
  },
  vocabItemSelected: { borderColor: colors.chili[400], backgroundColor: colors.chili[50] },
  levelStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  vocabMain: { flex: 1, marginLeft: 6 },
  vocabHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  levelTag: { fontFamily: fontFamily.monoBold, fontSize: 9, color: colors.ink[400] },
  vocabTerm: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 20, color: colors.ink[800], letterSpacing: -0.3,
  },
  vocabTranslation: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500], marginTop: 2 },
  difficultyRow: { flexDirection: 'row', gap: 3, paddingHorizontal: 6 },
  diffDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.ink[200] },
  actionRow: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: colors.ink[100], backgroundColor: surface.bg,
  },
  tacoPill: { backgroundColor: 'rgba(255,255,255,0.25)', borderWidth: 0, paddingHorizontal: 6, paddingVertical: 2 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 60 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.ink[800] },
  emptyText: {
    fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500],
    textAlign: 'center', maxWidth: 280,
  },
})
