import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Badge } from '@/components/ui/Badge'
import { colors, fontFamily, surface } from '@/constants/theme'

// Verb drills: one chapter served as fill-in-blank only. The player is the
// normal grammar player — `only` narrows the session, nothing else changes.
type Drill = {
  emoji: string
  title: string
  desc: string
  level: string
  chapter: number
  color: string
  badge: string
  badgeColor: 'chili' | 'rosa' | 'jade' | 'cielo' | 'maiz' | 'jacaranda'
}

const DRILLS: Drill[] = [
  {
    emoji: '🔀', title: 'Condicional · B1',
    desc: 'Si + presente / imperfecto de subjuntivo — tipos 0, 1 y 2',
    level: 'b1', chapter: 4, color: colors.cielo[500], badge: 'B1', badgeColor: 'cielo',
  },
  {
    emoji: '🔀', title: 'Condicional · B2',
    desc: 'Los tres tipos + mixtas, con «habría/hubiera + participio»',
    level: 'b2', chapter: 2, color: colors.cielo[500], badge: 'B2', badgeColor: 'cielo',
  },
  {
    emoji: '💬', title: 'Estilo indirecto · B1',
    desc: '«Voy al cine» → dijo que iba al cine',
    level: 'b1', chapter: 12, color: colors.maiz[400], badge: 'B1', badgeColor: 'maiz',
  },
  {
    emoji: '💬', title: 'Estilo indirecto · B2',
    desc: 'Con tiempos compuestos y órdenes en subjuntivo',
    level: 'b2', chapter: 6, color: colors.maiz[400], badge: 'B2', badgeColor: 'maiz',
  },
]

export default function VerbDrillsScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.ink[500]} />
          <Text style={styles.backText}>EJERCICIOS</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>VERBOS · DOS PARTES</Text>
          <Text style={styles.title}>Rellena el verbo</Text>
          <Text style={styles.subtitle}>
            El primer verbo está a la vista. Escribe el segundo — con auxiliar si hace falta.
          </Text>
        </View>

        <View style={styles.grid}>
          {DRILLS.map((d) => (
            <TouchableOpacity
              key={`${d.level}-${d.chapter}`}
              activeOpacity={0.8}
              onPress={() =>
                router.push(
                  `/(tabs)/exercises/grammar/play?level=${d.level}&chapter=${d.chapter}&only=fill_in_blank`,
                )
              }
            >
              <View style={styles.card}>
                <View style={[styles.iconBox, { backgroundColor: d.color }]}>
                  <Text style={{ fontSize: 26 }}>{d.emoji}</Text>
                </View>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{d.title}</Text>
                  <Badge color={d.badgeColor} variant="soft" size="sm">
                    {d.badge}
                  </Badge>
                </View>
                <Text style={styles.cardDesc}>{d.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: {
    fontFamily: fontFamily.monoBold, fontSize: 11, letterSpacing: 1.5, color: colors.ink[500],
  },
  header: { gap: 2 },
  eyebrow: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 2,
    color: colors.chili[500], textTransform: 'uppercase',
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 32, color: colors.ink[800], lineHeight: 34 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500], marginTop: 6 },
  grid: { gap: 12 },
  card: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 20, padding: 18, gap: 10,
  },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.ink[800], flex: 1 },
  cardDesc: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
})
