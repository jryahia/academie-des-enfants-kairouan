import { useTranslation } from 'react-i18next'
import BrandLogo from './BrandLogo'
import { WHATSAPP_URL } from '../data/contact'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="glass-card relative z-10 rounded-t-[40px] border-b-0 px-4 py-12 sm:px-6">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <a href="#top" className="inline-flex" aria-label={t('hero.tagline')}>
            <BrandLogo />
          </a>
          <p className="mt-2 text-candy-ink/70">{t('footer.tagline')}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-candy-ink/50">
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {t('footer.location')}
          </p>
        </div>
        <nav aria-label={t('footer.quickLinks')}>
          <h4 className="font-bold text-candy-ink mb-2">{t('footer.quickLinks')}</h4>
          <ul className="text-candy-ink/70">
            {(['home', 'world', 'programs', 'values', 'contact'] as const).map((k) => (
              <li key={k}>
                <a
                  href={k === 'home' ? '#top' : `#${k}`}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center transition-colors hover:text-candy-orange"
                >
                  {t(`nav.${k}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h4 className="font-bold text-candy-ink mb-2">{t('footer.contactUs')}</h4>
          <ul className="text-candy-ink/70">
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center transition-colors hover:text-candy-mint">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center transition-colors hover:text-candy-mint">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-candy-ink/50">
        © {new Date().getFullYear()} {t('hero.tagline')}. {t('footer.rights')}.
      </div>
    </footer>
  )
}
