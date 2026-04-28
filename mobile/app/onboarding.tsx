import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plane, Wine, Briefcase, Home, GraduationCap, Gamepad2, Headphones, Eye, Mic } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { colors, fontFamily, surface } from '@/constants/theme'

export default function OnboardingScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    nativeLanguage: 'English',
    location: '',
    proficiencyLevel: '',
    learningGoals: [] as string[],
    learningStyle: '',
    dailyStudyMinutes: 15,
  })

  const updateData = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const toggleGoal = (goal: string) => {
    setFormData(prev => {
      const goals = prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal].slice(0, 3)
      return { ...prev, learningGoals: goals }
    })
  }

  const finishOnboarding = async () => {
    if (!user) return
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    const { error } = await supabase.from('user_profiles').upsert({
      id: user.id,
      first_name: formData.firstName,
      native_language: formData.nativeLanguage,
      location: formData.location,
      proficiency_level: formData.proficiencyLevel,
      learning_goals: formData.learningGoals,
      learning_style: formData.learningStyle,
      daily_study_minutes: formData.dailyStudyMinutes,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    })
    if (error) {
      Alert.alert('¡Ay, no!', 'No se pudo guardar el perfil. Inténtalo de nuevo.')
      setIsLoading(false)
    } else {
      router.replace('/(tabs)/dashboard')
    }
  }

  const languages = ['English', 'Deutsch', 'Français', 'Italiano', 'Português']
  const locations = [
    'Ya estoy en España / LatAm',
    'Estoy planeando ir',
    'Solo aprendiendo por gusto',
  ]
  const proficiencyLevels = [
    { id: 'newbie',         label: 'Novato',       desc: '«Hola» es lo único que sé.' },
    { id: 'dabbler',        label: 'Curioso',      desc: 'Pido una chela y digo gracias.' },
    { id: 'conversational', label: 'Conversador',  desc: 'Charlas básicas sobre mi día.' },
    { id: 'pro',            label: 'Pro',          desc: 'Veo La Casa de Papel sin subtítulos.' },
  ]
  const goals = [
    { id: 'tourism',  label: 'Viajes',        Icon: Plane },
    { id: 'social',   label: 'Social & citas', Icon: Wine },
    { id: 'business', label: 'Trabajo',       Icon: Briefcase },
    { id: 'living',   label: 'Vivir allá',    Icon: Home },
    { id: 'culture',  label: 'Cultura',       Icon: GraduationCap },
  ]
  const learningStyles = [
    { id: 'gamer',      label: 'El gamer',   desc: 'Quizzes, rachas, retos.',      Icon: Gamepad2 },
    { id: 'listener',   label: 'El oyente',  desc: 'Podcasts y audio.',             Icon: Headphones },
    { id: 'visualizer', label: 'El visual',  desc: 'Tarjetas y lectura.',           Icon: Eye },
    { id: 'speaker',    label: 'El hablador', desc: 'Habla y pronunciación.',        Icon: Mic },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Logo size={40} />
        </View>

        <View style={styles.card}>
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>¡Hola! Cuéntanos quién eres</Text>
              <Text style={styles.stepSubtitle}>Lo necesitamos para personalizar tu camino.</Text>

              <Text style={styles.fieldLabel}>¿Cómo te llamamos?</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(v) => updateData('firstName', v)}
                placeholder="Tu nombre"
                placeholderTextColor={colors.ink[400]}
              />

              <Text style={styles.fieldLabel}>Idioma nativo</Text>
              <View style={styles.optionList}>
                {languages.map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.option, formData.nativeLanguage === lang && styles.optionActive]}
                    onPress={() => updateData('nativeLanguage', lang)}
                  >
                    <Text style={[styles.optionText, formData.nativeLanguage === lang && styles.optionTextActive]}>
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>¿Dónde estás?</Text>
              {locations.map(loc => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.optionFull, formData.location === loc && styles.optionActive]}
                  onPress={() => updateData('location', loc)}
                >
                  <Text style={[styles.optionText, formData.location === loc && styles.optionTextActive]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}

              <Button
                onPress={() => setStep(2)}
                disabled={!formData.firstName || !formData.location}
                variant="primary"
                size="lg"
              >
                Siguiente
              </Button>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>¿Cuánto español sabes?</Text>
              <Text style={styles.stepSubtitle}>No juzgamos, prometido.</Text>
              {proficiencyLevels.map(level => (
                <TouchableOpacity
                  key={level.id}
                  style={[styles.optionFull, formData.proficiencyLevel === level.id && styles.optionActive]}
                  onPress={() => updateData('proficiencyLevel', level.id)}
                >
                  <Text style={[styles.optionTitle, formData.proficiencyLevel === level.id && styles.optionTextActive]}>
                    {level.label}
                  </Text>
                  <Text style={styles.optionDesc}>{level.desc}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.btnRow}>
                <Button variant="ghost" onPress={() => setStep(1)} style={{ flex: 1 }}>Atrás</Button>
                <Button onPress={() => setStep(3)} disabled={!formData.proficiencyLevel} style={{ flex: 1 }}>
                  Siguiente
                </Button>
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>¿Por qué aprendes español?</Text>
              <Text style={styles.stepSubtitle}>Elige hasta 3.</Text>
              <View style={styles.goalsGrid}>
                {goals.map(goal => {
                  const active = formData.learningGoals.includes(goal.id)
                  return (
                    <TouchableOpacity
                      key={goal.id}
                      style={[styles.goalCard, active && styles.optionActive]}
                      onPress={() => toggleGoal(goal.id)}
                    >
                      <goal.Icon size={22} color={active ? colors.chili[600] : colors.ink[500]} />
                      <Text style={[styles.goalText, active && styles.optionTextActive]}>
                        {goal.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <View style={styles.btnRow}>
                <Button variant="ghost" onPress={() => setStep(2)} style={{ flex: 1 }}>Atrás</Button>
                <Button onPress={() => setStep(4)} disabled={formData.learningGoals.length === 0} style={{ flex: 1 }}>
                  Siguiente
                </Button>
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>¿Cómo aprendes mejor?</Text>
              <Text style={styles.stepSubtitle}>Adaptamos el contenido a ti.</Text>
              {learningStyles.map(s => {
                const active = formData.learningStyle === s.id
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.styleOption, active && styles.optionActive]}
                    onPress={() => updateData('learningStyle', s.id)}
                  >
                    <View style={styles.styleIconBox}>
                      <s.Icon size={20} color={active ? colors.chili[600] : colors.ink[500]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionTitle, active && styles.optionTextActive]}>{s.label}</Text>
                      <Text style={styles.optionDesc}>{s.desc}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}

              <Text style={styles.fieldLabel}>¿Cuánto tiempo al día?</Text>
              <View style={styles.timeRow}>
                {[5, 15, 30].map(min => {
                  const active = formData.dailyStudyMinutes === min
                  return (
                    <TouchableOpacity
                      key={min}
                      style={[styles.timeChip, active && styles.timeChipActive]}
                      onPress={() => updateData('dailyStudyMinutes', min)}
                    >
                      <Text style={[styles.timeText, active && styles.timeTextActive]}>{min} min</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>

              <View style={styles.btnRow}>
                <Button variant="ghost" onPress={() => setStep(3)} style={{ flex: 1 }}>Atrás</Button>
                <Button onPress={() => setStep(5)} disabled={!formData.learningStyle} style={{ flex: 1 }}>
                  Siguiente
                </Button>
              </View>
            </View>
          )}

          {step === 5 && (
            <View style={styles.magicStep}>
              <ActivityIndicator size="large" color={colors.chili[500]} />
              <Text style={styles.magicTitle}>Cocinando tu plan…</Text>
              <Text style={styles.magicLine}>Analizando tu nivel…</Text>
              <Text style={styles.magicLine}>Eligiendo vocabulario chingón…</Text>
              <Text style={styles.magicLine}>{isLoading ? 'Guardando…' : 'Casi listo…'}</Text>
              <OnboardingTrigger onComplete={finishOnboarding} />
            </View>
          )}
        </View>

        {step < 5 && (
          <View style={styles.dots}>
            {[1, 2, 3, 4].map(i => (
              <View
                key={i}
                style={[
                  styles.dot,
                  step >= i
                    ? { width: 24, backgroundColor: colors.chili[500] }
                    : { width: 8, backgroundColor: colors.ink[200] },
                ]}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function OnboardingTrigger({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    onComplete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 24, padding: 24,
  },
  stepContent: { gap: 12 },
  stepTitle: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 24, color: colors.ink[800],
    textAlign: 'center', letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500],
    textAlign: 'center', marginBottom: 6,
  },
  fieldLabel: {
    fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.ink[700], marginTop: 4,
  },
  input: {
    fontFamily: fontFamily.body, backgroundColor: '#FFFFFF',
    borderWidth: 2, borderColor: colors.ink[200],
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: colors.ink[800],
  },
  optionList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 2, borderColor: colors.ink[200], borderRadius: 12, backgroundColor: '#FFFFFF',
  },
  optionFull: {
    padding: 14, borderWidth: 2, borderColor: colors.ink[200], borderRadius: 14, backgroundColor: '#FFFFFF',
  },
  optionActive: { borderColor: colors.chili[500], backgroundColor: colors.chili[50] },
  optionText: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[700] },
  optionTextActive: { fontFamily: fontFamily.bodyBold, color: colors.chili[700] },
  optionTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 16, color: colors.ink[800] },
  optionDesc: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ink[500], marginTop: 2 },
  goalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  goalCard: {
    width: '47%', flexGrow: 1, alignItems: 'center', gap: 8, padding: 14,
    borderWidth: 2, borderColor: colors.ink[200], borderRadius: 14, backgroundColor: '#FFFFFF',
  },
  goalText: { fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.ink[700], textAlign: 'center' },
  styleOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
    borderWidth: 2, borderColor: colors.ink[200], borderRadius: 14, backgroundColor: '#FFFFFF',
  },
  styleIconBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.masa[100],
    alignItems: 'center', justifyContent: 'center',
  },
  timeRow: { flexDirection: 'row', gap: 8 },
  timeChip: {
    flex: 1, paddingVertical: 12, borderWidth: 2, borderColor: colors.ink[200],
    borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center',
  },
  timeChipActive: { borderColor: colors.chili[500], backgroundColor: colors.chili[500] },
  timeText: { fontFamily: fontFamily.displayExtraBold, fontSize: 15, color: colors.ink[600] },
  timeTextActive: { color: '#FFFFFF' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  magicStep: { alignItems: 'center', gap: 10, paddingVertical: 20 },
  magicTitle: {
    fontFamily: fontFamily.marker, fontSize: 24, color: colors.chili[500], marginTop: 12,
  },
  magicLine: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 20 },
  dot: { height: 8, borderRadius: 4 },
})
