import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Icon, { type IconName } from './Icon'
import { SectionHeading } from './Programs'
import { PLAY_COLORS } from '../data/playgroundPhotos'

const VALUES: Array<{ key: string; icon: IconName; color: string }> = [
  { key: 'joy', icon: 'smile', color: PLAY_COLORS.yellow },
  { key: 'safety', icon: 'shield', color: PLAY_COLORS.blue },
  { key: 'creativity', icon: 'palette', color: PLAY_COLORS.pink },
  { key: 'growth', icon: 'sprout', color: PLAY_COLORS.lime },
  { key: 'community', icon: 'users', color: PLAY_COLORS.orange },
  { key: 'languages', icon: 'languages', color: PLAY_COLORS.blue },
]

export default function Values() {
  const { t } = useTranslation()
  return (
    <section
      id="values"
      className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-6"
      style={{
        backgroundColor: '#FFFDF4',
        backgroundImage: 'radial-gradient(rgba(30,99,255,0.12) 1.6px, transparent 1.6px)',
        backgroundSize: '26px 26px',
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute start-[12%] top-[30%] h-56 w-56 rounded-full bg-play-yellow/40 blur-3xl" />
        <span className="absolute bottom-[10%] end-[14%] h-64 w-64 rounded-full bg-play-blue/20 blur-3xl" />
        <span className="absolute bottom-[30%] start-[45%] h-40 w-40 rounded-full bg-play-pink/20 blur-3xl" />
      </div>
      <SectionHeading chip={t('nav.values')} title={t('values.title')} subtitle={t('values.subtitle')} chipColor={PLAY_COLORS.lime} />

      <div className="relative mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.key}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 17, delay: (i % 3) * 0.08 }}
            className="glass-card group flex items-start gap-4 rounded-[1.75rem] p-5"
          >
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-blob text-white transition-transform duration-500 group-hover:rotate-[18deg] group-hover:scale-110"
              style={{ background: v.color, color: v.color === PLAY_COLORS.yellow || v.color === PLAY_COLORS.lime ? '#13235B' : '#fff' }}
            >
              <Icon name={v.icon} className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display text-xl font-extrabold text-candy-ink">{t(`values.items.${v.key}`)}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-candy-navy">{t(`values.descs.${v.key}`)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
