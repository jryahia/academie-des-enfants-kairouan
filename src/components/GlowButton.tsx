import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'

/* Premium CTA: a soft inner glow follows the pointer, the button leans toward
 * the cursor (magnetic), and it keeps the playful chunky drop shadow.
 * Renders an <a> when `href` is given, otherwise a <button>. */

type Variant = 'sun' | 'orange' | 'gold' | 'glass'

const VARIANTS: Record<Variant, { cls: string; drop: string; halo: string }> = {
  sun: { cls: 'bg-play-yellow text-candy-ink', drop: '0 6px 0 #C9A000', halo: 'rgba(255, 210, 31, 0.75)' },
  orange: { cls: 'bg-play-orange text-candy-ink', drop: '0 5px 0 #C25E00', halo: 'rgba(255, 138, 31, 0.7)' },
  gold: {
    cls: 'bg-[linear-gradient(135deg,#FFE58A_0%,#FFC61A_45%,#F29A00_100%)] text-candy-ink',
    drop: '0 6px 0 #B57400',
    halo: 'rgba(255, 198, 26, 0.85)',
  },
  glass: {
    cls: 'bg-white/70 text-candy-ink backdrop-blur-md ring-1 ring-white/80',
    drop: '0 10px 24px -12px rgba(19, 35, 91, 0.35)',
    halo: 'rgba(255, 255, 255, 0.9)',
  },
}

interface Props {
  children: ReactNode
  variant?: Variant
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  ariaLabel?: string
  disabled?: boolean
  /** open the link in a new tab (external sites such as WhatsApp) */
  external?: boolean
}

export default function GlowButton({
  children,
  variant = 'sun',
  href,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  disabled,
  external,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 })
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 })
  const v = VARIANTS[variant]

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top
    el.style.setProperty('--mx', `${px}px`)
    el.style.setProperty('--my', `${py}px`)
    if (!reduced) {
      x.set((px - r.width / 2) * 0.18)
      y.set((py - r.height / 2) * 0.28)
    }
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const shared = {
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    whileTap: { scale: 0.96 },
    style: { x, y, ['--btn-drop' as string]: v.drop, ['--btn-halo' as string]: v.halo },
    className: `btn-glow inline-flex items-center justify-center gap-2 rounded-full font-extrabold ${v.cls} ${className}`,
    'aria-label': ariaLabel,
  }

  return href ? (
    <motion.a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...shared}
    >
      {children}
    </motion.a>
  ) : (
    <motion.button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} {...shared}>
      {children}
    </motion.button>
  )
}
