import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"
import { getMessages, isLocale, resolveLocale } from "@chingon/shared"
import { createClient } from "@/utils/supabase/server"
import { LOCALE_COOKIE } from "./config"

// Locale resolution order: cookie → (if logged in) user_profiles.app_locale →
// resolveLocale() default. The switcher always sets the cookie, so the DB read
// only fires on a fresh device before the first switch.
// ponytail: DB hit per cookieless authed request; upgrade path = set the cookie
// in auth/callback so the profile read only ever runs once.
export default getRequestConfig(async () => {
    const store = await cookies()
    const cookieLocale = store.get(LOCALE_COOKIE)?.value

    if (isLocale(cookieLocale)) {
        return { locale: cookieLocale, messages: getMessages(cookieLocale) }
    }

    // No valid cookie: fall back to the signed-in user's saved preference.
    // Wrapped whole so a failing Supabase call (e.g. placeholder env at build
    // time) can never throw out of getRequestConfig.
    let profileLocale: string | null | undefined
    try {
        const supabase = await createClient()
        const user = (await supabase.auth.getUser()).data.user
        if (user) {
            const { data } = await supabase
                .from("user_profiles")
                .select("app_locale")
                .eq("id", user.id)
                .single()
            profileLocale = data?.app_locale
        }
    } catch {
        // Ignore — fall through to the default locale.
    }

    const locale = resolveLocale(profileLocale)
    return { locale, messages: getMessages(locale) }
})
