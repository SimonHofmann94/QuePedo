import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Lock } from 'lucide-react-native'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { colors, fontFamily, surface, LEVEL_COLOR, ColorFamily } from '@/constants/theme'

type LevelState = 'done' | 'current' | 'available' | 'locked'

const GRAMMAR_LEVELS: Array<{
  code: keyof typeof LEVEL_COLOR
  label: string
  desc: string
  progress: number
  state: LevelState
  colorFamily: Exclude<ColorFamily, 'ink' | 'masa'>
}> = [
  { code: 'A1', label: 'Principiante', desc: 'Saludos, verbos regulares, pronombres', progress: 100, state: 'done', colorFamily: 'chili' },
  { code: 'A2', label: 'Elemental',   desc: 'Pretérito, futuro, objetos directos',  progress: 62,  state: 'current', colorFamily: 'jade' },
  { code: 'B1', label: 'Intermedio',  desc: 'Subjuntivo, condicional, por/para',    progress: 0,   state: 'available', colorFamily: 'cielo' },
  { code: 'B2', label: 'Alto',        desc: 'Subjuntivo imperfecto, voz pasiva',     progress: 0,   state: 'available', colorFamily: 'maiz' },
  { code: 'C1', label: 'Avanzado',    desc: 'Matices, registros, expresiones',        progress: 0,   state: 'available', colorFamily: 'jacaranda' },
  { code: 'C2', label: 'Maestría',    desc: 'Fluidez nativa, literatura, dialectos', progress: 0,   state: 'available', colorFamily: 'rosa' },
]

const FREE_LEVELS = new Set(['A1', 'A2'])

export default function GrammarScreen() {
  const router = useRouter()
  const { isPremium, presentPaywall } = useSubscription()

  const isFree = (code: string) => FREE_LEVELS.has(code)

  const handleLevelPress = (level: typeof GRAMMAR_LEVELS[0]) => {
    if (!isFree(level.code) && !isPremium) {
      presentPaywall()
      return
    }
    router.push({
      pathname: '/(tabs)/grammar/chapters',
      params: { level: level.code.toLowerCase() },
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TU RUTA</Text>
          <Text style={styles.title}>Gramática</Text>
          <Text style={styles.subtitle}>
            Del «hola» al «me cae re gordo» · 6 niveles · CEFR oficial
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

        {GRAMMAR_LEVELS.map((l) => {
          const locked = !isFree(l.code) && !isPremium
          const isCurrent = l.state === 'current' && !locked
          const isDone = l.state === 'done' && !locked
          const color = LEVEL_COLOR[l.code]
          return (
            <TouchableOpacity
              key={l.code}
              onPress={() => handleLevelPress(l)}
              activeOpacity={locked ? 1 : 0.85}
              style={[
                styles.levelCard,
                locked && { opacity: 0.6 },
                isCurrent && { borderColor: color, borderWidth: 3 },
              ]}
            >
              <View style={styles.levelRow}>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: locked ? colors.ink[200] : color },
                  ]}
                >
                  {locked ? (
                    <Lock size={20} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.levelBadgeText}>{l.code}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.levelHeader}>
                    <Text style={styles.levelTitle}>Nivel {l.code}</Text>
                    {isDone && <Badge color="jade" variant="solid" size="sm">✓ Completo</Badge>}
                    {isCurrent && <Badge color="maiz" variant="solid" size="sm">⚡ Ahora</Badge>}
                  </View>
                  <Text style={styles.levelSub}>{l.label}</Text>
                  <Text style={styles.levelDesc}>{l.desc}</Text>
                  {!locked && (
                    <View style={{ marginTop: 8 }}>
                      <ProgressBar value={l.progress} color={color} height={6} />
                      <Text style={styles.progressText}>
                        {l.progress}% · {l.progress === 100 ? '¡ya lo dominas!' : isCurrent ? 'sigue así' : ''}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  header: { gap: 4, marginBottom: 8 },
  eyebrow: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 2,
    color: colors.chili[500], textTransform: 'uppercase',
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 32, color: colors.ink[800], lineHeight: 34 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
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
  levelSub: { fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.ink[600], marginTop: 2 },
  levelDesc: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ink[500], marginTop: 4 },
  progressText: {
    fontFamily: fontFamily.monoBold, fontSize: 10, color: colors.ink[500], marginTop: 4,
  },
})
