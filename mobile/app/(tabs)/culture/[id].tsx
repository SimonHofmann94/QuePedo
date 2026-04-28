import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Badge } from '@/components/ui/Badge'
import { colors, fontFamily, surface } from '@/constants/theme'

const COUNTRY_DATA: Record<string, { name: string; flag: string; capital: string; population: string; language: string; description: string }> = {
  spain:     { name: 'España',    flag: '🇪🇸', capital: 'Madrid',         population: '47,4M', language: 'Castellano',          description: 'España es el origen del español. El castellano es la forma estándar. Destacan flamenco, tapas, la siesta y una rica tradición literaria.' },
  mexico:    { name: 'México',    flag: '🇲🇽', capital: 'Ciudad de México', population: '128,9M', language: 'Español mexicano',   description: 'México es el país hispanohablante más poblado. El español mexicano tiene un vocabulario distintivo con préstamos del náhuatl. Destacan el Día de Muertos, el mariachi y una cocina mundialmente reconocida.' },
  colombia:  { name: 'Colombia',  flag: '🇨🇴', capital: 'Bogotá',          population: '51,3M', language: 'Español colombiano',  description: 'El español colombiano destaca por su claridad. El de Bogotá se considera particularmente neutro. Destacan la cumbia, la cultura del café y gigantes literarios como Gabriel García Márquez.' },
  argentina: { name: 'Argentina', flag: '🇦🇷', capital: 'Buenos Aires',    population: '45,8M', language: 'Rioplatense',         description: 'El español argentino se distingue por el uso de «vos» y la pronunciación «sh» de «ll» e «y». Destacan el tango, el asado y el mate.' },
  peru:      { name: 'Perú',      flag: '🇵🇪', capital: 'Lima',            population: '33,4M', language: 'Español peruano',     description: 'El español peruano varía mucho por región. El de Lima se considera bastante claro. Destacan Machu Picchu, el ceviche y una rica herencia indígena.' },
  chile:     { name: 'Chile',     flag: '🇨🇱', capital: 'Santiago',        population: '19,5M', language: 'Español chileno',     description: 'El español chileno se conoce por su habla rápida y su slang único. Destacan el desierto de Atacama, las regiones vinícolas y el poeta Pablo Neruda.' },
  venezuela: { name: 'Venezuela', flag: '🇻🇪', capital: 'Caracas',         population: '28,4M', language: 'Español venezolano',  description: 'El español venezolano se caracteriza por su entonación melódica. Destacan las arepas, las playas caribeñas y la música joropo.' },
  ecuador:   { name: 'Ecuador',   flag: '🇪🇨', capital: 'Quito',           population: '17,6M', language: 'Español ecuatoriano', description: 'El español ecuatoriano varía entre la sierra y la costa. Destacan las Galápagos, la biodiversidad y la influencia del kichwa.' },
  guatemala: { name: 'Guatemala', flag: '🇬🇹', capital: 'Ciudad de Guatemala', population: '17,1M', language: 'Español guatemalteco', description: 'El español guatemalteco tiene una fuerte influencia maya. Destacan las ruinas mayas, los textiles coloridos y los mercados tradicionales.' },
  cuba:      { name: 'Cuba',      flag: '🇨🇺', capital: 'La Habana',       population: '11,3M', language: 'Español cubano',      description: 'El español cubano se caracteriza por la pérdida de consonantes finales y expresiones únicas. Destacan la salsa, los carros antiguos y los puros.' },
  'dominican-republic': { name: 'República Dominicana', flag: '🇩🇴', capital: 'Santo Domingo', population: '10,8M', language: 'Español dominicano', description: 'El español dominicano es rápido y con expresiones propias. Destacan el merengue, la bachata, el béisbol y las playas.' },
  'costa-rica': { name: 'Costa Rica', flag: '🇨🇷', capital: 'San José', population: '5,2M', language: 'Español costarricense', description: 'El español costarricense usa mucho «usted». A los locales se les llama «ticos». Destacan la biodiversidad, la filosofía «pura vida» y el ecoturismo.' },
}

export default function CultureDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const country = COUNTRY_DATA[id || '']

  if (!country) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>País no encontrado</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.ink[500]} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={styles.name}>{country.name}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
            <Badge color="chili" variant="soft" size="sm">slang</Badge>
            <Badge color="jade" variant="soft" size="sm">comida</Badge>
            <Badge color="cielo" variant="soft" size="sm">música</Badge>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoTile label="Capital" value={country.capital} />
          <InfoTile label="Población" value={country.population} />
          <InfoTile label="Idioma" value={country.language} />
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <Text style={styles.description}>{country.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: {
    fontFamily: fontFamily.monoBold, fontSize: 11, color: colors.ink[500],
    letterSpacing: 1, textTransform: 'uppercase',
  },
  hero: { alignItems: 'center', gap: 4 },
  flag: { fontSize: 72 },
  name: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 36, color: colors.ink[800], letterSpacing: -0.5,
  },
  infoGrid: { flexDirection: 'row', gap: 10 },
  infoCard: {
    flex: 1, backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center',
  },
  infoLabel: {
    fontFamily: fontFamily.monoBold, fontSize: 9, letterSpacing: 1,
    color: colors.ink[400], textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 14, color: colors.ink[800],
    textAlign: 'center', marginTop: 4,
  },
  aboutCard: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 20, padding: 18,
  },
  sectionTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 18, color: colors.ink[800], marginBottom: 10,
  },
  description: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[700], lineHeight: 22 },
  notFound: { fontFamily: fontFamily.body, fontSize: 16, color: colors.ink[500], textAlign: 'center', marginTop: 40 },
})
