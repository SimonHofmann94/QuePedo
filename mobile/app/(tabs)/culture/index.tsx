import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Lock } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { getAllCultureCountries, ct } from '@chingon/shared'
import { fetchCultureCountries } from '@/services/culture'
import { colors, fontFamily, surface } from '@/constants/theme'

export default function CultureScreen() {
  const router = useRouter()
  const { i18n } = useTranslation()
  const { isPremium, presentPaywall } = useSubscription()
  // Bundled list renders instantly; CMS overrides swap in when the fetch resolves.
  const [countries, setCountries] = useState(getAllCultureCountries())

  useEffect(() => {
    let active = true
    fetchCultureCountries().then((list) => {
      if (active) setCountries(list)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>21 PAÍSES · 500M HABLANTES</Text>
          <Text style={styles.title}>Cultura</Text>
          <Text style={styles.subtitle}>Un idioma, mil formas de decirlo.</Text>
        </View>

        {!isPremium && (
          <TouchableOpacity onPress={presentPaywall} activeOpacity={0.85} style={styles.lockBanner}>
            <View style={styles.lockIcon}>
              <Lock size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lockTitle}>Cultura es Premium</Text>
              <Text style={styles.lockDesc}>Slang, comida y costumbres por región</Text>
            </View>
            <Button onPress={presentPaywall} variant="secondary" size="sm">
              Unlock
            </Button>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Países</Text>
        <View style={[styles.grid, !isPremium && { opacity: 0.5 }]}>
          {countries.map((c) => {
            const name = ct(c.name, i18n.language)
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => {
                  if (isPremium) router.push(`/(tabs)/culture/${c.id}`)
                  else presentPaywall()
                }}
                activeOpacity={0.85}
                style={styles.countryCard}
              >
                <Text style={styles.countryFlag}>{c.flag}</Text>
                <Text style={styles.countryName}>{name}</Text>
                {c.nameEs !== name && <Text style={styles.countryNameEs}>{c.nameEs}</Text>}
                {c.slang[0] && (
                  <Text style={styles.countryPhrase} numberOfLines={1}>
                    «{c.slang[0].term}»
                  </Text>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  header: { gap: 4 },
  eyebrow: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 2,
    color: colors.chili[500], textTransform: 'uppercase',
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 32, color: colors.ink[800], lineHeight: 34 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
  lockBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.cielo[500], borderRadius: 18, padding: 14,
  },
  lockIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  lockTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: '#FFFFFF' },
  lockDesc: { fontFamily: fontFamily.body, fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  sectionTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 20, color: colors.ink[800], marginTop: 4,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  countryCard: {
    width: '48%', flexGrow: 1,
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 16, padding: 14, gap: 2,
  },
  countryFlag: { fontSize: 32 },
  countryName: {
    fontFamily: fontFamily.bodyBold, fontSize: 14, color: colors.ink[800], marginTop: 4,
  },
  countryNameEs: { fontFamily: fontFamily.body, fontSize: 11, color: colors.ink[400] },
  countryPhrase: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 15, color: colors.chili[600], marginTop: 4,
  },
})
