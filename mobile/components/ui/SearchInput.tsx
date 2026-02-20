import { View, TextInput, StyleSheet, ViewStyle } from 'react-native'
import { Search } from 'lucide-react-native'
import { useState } from 'react'

interface SearchInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  style?: ViewStyle
}

export function SearchInput({ value, onChangeText, placeholder = 'Search...', style }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={[styles.container, isFocused && styles.containerFocused, style]}>
      <Search size={18} color="#78716C" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#78716C"
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  containerFocused: {
    borderColor: '#FB923C',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#292524',
  },
})
