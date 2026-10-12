import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { PLAYGROUND_PHOTOS } from '../data/playgroundPhotos'
import { lockScroll, unlockScroll } from '../lib/smoothScroll'

interface Props {
  index: number | null
  onClose: () => void
  onChange: (index: number) => void
}

const N = PLAYGROUND_PHOTOS.length

/** Full-screen photo viewer: Esc closes, arrow keys browse (mirrored in RTL). */
export default function PhotoLightbox({ index, onClose, onChange }: Props) {
  const { t, i18n } = useTranslation()
  const closeRef = useRef<HTMLButtonElement>(null)
  const rtl = i18n.dir() === 'rtl'
  const alts = t('playground.alts', { returnObjects: true }) as unknown as string[]
  const open = index !== null

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    lockScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      const fwd = rtl ? 'ArrowLeft' : 'ArrowRight'
      const back = rtl ? 'ArrowRight' : 'ArrowLeft'
      if (e.key === fwd) onChange(((index ?? 0) + 1) % N)
      if (e.key === back) onChange(((index ?? 0) - 1 + N) % N)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [open, index, rtl, onClose, onChange])

  const photo = index !== null ? PLAYGROUND_PHOTOS[index] : null

  return (
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.lightbox')}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-candy-ink/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.figure
            key={photo.src}
            className="relative flex max-h-full max-w-5xl flex-col items-center"
            initial={{ scale: 0.85, rotate: -3, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(min-width: 1024px) 80vw, 100vw"
              alt={alts[photo.alt] ?? ''}
              className="max-h-[78vh] w-auto rounded-[28px] border-[10px] object-contain shadow-2xl"
              style={{ borderColor: photo.frame }}
            />
            <figcaption className="mt-4 rounded-full bg-white px-5 py-2 text-center text-sm font-bold text-candy-ink shadow-lg">
              {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · {alts[photo.alt]}
            </figcaption>
          </motion.figure>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('gallery.close')}
            className="absolute end-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-play-yellow text-candy-ink shadow-lg transition-transform hover:rotate-90 hover:scale-110"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange((index + d + N) % N)
              }}
              aria-label={t(d > 0 ? 'playground.next' : 'playground.prev')}
              className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-candy-ink shadow-lg transition-transform hover:scale-110 ${
                d > 0 ? 'end-3 sm:end-6' : 'start-3 sm:start-6'
              }`}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className={`h-6 w-6 ${(d > 0) !== rtl ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
