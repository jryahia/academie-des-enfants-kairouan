import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

/* =========================================================================
  About — mission text + a fresh photo feature (real academy shot framed in
  the candy style) with a floating stat chip. Symmetrical on desktop, stacked
  on mobile. dir-aware without hardcoding.
  ========================================================================= */

export default function About() {
  const { t } = useTranslation()
  return (
    <section id="about" className="py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
          <span className="text-gradient">{t('about.title')}</span>
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
          {/* photo feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-candy-ink/15 rotate-[-1.5deg]">
              <img
                src="/images/classroom-group.webp"
                alt=""
                loading="lazy"
                className="w-full h-64 sm:h-80 object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              {/* candy frame accent */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 30%, transparent 70%, rgba(74,143,231,0.25) 100%)',
                }}
              />
            </div>
            {/* floating stat chip */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 ltr:-right-3 rtl:-left-3 rounded-2xl bg-white/90 backdrop-blur px-5 py-3 shadow-xl shadow-candy-ink/10 border border-candy-ink/5"
            >
              <div className="font-display font-extrabold text-2xl text-candy-orange">{t('about.badgeValue')}</div>
              <div className="text-xs font-semibold text-candy-ink/60">{t('about.chip')}</div>
            </motion.div>
          </motion.div>

          {/* text */}
          <div>
            <p className="text-candy-ink/75 text-lg leading-relaxed">{t('about.body')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
