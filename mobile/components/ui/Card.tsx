import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors, elevation, surface } from '@/constants/theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  elevated?: boolean
  padded?: boolean
}

export function Card({ children, style, elevated = false, padded = true }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        elevated ? elevation.md : elevation.sm,
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: surface.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.ink[100],
  },
  padded: {
    padding: 20,
  },
})
