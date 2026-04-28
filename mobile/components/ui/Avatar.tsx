import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors, fontFamily } from '@/constants/theme'

interface AvatarProps {
  name?: string
  emoji?: string
  color?: string
  size?: number
  style?: ViewStyle
}

export function Avatar({
  name = '?',
  emoji,
  color = colors.chili[500],
  size = 48,
  style,
}: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: fontFamily.displayExtraBold,
          fontSize: size * 0.42,
          color: '#FFFFFF',
        }}
      >
        {emoji ?? name.charAt(0).toUpperCase()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 2,
  },
})
