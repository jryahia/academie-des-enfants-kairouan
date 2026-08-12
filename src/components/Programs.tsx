import { useTranslation } from 'react-i18next'

// Placeholder program tiles. Real programs come from the client — see the open
// items round. Each card's looping 3D/Lottie icon is a later build.
const PROGRAM_SLOTS = [
  { key: 'petite', emoji: '🐣', color: '#58C778' },
  { key: 'moyenne', emoji: '🚀', color: '#4A8FE7' },
  { key: 'grande', emoji: '🎨', color: '#FF9A3C' },
  { key: 'primaire', emoji: '📚', color: '#B07BF0' },
]

export default function Programs() {
  const { t } = useTranslation()
  return (
    <section id="programs" className="py-20 px-4 sm:px-6">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
        <span className="text-gradient">{t('programs.title')}</span>
      </h2>
      <p className="mt-3 text-center text-candy-ink/60">{t('programs.subtitle')}</p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {PROGRAM_SLOTS.map((p, i) => (
          <article key={p.key} className="glass rounded-3xl p-6 text-center hover:-translate-y-1 transition-transform">
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-4xl"
              style={{ background: `${p.color}22`, boxShadow: `0 0 24px ${p.color}44` }}
              aria-hidden
            >
              {p.emoji}
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-candy-ink">
              {t('programs.comingSoon')}
            </h3>
            <span className="sr-only">{`Program ${i + 1} — ${p.key}`}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
