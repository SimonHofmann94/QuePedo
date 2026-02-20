import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'

const COUNTRY_DATA: Record<string, { name: string; flag: string; capital: string; population: string; language: string; description: string }> = {
  spain: { name: 'Spain', flag: '🇪🇸', capital: 'Madrid', population: '47.4M', language: 'Castilian Spanish', description: 'Spain is the origin of the Spanish language. Castilian Spanish (castellano) is considered the standard form. Key cultural features include flamenco, tapas, siesta, and a rich literary tradition.' },
  mexico: { name: 'Mexico', flag: '🇲🇽', capital: 'Mexico City', population: '128.9M', language: 'Mexican Spanish', description: 'Mexico is the most populous Spanish-speaking country. Mexican Spanish is known for its distinctive vocabulary, including many Nahuatl loanwords. Key cultural features include Day of the Dead, mariachi, and a world-renowned cuisine.' },
  colombia: { name: 'Colombia', flag: '🇨🇴', capital: 'Bogotá', population: '51.3M', language: 'Colombian Spanish', description: 'Colombian Spanish is often praised for its clarity. Bogotá\'s Spanish is considered particularly clear and neutral. Key cultural features include cumbia music, coffee culture, and literary giants like Gabriel García Márquez.' },
  argentina: { name: 'Argentina', flag: '🇦🇷', capital: 'Buenos Aires', population: '45.8M', language: 'Rioplatense Spanish', description: 'Argentine Spanish is distinctive for its use of "vos" instead of "tú" and the "sh" pronunciation of "ll" and "y". Key cultural features include tango, asado (barbecue), and mate tea.' },
  peru: { name: 'Peru', flag: '🇵🇪', capital: 'Lima', population: '33.4M', language: 'Peruvian Spanish', description: 'Peruvian Spanish varies significantly by region. Lima Spanish is considered quite clear. Key cultural features include Machu Picchu, ceviche, and rich indigenous heritage.' },
  chile: { name: 'Chile', flag: '🇨🇱', capital: 'Santiago', population: '19.5M', language: 'Chilean Spanish', description: 'Chilean Spanish is known for its rapid speech and unique slang. Key cultural features include the Atacama Desert, wine regions, and poet Pablo Neruda.' },
  venezuela: { name: 'Venezuela', flag: '🇻🇪', capital: 'Caracas', population: '28.4M', language: 'Venezuelan Spanish', description: 'Venezuelan Spanish is characterized by its melodic intonation. Key cultural features include arepa cuisine, Caribbean beaches, and joropo music.' },
  ecuador: { name: 'Ecuador', flag: '🇪🇨', capital: 'Quito', population: '17.6M', language: 'Ecuadorian Spanish', description: 'Ecuadorian Spanish varies between the highlands and the coast. Key cultural features include the Galápagos Islands, biodiversity, and indigenous Kichwa influence.' },
  guatemala: { name: 'Guatemala', flag: '🇬🇹', capital: 'Guatemala City', population: '17.1M', language: 'Guatemalan Spanish', description: 'Guatemalan Spanish has significant Mayan language influence. Key cultural features include ancient Mayan ruins, colorful textiles, and traditional markets.' },
  cuba: { name: 'Cuba', flag: '🇨🇺', capital: 'Havana', population: '11.3M', language: 'Cuban Spanish', description: 'Cuban Spanish is characterized by dropped final consonants and unique expressions. Key cultural features include salsa music, vintage cars, and cigars.' },
  'dominican-republic': { name: 'Dominican Republic', flag: '🇩🇴', capital: 'Santo Domingo', population: '10.8M', language: 'Dominican Spanish', description: 'Dominican Spanish is rapid and has unique expressions. Key cultural features include merengue and bachata music, baseball culture, and beautiful beaches.' },
  'costa-rica': { name: 'Costa Rica', flag: '🇨🇷', capital: 'San José', population: '5.2M', language: 'Costa Rican Spanish', description: 'Costa Rican Spanish uses "usted" more than most countries. Locals are called "Ticos". Key cultural features include biodiversity, "pura vida" philosophy, and eco-tourism.' },
}

export default function CultureDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const country = COUNTRY_DATA[id || '']

  if (!country) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Country not found</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#292524" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={styles.name}>{country.name}</Text>
        </View>

        <View style={styles.infoGrid}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Capital</Text>
            <Text style={styles.infoValue}>{country.capital}</Text>
          </Card>
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Population</Text>
            <Text style={styles.infoValue}>{country.population}</Text>
          </Card>
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Language</Text>
            <Text style={styles.infoValue}>{country.language}</Text>
          </Card>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{country.description}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  scroll: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 15,
    color: '#292524',
  },
  hero: {
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: 64,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 11,
    color: '#78716C',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#292524',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#292524',
    lineHeight: 24,
  },
  notFound: {
    fontSize: 16,
    color: '#78716C',
    textAlign: 'center',
    marginTop: 40,
  },
})
