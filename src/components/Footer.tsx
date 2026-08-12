import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-candy-ink/10 bg-white/50 px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <a href="#top" className="font-display font-bold text-lg text-candy-ink">
            🦉 {t('hero.tagline')}
          </a>
          <p className="mt-2 text-candy-ink/70">{t('footer.tagline')}</p>
          <p className="mt-2 text-candy-ink/50">📍 {t('footer.location')}</p>
        </div>
        <nav aria-label={t('footer.quickLinks')}>
          <h4 className="font-bold text-candy-ink mb-2">{t('footer.quickLinks')}</h4>
          <ul className="space-y-1 text-candy-ink/70">
            {(['about', 'programs', 'world', 'values', 'contact'] as const).map((k) => (
              <li key={k}>
                <a href={`#${k}`} className="hover:text-candy-orange transition-colors">
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
