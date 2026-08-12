import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { AR } from './locales/ar'
import { FR } from './locales/fr'

export const LOCALES = ['ar', 'fr'] as const
export type Locale = (typeof LOCALES)[number]

export const DIRS: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', fr: 'ltr' }

// Persisted choice + browser sniff fallback (French default is safer for the
// Kairouan client audience unless the browser already prefers Arabic).
const detectInitial = (): Locale => {
  const saved = localStorage.getItem('academie-lang')
  if (saved === 'ar' || saved === 'fr') return saved
  const nav = navigator.language?.toLowerCase() || ''
  if (nav.startsWith('ar')) return 'ar'
  return 'fr'
}

export const initialLocale: Locale = detectInitial()

/* Apply the direction to the DOCUMENT, not just the content. The whole UI —
 * nav, 3D overlay labels, forms, motion direction — must mirror, not just text.
 */
export function applyDirection(locale: Locale) {
  const dir = DIRS[locale]
  document.documentElement.lang = locale
  document.documentElement.dir = dir
}

export function setLocale(locale: Locale) {
  applyDirection(locale)
  localStorage.setItem('academie-lang', locale)
  void i18n.changeLanguage(locale)
}

export function setupI18n() {
  // Ensure dir matches before first paint of translated content
  applyDirection(initialLocale)
  return i18n.use(initReactI18next).init({
    resources: {
      ar: { translation: AR },
      fr: { translation: FR },
    },
    lng: initialLocale,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    // A key is never allowed to fall back silently to the wrong language.
    returnNull: false,
    // Prevent console spam for known TBD keys; content placeholders are handled in components.
    missingKeyHandler: () => {},
    react: { useSuspense: false },
  })
}

export default i18n
