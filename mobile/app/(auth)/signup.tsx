import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { Link } from 'expo-router'
import { AlertCircle } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { signUpWithEmail, signInWithGoogle } from '@/services/auth'
import { colors, fontFamily, surface } from '@/constants/theme'

export default function SignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleEmailSignUp() {
    setError('')
    setMessage('')
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña necesita al menos 6 caracteres')
      return
    }
    setIsLoading(true)
    const result = await signUpWithEmail(email, password)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.confirmEmail) {
      setMessage('Revisa tu email para confirmar la cuenta, luego entra.')
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignUp() {
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
            <Text style={styles.title}>Empieza hoy</Text>
            <Text style={styles.subtitle}>Crea tu cuenta gratis · empieza tu camino al chingón</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={18} color={colors.rosa[600]} />
              <Text style={styles.errorText}>¡Ay, no! {error}</Text>
            </View>
          ) : null}

          {message ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>¡Órale! {message}</Text>
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
            <Input
              label="Confirma contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
            />
            <Button onPress={handleEmailSignUp} loading={isLoading} variant="primary" size="lg">
              ¡Dale, crear cuenta!
            </Button>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o sigue con</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button onPress={handleGoogleSignUp} variant="ghost" size="lg">
            Google
          </Button>

          <Text style={styles.disclaimer}>
            Al registrarte, aceptas nuestros Términos y la Política de Privacidad.
            Te damos 14 días gratis de premium 🌶
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Entrar</Text>
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
  successBox: {
    backgroundColor: colors.jade[50], borderWidth: 2, borderColor: colors.jade[200],
    borderRadius: 14, padding: 12,
  },
  successText: { fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.jade[700] },
  form: { gap: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.ink[200] },
  dividerText: {
    fontFamily: fontFamily.monoBold, fontSize: 10, letterSpacing: 1.5,
    color: colors.ink[400], textTransform: 'uppercase',
  },
  disclaimer: {
    fontFamily: fontFamily.body, fontSize: 11, color: colors.ink[500],
    textAlign: 'center', lineHeight: 16,
  },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontFamily: fontFamily.body, fontSize: 13, color: colors.ink[500] },
  footerLink: { fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.chili[600] },
})
