import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Icon from './Icon'
import GlowButton from './GlowButton'
import { useEnrollment } from './MagicEnrollment'
import PhotoLightbox from './PhotoLightbox'
import { PLAYGROUND_PHOTOS } from '../data/playgroundPhotos'

/* =========================================================================
  PlaygroundHero — landing section.
  A 320vh scroll track with a sticky viewport: the WebGL photo ring
  (lazy-loaded, so the DOM headline paints first) spins through all ten real
  playground photos as you scroll, then hands off to the scroll-world flight.
  Reduced motion, no WebGL, or a WebGL crash all fall back to a static,
  animated-in photo mosaic with the same lightbox.
  ========================================================================= */

const PlaygroundScene = lazy(() => import('../three/PlaygroundScene'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function PhotoMosaic({ onSelect }: { onSelect: (i: number) => void }) {
  const { t } = useTranslation()
  const alts = t('playground.alts', { returnObjects: true }) as unknown as string[]
  return (
    <div className="mx-auto max-w-6xl columns-2 gap-4 px-4 pb-20 sm:columns-3 lg:columns-4">
      {PLAYGROUND_PHOTOS.map((p, i) => (
        <motion.button
          key={p.src}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${t('gallery.open')}: ${alts[p.alt]}`}
          className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl border-[6px] shadow-xl"
          style={{ borderColor: p.frame, aspectRatio: String(p.aspect) }}
          initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 160, damping: 18, delay: (i % 5) * 0.05 }}
        >
          <img
            src={p.src}
            srcSet={p.srcSet}
            sizes="(min-width: 1024px) 25vw, 50vw"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </motion.button>
      ))}
    </div>
  )
}

export default function PlaygroundHero() {
  const { t, i18n } = useTranslation()
  const rtl = i18n.dir() === 'rtl'
  const { open: openEnrollment, isOpen: enrolling } = useEnrollment()
  const reduced = useReducedMotion()
  const [webgl] = useState(hasWebGL)
  const use3D = webgl && !reduced

  const trackRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(true)
  const [open, setOpen] = useState<number | null>(null)
  const [focus, setFocus] = useState(0)
  const alts = t('playground.alts', { returnObjects: true }) as unknown as string[]

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const headOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const headY = useTransform(scrollYProgress, [0, 0.16], [0, -80])
  const tourOpacity = useTransform(scrollYProgress, [0.18, 0.28, 0.9, 1], [0, 1, 1, 0])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  // Pause the render loop once the hero is scrolled past.
  useEffect(() => {
    const el = trackRef.current
    if (!el || !use3D) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [use3D])

  const close = useCallback(() => setOpen(null), [])
  const fallback = <PhotoMosaic onSelect={setOpen} />

  const headline = (
    <div className="max-w-xl">
      <motion.span
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-play-blue shadow-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="h-2.5 w-2.5 animate-ping rounded-full bg-play-lime" aria-hidden />
        {t('playground.eyebrow')}
      </motion.span>
      <h1 className="mt-4 font-display text-[2.6rem] font-extrabold leading-[1.02] text-candy-ink sm:text-6xl xl:text-7xl">
        {[t('hero.title1'), t('hero.title2'), t('hero.title3')].map((word, i) => (
          <motion.span
            key={i}
            className={`block ${i === 1 ? 'text-play-blue' : i === 2 ? 'text-gradient' : ''}`}
            initial={{ opacity: 0, y: 40, rotate: rtl ? 3 : -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.2 + i * 0.12 }}
          >
            {word}
          </motion.span>
        ))}
      </h1>
      <motion.p
        className="mt-4 max-w-md text-base font-medium text-candy-navy sm:text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {t('hero.subtitle')}
      </motion.p>
      <motion.div
        className="mt-6 flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <GlowButton variant="sun" onClick={openEnrollment} className="px-6 py-3 text-base sm:px-7 sm:py-3.5 sm:text-lg">
          {t('cta.enroll')}
          <Icon name="arrow" className={`h-5 w-5 ${rtl ? 'rotate-180' : ''}`} strokeWidth={2.6} />
        </GlowButton>
        <GlowButton variant="glass" onClick={() => setOpen(0)} className="px-5 py-3 text-base sm:px-6 sm:py-3.5 sm:text-lg">
          {t('nav.gallery')}
        </GlowButton>
      </motion.div>
    </div>
  )

  if (!use3D) {
    return (
      <section ref={trackRef} id="playground" className="relative overflow-hidden bg-playful">
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-32 sm:px-8">{headline}</div>
        {fallback}
        <PhotoLightbox index={open} onClose={close} onChange={setOpen} />
      </section>
    )
  }

  return (
    <section ref={trackRef} id="playground" className="relative h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-playful">
        <SceneBoundary fallback={<div className="absolute inset-0 overflow-y-auto pt-[60vh]">{fallback}</div>}>
          <Suspense fallback={null}>
            <PlaygroundScene
              active={inView && open === null && !enrolling}
              progress={scrollYProgress}
              rtl={rtl}
              onSelect={setOpen}
              onFocusChange={setFocus}
            />
          </Suspense>
        </SceneBoundary>


        {/* Cream wash on the headline side keeps copy readable over the 3D */}
        <motion.div
          aria-hidden
          style={{ opacity: headOpacity }}
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-full bg-gradient-to-b from-candy-cream/85 via-candy-cream/40 to-transparent md:w-[62%] md:bg-gradient-to-r md:via-candy-cream/55 md:rtl:bg-gradient-to-l"
        />

        {/* Headline: sits beside the ring, lifts away on scroll. Flex centres
            it (framer's `y` owns the transform, so no translate utilities). */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-start px-5 pt-24 md:items-center md:px-10 md:pt-8 lg:px-16">
          <motion.div style={{ opacity: headOpacity, y: headY }} className="w-full min-w-0 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
            {headline}
          </motion.div>
        </div>

        {/* Tour caption: names the photo facing the camera */}
        <motion.div
          style={{ opacity: tourOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-3 px-4 text-center sm:bottom-10"
        >
          <h2 className="font-display text-3xl font-extrabold text-candy-ink drop-shadow-[0_2px_0_#fff] sm:text-5xl">
            {t('playground.title')}
          </h2>
          <p className="rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-candy-ink shadow-md backdrop-blur sm:text-base" aria-live="polite">
            <span className="text-play-blue">{String(focus + 1).padStart(2, '0')}</span> / {PLAYGROUND_PHOTOS.length} ·{' '}
            {alts[PLAYGROUND_PHOTOS[focus].alt]}
          </p>
          <p className="text-xs font-semibold text-candy-navy">{t('playground.hint')}</p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-6 start-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-sm font-bold text-candy-ink rtl:translate-x-1/2"
        >
          {t('hero.scrollHint')}
          <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 animate-bounce" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </div>
      <PhotoLightbox index={open} onClose={close} onChange={setOpen} />
    </section>
  )
}
