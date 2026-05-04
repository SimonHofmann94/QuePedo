import { useMemo, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Lock, Plus, Check } from 'lucide-react-native'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { addVocabulary } from '@/services/vocabulary'
import { getVocabList, type VocabWord } from '@chingon/shared'
import { colors, fontFamily, surface, LEVEL_COLOR, ColorFamily } from '@/constants/theme'

const LEVEL_FAMILY: Record<string, Exclude<ColorFamily, 'ink' | 'masa'>> = {
  A1: 'chili', A2: 'jade', B1: 'cielo', B2: 'maiz', C1: 'jacaranda', C2: 'rosa',
}

const POS_LABEL: Record<string, string> = {
  n: 'sustantivo',
  v: 'verbo',
  adj: 'adjetivo',
  adv: 'adverbio',
  pron: 'pronombre',
  prep: 'preposición',
  conj: 'conjunción',
  num: 'número',
  art: 'artículo',
  interj: 'interjección',
  phrase: 'frase',
}

const POS_COLOR: Record<string, ColorFamily> = {
  n: 'chili',
  v: 'jade',
  adj: 'cielo',
  adv: 'maiz',
  pron: 'jacaranda',
  prep: 'ink',
  conj: 'ink',
  num: 'rosa',
  art: 'ink',
  interj: 'rosa',
  phrase: 'rosa',
}

const FREE_LEVELS = new Set(['a1', 'a2'])

