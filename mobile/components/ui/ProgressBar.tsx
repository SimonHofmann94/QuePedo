import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors, fontFamily } from '@/constants/theme'

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  trackColor?: string
  height?: number
  label?: string
  style?: ViewStyle
}

export function ProgressBar({
  value,
  max = 100,
  color = colors.chili[500],
  trackColor = colors.ink[100],
  height = 10,
  label,
  style,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <View style={style}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>{label}</Text>
          <Text style={styles.labelText}>{value}/{max}</Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          { height, backgroundColor: trackColor, borderRadius: height / 2 },
        ]}
      >
        <View
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: height / 2,
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelText: {
    fontFamily: fontFamily.monoBold,
    fontSize: 11,
    color: colors.ink[500],
  },
  track: {
    overflow: 'hidden',
  },
})
