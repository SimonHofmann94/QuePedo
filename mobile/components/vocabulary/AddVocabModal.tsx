import { useState } from 'react'
import { View, Text, Modal, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react-native'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { addVocabulary } from '@/services/vocabulary'

const formSchema = z.object({
  term: z.string().min(1, 'Term is required'),
  translation_de: z.string().optional(),
  translation_en: z.string().optional(),
  context_sentence: z.string().optional(),
  synonyms_raw: z.string().optional(),
  tags_raw: z.string().optional(),
}).refine(data => data.translation_de || data.translation_en, {
  message: 'At least one translation is required',
  path: ['translation_de'],
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddVocabModal({ visible, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: '',
      translation_de: '',
      translation_en: '',
      context_sentence: '',
      synonyms_raw: '',
      tags_raw: '',
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setError(null)

    const translations: Record<string, string> = {}
    if (data.translation_de) translations.de = data.translation_de
    if (data.translation_en) translations.en = data.translation_en

    const synonyms = data.synonyms_raw?.split(',').map(s => s.trim()).filter(Boolean) || []
    const tags = data.tags_raw?.split(',').map(s => s.trim()).filter(Boolean) || []

    const result = await addVocabulary({
      term: data.term,
      translations,
      context_sentence: data.context_sentence,
      difficulty_rating: 1,
      tags,
      synonyms,
    }, 'manual')

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else {
      reset()
      onSuccess()
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add New Word</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#78716C" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
          <Controller
            control={control}
            name="term"
            render={({ field: { onChange, value } }) => (
              <Input label="Spanish Term" value={value} onChangeText={onChange} placeholder="La casa" error={errors.term?.message} />
            )}
          />
          <Controller
            control={control}
            name="translation_de"
            render={({ field: { onChange, value } }) => (
              <Input label="German Translation" value={value} onChangeText={onChange} placeholder="Das Haus" error={errors.translation_de?.message} />
            )}
          />
          <Controller
            control={control}
            name="translation_en"
            render={({ field: { onChange, value } }) => (
              <Input label="English Translation (Optional)" value={value} onChangeText={onChange} placeholder="The house" />
            )}
          />
          <Controller
            control={control}
            name="synonyms_raw"
            render={({ field: { onChange, value } }) => (
              <Input label="Synonyms (comma separated)" value={value} onChangeText={onChange} placeholder="hogar, vivienda" />
            )}
          />
          <Controller
            control={control}
            name="tags_raw"
            render={({ field: { onChange, value } }) => (
              <Input label="Tags (comma separated)" value={value} onChangeText={onChange} placeholder="noun, building" />
            )}
          />
          <Controller
            control={control}
            name="context_sentence"
            render={({ field: { onChange, value } }) => (
              <Input label="Context Sentence (Optional)" value={value} onChangeText={onChange} placeholder="Vivo en una casa grande." />
            )}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Button onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={{ marginTop: 8 }}>
            Add Word
          </Button>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#292524',
  },
  form: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  error: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
  },
})
