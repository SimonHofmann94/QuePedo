import { useState } from 'react'
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { X, Check, AlertCircle } from 'lucide-react-native'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TacoBalance } from '@/components/ui/TacoBalance'
import { generateVocabulary } from '@/services/ai'
import { addVocabulary } from '@/services/vocabulary'
import { getDisplayTranslation } from '@chingon/shared'
import { useSubscription } from '@/contexts/SubscriptionContext'

interface GeneratedWord {
  term: string
  translations: Record<string, string>
  context_sentence?: string
  difficulty_rating: number
  tags: string[]
  synonyms: string[]
}

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AIGeneratorModal({ visible, onClose, onSuccess }: Props) {
  const { isPremium, tacoBalance, presentPaywall, refreshTacoBalance } = useSubscription()
  const [prompt, setPrompt] = useState('')
  const [count, setCount] = useState('5')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedWords, setGeneratedWords] = useState<GeneratedWord[]>([])
  const [savedStatus, setSavedStatus] = useState<Record<number, 'saved' | 'error' | null>>({})

  const handleGenerate = async () => {
    if (!prompt) return

    const wordCount = prompt.trim().split(/\s+/).length
    if (wordCount > 50) {
      alert('Please limit your description to 50 words.')
      return
    }

    setIsLoading(true)
    setSavedStatus({})
    try {
      const words = await generateVocabulary(prompt, parseInt(count) || 5)
      setGeneratedWords(words)
      await refreshTacoBalance()
    } catch (error: any) {
      if (error?.message === 'NO_TACOS') {
        presentPaywall()
      } else {
        alert('Failed to generate vocabulary')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    for (let i = 0; i < generatedWords.length; i++) {
      if (!savedStatus[i]) {
        const result = await addVocabulary(generatedWords[i], 'ai_generated', prompt)
        setSavedStatus(prev => ({
          ...prev,
          [i]: result.error ? 'error' : 'saved',
        }))
      }
    }
    setIsSaving(false)

    const allSaved = generatedWords.every((_, i) => savedStatus[i] === 'saved')
    if (allSaved) {
      handleReset()
      onSuccess()
    }
  }

  const handleReset = () => {
    setGeneratedWords([])
    setSavedStatus({})
    setPrompt('')
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Generate Vocabulary</Text>
          <View style={styles.headerRight}>
            <TacoBalance balance={tacoBalance} isPremium={isPremium} />
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#78716C" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {generatedWords.length === 0 ? (
            <View style={styles.form}>
              <Input
                label="Describe what you want (max 50 words)"
                value={prompt}
                onChangeText={setPrompt}
                placeholder="I want to learn words related to ordering food..."
                multiline
                numberOfLines={4}
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
              <Input
                label="Number of words"
                value={count}
                onChangeText={setCount}
                keyboardType="number-pad"
                placeholder="5"
              />

              {!isPremium && (
                <Text style={styles.tacoCost}>
                  Uses 1 {'\u{1F32E}'} per generation
                </Text>
              )}

              {isLoading ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="large" color="#F97316" />
                  <Text style={styles.loadingText}>Generating vocabulary...</Text>
                </View>
              ) : (
                <Button onPress={handleGenerate} disabled={!prompt}>
                  Generate
                </Button>
              )}
            </View>
          ) : (
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Preview</Text>
              {generatedWords.map((word, i) => (
                <View
                  key={i}
                  style={[
                    styles.wordCard,
                    savedStatus[i] === 'saved' && styles.wordCardSaved,
                    savedStatus[i] === 'error' && styles.wordCardError,
                  ]}
                >
                  <View style={styles.wordMain}>
                    <Text style={styles.wordTerm}>{word.term}</Text>
                    <Text style={styles.wordTranslation}>{getDisplayTranslation(word.translations)}</Text>
                    {word.context_sentence && (
                      <Text style={styles.wordContext}>{word.context_sentence}</Text>
                    )}
                    {word.tags.length > 0 && (
                      <View style={styles.tagsRow}>
                        {word.tags.map((tag, j) => (
                          <Badge key={j}>{tag}</Badge>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={styles.wordStatus}>
                    {savedStatus[i] === 'saved' && <Check size={18} color="#22C55E" />}
                    {savedStatus[i] === 'error' && <AlertCircle size={18} color="#EF4444" />}
                  </View>
                </View>
              ))}

              <View style={styles.previewActions}>
                <Button
                  variant="outline"
                  onPress={handleReset}
                  disabled={isSaving}
                >
                  {Object.keys(savedStatus).length > 0 ? 'Done' : 'Cancel'}
                </Button>
                <Button
                  onPress={handleSaveAll}
                  loading={isSaving}
                  disabled={generatedWords.every((_, i) => savedStatus[i] === 'saved')}
                >
                  Save All
                </Button>
              </View>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#292524',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    gap: 16,
  },
  tacoCost: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
  },
  loadingBox: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    color: '#78716C',
  },
  previewSection: {
    gap: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292524',
  },
  wordCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    padding: 14,
  },
  wordCardSaved: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  wordCardError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  wordMain: {
    flex: 1,
    gap: 4,
  },
  wordTerm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  wordTranslation: {
    fontSize: 14,
    color: '#292524',
  },
  wordContext: {
    fontSize: 12,
    color: '#78716C',
    fontStyle: 'italic',
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  wordStatus: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
})
