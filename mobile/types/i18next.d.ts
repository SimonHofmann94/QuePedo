// Typed t() keys from the shared catalog. `Messages` (= typeof en) is exactly
// the resources-per-language shape { nav: {...}, common: {...} }, so this gives
// `useTranslation('nav')` → `t('dashboard')` autocomplete with no `any`.
import type { Messages } from '@chingon/shared'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: Messages
  }
}
