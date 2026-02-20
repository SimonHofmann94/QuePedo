import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Globe, Lock } from 'lucide-react-native'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useSubscription } from '@/contexts/SubscriptionContext'

const SPANISH_COUNTRIES = [
  { id: 'spain', name: 'Spain', flag: '\u{1F1EA}\u{1F1F8}', region: 'Europe' },
  { id: 'mexico', name: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}', region: 'North America' },
  { id: 'colombia', name: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', region: 'South America' },
  { id: 'argentina', name: 'Argentina', flag: '\u{1F1E6}\u{1F1F7}', region: 'South America' },
  { id: 'peru', name: 'Peru', flag: '\u{1F1F5}\u{1F1EA}', region: 'South America' },
  { id: 'chile', name: 'Chile', flag: '\u{1F1E8}\u{1F1F1}', region: 'South America' },
  { id: 'venezuela', name: 'Venezuela', flag: '\u{1F1FB}\u{1F1EA}', region: 'South America' },
  { id: 'ecuador', name: 'Ecuador', flag: '\u{1F1EA}\u{1F1E8}', region: 'South America' },
  { id: 'guatemala', name: 'Guatemala', flag: '\u{1F1EC}\u{1F1F9}', region: 'Central America' },
  { id: 'cuba', name: 'Cuba', flag: '\u{1F1E8}\u{1F1FA}', region: 'Caribbean' },
  { id: 'dominican-republic', name: 'Dominican Republic', flag: '\u{1F1E9}\u{1F1F4}', region: 'Caribbean' },
  { id: 'costa-rica', name: 'Costa Rica', flag: '\u{1F1E8}\u{1F1F7}', region: 'Central America' },
]

export default function CultureScreen() {
  const router = useRouter()
  const { isPremium, presentPaywall } = useSubscription()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Culture</Text>
          <Text style={styles.subtitle}>Explore the Spanish-speaking world</Text>
        </View>

        {/* Lock overlay for free users */}
        {!isPremium && (
          <Card style={styles.lockBanner}>
            <Lock size={28} color="#D97706" />
            <Text style={styles.lockTitle}>Premium Feature</Text>
            <Text style={styles.lockDesc}>Unlock cultural content with Premium</Text>
            <Button onPress={presentPaywall} style={{ marginTop: 8 }}>
              Unlock Culture
            </Button>
          </Card>
        )}

        <Card style={styles.mapPlaceholder}>
          <Globe size={48} color="#F97316" />
          <Text style={styles.mapText}>Interactive Map</Text>
          <Text style={styles.mapSubtext}>Select a country below to explore</Text>
        </Card>

        <Text style={styles.sectionTitle}>Spanish-Speaking Countries</Text>

        <View style={!isPremium ? styles.teaserContent : undefined}>
          {SPANISH_COUNTRIES.map((country) => (
            <TouchableOpacity
              key={country.id}
              onPress={() => {
                if (isPremium) {
                  router.push(`/(tabs)/culture/${country.id}`)
                } else {
                  presentPaywall()
                }
              }}
              activeOpacity={0.7}
              style={{ marginBottom: 12 }}
            >
              <Card style={styles.countryCard}>
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Badge>{country.region}</Badge>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
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
    gap: 12,
    paddingBottom: 40,
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  subtitle: {
    fontSize: 15,
    color: '#78716C',
  },
  lockBanner: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  lockTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
  },
  lockDesc: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
  },
  teaserContent: {
    opacity: 0.5,
  },
  mapPlaceholder: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 32,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
  },
  mapSubtext: {
    fontSize: 13,
    color: '#78716C',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
    marginTop: 8,
  },
  countryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  countryFlag: {
    fontSize: 32,
  },
  countryInfo: {
    flex: 1,
    gap: 4,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292524',
  },
})
