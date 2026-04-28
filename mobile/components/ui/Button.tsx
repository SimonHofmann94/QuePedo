import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View } from 'react-native'
import { useState } from 'react'
import { colors, fontFamily, chunkyShadow } from '@/constants/theme'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  onPress: () => void
  children: React.ReactNode
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  style?: ViewStyle
}

const VARIANT_STYLES: Record<Variant, { bg: string; fg: string; shadow: string; border?: string }> = {
  primary:   { bg: colors.chili[500], fg: '#FFFFFF',             shadow: colors.chili[700] },
  secondary: { bg: colors.ink[700],   fg: '#FFFFFF',             shadow: colors.ink[900] },
  success:   { bg: colors.jade[500],  fg: '#FFFFFF',             shadow: colors.jade[700] },
  danger:    { bg: colors.rosa[500],  fg: '#FFFFFF',             shadow: colors.rosa[700] },
  outline:   { bg: '#FFFFFF',          fg: colors.chili[600],     shadow: colors.chili[200], border: colors.chili[300] },
  ghost:     { bg: 'transparent',      fg: colors.ink[700],       shadow: 'transparent',     border: colors.ink[200] },
}

const SIZE_STYLES: Record<Size, { height: number; padH: number; font: number; gap: number }> = {
  sm: { height: 36, padH: 14, font: 13, gap: 6 },
  md: { height: 46, padH: 20, font: 15, gap: 8 },
  lg: { height: 56, padH: 28, font: 17, gap: 10 },
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  leftIcon,
  rightIcon,
  style,
}: ButtonProps) {
  const [pressed, setPressed] = useState(false)
  const isDisabled = disabled || loading
  const v = VARIANT_STYLES[variant]
  const s = SIZE_STYLES[size]

  const buttonStyle: ViewStyle = {
    height: s.height,
    paddingHorizontal: s.padH,
    backgroundColor: isDisabled ? colors.ink[200] : v.bg,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    borderWidth: v.border ? 2 : 0,
    borderColor: v.border,
    ...(isDisabled || variant === 'ghost' ? {} : chunkyShadow(v.shadow)),
    transform: [{ translateY: pressed && !isDisabled ? 4 : 0 }],
  }

  const textStyle: TextStyle = {
    color: isDisabled ? colors.ink[400] : v.fg,
    fontFamily: fontFamily.bodyBold,
    fontSize: s.font,
    letterSpacing: 0.1,
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[buttonStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} size="small" />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          {typeof children === 'string' ? <Text style={textStyle}>{children}</Text> : children}
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  )
}
