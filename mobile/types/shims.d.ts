// Type shim: react-native-safe-area-context's SafeAreaView under React 19 loses
// `style` and other ViewProps in its forwarded-ref typings. Extend the module
// interface so consumers can pass `style`, `testID`, etc. without TS errors.
import type { ViewProps } from 'react-native'

declare module 'react-native-safe-area-context' {
  export interface NativeSafeAreaViewProps extends ViewProps {
    children?: React.ReactNode
    mode?: 'padding' | 'margin'
    edges?: readonly ('top' | 'right' | 'bottom' | 'left')[] | Readonly<Partial<Record<'top' | 'right' | 'bottom' | 'left', 'off' | 'additive' | 'maximum'>>>
  }
}
