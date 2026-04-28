import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native'
import { useState, forwardRef } from 'react'
import { colors, fontFamily, surface } from '@/constants/theme'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  hint?: string
  containerStyle?: ViewStyle
  leftIcon?: React.ReactNode
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, containerStyle, style, leftIcon, ...props },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false)

  const borderColor = error
    ? colors.rosa[400]
    : isFocused
      ? colors.chili[400]
      : colors.ink[200]

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrap,
          { borderColor },
          isFocused && !error && styles.inputWrapFocused,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.ink[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {!error && hint && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 13,
    color: colors.ink[700],
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surface.card,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputWrapFocused: {
    shadowColor: colors.chili[100],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: 15,
    color: colors.ink[800],
    paddingVertical: 0,
  },
  hint: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    color: colors.ink[400],
  },
  error: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 12,
    color: colors.rosa[600],
  },
})
