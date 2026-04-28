import { View, Text, StyleSheet } from 'react-native'
import Svg, { Path, Text as SvgText } from 'react-native-svg'
import { colors, fontFamily } from '@/constants/theme'

interface LogoProps {
  size?: number
  color?: string
  textColor?: string
  showText?: boolean
}

export function Logo({
  size = 48,
  color = colors.chili[500],
  textColor = colors.ink[700],
  showText = true,
}: LogoProps) {
  return (
    <View style={styles.row}>
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Path
          d="M24 4 C36 4 44 12 44 22 C44 32 36 40 24 40 L16 40 L8 46 L10 38 C6 34 4 28 4 22 C4 12 12 4 24 4 Z"
          fill={color}
        />
        <SvgText
          x="18"
          y="28"
          fill="#FFFFFF"
          fontSize="18"
          fontWeight="900"
        >
          ¡!
        </SvgText>
      </Svg>
      {showText && (
        <Text
          style={{
            fontFamily: fontFamily.marker,
            fontSize: size * 0.56,
            color: textColor,
            letterSpacing: -0.5,
            marginLeft: 10,
          }}
        >
          ¿Qué Pedo<Text style={{ color }}>!</Text>
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
