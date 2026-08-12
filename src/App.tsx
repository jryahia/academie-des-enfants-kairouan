import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeviceQuality } from './hooks/useDeviceQuality'
import LanguageSwitcher from './components/LanguageSwitcher'
import SceneBoundary from './components/SceneBoundary'

// Heavy 3D scenes are lazy-loaded so core content+CTA render immediately even
// before assets stream in (progressive reveal requirement).
const RunnerHero = lazy(() => import('./components/RunnerHero'))
const About = lazy(() => import('./components/About'))
const Programs = lazy(() => import('./components/Programs'))
const World = lazy(() => import('./components/WorldExperience'))
const Values = lazy(() => import('./components/Values'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const Enrollment = lazy(() => import('./components/Enrollment'))
const Footer = lazy(() => import('./components/Footer'))

// TEMP dev preview route — hoisted so it isn't re-created on every render.
const Stage = lazy(() => import('./Stage'))

function LoadingSplash() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-candy-cream"
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

  // TEMP: dev preview — ?stage renders the 3D character demo instead of the site.
  if (typeof window !== 'undefined' && new URL(window.location.href).searchParams.has('stage')) {
    return (
      <Suspense fallback={<LoadingSplash />}>
        <Stage />
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen bg-candy-cream text-candy-ink">
      <header className="bg-white/70 backdrop-blur fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-6 h-16 border-b border-candy-ink/5 shadow-sm">
        <a href="#top" className="flex items-center gap-2 font-display font-bold text-lg text-candy-ink">
          <span aria-hidden className="text-2xl">🦉</span>
          <span className="whitespace-nowrap">{t('hero.tagline')}</span>
        </a>
        <nav aria-label="Main" className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {(['about', 'programs', 'world', 'values', 'contact'] as const).map((k) => (
            <a key={k} href={`#${k}`} className="hover:text-candy-orange transition-colors">
              {t(`nav.${k}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex rounded-full bg-candy-coral text-white px-5 py-2 text-sm font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            {t('cta.enroll')}
          </a>
          <LanguageSwitcher />
        </div>
      </header>

      <main id="top" className="relative z-10">
        <Suspense fallback={<LoadingSplash />}>
          <SceneBoundary
            fallback={
              <section
                className="relative w-full h-[100dvh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
                style={{ background: 'linear-gradient(#8FE3FA 0%, #CDEFFD 45%, #FFF6E9 100%)' }}
              >
                <div className="text-7xl animate-bounce" aria-hidden>🦉</div>
                <h1 className="mt-6 font-display text-4xl sm:text-6xl font-extrabold text-candy-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.7)]">
                  {t('hero.title1')} <span className="text-candy-orange">{t('hero.title2')}</span>
                </h1>
                <div className="mt-8 flex gap-3">
                  <a href="#contact" className="rounded-full bg-candy-coral text-white px-7 py-3 font-bold text-lg shadow-lg shadow-candy-coral/40 hover:scale-105 active:scale-95 transition-transform">
                    {t('cta.enroll')}
                  </a>
                  <a href="#about" className="rounded-full bg-white text-candy-navy px-7 py-3 font-bold text-lg shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-transform">
                    {t('cta.learnMore')}
                  </a>
                </div>
              </section>
            }
          >
            <RunnerHero deviceQuality={q} />
          </SceneBoundary>
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
