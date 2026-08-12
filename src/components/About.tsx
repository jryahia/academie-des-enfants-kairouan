import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()
  return (
    <section id="about" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
        <span className="text-gradient">{t('about.title')}</span>
      </h2>
      <p className="mt-6 text-center text-slate-300 text-lg leading-relaxed">{t('about.body')}</p>
    </section>
  )
}
