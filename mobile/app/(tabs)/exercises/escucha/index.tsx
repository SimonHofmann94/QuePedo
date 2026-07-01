import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ArrowLeft, Headphones } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { colors, fontFamily, surface } from '@/constants/theme'

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const

export default function EscuchaSettingsScreen() {
  const router = useRouter()
  const [level, setLevel] = useState<string>('a1')

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.ink[700]} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Headphones size={28} color={colors.cielo[500]} />
          <Text style={styles.title}>Escucha y comprende</Text>
        </View>
        <Text style={styles.subtitle}>
          Escucha la frase en español y elige lo que significa
        </Text>

        <Text style={styles.label}>NIVEL CEFR</Text>
        <View style={styles.levelRow}>
          {LEVELS.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.levelChip, level === l && styles.levelChipActive]}
              onPress={() => setLevel(l)}
            >
              <Text style={[styles.levelChipText, level === l && styles.levelChipTextActive]}>
                {l.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          onPress={() =>
            router.push({ pathname: '/(tabs)/exercises/escucha/play', params: { level } })
          }
          style={{ marginTop: 8 }}
        >
          ¡Dale! Empezar
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: fontFamily.body, fontSize: 15, color: colors.ink[700] },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  title: { fontFamily: fontFamily.displayExtraBold, fontSize: 26, color: colors.ink[800], flex: 1 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[500] },
  label: {
    fontFamily: fontFamily.monoBold, fontSize: 11, letterSpacing: 1.5,
    color: colors.ink[600], textTransform: 'uppercase', marginTop: 8,
  },
  levelRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  levelChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999,
    borderWidth: 2, borderColor: colors.ink[200],
  },
  levelChipActive: { backgroundColor: colors.cielo[500], borderColor: colors.cielo[500] },
  levelChipText: { fontFamily: fontFamily.bodyBold, fontSize: 14, color: colors.ink[500] },
  levelChipTextActive: { color: '#FFFFFF' },
})
