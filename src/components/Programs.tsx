import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Icon, { type IconName } from './Icon'
import { PLAY_COLORS } from '../data/playgroundPhotos'

interface ProgramCopy {
  age: string
  title: string
  body: string
  points: string[]
}

const STYLE: Array<{ icon: IconName; color: string; shadow: string }> = [
  { icon: 'shapes', color: PLAY_COLORS.yellow, shadow: '#C9A000' },
  { icon: 'book', color: PLAY_COLORS.lime, shadow: '#5E9A12' },
  { icon: 'cap', color: PLAY_COLORS.orange, shadow: '#C25E00' },
  { icon: 'slide', color: PLAY_COLORS.blue, shadow: '#0F3DB0' },
]

export function SectionHeading({ chip, title, subtitle, chipColor }: { chip: string; title: string; subtitle: string; chipColor: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.span
        className="inline-block rounded-full px-4 py-1.5 font-display text-sm font-extrabold text-candy-ink shadow-sm"
        style={{ background: chipColor }}
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {chip}
      </motion.span>
      <motion.h2
        className="mt-4 font-display text-4xl font-extrabold leading-tight text-candy-ink sm:text-5xl"
        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mt-3 text-base font-medium text-candy-navy sm:text-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        {subtitle}
      </motion.p>
    </div>
  )
}

export default function Programs() {
  const { t } = useTranslation()
  const items = t('programs.items', { returnObjects: true }) as unknown as ProgramCopy[]

  return (
    <section id="programs" className="relative scroll-mt-20 overflow-hidden bg-playful px-4 py-24 sm:px-6">
      {/* floating shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute start-[4%] top-24 h-20 w-20 animate-float rounded-blob bg-play-yellow/60" />
        <span className="absolute end-[6%] top-40 h-14 w-14 animate-float-slow rounded-full bg-play-blue/25" />
        <span className="absolute bottom-16 start-[45%] h-10 w-10 animate-float rounded-xl bg-play-lime/50 [animation-delay:1.2s]" />
      </div>

      <SectionHeading chip={t('nav.programs')} title={t('programs.title')} subtitle={t('programs.subtitle')} chipColor={PLAY_COLORS.yellow} />

      <div className="relative mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => {
          const s = STYLE[i % STYLE.length]
          return (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 50, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              whileHover={{ y: -8, rotate: i % 2 ? 1.2 : -1.2 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: i * 0.08 }}
              className="glass-card group relative flex flex-col rounded-[2rem] p-6"
              style={{ borderTop: `6px solid ${s.color}` }}
            >
              <div
                className="grid h-16 w-16 place-items-center rounded-2xl text-candy-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                style={{ background: s.color, boxShadow: `0 6px 0 ${s.shadow}` }}
              >
                <Icon name={s.icon} className="h-8 w-8" />
              </div>
              <span
                className="mt-5 inline-block self-start rounded-full px-3 py-1 text-xs font-extrabold text-candy-ink"
                style={{ background: `${s.color}33` }}
              >
                {p.age}
              </span>
              <h3 className="mt-2 font-display text-2xl font-extrabold text-candy-ink">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-candy-navy">{p.body}</p>
              <ul className="mt-4 space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm font-bold text-candy-ink">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-white" style={{ background: s.shadow }}>
                      <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3.2} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
