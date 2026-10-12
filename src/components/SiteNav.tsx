import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import Icon from './Icon'
import BrandLogo from './BrandLogo'
import GlowButton from './GlowButton'
import { useEnrollment } from './MagicEnrollment'

/* Fixed site header. Transparent over the hero, turns into a white pill once
 * the page scrolls. Phones get a slide-down menu. */

const LINKS = [
  { key: 'world', href: '#world' },
  { key: 'programs', href: '#programs' },
  { key: 'values', href: '#values' },
] as const

export default function SiteNav() {
  const { t } = useTranslation()
  const { open: openEnrollment } = useEnrollment()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full px-3 py-2 transition-all duration-300 sm:px-4 ${
          scrolled || open ? 'glass-card' : 'border border-transparent'
        }`}
      >
        <a href="#top" className="min-w-0" aria-label={t('hero.tagline')}>
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('footer.quickLinks')}>
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-candy-ink transition-colors hover:bg-play-yellow"
            >
              {t(`nav.${l.key}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <GlowButton variant="orange" onClick={openEnrollment} className="hidden px-4 py-2 text-sm sm:inline-flex">
            {t('cta.enroll')}
          </GlowButton>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t('nav.menu')}
            className="grid h-11 w-11 place-items-center rounded-full bg-play-yellow text-candy-ink lg:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" strokeWidth={2.8} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={t('footer.quickLinks')}
            className="glass-card mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl p-3 lg:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
          >
            {[...LINKS, { key: 'contact', href: '#contact' } as const].map((l, i) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 font-display text-lg font-bold text-candy-ink hover:bg-white/70"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: ['#FFD21F', '#8CD62B', '#FF8A1F', '#1E63FF'][i] }}
                  aria-hidden
                />
                {t(`nav.${l.key}`)}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
