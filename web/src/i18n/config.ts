// Cookie that carries the UI locale (next-intl convention). Shared by the
// request config (read) and the setAppLocale server action (write). Lives in
// its own module because a "use server" file can't export plain constants.
export const LOCALE_COOKIE = "NEXT_LOCALE"
