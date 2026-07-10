import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  messages,
  DEFAULT_LOCALE,
  isLocale,
  resolveLocale,
  type Locale,
} from '@chingon/shared'
import { supabase } from '@/lib/supabase'

export const LOCALE_STORAGE_KEY = 'app_locale'

// Namespaces = the catalog's top-level keys (nav, common, …). Derived from the
// shared object so Phase 3 namespaces register automatically — no list to keep
// in sync.
const NAMESPACES = Object.keys(messages[DEFAULT_LOCALE])

/**
 * Device UI language mapped to a supported Locale (e.g. `de-DE` → `de`),
 * falling back to DEFAULT_LOCALE when the device language isn't supported.
 * `getLocales()` is synchronous; guarded because it can throw during web/
 * static-export render (mirrors the isSSR guard in lib/supabase).
 */
function deviceLocale(): Locale {
  try {
    return resolveLocale(getLocales()[0]?.languageCode)
  } catch {
    return DEFAULT_LOCALE
  }
}

// `messages` (Record<Locale, {nav, common, …}>) is already the exact shape
// i18next wants for `resources` (resources[lng][ns]) — reference it directly,
// never copy.
i18n.use(initReactI18next).init({
  resources: messages,
  lng: deviceLocale(),
  fallbackLng: DEFAULT_LOCALE,
  ns: NAMESPACES,
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

/**
 * Resolve and apply the startup locale in priority order:
 * AsyncStorage (explicit choice) → profile.app_locale (if logged in) →
 * device → DEFAULT_LOCALE. Device/default are already applied at init, so
 * this only overrides when a higher-priority source has a value.
 */
export async function bootstrapLocale(userId?: string): Promise<void> {
  const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY)
  if (isLocale(stored)) {
    await i18n.changeLanguage(stored)
    return
  }

  if (userId) {
    const { data } = await supabase
      .from('user_profiles')
      .select('app_locale')
      .eq('id', userId)
      .single()
    if (isLocale(data?.app_locale)) {
      await i18n.changeLanguage(data.app_locale)
      return
    }
  }

  await i18n.changeLanguage(deviceLocale())
}

/** Switch language live and persist to AsyncStorage + the user's profile. */
export async function setLocale(locale: Locale, userId?: string): Promise<void> {
  await i18n.changeLanguage(locale)
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale)
  if (userId) {
    await supabase.from('user_profiles').update({ app_locale: locale }).eq('id', userId)
  }
}

export default i18n
