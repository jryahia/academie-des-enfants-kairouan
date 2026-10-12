import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LOGO_VIEWBOX, SPARK_FILL, SPARK_PATH, STAR_FACETS } from '../brand/logo'

/** Origami-star mark. On hover the facets fan out a touch and the spark twinkles. */
export function LogoMark({ className = 'h-10 w-10', glow = true }: { className?: string; glow?: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox={LOGO_VIEWBOX}
      className={className}
      initial="rest"
      animate="rest"
      whileHover="hover"
      style={glow ? { filter: 'drop-shadow(0 4px 10px rgba(255, 170, 30, 0.45))' } : undefined}
    >
      {STAR_FACETS.map((f, i) => (
        <motion.polygon
          key={i}
          points={f.points}
          fill={f.fill}
          stroke={f.fill}
          strokeWidth={1.6}
          strokeLinejoin="round"
          style={{ transformOrigin: '32px 34px' }}
          variants={{
            rest: { scale: 1, rotate: 0 },
            hover: { scale: 1.06, rotate: i % 2 ? 4 : -4, transition: { type: 'spring', stiffness: 300, damping: 12 } },
          }}
        />
      ))}
      <motion.path
        d={SPARK_PATH}
        fill={SPARK_FILL}
        style={{ transformOrigin: '54px 10px' }}
        animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

/** Mark + two-line wordmark ("Académie des Enfants" / "KAIROUAN"). */
export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <LogoMark className="h-11 w-11 shrink-0" />
      {!compact && (
        <span className="hidden min-w-0 flex-col leading-none sm:flex">
          <span className="truncate font-display text-[17px] font-extrabold text-candy-ink">{t('brand.name')}</span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.32em] text-play-blue rtl:text-[11px] rtl:tracking-normal">{t('brand.city')}</span>
        </span>
      )}
    </span>
  )
}
