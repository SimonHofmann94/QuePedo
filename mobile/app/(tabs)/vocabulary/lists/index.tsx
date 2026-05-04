import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ArrowLeft, Lock } from 'lucide-react-native'
import { Badge } from '@/components/ui/Badge'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { getAllVocabLevels } from '@chingon/shared'
import { colors, fontFamily, surface, LEVEL_COLOR, ColorFamily } from '@/constants/theme'

const LEVEL_FAMILY: Record<string, Exclude<ColorFamily, 'ink' | 'masa'>> = {
  A1: 'chili', A2: 'jade', B1: 'cielo', B2: 'maiz', C1: 'jacaranda', C2: 'rosa',
}

const LEVEL_DESC: Record<string, string> = {
  A1: 'Saludos, números, familia, presente',
  A2: 'Pasado, viajes, restaurante, descripciones',
  B1: 'Subjuntivo, condicional, abstractos',
  B2: 'Negocios, política, sentimientos complejos',
  C1: 'Matices, registros, expresiones idiomáticas',
  C2: 'Literatura, dialectos, fluidez nativa',
}

const FREE_LEVELS = new Set(['A1', 'A2'])

export default function VocabListsScreen() {
  const router = useRouter()
  const { isPremium, presentPaywall } = useSubscription()
  const lists = getAllVocabLevels()

  const isFree = (code: string) => FREE_LEVELS.has(code)

  const handleLevelPress = (level: string, empty: boolean) => {
    if (empty) return
    if (!isFree(level) && !isPremium) {
      presentPaywall()
      return
    }
    router.push({
      pathname: '/(tabs)/vocabulary/lists/[level]',
      params: { level: level.toLowerCase() },
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow} activeOpacity={0.7}>
          <ArrowLeft size={18} color={colors.ink[500]} />
          <Text style={styles.backText}>Volver al cuaderno</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>VOCAB BASE · 6 NIVELES</Text>
          <Text style={styles.title}>Listas de vocabulario</Text>
          <Text style={styles.subtitle}>
            Las palabras más usadas del español, organizadas por nivel CEFR.
            Empieza con A1 y avanza hasta C2.
          </Text>
        </View>

        {!isPremium && (
          <TouchableOpacity onPress={presentPaywall} style={styles.lockBanner} activeOpacity={0.85}>
            <View style={styles.lockIcon}>
              <Lock size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lockTitle}>B1–C2 son Premium</Text>
              <Text style={styles.lockDesc}>A1 y A2 son gratis. Desbloquea los demás con un tap.</Text>
            </View>
            <Text style={styles.lockArrow}>→</Text>
          </TouchableOpacity>
        )}

        {lists.map((list) => {
          const code = list.level
          const family = LEVEL_FAMILY[code]
          const color = LEVEL_COLOR[code]
          const empty = list.wordCount === 0
          const locked = !isFree(code) && !isPremium

          return (
            <TouchableOpacity
              key={code}
              onPress={() => handleLevelPress(code, empty)}
              activeOpacity={empty || locked ? 1 : 0.85}
              style={[
                styles.levelCard,
                (locked || empty) && { opacity: 0.65 },
              ]}
            >
              <View style={styles.levelRow}>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: empty ? colors.ink[200] : locked ? colors.ink[300] : color },
                  ]}
                >
                  {locked ? (
                    <Lock size={20} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.levelBadgeText}>{code}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.levelHeader}>
                    <Text style={styles.levelTitle}>{list.title}</Text>
                  </View>
                  <Text style={styles.levelDesc}>{LEVEL_DESC[code]}</Text>
                  <View style={styles.metaRow}>
                    <Badge color={family} variant="soft" size="sm">
                      {list.wordCount} palabras
                    </Badge>
                    {empty && (
                      <Badge color="ink" variant="soft" size="sm">Próximamente</Badge>
                    )}
                    {!empty && locked && (
                      <Badge color="maiz" variant="solid" size="sm">Premium</Badge>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}

        <View style={styles.attribution}>
          <Text style={styles.attributionTitle}>Atribución</Text>
          <Text style={styles.attributionText}>
            Listas basadas en el corpus de frecuencias de doozan/spanish_data (CC-BY-4.0),
            curado y traducido para los niveles CEFR.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  backText: {
    fontFamily: fontFamily.monoBold, fontSize: 11, letterSpacing: 1.5,
    color: colors.ink[500], textTransform: 'uppercase',
  },
  header: { gap: 4, marginBottom: 8 },
  eyebrow: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 2,
    color: colors.chili[500], textTransform: 'uppercase',
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 32, color: colors.ink[800], lineHeight: 34 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500], marginTop: 4 },
  lockBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.maiz[400], borderRadius: 18, padding: 16,
  },
  lockIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  lockTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: colors.ink[800] },
  lockDesc: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ink[700], marginTop: 2 },
  lockArrow: { fontFamily: fontFamily.displayExtraBold, fontSize: 22, color: colors.ink[800] },
  levelCard: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 18, padding: 16,
  },
  levelRow: { flexDirection: 'row', gap: 14 },
  levelBadge: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  levelBadgeText: { fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: '#FFFFFF' },
  levelHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8,
  },
  levelTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.ink[800] },
  levelDesc: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ink[500], marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  attribution: {
    backgroundColor: colors.masa[50], borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.ink[100], marginTop: 6,
  },
  attributionTitle: {
    fontFamily: fontFamily.monoBold, fontSize: 11, color: colors.ink[700],
    textTransform: 'uppercase', letterSpacing: 1,
  },
  attributionText: {
    fontFamily: fontFamily.mono, fontSize: 11, color: colors.ink[500], marginTop: 6, lineHeight: 16,
  },
})
