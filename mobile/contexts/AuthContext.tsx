import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { posthog } from '@/lib/posthog'

interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
  onboardingCompleted: boolean | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  onboardingCompleted: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        checkOnboarding(session.user.id)
        const email = session.user.email
        posthog?.identify(session.user.id, email ? { email } : undefined)
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (session?.user) {
        checkOnboarding(session.user.id)
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          const email = session.user.email
          posthog?.identify(session.user.id, email ? { email } : undefined)
        }
      } else {
        setOnboardingCompleted(null)
        setIsLoading(false)
        if (event === 'SIGNED_OUT') posthog?.reset()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkOnboarding(userId: string) {
    const { data } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single()

    setOnboardingCompleted(data?.onboarding_completed ?? false)
    setIsLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setOnboardingCompleted(null)
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      isLoading,
      onboardingCompleted,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
