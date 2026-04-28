import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors, fontFamily } from '@/constants/theme'

interface TacoBalanceProps {
  balance: number
  isPremium?: boolean
  style?: ViewStyle
}

export function TacoBalance({ balance, isPremium, style }: TacoBalanceProps) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={styles.text}>
        {isPremium ? '🌮 ∞' : `🌮 ${balance}`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.maiz[100],
    borderWidth: 2,
    borderColor: colors.maiz[300],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 13,
    color: colors.ink[800],
  },
})
