import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Globe, Lock } from 'lucide-react-native'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { colors, fontFamily, surface } from '@/constants/theme'

type ColorFam = 'chili' | 'rosa' | 'jade' | 'cielo' | 'maiz' | 'jacaranda'

const COUNTRIES: Array<{ id: string; name: string; flag: string; phrase: string; mean: string; color: ColorFam }> = [
  { id: 'mexico',    name: 'México',    flag: '🇲🇽', phrase: '¡No manches!',  mean: '¡No way!',  color: 'chili' },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷', phrase: 'Che, boludo',   mean: 'Hey güey',  color: 'cielo' },
  { id: 'spain',     name: 'España',    flag: '🇪🇸', phrase: 'Vale, tío',     mean: 'OK, tío',   color: 'maiz' },
  { id: 'colombia',  name: 'Colombia',  flag: '🇨🇴', phrase: '¡Qué chimba!',  mean: '¡Qué bien!',color: 'jade' },
  { id: 'chile',     name: 'Chile',     flag: '🇨🇱', phrase: '¡Bacán!',       mean: 'Genial',    color: 'rosa' },
  { id: 'peru',      name: 'Perú',      flag: '🇵🇪', phrase: '¡Qué chévere!', mean: 'Qué bien',  color: 'jacaranda' },
  { id: 'cuba',      name: 'Cuba',      flag: '🇨🇺', phrase: '¡Asere!',        mean: '¡Compa!',   color: 'chili' },
  { id: 'venezuela', name: 'Venezuela', flag: '🇻🇪', phrase: '¡Qué pana!',     mean: 'Qué amigo', color: 'jade' },
]

export default function CultureScreen() {
  const router = useRouter()
  const { isPremium, presentPaywall } = useSubscription()

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

        {/* Featured hero */}
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Globe size={32} color="#FFFFFF" />
          </View>
          <Badge color="chili" variant="solid" size="sm">🇲🇽 MÉXICO · ESTA SEMANA</Badge>
          <Text style={styles.featureTitle}>Slang de CDMX</Text>
          <Text style={styles.featureDesc}>«No manches», «qué padre», «va que va»</Text>
        </View>

        <Text style={styles.sectionTitle}>Países</Text>
        <View style={[styles.grid, !isPremium && { opacity: 0.5 }]}>
          {COUNTRIES.map((c) => (
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
              <Text style={styles.countryName}>{c.name}</Text>
              <Text style={styles.countryPhrase}>«{c.phrase}»</Text>
              <Text style={styles.countryMean}>{c.mean}</Text>
            </TouchableOpacity>
          ))}
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
  featureCard: {
    backgroundColor: colors.maiz[100], borderWidth: 2, borderColor: colors.maiz[300],
    borderRadius: 20, padding: 20, gap: 8, alignItems: 'flex-start',
  },
  featureIcon: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: colors.chili[500],
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  featureTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 22, color: colors.ink[800] },
  featureDesc: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[600] },
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
    fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.ink[700], marginTop: 4,
  },
  countryPhrase: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: colors.ink[800], marginTop: 4,
  },
  countryMean: { fontFamily: fontFamily.body, fontSize: 11, color: colors.ink[500] },
})
