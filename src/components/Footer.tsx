import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-candy-ink/10 bg-candy-cloud/60 px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <a href="#top" className="inline-flex items-center gap-2 font-display font-bold text-lg text-candy-ink">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            {t('hero.tagline')}
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
          <ul className="space-y-1 text-candy-ink/70">
            {(['home', 'world', 'contact'] as const).map((k) => (
              <li key={k}>
                <a
                  href={k === 'home' ? '#top' : k === 'world' ? '#world' : '#contact'}
                  className="hover:text-candy-orange transition-colors"
                >
                  {t(`nav.${k}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h4 className="font-bold text-candy-ink mb-2">{t('footer.contactUs')}</h4>
          <ul className="space-y-1 text-candy-ink/70">
            <li>
              <a href="https://wa.me/21600000000" target="_blank" rel="noreferrer" className="hover:text-candy-mint transition-colors">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-candy-mint transition-colors">
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
