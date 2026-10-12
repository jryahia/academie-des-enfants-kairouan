import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import Icon from './Icon'
import GlowButton from './GlowButton'
import { useEnrollment } from './MagicEnrollment'
import { scrollToTarget } from '../lib/smoothScroll'
import PhotoLightbox from './PhotoLightbox'
import { PLAYGROUND_PHOTOS, PLAY_COLORS, photoByNumber } from '../data/playgroundPhotos'

/* =========================================================================
  PlaygroundJourney — the scroll tour of the playground (#world).
  Replaces the old video flight: no clips, no vendored engine. A sticky stage
  pins for one viewport per scene; each real photo pops in as a chunky
  coloured card with a slow Ken Burns zoom, while the copy card swaps with a
  spring. Scroll position drives everything through MotionValues; React only
  re-renders when the active scene changes.
  ========================================================================= */

interface SceneCopy {
  label: string
  eyebrow: string
  title: string
  body: string
  tags: string[]
}

// Photo number (2 to 11) per scene, in the order of `world.scenes`.
const SCENE_PHOTOS = [7, 2, 4, 9, 6, 5, 10]
const SCENE_COLORS = [
  PLAY_COLORS.yellow,
  PLAY_COLORS.lime,
  PLAY_COLORS.orange,
  PLAY_COLORS.blue,
  PLAY_COLORS.pink,
  PLAY_COLORS.lime,
  PLAY_COLORS.yellow,
]
const N = SCENE_PHOTOS.length
const pad = (n: number) => String(n).padStart(2, '0')

function SceneCard({
  index,
  progress,
  reduced,
  label,
  onOpen,
}: {
  index: number
  progress: MotionValue<number>
  reduced: boolean
  label: string
  onOpen: () => void
}) {
  const photo = photoByNumber(SCENE_PHOTOS[index])
  const color = SCENE_COLORS[index]
  const start = index / N
  const end = (index + 1) / N
  const f = 0.22 / N // transition width inside each scene's scroll window

  // Cards never overlap: the outgoing card shrinks and fades in the last
  // slice of its window, the incoming one pops in during the first slice.
  // First card is visible from the start, last card stays until the end.
  const opacity = useTransform(progress, [start, start + f, end - f, end], [index === 0 ? 1 : 0, 1, 1, index === N - 1 ? 1 : 0])
  const scale = useTransform(progress, [start, start + f, end - f, end], [index === 0 ? 1 : 0.82, 1, 1, index === N - 1 ? 1 : 0.9])
  const rotate = useTransform(progress, [start, start + f], [index === 0 ? 0 : index % 2 ? 7 : -7, index % 2 ? 1.5 : -1.5])
  const zoom = useTransform(progress, [start, end], [1.18, 1])
  const portrait = photo.aspect < 1

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        style={reduced ? { aspectRatio: String(photo.aspect) } : { scale, rotate, aspectRatio: String(photo.aspect) }}
        className={`relative ${portrait ? 'h-[86%] max-w-full' : 'max-h-full w-full max-w-[880px]'}`}
      >
        {/* coloured slab behind the card */}
        <div
          aria-hidden
          className="absolute inset-0 translate-x-3 translate-y-4 rounded-[36px] opacity-90 rtl:-translate-x-3"
          style={{ background: color }}
        />
        <button
          type="button"
          onClick={onOpen}
          aria-label={label}
          className="group pointer-events-auto relative block h-full w-full overflow-hidden rounded-[32px] border-[8px] bg-white shadow-[0_30px_60px_-25px_rgba(19,35,91,0.55)]"
          style={{ borderColor: '#fff' }}
        >
          <motion.img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 768px) 55vw, 92vw"
            alt=""
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            style={reduced ? undefined : { scale: zoom }}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-3 end-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-candy-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Icon name="expand" className="h-5 w-5" />
          </span>
        </button>
        {/* sticker with the scene number */}
        <span
          aria-hidden
          className="absolute -top-4 start-6 rounded-full px-4 py-1.5 font-display text-lg font-extrabold text-candy-ink shadow-md"
          style={{ background: color, rotate: index % 2 ? '4deg' : '-4deg' }}
        >
          {pad(index + 1)}
        </span>
      </motion.div>
    </motion.div>
  )
}

function Decor({ progress }: { progress: MotionValue<number> }) {
  const y1 = useTransform(progress, [0, 1], ['0%', '-60%'])
  const y2 = useTransform(progress, [0, 1], ['0%', '45%'])
  const spin = useTransform(progress, [0, 1], [0, 220])
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <motion.div style={{ y: y1 }} className="absolute start-[6%] top-[18%] h-16 w-16 rounded-full bg-play-yellow/70 blur-[1px]" />
      <motion.div style={{ y: y2 }} className="absolute bottom-[12%] start-[38%] h-10 w-10 rounded-full bg-play-blue/40" />
      <motion.div style={{ y: y2, rotate: spin }} className="absolute end-[8%] top-[14%] text-play-orange/70">
        <Icon name="star" className="h-14 w-14" strokeWidth={0} />
      </motion.div>
      <motion.div style={{ y: y1, rotate: spin }} className="absolute bottom-[20%] end-[44%] hidden h-12 w-12 rounded-2xl bg-play-lime/60 md:block" />
    </div>
  )
}

