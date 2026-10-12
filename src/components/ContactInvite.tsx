import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import GlowButton from './GlowButton'
import Icon from './Icon'
import { LogoMark } from './BrandLogo'
import { useEnrollment } from './MagicEnrollment'
import { WHATSAPP_URL } from '../data/contact'

/* #contact: a frosted "invitation" card that opens the Magic enrollment
 * overlay, plus direct WhatsApp / phone links for parents who prefer them. */
export default function ContactInvite() {
  const { t } = useTranslation()
  const { open } = useEnrollment()
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-playful px-4 py-24 sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute start-[8%] top-16 h-24 w-24 animate-float rounded-blob bg-play-orange/40" />
        <span className="absolute bottom-14 end-[10%] h-16 w-16 animate-float-slow rounded-full bg-play-blue/25" />
      </div>
      <motion.div
        className="glass-card relative mx-auto max-w-3xl overflow-hidden rounded-[36px] px-6 py-12 text-center sm:px-12"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* mini sealed envelope */}
        <motion.div
          aria-hidden
          className="relative mx-auto h-24 w-36"
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(160deg,#FFF3CF,#FFD36A)] shadow-[0_18px_30px_-14px_rgba(181,116,0,0.6)]" />
          <div className="absolute inset-x-0 top-0 h-[62%] bg-[linear-gradient(180deg,#FFE29A,#FFC94A)] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <div className="absolute left-1/2 top-[62%] grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FF9ACB,#E2307F_58%,#9C1356)] shadow-md">
            <LogoMark className="h-6 w-6" glow={false} />
          </div>
        </motion.div>

        <p className="mt-6 font-display text-sm font-extrabold uppercase tracking-[0.25em] text-[#B57400] rtl:tracking-normal">
          {t('magic.eyebrow')}
        </p>
        <h2 className="mt-2 font-display text-4xl font-extrabold text-candy-ink sm:text-5xl">{t('magic.inviteTitle')}</h2>
        <p className="mx-auto mt-3 max-w-lg text-base text-candy-navy sm:text-lg">{t('magic.inviteBody')}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <GlowButton variant="gold" onClick={open} className="px-8 py-4 text-lg">
            <Icon name="star" className="h-5 w-5" strokeWidth={2} />
            {t('magic.open')}
          </GlowButton>
          <GlowButton variant="glass" href={WHATSAPP_URL} external className="px-6 py-4 text-base">
            {t('cta.whatsapp')}
          </GlowButton>
        </div>
      </motion.div>
    </section>
  )
}
