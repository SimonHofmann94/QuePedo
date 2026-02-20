import { View, Text, StyleSheet, ViewStyle } from 'react-native'

interface BadgeProps {
  children: string
  variant?: 'default' | 'success' | 'error' | 'premium'
  style?: ViewStyle
}

export function Badge({ children, variant = 'default', style }: BadgeProps) {
  return (
    <View style={[styles.badge, variantStyles[variant].container, style]}>
      <Text style={[styles.text, variantStyles[variant].text]}>
        {children}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
})

const variantStyles = {
  default: StyleSheet.create({
    container: { backgroundColor: '#FFF7ED' },
    text: { color: '#EA580C' },
  }),
  success: StyleSheet.create({
    container: { backgroundColor: '#F0FDF4' },
    text: { color: '#16A34A' },
  }),
  error: StyleSheet.create({
    container: { backgroundColor: '#FEF2F2' },
    text: { color: '#DC2626' },
  }),
  premium: StyleSheet.create({
    container: { backgroundColor: '#FEF3C7' },
    text: { color: '#D97706' },
  }),
}
