import { createClient } from '@supabase/supabase-js'
import { Platform, AppState } from 'react-native'

const isSSR = typeof window === 'undefined'

let SecureStore: typeof import('expo-secure-store') | null = null

// Only import SecureStore on native platforms (not during web SSR)
if (!isSSR && Platform.OS !== 'web') {
  SecureStore = require('expo-secure-store')
}

// Dynamically import AsyncStorage only at runtime (not during SSR)
let AsyncStorage: import('@react-native-async-storage/async-storage').AsyncStorageStatic | null = null
if (!isSSR) {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
}

/**
 * LargeSecureStore: uses expo-secure-store on native, AsyncStorage on web.
 * On native, tries SecureStore first, falls back to AsyncStorage for large values.
 * During SSR, uses in-memory storage as a no-op fallback.
 */
const memoryStore = new Map<string, string>()

class LargeSecureStore {
  async getItem(key: string) {
    if (SecureStore) {
      try {
        const value = await SecureStore.getItemAsync(key)
        if (value) return value
      } catch {
        // SecureStore unavailable, fall through
      }
    }
    if (AsyncStorage) {
      return await AsyncStorage.getItem(key)
    }
    return memoryStore.get(key) ?? null
  }

  async setItem(key: string, value: string) {
    if (SecureStore) {
      try {
        await SecureStore.setItemAsync(key, value)
        return
      } catch {
        // Value too large for SecureStore, fall through
      }
    }
    if (AsyncStorage) {
      await AsyncStorage.setItem(key, value)
    } else {
      memoryStore.set(key, value)
    }
  }

  async removeItem(key: string) {
    if (SecureStore) {
      try {
        await SecureStore.deleteItemAsync(key)
      } catch {
        // Ignore
      }
    }
    if (AsyncStorage) {
      await AsyncStorage.removeItem(key)
    } else {
      memoryStore.delete(key)
    }
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Auto-refresh tokens when app comes to foreground (skip during SSR)
if (!isSSR) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}
