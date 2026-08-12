import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-white/10 px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <a href="#top" className="font-display font-bold text-lg">
            🦉 {t('hero.tagline')}
          </a>
          <p className="mt-2 text-slate-400">{t('footer.tagline')}</p>
          <p className="mt-2 text-slate-500">📍 {t('footer.location')}</p>
        </div>
        <nav aria-label={t('footer.quickLinks')}>
          <h4 className="font-bold text-slate-300 mb-2">{t('footer.quickLinks')}</h4>
          <ul className="space-y-1 text-slate-400">
            {(['about', 'programs', 'world', 'values', 'contact'] as const).map((k) => (
              <li key={k}>
                <a href={`#${k}`} className="hover:text-brand-sun transition-colors">
                  {t(`nav.${k}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h4 className="font-bold text-slate-300 mb-2">{t('footer.contactUs')}</h4>
          <ul className="space-y-1 text-slate-400">
            <li>
              <a href="https://wa.me/21600000000" target="_blank" rel="noreferrer" className="hover:text-brand-mint transition-colors">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-brand-mint transition-colors">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} {t('hero.tagline')}. {t('footer.rights')}.
      </div>
    </footer>
  )
}
