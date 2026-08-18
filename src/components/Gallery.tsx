import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

/* =========================================================================
  Gallery — 2D photo wall of the real academy photos. Candy-soft rounded
  polaroid frames, staggered reveal, hover tilt + lift, and a simple
  full-screen lightbox (tap/click, Esc/outside to close). No invented
  captions — photos speak for themselves (site rule: no fabricated detail).
  ========================================================================= */

const PHOTOS = [
  '/images/playtime.webp',
  '/images/storytime.webp',
  '/images/music-lesson.webp',
  '/images/circle-time.webp',
  '/images/art-class.webp',
  '/images/outdoor-play.webp',
  '/images/reading.webp',
  '/images/smiling-student.webp',
  '/images/building-blocks.webp',
  '/images/classroom-group.webp',
  '/images/drawing.webp',
  '/images/crafts.webp',
  '/images/teacher-helping.webp',
]

const COLORS = ['#58C778', '#4A8FE7', '#FF9A3C', '#B07BF0', '#FF6B8A']
const TILT = ['-2deg', '1.5deg', '-1deg', '2deg', '0.5deg', '-1.5deg']

export default function Gallery() {
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-gradient">
          {t('gallery.title')}
        </h2>
        <p className="mt-3 text-center text-candy-ink/60">{t('gallery.subtitle')}</p>

        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {PHOTOS.map((src, i) => (
            <motion.button
              key={src}
              type="button"
              onClick={() => setLightbox(src)}
              initial={{ opacity: 0, y: 28, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 6) * 0.05, type: 'spring', stiffness: 220, damping: 20 }}
              whileHover={{ scale: 1.03, rotate: 0 }}
              aria-label={t('gallery.open')}
              className="mb-5 block w-full cursor-pointer text-left"
            >
              <div
                className="relative overflow-hidden rounded-3xl shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-shadow p-2.5 pb-9"
                style={{
                  background: `linear-gradient(160deg, ${COLORS[i % COLORS.length]}22, #ffffff 45%, ${COLORS[(i + 1) % COLORS.length]}18)`,
                  backdropFilter: 'blur(2px)',
                  transform: `rotate(${TILT[i % TILT.length]})`,
                  transition: 'transform .25s ease',
                }}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full h-auto rounded-2xl object-cover"
                  style={{ aspectRatio: 'auto' }}
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
                <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-xs font-display font-semibold text-candy-ink/45 tracking-wide uppercase">
                  {t('gallery.memory')}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            role="dialog"
            aria-modal="true"
            aria-label={t('gallery.lightbox')}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              src={lightbox}
              alt=""
              className="max-h-[88vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white text-2xl leading-none"
              aria-label={t('gallery.close')}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
