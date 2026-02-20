import { View, Text, StyleSheet, ViewStyle } from 'react-native'

interface TacoBalanceProps {
  balance: number
  isPremium?: boolean
  style?: ViewStyle
}

export function TacoBalance({ balance, isPremium, style }: TacoBalanceProps) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={styles.text}>
        {isPremium ? '\u{1F32E} \u221E' : `\u{1F32E} ${balance}`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EA580C',
  },
})
