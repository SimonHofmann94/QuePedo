import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { getUserVocabulary } from '@/services/vocabulary'
import { translationsMatch, getDisplayTranslation, type UserVocabulary } from '@chingon/shared'

export default function VocabularyBrowserScreen() {
  const router = useRouter()
  const [vocab, setVocab] = useState<UserVocabulary[]>([])
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const loadVocab = useCallback(async () => {
    const data = await getUserVocabulary()
    setVocab(data)
  }, [])

  useEffect(() => {
    loadVocab()
  }, [loadVocab])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadVocab()
    setRefreshing(false)
  }, [loadVocab])

  const filteredVocab = vocab.filter(item =>
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    translationsMatch(item.translations, search) ||
    item.synonyms?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#292524" />
        </TouchableOpacity>
        <Text style={styles.title}>All Vocabulary</Text>
        <Text style={styles.count}>{filteredVocab.length}</Text>
      </View>

      <View style={styles.searchRow}>
        <SearchInput value={search} onChangeText={setSearch} placeholder="Search..." />
      </View>

      <FlatList
        data={filteredVocab}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.term}>{item.term}</Text>
              <Text style={styles.translation}>{getDisplayTranslation(item.translations)}</Text>
            </View>
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {item.tags.slice(0, 2).map((tag, i) => (
                  <Badge key={i}>{tag}</Badge>
                ))}
              </View>
            )}
          </View>
        )}
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
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  searchRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 20,
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  term: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292524',
  },
  translation: {
    fontSize: 14,
    color: '#78716C',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
  },
})
