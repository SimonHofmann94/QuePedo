import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { BrainCircuit, PenTool, Mic, Headphones, BookOpen, Gamepad2, Lock } from 'lucide-react-native'
import { Badge } from '@/components/ui/Badge'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { colors, fontFamily, surface } from '@/constants/theme'

type Tile = {
  title: string
  desc: string
  icon: typeof BrainCircuit
  badge: string
  badgeColor: 'chili' | 'rosa' | 'jade' | 'cielo' | 'maiz' | 'jacaranda'
  color: string
  emoji: string
  locked: boolean
  onPress: () => void
}

export default function ExercisesScreen() {
  const router = useRouter()
  const { isPremium, presentPaywall } = useSubscription()

  const exercises: Tile[] = [
    {
      title: 'Quiz de vocabulario', desc: 'Tarjetas y swipe · 2 min',
      icon: BrainCircuit, badge: 'Práctica', badgeColor: 'chili',
      color: colors.chili[500], emoji: '🎯',
      locked: false, onPress: () => router.push('/(tabs)/exercises/quiz'),
    },
    {
      title: 'Habla con AI', desc: 'Pronunciación · STT',
      icon: Mic, badge: 'AI', badgeColor: 'rosa',
      color: colors.rosa[500], emoji: '🎤',
      locked: !isPremium, onPress: () => router.push('/(tabs)/exercises/speaking'),
    },
    {
      title: 'Gramática', desc: 'Reglas + ejercicios',
      icon: BookOpen, badge: 'Core', badgeColor: 'jade',
      color: colors.jade[500], emoji: '📚',
      locked: !isPremium, onPress: () => router.push('/(tabs)/exercises/grammar'),
    },
    {
      title: 'Escucha', desc: 'Audio nativo · comprensión',
      icon: Headphones, badge: 'Audio', badgeColor: 'cielo',
      color: colors.cielo[500], emoji: '🎧',
      locked: !isPremium, onPress: () => {},
    },
    {
      title: 'Escritura', desc: 'Prompts con AI',
      icon: PenTool, badge: 'AI', badgeColor: 'jacaranda',
      color: colors.jacaranda[500], emoji: '✍️',
      locked: !isPremium, onPress: () => {},
    },
    {
      title: 'Juegos', desc: 'Aprende jugando',
      icon: Gamepad2, badge: 'Fun', badgeColor: 'maiz',
      color: colors.maiz[400], emoji: '🎮',
      locked: !isPremium, onPress: () => {},
    },
  ]

  const handlePress = (ex: Tile) => {
    if (ex.locked) presentPaywall()
    else ex.onPress()
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>PRACTICA · DOMINA</Text>
          <Text style={styles.title}>Ejercicios</Text>
          <Text style={styles.subtitle}>Seis modos — escoge el que te llame hoy.</Text>
        </View>

        {/* Daily challenge feature */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/exercises/quiz')}
          style={styles.challengeCard}
        >
          <Badge color="maiz" variant="solid" size="sm">⚡ Reto del día</Badge>
          <Text style={styles.challengeTitle}>Quiz diario · 10 palabras</Text>
          <Text style={styles.challengeDesc}>A2 · 2 min · +50 XP · +1 🔥</Text>
          <Text style={styles.challengeCta}>¡Dale! →</Text>
        </TouchableOpacity>

        {/* Grid */}
        <View style={styles.grid}>
          {exercises.map((ex, i) => (
            <TouchableOpacity key={i} onPress={() => handlePress(ex)} activeOpacity={0.8} style={styles.cardWrap}>
              <View style={[styles.card, ex.locked && { opacity: 0.5 }]}>
                <View style={[styles.iconBox, { backgroundColor: ex.color }]}>
                  <Text style={{ fontSize: 26 }}>{ex.emoji}</Text>
                </View>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{ex.title}</Text>
                  <Badge color={ex.locked ? 'maiz' : ex.badgeColor} variant="soft" size="sm">
                    {ex.locked ? 'Premium' : ex.badge}
                  </Badge>
                </View>
                <Text style={styles.cardDesc}>{ex.desc}</Text>
              </View>
              {ex.locked && (
                <View style={styles.lockBadge}>
                  <Lock size={12} color="#FFFFFF" />
                </View>
              )}
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
  header: { gap: 2 },
  eyebrow: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 2,
    color: colors.chili[500], textTransform: 'uppercase',
  },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 32, color: colors.ink[800], lineHeight: 34 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500], marginTop: 6 },
  challengeCard: {
    backgroundColor: colors.chili[500], padding: 20, borderRadius: 20, gap: 8,
  },
  challengeTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 22, color: '#FFFFFF', lineHeight: 26,
  },
  challengeDesc: { fontFamily: fontFamily.body, fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  challengeCta: {
    fontFamily: fontFamily.bodyBold, fontSize: 14, color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 4,
  },
  grid: { gap: 12 },
  cardWrap: { position: 'relative' },
  card: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 20, padding: 18, gap: 10,
  },
  iconBox: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.ink[800], flex: 1 },
  cardDesc: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
  lockBadge: {
    position: 'absolute', top: 12, right: 12,
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.ink[600],
    alignItems: 'center', justifyContent: 'center',
  },
})
