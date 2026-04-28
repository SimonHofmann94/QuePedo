import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { AlertCircle } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { signInWithEmail, signInWithGoogle } from '@/services/auth'
import { colors, fontFamily, surface } from '@/constants/theme'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleEmailSignIn() {
    if (!email || !password) return
    setError('')
    setIsLoading(true)
    try {
      const result = await signInWithEmail(email, password)
      if (result?.error) {
        setError(result.error)
      } else {
        router.replace('/')
        return
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Algo pasó')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('')
    const result = await signInWithGoogle()
    if (result?.error) setError(result.error)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <Logo size={52} />
            <Text style={styles.title}>¡Buen retorno!</Text>
            <Text style={styles.subtitle}>Entra y sigue tu camino al chingón</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={18} color={colors.rosa[600]} />
              <Text style={styles.errorText}>¡Ay, no! {error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@ejemplo.mx"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
            <Button onPress={handleEmailSignIn} loading={isLoading} variant="primary" size="lg">
              ¡Dale, entrar!
            </Button>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o sigue con</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button onPress={handleGoogleSignIn} variant="ghost" size="lg">
            Google
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta aún? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Regístrate</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: surface.card, borderWidth: 1, borderColor: colors.ink[100],
    borderRadius: 24, padding: 24, gap: 20,
  },
  header: { alignItems: 'center', gap: 8 },
  title: {
    fontFamily: fontFamily.displayExtraBold, fontSize: 28, color: colors.ink[800],
    marginTop: 12, letterSpacing: -0.5,
  },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500], textAlign: 'center' },
  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: colors.rosa[50], borderWidth: 2, borderColor: colors.rosa[200],
    borderRadius: 14, padding: 12,
  },
  errorText: { flex: 1, fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.rosa[700] },
  form: { gap: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.ink[200] },
  dividerText: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 1.5,
    color: colors.ink[400], textTransform: 'uppercase',
  },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
  footerLink: { fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.chili[600] },
})
