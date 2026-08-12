import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { DeviceQuality } from '../hooks/useDeviceQuality'

/**
 * Hero — 3D mascot cast entrance + animated wordmark + CTA.
 * The full r3f scene is the Claude build (mascot cast, idle animations,
 * background parallax). This stub keeps the route building now; it will be
 * replaced by the real scene per the section brief.
 */
export default function Hero({ deviceQuality }: { deviceQuality: DeviceQuality }) {
  const { t } = useTranslation()
  const mount = useRef<HTMLDivElement>(null)

  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center px-4">
      {/* 3D canvas mounts here */}
      <div ref={mount} className="absolute inset-0" data-3d-hero data-quality={deviceQuality.can3D ? '3d' : '2d'} aria-hidden />

      <p className="text-brand-mint text-sm sm:text-base font-bold tracking-widest uppercase">
        {t('hero.tagline')}
      </p>
      <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-center leading-tight mt-3">
        <span className="block text-gradient">{t('hero.title1')}</span>
        <span className="block">{t('hero.title2')}</span>
        <span className="block text-brand-sun">{t('hero.title3')}</span>
      </h1>
      <p className="mt-5 max-w-xl text-center text-slate-300">{t('hero.subtitle')}</p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <a
          href="#contact"
          className="rounded-full bg-brand-indigo px-8 py-3 font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-brand-indigo/30"
        >
          {t('cta.enroll')}
        </a>
        <a
          href="#about"
          className="rounded-full border-2 border-brand-mint px-8 py-3 font-bold text-lg text-brand-mint hover:bg-brand-mint/10 transition-colors"
        >
          {t('cta.learnMore')}
        </a>
      </div>

      <div className="absolute bottom-6 text-slate-500 text-sm animate-bounce">{t('hero.scrollHint')}</div>
    </section>
  )
}
