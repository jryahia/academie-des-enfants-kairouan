import { useTranslation } from 'react-i18next'
import type { DeviceQuality } from '../hooks/useDeviceQuality'

// NO real photos. Illustrated generic parent/child avatars (bundled Lottie or
// CSS/SVG illustration), never tied to real people. Real quote TEXT is pending
// client confirmation — shipped as clearly-marked placeholder until then.
export default function Testimonials({ deviceQuality }: { deviceQuality: DeviceQuality }) {
  const { t } = useTranslation()
  void deviceQuality // used when illustrated avatars land via Claude brief
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient">
          {t('testimonials.title')}
        </h2>
        <p className="mt-4 text-slate-400 italic">{t('testimonials.pending')}</p>
        <p className="mt-2 text-sm text-slate-500">{t('testimonials.placeholder')}</p>
        <div className="mt-8 grid sm:grid-cols-2 gap-6 text-left" dir="ltr">
          {/* Illustrated placeholder cards — replace with real anonymized quotes once provided */}
          {[0, 1].map((i) => (
            <figure key={i} className="glass rounded-2xl p-6">
              <blockquote className="text-slate-300">
                “{t('testimonials.placeholder')}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-brand-indigo/40 grid place-items-center text-xl" aria-hidden>
                  👤
                </span>
                <span className="text-sm text-slate-400">Parent {i + 1}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
