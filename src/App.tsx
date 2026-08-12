import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeviceQuality } from './hooks/useDeviceQuality'
import LanguageSwitcher from './components/LanguageSwitcher'

// Heavy 3D scenes are lazy-loaded so core content+CTA render immediately even
// before assets stream in (progressive reveal requirement).
const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Programs = lazy(() => import('./components/Programs'))
const World = lazy(() => import('./components/WorldExperience'))
const Values = lazy(() => import('./components/Values'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const Enrollment = lazy(() => import('./components/Enrollment'))
const Footer = lazy(() => import('./components/Footer'))

function LoadingSplash() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg"
      aria-label="Chargement / جارٍ التحميل"
    >
      {/* On-theme loader: bouncing candy companion built in CSS — no blank flash.
          The full 3D mascot loader ships in the scenes later. */}
      <div className="animate-bounce text-5xl">🟣</div>
      <h1 className="sr-only">Chargement…</h1>
    </div>
  )
}

export default function App() {
  const { t } = useTranslation()
  const q = useDeviceQuality()

  return (
    <div className="min-h-screen bg-brand-bg text-slate-100">
      <header className="glass fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-6 h-16">
        <a href="#top" className="flex items-center gap-2 font-display font-bold text-lg">
          <span aria-hidden className="text-2xl">🦉</span>
          <span className="whitespace-nowrap">{t('hero.tagline')}</span>
        </a>
        <nav aria-label="Main" className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {(['about', 'programs', 'world', 'values', 'contact'] as const).map((k) => (
            <a key={k} href={`#${k}`} className="hover:text-brand-sun transition-colors">
              {t(`nav.${k}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex rounded-full bg-brand-sun text-brand-bg px-5 py-2 text-sm font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            {t('cta.enroll')}
          </a>
          <LanguageSwitcher />
        </div>
      </header>

      <main id="top" className="relative z-10">
        <Suspense fallback={<LoadingSplash />}>
          <Hero deviceQuality={q} />
          <About />
          <Programs />
          <World />
          <Values />
          <Testimonials deviceQuality={q} />
          <Enrollment />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
