import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { Link } from 'expo-router'
import { MessageCircle, AlertCircle } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { signUpWithEmail, signInWithGoogle } from '@/services/auth'

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
      setError("Passwords don't match")
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    const result = await signUpWithEmail(email, password)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.confirmEmail) {
      setMessage('Check your email to confirm your account, then log in.')
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
    // Auth state change in context handles navigation to onboarding
  }

  async function handleGoogleSignUp() {
    setError('')
    const result = await signInWithGoogle()
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <MessageCircle size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.logoText}>Chingon</Text>
            </View>
            <Text style={styles.title}>Start Learning Today</Text>
            <Text style={styles.subtitle}>Create your free account and begin your Spanish journey</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={18} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {message ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{message}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
            />
            <Button onPress={handleEmailSignUp} loading={isLoading}>
              Create Account
            </Button>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button onPress={handleGoogleSignUp} variant="outline">
            Google
          </Button>

          <Text style={styles.disclaimer}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
            You'll get a 14-day free trial of premium features.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    gap: 20,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  logoBox: {
    backgroundColor: '#F97316',
    padding: 8,
    borderRadius: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#292524',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#292524',
  },
  subtitle: {
    fontSize: 15,
    color: '#78716C',
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#991B1B',
  },
  successBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 12,
  },
  successText: {
    fontSize: 13,
    color: '#166534',
  },
  form: {
    gap: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E7E5E4',
  },
  dividerText: {
    fontSize: 13,
    color: '#78716C',
  },
  disclaimer: {
    fontSize: 11,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#78716C',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EA580C',
  },
})
