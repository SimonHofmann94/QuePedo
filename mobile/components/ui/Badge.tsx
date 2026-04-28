import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors, fontFamily, ColorFamily } from '@/constants/theme'

type Variant = 'solid' | 'soft' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: React.ReactNode
  color?: ColorFamily
  variant?: Variant
  size?: Size
  style?: ViewStyle
}

export function Badge({
  children,
  color = 'chili',
  variant = 'solid',
  size = 'md',
  style,
}: BadgeProps) {
  const palette = colors[color] as Record<string | number, string>
  const solidBg = color === 'maiz' ? palette[400] : palette[500]
  const solidFg = color === 'maiz' ? colors.ink[800] : '#FFFFFF'

  const lookup = {
    solid:   { bg: solidBg,       fg: solidFg,        border: 'transparent' },
    soft:    { bg: palette[100],  fg: palette[700],   border: 'transparent' },
    outline: { bg: 'transparent', fg: palette[600],   border: palette[300] },
  } as const
  const v = lookup[variant]

  const sizeLookup = {
    sm: { padH: 8,  padV: 3, font: 10 },
    md: { padH: 10, padV: 5, font: 11 },
    lg: { padH: 14, padV: 7, font: 13 },
  } as const
  const s = sizeLookup[size]

  return (
    <View
      style={[
        styles.badge,
        {
          paddingHorizontal: s.padH,
          paddingVertical: s.padV,
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: s.font, color: v.fg },
        ]}
      >
        {typeof children === 'string' ? children.toUpperCase() : children}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontFamily: fontFamily.monoBold,
    letterSpacing: 0.5,
  },
})
