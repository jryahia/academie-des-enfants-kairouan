import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { LogoMark } from './BrandLogo'
import GlowButton from './GlowButton'
import Icon from './Icon'
import { EMPTY_FORM, isValidPhone, submitEnrollment, type EnrollmentForm } from '../lib/enrollment'
import { lockScroll, unlockScroll } from '../lib/smoothScroll'

/* =========================================================================
  MagicEnrollment: the "magical admission letter".
  Any enroll CTA calls useEnrollment().open(). A fullscreen night-blue
  overlay shows a floating sealed envelope; touching the wax seal folds the
  flap open in 3D, the letter rises out and unfolds into a gold-foil
  admission ticket (the form) that greets the child by name as the parent
  types. On submit the ticket flips over to a welcome card and confetti
  bursts. Reduced motion: no flap/flip choreography, no confetti.
  ========================================================================= */

interface EnrollmentCtx {
  open: () => void
  isOpen: boolean
}

const Ctx = createContext<EnrollmentCtx>({ open: () => {}, isOpen: false })

export const useEnrollment = () => useContext(Ctx)

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const lastFocus = useRef<HTMLElement | null>(null)
  const open = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }, [])
  const close = useCallback(() => {
    setOpen(false)
    lastFocus.current?.focus?.()
  }, [])
  const value = useMemo(() => ({ open, isOpen }), [open, isOpen])
  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>{isOpen && <MagicEnrollment key="magic" onClose={close} />}</AnimatePresence>
    </Ctx.Provider>
  )
}

type Stage = 'envelope' | 'opening' | 'form' | 'done'

const CONFETTI_COLORS = ['#FFD21F', '#FF8A1F', '#8CD62B', '#1E63FF', '#FF4FA3', '#FFE58A']
const EASE_FOLD = [0.65, 0, 0.35, 1] as const

