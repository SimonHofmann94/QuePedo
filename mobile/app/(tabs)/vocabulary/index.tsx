import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
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

export default function VocabularyScreen() {
  const router = useRouter()
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
    item.synonyms?.some(s => s.toLowerCase().includes(search.toLowerCase()))
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
      'Delete Words',
      `Delete ${selectedIds.size} selected word(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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
      ]
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
    return (
      <TouchableOpacity
        style={[styles.vocabItem, isSelected && styles.vocabItemSelected]}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.vocabMain}>
          <Text style={styles.vocabTerm}>{item.term}</Text>
          <Text style={styles.vocabTranslation}>{getDisplayTranslation(item.translations)}</Text>
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {item.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i}>{tag}</Badge>
              ))}
            </View>
          )}
        </View>
        <View style={styles.vocabRight}>
          <View style={styles.difficultyRow}>
            {[1, 2, 3, 4, 5].map(d => (
              <View
                key={d}
                style={[
                  styles.diffDot,
                  d <= (item.difficulty_rating || 1) && styles.diffDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const wordCountDisplay = isPremium
    ? `${vocab.length} words`
    : `${vocab.length} / ${FREE_TIER_LIMITS.maxVocabulary} words`

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Vocabulary</Text>
        <Text style={styles.count}>{wordCountDisplay}</Text>
      </View>

      <View style={styles.searchRow}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search vocabulary..."
          style={{ flex: 1 }}
        />
      </View>

      {selectedIds.size > 0 && (
        <View style={styles.selectionBar}>
          <Button variant="destructive" onPress={handleDeleteSelected} loading={isDeleting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Trash2 size={16} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                Delete ({selectedIds.size})
              </Text>
            </View>
          </Button>
          <TouchableOpacity onPress={() => setSelectedIds(new Set())}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredVocab}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <BookOpen size={40} color="#D6D3D1" />
            <Text style={styles.emptyText}>No vocabulary yet. Add some words to get started!</Text>
          </View>
        }
      />

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleAddWord}>
          <Plus size={22} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Add Word</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnAi]} onPress={handleAiGenerate}>
          <Sparkles size={22} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>AI Generate</Text>
          {!isPremium && (
            <TacoBalance balance={tacoBalance} style={styles.tacoPill} />
          )}
        </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  count: {
    fontSize: 13,
    color: '#78716C',
  },
  searchRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  clearText: {
    fontSize: 14,
    color: '#78716C',
  },
  list: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 20,
  },
  vocabItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 14,
    padding: 14,
  },
  vocabItemSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  vocabMain: {
    flex: 1,
    gap: 4,
  },
  vocabTerm: {
    fontSize: 17,
    fontWeight: '600',
    color: '#292524',
  },
  vocabTranslation: {
    fontSize: 14,
    color: '#78716C',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  vocabRight: {
    alignItems: 'flex-end',
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 3,
  },
  diffDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E7E5E4',
  },
  diffDotActive: {
    backgroundColor: '#F97316',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F97316',
    borderRadius: 14,
    paddingVertical: 14,
  },
  actionBtnAi: {
    backgroundColor: '#FB923C',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  tacoPill: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  empty: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
  },
})
