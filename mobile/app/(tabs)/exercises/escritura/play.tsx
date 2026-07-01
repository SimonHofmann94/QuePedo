import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Send } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { buildWritingPrompt, countWords, type WritingResult } from '@chingon/shared'
import { getWritingFeedback } from '@/services/writingExercise'
import { colors, fontFamily, surface } from '@/constants/theme'

export default function EscrituraPlayScreen() {
  const router = useRouter()
  const { level, chapter: chapterParam } = useLocalSearchParams<{ level: string; chapter: string }>()
  const chapterId = parseInt(chapterParam || '0', 10)
  const prompt = buildWritingPrompt(level || 'a1', chapterId)

  const [text, setText] = useState('')
  const [isGrading, setIsGrading] = useState(false)

  if (!prompt) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.ink[700]} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
          <Text style={styles.errorTitle}>¡Ay, no! No encontramos este tema.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const words = countWords(text)

  const handleSubmit = async () => {
    if (!text.trim() || isGrading) return
    setIsGrading(true)
    const feedback = await getWritingFeedback(prompt.level, prompt.chapterId, text)
    const result: WritingResult = { prompt, text, feedback }
    router.replace({
      pathname: '/(tabs)/exercises/escritura/results',
      params: { result: JSON.stringify(result) },
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.ink[500]} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Prompt card */}
          <View style={styles.promptCard}>
            <Text style={styles.promptChapter}>{prompt.chapterTitle.toUpperCase()}</Text>
            <Text style={styles.promptText}>{prompt.prompt}</Text>
            {prompt.guidance.map((g) => (
              <Text key={g} style={styles.guidance}>• {g}</Text>
            ))}
          </View>

          {/* Writing area */}
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe aquí tu texto en español…"
            placeholderTextColor={colors.ink[400]}
            multiline
            textAlignVertical="top"
            autoCorrect={false}
            style={styles.input}
          />
          <Text style={[styles.wordCount, words >= prompt.minWords && styles.wordCountOk]}>
            {words} {words === 1 ? 'palabra' : 'palabras'} · meta {prompt.minWords}
          </Text>
        </ScrollView>

        <View style={styles.bottomAction}>
          <Button onPress={handleSubmit} disabled={!text.trim() || isGrading} loading={isGrading}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Send size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodyBold, fontSize: 16 }}>
                ¡Dale! Revisar
              </Text>
            </View>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: fontFamily.body, fontSize: 15, color: colors.ink[500] },
  scroll: { padding: 20, gap: 16, paddingBottom: 8 },
  errorContainer: { padding: 20, gap: 16 },
  errorTitle: { fontFamily: fontFamily.body, fontSize: 16, color: colors.rosa[600], marginTop: 20 },
  promptCard: {
    backgroundColor: colors.jacaranda[50], borderWidth: 2, borderColor: colors.jacaranda[200],
    borderRadius: 20, padding: 18, gap: 8,
  },
  promptChapter: {
    fontFamily: fontFamily.monoBold, fontSize: 11, letterSpacing: 1,
    color: colors.jacaranda[600],
  },
  promptText: { fontFamily: fontFamily.displayExtraBold, fontSize: 19, color: colors.ink[800], lineHeight: 26 },
  guidance: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink[600], lineHeight: 20 },
  input: {
    minHeight: 180, backgroundColor: surface.card, borderWidth: 2, borderColor: colors.ink[200],
    borderRadius: 14, padding: 16, fontFamily: fontFamily.body, fontSize: 16, color: colors.ink[800],
  },
  wordCount: { fontFamily: fontFamily.mono, fontSize: 12, color: colors.ink[400] },
  wordCountOk: { color: colors.jade[600] },
  bottomAction: { padding: 20, paddingBottom: 12 },
})
