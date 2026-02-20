import { supabase } from '@/lib/supabase'
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  // Record activity (non-blocking, don't let it break login)
  if (data.user) {
    supabase.rpc('record_user_activity', { p_user_id: data.user.id }).then(() => {}).catch(() => {})
  }

  return { data }
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) return { error: error.message }

  // If email confirmation is required, session will be null
  if (data.user && !data.session) {
    return { data, confirmEmail: true }
  }

  return { data }
}

export async function signInWithGoogle() {
  const redirectTo = makeRedirectUri()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  })

  if (error) return { error: error.message }
  if (!data.url) return { error: 'No auth URL returned' }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)

  if (result.type === 'success') {
    const url = new URL(result.url)
    const params = new URLSearchParams(url.hash.substring(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      if (sessionError) return { error: sessionError.message }
      return { success: true }
    }
  }

  return { error: 'Authentication cancelled' }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) return { error: error.message }
  return { success: true }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}
