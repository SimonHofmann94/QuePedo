"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { LOCALES, LOCALE_LABELS, type Locale } from "@chingon/shared"
import { Button } from "@/components/ui/button"
import { setAppLocale } from "@/actions/profile"

// Language picker for the profile page. Sets the cookie + persists to the
// profile via setAppLocale, then refreshes so Server Components (and the
// nav labels) re-render in the new locale.
export function LanguageSwitcher() {
    const t = useTranslations("common")
    const activeLocale = useLocale()
    const router = useRouter()
    const [pending, startTransition] = useTransition()

    const handleSelect = (locale: Locale) => {
        if (locale === activeLocale || pending) return
        startTransition(async () => {
            const result = await setAppLocale(locale)
            if ("error" in result) {
                console.error("[profile] set locale failed:", result.error)
                return
            }
            router.refresh()
        })
    }

    return (
        <div className="rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm">
            <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-400">
                {t("appLanguage")}
            </div>
            <div className="flex flex-wrap gap-2">
                {LOCALES.map((locale) => (
                    <Button
                        key={locale}
                        size="sm"
                        variant={locale === activeLocale ? "primary" : "ghost"}
                        disabled={pending}
                        onClick={() => handleSelect(locale)}
                    >
                        {LOCALE_LABELS[locale]}
                    </Button>
                ))}
            </div>
        </div>
    )
}
