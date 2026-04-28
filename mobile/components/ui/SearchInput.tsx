import { View, TextInput, StyleSheet, ViewStyle } from 'react-native'
import { Search } from 'lucide-react-native'
import { useState } from 'react'
import { colors, fontFamily, surface } from '@/constants/theme'

interface SearchInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  style?: ViewStyle
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Buscar…',
  style,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? colors.chili[400] : colors.ink[200] },
        style,
      ]}
    >
      <Search size={18} color={colors.ink[400]} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.ink[400]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCorrect={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surface.card,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: 15,
    color: colors.ink[800],
    paddingVertical: 0,
  },
})