function Envelope({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  const { t } = useTranslation()
  const [flapBehind, setFlapBehind] = useState(false)
  const sealRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    sealRef.current?.focus()
  }, [])
  useEffect(() => {
    if (!opening) return
    // Once the flap passes vertical it must tuck behind the rising letter.
    const id = window.setTimeout(() => setFlapBehind(true), 340)
    return () => window.clearTimeout(id)
  }, [opening])

  return (
    <motion.div
      key="envelope"
      className="flex w-full flex-col items-center text-center"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 16 } }}
      exit={{ opacity: 0, y: 160, scale: 0.85, transition: { duration: 0.45, ease: 'easeIn' } }}
    >
      <span className="rounded-full border border-[#FFE58A]/50 bg-[#FFE58A]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.25em] text-[#FFE58A] rtl:tracking-normal">
        {t('magic.eyebrow')}
      </span>
      <h2 className="mt-4 max-w-lg font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
        {t('magic.envelopeTitle')}
      </h2>

      <div className="relative mt-24 aspect-[1.6/1] w-[min(520px,86vw)] [perspective:1400px] sm:mt-28">
        <motion.div
          className="absolute inset-0"
          animate={opening ? { y: 0, rotate: 0 } : { y: [0, -10, 0], rotate: [-1.2, 1.2, -1.2] }}
          transition={opening ? { duration: 0.3 } : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* back of the envelope */}
          <div className="absolute inset-0 rounded-[22px] bg-[linear-gradient(160deg,#FFF3CF,#FFDD8A)] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.65)]" />

          {/* the letter inside */}
          <motion.div
            className="absolute inset-x-[7%] bottom-[6%] top-[8%] flex flex-col items-center gap-2 rounded-xl bg-[#FFFDF6] p-4 shadow-md"
            style={{ zIndex: 2 }}
            animate={opening ? { y: '-62%' } : { y: '0%' }}
            transition={{ delay: 0.5, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* content stays blank while sealed so no text peeks through the fold gap */}
            <motion.div
              className="flex w-full flex-col items-center gap-2"
              animate={{ opacity: opening ? 1 : 0 }}
              transition={{ delay: opening ? 0.75 : 0, duration: 0.4 }}
            >
              <LogoMark className="h-9 w-9" glow={false} />
              <span className="text-center font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[#B57400] rtl:tracking-normal">
                {t('magic.letterEyebrow')}
              </span>
              <span className="h-1.5 w-3/4 rounded-full bg-[#F4E2B0]" />
              <span className="h-1.5 w-2/3 rounded-full bg-[#F4E2B0]" />
              <span className="h-1.5 w-1/2 rounded-full bg-[#F4E2B0]" />
            </motion.div>
          </motion.div>

          {/* front pocket: two side folds + bottom fold */}
          <div
            className="absolute inset-0 rounded-[22px]"
            style={{ zIndex: 3, background: 'linear-gradient(180deg,#FFE7A6,#FFD36A)', clipPath: 'polygon(0 32%, 50% 64%, 100% 32%, 100% 100%, 0 100%)' }}
          />
          <div
            className="absolute inset-0 rounded-[22px]"
            style={{ zIndex: 3, background: 'linear-gradient(90deg,#FFE9B0,#FFDA7E)', clipPath: 'polygon(0 30%, 50% 66%, 0 100%)' }}
          />
          <div
            className="absolute inset-0 rounded-[22px]"
            style={{ zIndex: 3, background: 'linear-gradient(270deg,#FFE9B0,#FFDA7E)', clipPath: 'polygon(100% 30%, 50% 66%, 100% 100%)' }}
          />

          {/* top flap, folds open in 3D */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[64%]"
            style={{ zIndex: flapBehind ? 1 : 4, transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
            animate={{ rotateX: opening ? 180 : 0 }}
            transition={{ duration: 0.7, ease: EASE_FOLD }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg,#FFE29A,#FFC94A)',
                backfaceVisibility: 'hidden',
                borderRadius: '22px 22px 0 0',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(0deg,#FFF1C8,#FFE6A0)',
                backfaceVisibility: 'hidden',
                transform: 'rotateX(180deg)',
              }}
            />
          </motion.div>

          {/* wax seal (positioning wrapper keeps the centring transform) */}
          <div className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 5 }}>
            <motion.button
              ref={sealRef}
              type="button"
              onClick={onOpen}
              aria-label={t('magic.open')}
              className="grid h-20 w-20 place-items-center rounded-full outline-none ring-[#FFE58A] focus-visible:ring-4 sm:h-24 sm:w-24"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #FF9ACB, #E2307F 58%, #9C1356)',
                boxShadow: '0 10px 24px -6px rgba(156,19,86,0.7), inset 0 2px 6px rgba(255,255,255,0.45), inset 0 -4px 8px rgba(0,0,0,0.25)',
              }}
              animate={opening ? { scale: 0, opacity: 0, rotate: 90 } : { scale: [1, 1.07, 1] }}
              transition={opening ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.12 }}
            >
              <span className="grid h-[70%] w-[70%] place-items-center rounded-full border-2 border-dashed border-white/40">
                <LogoMark className="h-9 w-9 sm:h-11 sm:w-11" glow={false} />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <p className="mt-8 text-sm font-semibold text-white/70">{t('magic.envelopeHint')}</p>
      <GlowButton variant="gold" onClick={onOpen} className="mt-4 px-7 py-3.5 text-lg">
        <Icon name="star" className="h-5 w-5" strokeWidth={2} />
        {t('magic.open')}
      </GlowButton>
    </motion.div>
  )
}

