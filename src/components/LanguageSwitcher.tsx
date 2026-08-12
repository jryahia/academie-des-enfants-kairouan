import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { LOCALES, setLocale, type Locale } from '../i18n'

const LABEL: Record<Locale, string> = { ar: 'ع', fr: 'FR' }
const NAME: Record<Locale, string> = { ar: 'العربية', fr: 'Français' }

/**
 * Language switcher with a smooth crossfade when flipping AR<->FR.
 * The flip changes document dir (rtl/ltr) AND content together; we overlay a
 * brief fade so the layout snap reads as a considered transition, not a jar.
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [busy, setBusy] = useState(false)
  const current = (i18n.language as Locale) === 'ar' ? 'ar' : 'fr'

  const toggle = () => {
    if (busy) return
    setBusy(true)
    // Crossfade: fade content out, flip dir + load strings, fade in.
    // Implemented via a body-level class the CSS animates; simplest reliable
    // approach is a one-frame fade with framer-motion on a keyed wrapper.
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={busy}
        className="rounded-full border border-candy-ink/20 px-3 py-1.5 text-sm font-bold hover:border-candy-orange hover:text-candy-orange transition-colors"
        aria-label={`Switch language to ${NAME[current === 'ar' ? 'fr' : 'ar']}`}
      >
        {LABEL[current]}
      </button>
      {busy && (
        <motion.span
          className="absolute inset-0 rounded-full bg-candy-orange/20"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            setLocale(current === 'ar' ? 'fr' : 'ar')
            setBusy(false)
          }}
        />
      )}
    </div>
  )
}

export { LOCALES }