export default function VocabListLevelScreen() {
  const router = useRouter()
  const { level } = useLocalSearchParams<{ level: string }>()
  const { isPremium, presentPaywall, canAddVocabulary, refreshSubscription } = useSubscription()

  const lvl = (level || '').toLowerCase()
  const list = useMemo(() => getVocabList(lvl), [lvl])

  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState<Set<string>>(new Set())
  const [added, setAdded] = useState<Set<string>>(new Set())

  const isFree = FREE_LEVELS.has(lvl)
  const isLocked = !isFree && !isPremium

  const filtered = useMemo(() => {
    if (!list) return []
    const s = search.toLowerCase().trim()
    if (!s) return list.words
    return list.words.filter(
      (w) =>
        w.es.toLowerCase().includes(s) ||
        w.de.toLowerCase().includes(s) ||
        (w.en?.toLowerCase().includes(s) ?? false),
    )
  }, [list, search])

  const handleAdd = useCallback(
    async (w: VocabWord) => {
      if (adding.has(w.es) || added.has(w.es)) return

      if (!canAddVocabulary()) {
        presentPaywall()
        return
      }

      setAdding((prev) => new Set(prev).add(w.es))
      const translations: Record<string, string> = { de: w.de }
      if (w.en) translations.en = w.en

      const result = await addVocabulary(
        {
          term: w.es,
          translations,
          context_sentence: w.example,
          difficulty_rating: 1,
          tags: [w.pos],
          synonyms: [],
        },
        'manual',
      )

      setAdding((prev) => {
        const next = new Set(prev)
        next.delete(w.es)
        return next
      })

      if (!result.error) {
        setAdded((prev) => new Set(prev).add(w.es))
        refreshSubscription()
      } else {
        Alert.alert('¡Ay, no!', result.error)
      }
    },
    [adding, added, canAddVocabulary, presentPaywall, refreshSubscription],
  )

  // Level not found
  if (!list) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.ink[800]} />
          </TouchableOpacity>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌶</Text>
          <Text style={styles.emptyTitle}>Nivel no encontrado</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Premium gate
  if (isLocked) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.ink[800]} />
          </TouchableOpacity>
        </View>
        <View style={styles.lockedWrap}>
          <View style={styles.lockedCard}>
            <View style={styles.lockedIconCircle}>
              <Lock size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.lockedTitle}>{list.title} es Premium</Text>
            <Text style={styles.lockedDesc}>
              {list.wordCount > 0
                ? `${list.wordCount} palabras esperando para ti.`
                : 'Próximamente — estamos curando esta lista.'}
            </Text>
            <Button onPress={presentPaywall} variant="primary" size="md" style={{ marginTop: 16 }}>
              ¡Dale! Hazte Premium
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  // Empty list (free, but no words yet)
  if (list.wordCount === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.ink[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{list.title}</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌶</Text>
          <Text style={styles.emptyTitle}>Próximamente</Text>
          <Text style={styles.emptyText}>Esta lista todavía está en preparación.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const family = LEVEL_FAMILY[list.level]
  const accent = LEVEL_COLOR[list.level]

  const renderItem = ({ item }: { item: VocabWord }) => {
    const isAdded = added.has(item.es)
    const isAddingItem = adding.has(item.es)
    const article = item.gender === 'f' ? 'la ' : item.gender === 'm' ? 'el ' : ''

    return (
      <View style={styles.wordCard}>
        <View style={[styles.levelStripe, { backgroundColor: accent }]} />
        <View style={styles.wordMain}>
          <View style={styles.wordHeader}>
            <Badge color={POS_COLOR[item.pos] ?? 'ink'} variant="soft" size="sm">
              {POS_LABEL[item.pos] ?? item.pos}
            </Badge>
            <Text style={styles.rankTag}>#{item.rank}</Text>
          </View>
          <Text style={styles.wordTerm}>
            {article}
            {item.es}
          </Text>
          <Text style={styles.wordTranslation}>{item.de}</Text>
          {item.en && <Text style={styles.wordEnglish}>{item.en}</Text>}
          {item.example && (
            <Text style={styles.wordExample} numberOfLines={2}>
              {item.example}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleAdd(item)}
          disabled={isAddingItem || isAdded}
          activeOpacity={0.8}
          style={[
            styles.addBtn,
            isAdded && { backgroundColor: colors.jade[100], borderColor: colors.jade[300] },
          ]}
        >
          {isAdded ? (
            <Check size={18} color={colors.jade[700]} />
          ) : (
            <Plus size={18} color={isAddingItem ? colors.ink[400] : colors.chili[600]} />
          )}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.ink[800]} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Badge color={family} variant="solid" size="sm">
            CEFR {list.level}
          </Badge>
        </View>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{list.title}</Text>
        <Text style={styles.subtitle}>
          {list.wordCount} palabras · ordenadas por frecuencia
        </Text>
      </View>

      <View style={styles.searchRow}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar palabra…"
          style={{ flex: 1 }}
        />
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>
          Mostrando {filtered.length} de {list.wordCount}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.es + item.pos}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌶</Text>
            <Text style={styles.emptyTitle}>Nada coincide</Text>
            <Text style={styles.emptyText}>Cambia la búsqueda.</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: colors.ink[800],
  },
  titleBlock: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12, gap: 4 },
  title: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 28, color: colors.ink[800], lineHeight: 30,
  },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
  searchRow: { paddingHorizontal: 20, paddingBottom: 8 },
  countRow: { paddingHorizontal: 20, paddingBottom: 8 },
  countText: { fontFamily: fontFamily.monoBold, fontSize: 11, color: colors.ink[500] },
  list: { paddingHorizontal: 20, gap: 10, paddingBottom: 40 },
  wordCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 16, padding: 14, overflow: 'hidden',
  },
  levelStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  wordMain: { flex: 1, marginLeft: 6, gap: 2 },
  wordHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4,
  },
  rankTag: { fontFamily: fontFamily.monoBold, fontSize: 9, color: colors.ink[400] },
  wordTerm: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 20, color: colors.ink[800],
    letterSpacing: -0.3,
  },
  wordTranslation: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[600], marginTop: 2 },
  wordEnglish: { fontFamily: fontFamily.mono, fontSize: 11, color: colors.ink[400], marginTop: 1 },
  wordExample: {
    fontFamily: fontFamily.body, fontStyle: 'italic',
    fontSize: 12, color: colors.ink[500], marginTop: 6,
  },
  addBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.chili[50], borderWidth: 1, borderColor: colors.chili[200],
    alignItems: 'center', justifyContent: 'center',
  },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 60 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.ink[800] },
  emptyText: {
    fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500],
    textAlign: 'center', maxWidth: 280,
  },
  lockedWrap: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  lockedCard: {
    backgroundColor: colors.maiz[50], borderWidth: 2, borderColor: colors.maiz[300],
    borderRadius: 24, padding: 28, alignItems: 'center',
  },
  lockedIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.maiz[400],
    alignItems: 'center', justifyContent: 'center',
  },
  lockedTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 24, color: colors.ink[800],
    marginTop: 16, textAlign: 'center',
  },
  lockedDesc: {
    fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[600],
    marginTop: 8, textAlign: 'center',
  },
})