export default function PlaygroundJourney() {
  const { t, i18n } = useTranslation()
  const rtl = i18n.dir() === 'rtl'
  const reduced = !!useReducedMotion()
  const { open: openEnrollment } = useEnrollment()
  const scenes = t('world.scenes', { returnObjects: true }) as unknown as SceneCopy[]
  const alts = t('playground.alts', { returnObjects: true }) as unknown as string[]

  const trackRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)))
    setActive((prev) => (prev === i ? prev : i))
  })

  const goTo = useCallback((i: number) => {
    const el = trackRef.current
    if (!el) return
    const range = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / N) * range
    scrollToTarget(top)
  }, [])

  const openScene = (i: number) => setOpen(PLAYGROUND_PHOTOS.indexOf(photoByNumber(SCENE_PHOTOS[i])))
  const close = useCallback(() => setOpen(null), [])
  const scene = scenes[active] ?? scenes[0]
  const color = SCENE_COLORS[active]

  return (
    <section ref={trackRef} id="world" aria-label={t('world.title')} className="relative" style={{ height: `${N * 100}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-playful">
        <Decor progress={scrollYProgress} />

        {/* progress bar under the nav */}
        <motion.div
          aria-hidden
          style={{ scaleX: bar, transformOrigin: rtl ? 'right' : 'left' }}
          className="absolute inset-x-0 top-0 z-20 h-1.5 bg-gradient-to-r from-play-yellow via-play-orange to-play-blue"
        />

        {/* photo stage */}
        <div className="absolute inset-x-5 top-[84px] h-[42svh] md:inset-y-24 md:start-[44%] md:end-20 md:top-24 md:h-auto lg:end-28">
          {SCENE_PHOTOS.map((_, i) => (
            <SceneCard
              key={i}
              index={i}
              progress={scrollYProgress}
              reduced={reduced}
              label={`${t('gallery.open')}: ${alts[photoByNumber(SCENE_PHOTOS[i]).alt]}`}
              onOpen={() => openScene(i)}
            />
          ))}
        </div>

        {/* copy card */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 md:inset-y-0 md:end-auto md:flex md:w-[44%] md:items-center md:pb-0 md:ps-10 lg:ps-20">
          <div className="w-full max-w-md">
            <p className="mb-3 hidden font-display text-sm font-extrabold uppercase tracking-[0.18em] text-play-blue md:block">
              {t('world.title')}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${active}-${i18n.language}`}
                initial={{ opacity: 0, y: 28, rotate: rtl ? 1.5 : -1.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="glass-card rounded-[28px] p-5 md:rounded-none md:border-0 md:!bg-none md:p-0 md:!shadow-none md:!backdrop-blur-0"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-extrabold text-candy-navy">
                    {pad(active + 1)} / {pad(N)}
                  </span>
                  <span className="rounded-full px-3 py-1 text-xs font-extrabold text-candy-ink sm:text-sm" style={{ background: color }}>
                    {scene.eyebrow}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-candy-ink sm:text-4xl lg:text-5xl">
                  {scene.title}
                </h2>
                <p className="mt-3 text-[15px] font-medium leading-relaxed text-candy-navy sm:text-lg">{scene.body}</p>
                {scene.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {scene.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border-2 bg-white px-3 py-1 text-sm font-bold text-candy-ink"
                        style={{ borderColor: color }}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
                {active === N - 1 && (
                  <GlowButton variant="orange" onClick={openEnrollment} className="mt-5 px-6 py-3 text-base">
                    {t('cta.enroll')}
                    <Icon name="arrow" className={`h-5 w-5 ${rtl ? 'rotate-180' : ''}`} strokeWidth={2.6} />
                  </GlowButton>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* scene dots */}
        <nav
          aria-label={t('world.title')}
          className="absolute end-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 md:flex lg:end-6"
        >
          {scenes.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === active ? 'step' : undefined}
              className="group flex items-center justify-end gap-2"
            >
              <span className="pointer-events-none rounded-full bg-white px-3 py-1 text-xs font-bold text-candy-ink opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {s.label}
              </span>
              <span
                className={`block rounded-full border-[3px] border-white shadow transition-all ${i === active ? 'h-5 w-5' : 'h-3.5 w-3.5 opacity-70'}`}
                style={{ background: SCENE_COLORS[i] }}
              />
            </button>
          ))}
        </nav>

        <p className="sr-only">{t('world.hint')}</p>
      </div>
      <PhotoLightbox index={open} onClose={close} onChange={setOpen} />
    </section>
  )
}
