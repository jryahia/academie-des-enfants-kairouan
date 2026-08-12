import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const VALUE_KEYS = ['joy', 'safety', 'creativity', 'growth', 'community', 'languages'] as const
const EMOJI: Record<(typeof VALUE_KEYS)[number], string> = {
  joy: '🎈',
  safety: '🛡️',
  creativity: '🎨',
  growth: '🌱',
  community: '🤝',
  languages: '🗣️',
}

export default function Values() {
  const { t } = useTranslation()
  return (
    <section id="values" className="py-20 px-4 sm:px-6">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-gradient">
        {t('values.title')}
      </h2>
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {VALUE_KEYS.map((v, i) => (
          <motion.div
            key={v}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
            className="glass rounded-2xl p-6 flex flex-col items-center gap-2"
          >
            <span className="text-4xl" aria-hidden>{EMOJI[v]}</span>
            <span className="font-display font-bold text-candy-ink">{t(`values.items.${v}`)}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
