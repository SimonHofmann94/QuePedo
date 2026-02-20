import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plane, Wine, Briefcase, Home, GraduationCap, Gamepad2, Headphones, Eye, Mic } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

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

  const updateData = (key: string, value: any) => {
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

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
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
      alert('Failed to save profile. Please try again.')
      setIsLoading(false)
    } else {
      router.replace('/(tabs)/dashboard')
    }
  }

  const languages = ['English', 'German', 'French', 'Italian', 'Portuguese']
  const locations = ['I am already in Spain', 'I am planning to go', 'Just learning for fun']
  const proficiencyLevels = [
    { id: 'newbie', label: 'Newbie', desc: 'Hola is the only word I know.' },
    { id: 'dabbler', label: 'Dabbler', desc: 'I can order a beer and say thanks.' },
    { id: 'conversational', label: 'Conversational', desc: 'I can have basic chats about my day.' },
    { id: 'pro', label: 'Pro', desc: 'I can watch La Casa de Papel without subtitles.' },
  ]
  const goals = [
    { id: 'tourism', label: 'Tourism', Icon: Plane },
    { id: 'social', label: 'Social & Dating', Icon: Wine },
    { id: 'business', label: 'Business', Icon: Briefcase },
    { id: 'living', label: 'Living in Spain', Icon: Home },
    { id: 'culture', label: 'Culture', Icon: GraduationCap },
  ]
  const learningStyles = [
    { id: 'gamer', label: 'The Gamer', desc: 'Quizzes, streaks, competitions.', Icon: Gamepad2 },
    { id: 'listener', label: 'The Listener', desc: 'Podcasts and audio.', Icon: Headphones },
    { id: 'visualizer', label: 'The Visualizer', desc: 'Flashcards and reading.', Icon: Eye },
    { id: 'speaker', label: 'The Speaker', desc: 'Pronunciation and speaking.', Icon: Mic },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Let's get to know you.</Text>
            <Text style={styles.stepSubtitle}>We need a few details to personalize your experience.</Text>

            <Text style={styles.fieldLabel}>What should we call you?</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(v) => updateData('firstName', v)}
              placeholder="First Name"
              placeholderTextColor="#78716C"
            />

            <Text style={styles.fieldLabel}>Native language</Text>
            <View style={styles.optionList}>
              {languages.map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.option, formData.nativeLanguage === lang && styles.optionActive]}
                  onPress={() => updateData('nativeLanguage', lang)}
                >
                  <Text style={[styles.optionText, formData.nativeLanguage === lang && styles.optionTextActive]}>{lang}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Where are you located?</Text>
            {locations.map(loc => (
              <TouchableOpacity
                key={loc}
                style={[styles.optionFull, formData.location === loc && styles.optionActive]}
                onPress={() => updateData('location', loc)}
              >
                <Text style={[styles.optionText, formData.location === loc && styles.optionTextActive]}>{loc}</Text>
              </TouchableOpacity>
            ))}

            <Button onPress={() => setStep(2)} disabled={!formData.firstName || !formData.location}>
              Next
            </Button>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How much Spanish do you know?</Text>
            <Text style={styles.stepSubtitle}>Don't worry, we won't judge!</Text>

            {proficiencyLevels.map(level => (
              <TouchableOpacity
                key={level.id}
                style={[styles.optionFull, formData.proficiencyLevel === level.id && styles.optionActive]}
                onPress={() => updateData('proficiencyLevel', level.id)}
              >
                <Text style={[styles.optionTitle, formData.proficiencyLevel === level.id && styles.optionTextActive]}>{level.label}</Text>
                <Text style={styles.optionDesc}>{level.desc}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.btnRow}>
              <Button variant="outline" onPress={() => setStep(1)} style={{ flex: 1 }}>Back</Button>
              <Button onPress={() => setStep(3)} disabled={!formData.proficiencyLevel} style={{ flex: 1 }}>Next</Button>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Why are you learning Spanish?</Text>
            <Text style={styles.stepSubtitle}>Select up to 3.</Text>

            <View style={styles.goalsGrid}>
              {goals.map(goal => (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalCard, formData.learningGoals.includes(goal.id) && styles.optionActive]}
                  onPress={() => toggleGoal(goal.id)}
                >
                  <goal.Icon size={22} color={formData.learningGoals.includes(goal.id) ? '#F97316' : '#78716C'} />
                  <Text style={[styles.goalText, formData.learningGoals.includes(goal.id) && styles.optionTextActive]}>{goal.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.btnRow}>
              <Button variant="outline" onPress={() => setStep(2)} style={{ flex: 1 }}>Back</Button>
              <Button onPress={() => setStep(4)} disabled={formData.learningGoals.length === 0} style={{ flex: 1 }}>Next</Button>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How do you learn best?</Text>
            <Text style={styles.stepSubtitle}>We'll adapt the content for you.</Text>

            {learningStyles.map(style => (
              <TouchableOpacity
                key={style.id}
                style={[styles.styleOption, formData.learningStyle === style.id && styles.optionActive]}
                onPress={() => updateData('learningStyle', style.id)}
              >
                <View style={styles.styleIconBox}>
                  <style.Icon size={20} color={formData.learningStyle === style.id ? '#F97316' : '#78716C'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionTitle, formData.learningStyle === style.id && styles.optionTextActive]}>{style.label}</Text>
                  <Text style={styles.optionDesc}>{style.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <Text style={styles.fieldLabel}>Daily study time</Text>
            <View style={styles.timeRow}>
              {[5, 15, 30].map(min => (
                <TouchableOpacity
                  key={min}
                  style={[styles.timeChip, formData.dailyStudyMinutes === min && styles.optionActive]}
                  onPress={() => updateData('dailyStudyMinutes', min)}
                >
                  <Text style={[styles.timeText, formData.dailyStudyMinutes === min && styles.optionTextActive]}>{min} min</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.btnRow}>
              <Button variant="outline" onPress={() => setStep(3)} style={{ flex: 1 }}>Back</Button>
              <Button onPress={() => setStep(5)} disabled={!formData.learningStyle} style={{ flex: 1 }}>Next</Button>
            </View>
          </View>
        )}

        {step === 5 && (
          <View style={styles.magicStep}>
            {isLoading || !isLoading ? (
              <>
                <ActivityIndicator size="large" color="#F97316" />
                <Text style={styles.magicTitle}>Analyzing your level...</Text>
                <Text style={styles.magicSubtitle}>Curating Castilian vocabulary...</Text>
                <Text style={styles.magicSubtitle}>Building your custom path...</Text>
              </>
            ) : null}
            {/* Auto-trigger onboarding completion */}
            <OnboardingTrigger onComplete={finishOnboarding} />
          </View>
        )}

        {/* Progress dots */}
        {step < 5 && (
          <View style={styles.dots}>
            {[1, 2, 3, 4].map(i => (
              <View
                key={i}
                style={[
                  styles.dot,
                  step >= i ? styles.dotActive : styles.dotInactive,
                  step >= i && { width: 16 },
                ]}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// Small component to trigger finishOnboarding on mount
function OnboardingTrigger({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    onComplete()
  }, [])
  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  stepContent: {
    gap: 14,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#292524',
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#78716C',
    textAlign: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#78716C',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#292524',
  },
  optionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
  },
  optionFull: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
  },
  optionActive: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  optionText: {
    fontSize: 14,
    color: '#292524',
  },
  optionTextActive: {
    color: '#F97316',
    fontWeight: '600',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#292524',
  },
  optionDesc: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalCard: {
    width: '47%',
    flexGrow: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  goalText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#292524',
    textAlign: 'center',
  },
  styleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
  },
  styleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeChip: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#292524',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  magicStep: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 40,
  },
  magicTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
  },
  magicSubtitle: {
    fontSize: 14,
    color: '#78716C',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#F97316',
  },
  dotInactive: {
    backgroundColor: '#E7E5E4',
  },
})