function TicketCard({ onClose, onCelebrate }: { onClose: () => void; onCelebrate: () => void }) {
  const { t, i18n } = useTranslation()
  const [form, setForm] = useState<EnrollmentForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof EnrollmentForm, string>>>({})
  const [done, setDone] = useState(false)
  const firstField = useRef<HTMLInputElement>(null)
  const doneBtn = useRef<HTMLButtonElement | null>(null)
  const ticketNo = useMemo(() => String(Math.floor(1000 + Math.random() * 9000)), [])
  const ages = (t('programs.items', { returnObjects: true }) as unknown as Array<{ age: string }>).slice(0, 3).map((p) => p.age)
  const childName = form.childName.trim() || t('magic.letterTitleDefault')

  useEffect(() => {
    const id = window.setTimeout(() => firstField.current?.focus(), 500)
    return () => window.clearTimeout(id)
  }, [])

  const set = (k: keyof EnrollmentForm) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    // Clear a field's error as soon as the parent edits it.
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!form.name.trim()) errs.name = t('contact.form.required')
    if (!form.childName.trim()) errs.childName = t('contact.form.required')
    if (!form.age.trim()) errs.age = t('contact.form.required')
    if (!form.phone.trim()) errs.phone = t('contact.form.required')
    else if (!isValidPhone(form.phone)) errs.phone = t('contact.form.invalidPhone')
    setErrors(errs)
    if (Object.keys(errs).length) return
    // Success shows at once; the API call (or offline queue) runs behind it.
    void submitEnrollment(form, i18n.language)
    setDone(true)
    window.setTimeout(onCelebrate, 450)
    window.setTimeout(() => doneBtn.current?.focus(), 950)
  }

  const input =
    'w-full rounded-2xl border border-[#EBD7A0] bg-white/85 px-4 py-3 text-candy-ink placeholder:text-candy-ink/35 transition focus:border-play-blue focus:outline-none focus:ring-4 focus:ring-play-blue/15'

  const field = (k: keyof EnrollmentForm, label: string, placeholder: string, extra?: { ref?: React.Ref<HTMLInputElement>; type?: string }) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-candy-ink">{label}</span>
      <input
        ref={extra?.ref}
        type={extra?.type ?? 'text'}
        className={input + (errors[k] ? ' border-red-400' : '')}
        value={form[k]}
        onChange={(e) => set(k)(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!errors[k]}
        tabIndex={done ? -1 : undefined}
      />
      {errors[k] && <span className="mt-1 block text-xs font-semibold text-red-500">{errors[k]}</span>}
    </label>
  )

  return (
    <motion.div
      key="ticket"
      className="w-full max-w-xl [perspective:1800px]"
      initial={{ opacity: 0, y: 90, scale: 0.7, rotateX: 40 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
    >
      <motion.div
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: done ? 180 : 0 }}
        transition={{ duration: 0.9, ease: EASE_FOLD }}
      >
        {/* FRONT: the admission ticket form */}
        <form
          onSubmit={submit}
          noValidate
          aria-hidden={done}
          className="ticket-foil relative rounded-[30px] p-6 sm:p-8"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <LogoMark className="h-12 w-12" />
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#B57400] rtl:text-xs rtl:tracking-normal">
                  {t('magic.letterEyebrow')}
                </p>
                <p className="font-display text-sm font-bold text-candy-navy">{t('brand.name')}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-dashed border-[#D9B25A] px-3 py-1 font-display text-xs font-bold text-[#B57400]">
              {t('magic.ticket')} {ticketNo}
            </span>
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-candy-ink sm:text-4xl">
            {t('magic.letterTitle', { name: childName })}
          </h2>
          <p className="mt-1.5 text-candy-navy">{t('magic.letterIntro')}</p>

          {/* perforation with ticket notches */}
          <div aria-hidden className="relative -mx-6 my-6 sm:-mx-8">
            <div className="border-t-2 border-dashed border-[#E6C46A]" />
            <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#0B1B47]" />
            <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#0B1B47]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {field('name', t('contact.form.name'), 'Amina B.', { ref: firstField })}
            {field('childName', t('contact.form.childName'), 'Yassine')}
          </div>

          <fieldset className="mt-4">
            <legend className="mb-1.5 text-sm font-bold text-candy-ink">{t('magic.ageLabel')}</legend>
            <div role="radiogroup" aria-label={t('magic.ageLabel')} className="flex flex-wrap gap-2">
              {ages.map((age) => {
                const on = form.age === age
                return (
                  <motion.button
                    key={age}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={done ? -1 : undefined}
                    onClick={() => set('age')(age)}
                    whileTap={{ scale: 0.94 }}
                    className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-2 px-4 text-sm font-extrabold transition-all ${
                      on
                        ? 'border-[#E08A00] bg-[linear-gradient(135deg,#FFE58A,#FFC61A)] text-candy-ink shadow-[0_0_22px_-4px_rgba(255,198,26,0.95)]'
                        : 'border-[#EBD7A0] bg-white/80 text-candy-navy hover:border-[#F2B705]'
                    }`}
                  >
                    {on && <Icon name="check" className="h-4 w-4" strokeWidth={3.2} />}
                    {age}
                  </motion.button>
                )
              })}
            </div>
            {errors.age && <span className="mt-1 block text-xs font-semibold text-red-500">{errors.age}</span>}
          </fieldset>

          <div className="mt-4 grid gap-4">
            {field('phone', t('contact.form.phone'), '+216 ...', { type: 'tel' })}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-candy-ink">{t('contact.form.message')}</span>
              <textarea
                className={input + ' min-h-[88px]'}
                value={form.message}
                onChange={(e) => set('message')(e.target.value)}
                placeholder="..."
                tabIndex={done ? -1 : undefined}
              />
            </label>
          </div>

          <GlowButton variant="gold" type="submit" className="mt-6 w-full py-4 text-lg">
            <Icon name="star" className="h-5 w-5" strokeWidth={2} />
            {t('contact.form.submit')}
          </GlowButton>
        </form>

        {/* BACK: welcome card, revealed by the flip */}
        <div
          role="status"
          aria-hidden={!done}
          className="ticket-foil absolute inset-0 flex flex-col items-center justify-center rounded-[30px] p-8 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <motion.div
            className="grid h-24 w-24 place-items-center rounded-full text-candy-ink"
            style={{ background: 'radial-gradient(circle at 35% 30%, #FFF1B0, #FFC61A 60%, #E08A00)', boxShadow: '0 0 50px -6px rgba(255,198,26,0.9)' }}
            animate={done ? { scale: [0.4, 1.15, 1], rotate: [-20, 8, 0] } : {}}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <Icon name="check" className="h-12 w-12" strokeWidth={3} />
          </motion.div>
          <h2 className="mt-6 font-display text-3xl font-extrabold text-candy-ink sm:text-4xl">
            {t('magic.successTitle', { name: form.childName.trim() || t('magic.letterTitleDefault') })}
          </h2>
          <p className="mt-3 max-w-sm text-candy-navy">{t('contact.form.success')}</p>
          <div className="mt-7" ref={(el) => (doneBtn.current = el?.querySelector('button') ?? null)}>
            <GlowButton variant="sun" onClick={onClose} className="px-7 py-3.5 text-base">
              {t('magic.done')}
            </GlowButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function MagicEnrollment({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const [stage, setStage] = useState<Stage>('envelope')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireRef = useRef<confetti.CreateTypes | null>(null)
  const timer = useRef<number>()

  const sparkles = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 8 + Math.random() * 14,
        delay: `${(Math.random() * 3).toFixed(2)}s`,
        color: Math.random() > 0.35 ? '#FFE58A' : '#FFFFFF',
      })),
    [],
  )

  useEffect(() => {
    lockScroll()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer.current)
      fireRef.current?.reset()
      unlockScroll()
    }
  }, [onClose])

  const openLetter = () => {
    if (stage !== 'envelope') return
    if (reduced) {
      setStage('form')
      return
    }
    setStage('opening')
    timer.current = window.setTimeout(() => setStage('form'), 1650)
  }

  const celebrate = () => {
    const canvas = canvasRef.current
    if (!canvas || reduced) return
    // Own canvas + no worker: stays inside the strict CSP (no blob: workers).
    fireRef.current ??= confetti.create(canvas, { resize: true, useWorker: false, disableForReducedMotion: true })
    const fire = fireRef.current
    const base = { colors: CONFETTI_COLORS, ticks: 260, scalar: 1.1 }
    void fire({ ...base, particleCount: 90, spread: 70, startVelocity: 55, angle: 60, origin: { x: 0.1, y: 0.8 } })
    void fire({ ...base, particleCount: 90, spread: 70, startVelocity: 55, angle: 120, origin: { x: 0.9, y: 0.8 } })
    window.setTimeout(() => {
      void fire({ ...base, particleCount: 60, spread: 140, startVelocity: 28, origin: { x: 0.5, y: 0.3 }, shapes: ['star'], scalar: 1.4 })
    }, 380)
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t('magic.letterEyebrow')}
      data-lenis-prevent
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      {/* night-sky backdrop with golden glow */}
      <div className="fixed inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,rgba(27,58,138,0.92)_0%,rgba(11,27,71,0.95)_55%,rgba(7,15,43,0.97)_100%)] backdrop-blur-md" />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,214,90,0.32), transparent 65%)' }}
        animate={reduced ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0">
        {sparkles.map((s, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="animate-twinkle absolute"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, color: s.color }}
          >
            <path d="M12 1c.9 6 2.9 8.1 9 9-6.1.9-8.1 2.9-9 9-.9-6.1-2.9-8.1-9-9 6.1-.9 8.1-3 9-9z" fill="currentColor" />
          </svg>
        ))}
      </div>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[3] h-full w-full" />

      <button
        type="button"
        onClick={onClose}
        aria-label={t('magic.close')}
        className="fixed end-3 top-3 z-[4] grid h-12 w-12 place-items-center rounded-full bg-[#0B1B47]/85 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-md transition hover:rotate-90 hover:bg-[#13235B] sm:end-4 sm:top-4"
      >
        <Icon name="close" className="h-6 w-6" strokeWidth={2.6} />
      </button>

      <div className="relative z-[2] flex min-h-full items-center justify-center px-4 py-20">
        <AnimatePresence mode="wait">
          {stage === 'envelope' || stage === 'opening' ? (
            <Envelope key="envelope" opening={stage === 'opening'} onOpen={openLetter} />
          ) : (
            <TicketCard key="ticket" onClose={onClose} onCelebrate={celebrate} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
