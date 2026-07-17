import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { getCultureCountry, ct } from '@chingon/shared'
import { fetchCultureCountry } from '@/services/culture'
import { colors, fontFamily, surface } from '@/constants/theme'

export default function CultureDetailScreen() {
  const router = useRouter()
  const { i18n } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const locale = i18n.language
  // Bundled content renders instantly; CMS override swaps in when the fetch resolves.
  const [country, setCountry] = useState(() => getCultureCountry(id || ''))

  useEffect(() => {
    let active = true
    fetchCultureCountry(id || '').then((c) => {
      if (active) setCountry(c)
    })
    return () => {
      active = false
    }
  }, [id])

  if (!country) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notFoundWrap}>
          <Text style={styles.notFoundFlag}>🌎</Text>
          <Text style={styles.notFound}>¡Ay, no! País no encontrado.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={colors.ink[500]} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const name = ct(country.name, locale)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.ink[500]} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={styles.name}>{name}</Text>
          {country.nameEs !== name && <Text style={styles.nameEs}>{country.nameEs}</Text>}
          <View style={styles.badgeRow}>
            <Badge color="ink" variant="soft" size="sm">{`📍 ${country.capital}`}</Badge>
            <Badge color="ink" variant="soft" size="sm">{`👥 ${country.population}`}</Badge>
          </View>
          <Text style={styles.intro}>{ct(country.intro, locale)}</Text>
        </View>

        {/* Dato curioso */}
        <View style={styles.funFactCard}>
          <Text style={styles.funFactLabel}>💡 Dato curioso</Text>
          <Text style={styles.funFactText}>{ct(country.funFact, locale)}</Text>
        </View>

        {/* Slang */}
        <Text style={styles.sectionTitle}>Así se habla</Text>
        {country.slang.map((s) => (
          <View key={s.term} style={styles.slangCard}>
            <Text style={styles.slangTerm}>{s.term}</Text>
            <Text style={styles.slangMeaning}>{ct(s.meaning, locale)}</Text>
            {s.example && <Text style={styles.slangExample}>«{s.example}»</Text>}
          </View>
        ))}

        {/* Regional vocabulary */}
        <Text style={styles.sectionTitle}>Vocabulario local</Text>
        <View style={styles.vocabCard}>
          {country.vocabulary.map((v, i) => (
            <View key={v.es} style={[styles.vocabRow, i > 0 && styles.vocabRowBorder]}>
              <Text style={styles.vocabEs}>{v.es}</Text>
              <Text style={styles.vocabTranslation}>{ct(v.translation, locale)}</Text>
              {v.note && <Text style={styles.vocabNote}>{ct(v.note, locale)}</Text>}
            </View>
          ))}
        </View>

        {/* Sights — list only, no map on mobile v1 */}
        <Text style={styles.sectionTitle}>Qué visitar</Text>
        {country.sights.map((s) => (
          <View key={s.name} style={styles.sightCard}>
            <Text style={styles.sightEmoji}>{s.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sightName}>{s.name}</Text>
              <Text style={styles.sightDesc}>{ct(s.description, locale)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: {
    fontFamily: fontFamily.monoBold, fontSize: 11, color: colors.ink[500],
    letterSpacing: 1, textTransform: 'uppercase',
  },
  hero: { alignItems: 'center', gap: 4 },
  flag: { fontSize: 72 },
  name: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 34, color: colors.ink[800],
    letterSpacing: -0.5, textAlign: 'center',
  },
  nameEs: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[400] },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  intro: {
    fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[700],
    lineHeight: 22, marginTop: 12,
  },
  funFactCard: {
    backgroundColor: colors.maiz[100], borderWidth: 2, borderColor: colors.maiz[300],
    borderRadius: 16, padding: 16, gap: 6, marginTop: 8,
  },
  funFactLabel: {
    fontFamily: fontFamily.monoBold, fontSize: 11, letterSpacing: 1,
    color: colors.maiz[700], textTransform: 'uppercase',
  },
  funFactText: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[700], lineHeight: 21 },
  sectionTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 20, color: colors.ink[800],
    marginTop: 12, marginBottom: 2,
  },
  slangCard: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderLeftWidth: 4, borderLeftColor: colors.chili[500],
    borderRadius: 16, padding: 14, gap: 4,
  },
  slangTerm: { fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.chili[600] },
  slangMeaning: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[700], lineHeight: 19 },
  slangExample: {
    fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500],
    fontStyle: 'italic', marginTop: 2,
  },
  vocabCard: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderLeftWidth: 4, borderLeftColor: colors.jade[500],
    borderRadius: 16, overflow: 'hidden',
  },
  vocabRow: { padding: 14, gap: 2 },
  vocabRowBorder: { borderTopWidth: 1, borderTopColor: colors.ink[100] },
  vocabEs: { fontFamily: fontFamily.bodyExtraBold, fontSize: 15, color: colors.jade[700] },
  vocabTranslation: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[700] },
  vocabNote: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ink[400], marginTop: 2 },
  sightCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderLeftWidth: 4, borderLeftColor: colors.cielo[500],
    borderRadius: 16, padding: 14,
  },
  sightEmoji: { fontSize: 28 },
  sightName: { fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: colors.ink[800] },
  sightDesc: {
    fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[600],
    lineHeight: 19, marginTop: 2,
  },
  notFoundWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  notFoundFlag: { fontSize: 56 },
  notFound: { fontFamily: fontFamily.body, fontSize: 16, color: colors.ink[500], textAlign: 'center' },
})
