import { Suspense, lazy } from 'react'
import { useDeviceQuality } from './hooks/useDeviceQuality'

// The entire site IS the scroll-world flight (7 real academy photos, one per
// scene) — a full-viewport scroll-scrubbed camera journey. Only the enrollment
// form + footer follow it. Heavy sections are lazy so the flight paints first.
const World = lazy(() => import('./components/WorldExperience'))
const Enrollment = lazy(() => import('./components/Enrollment'))
const Footer = lazy(() => import('./components/Footer'))

function LoadingSplash() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-candy-cream"
      aria-label="Chargement / جارٍ التحميل"
      style={{ background: 'linear-gradient(180deg,#0a0a0c 0%, #141419 60%, #1a1410 100%)' }}
    >
      {/* On-theme loader — gold orb + bouncy dots on Gotham black */}
      <div
        aria-hidden
        className="h-14 w-14 rounded-blob animate-bounce"
        style={{
          background: 'linear-gradient(135deg,#f0c75e,#e5b63e,#6e5a1e)',
          boxShadow: '0 0 50px rgba(229,182,62,0.45)',
        }}
      />
      <div className="flex items-center gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-candy-orange animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <h1 className="sr-only">Chargement…</h1>
    </div>
  )
}

export default function App() {
  const q = useDeviceQuality()

  return (
    <div className="min-h-screen bg-candy-cream text-candy-ink">
      <main id="top" className="relative z-10">
        <Suspense fallback={<LoadingSplash />}>
          <World deviceQuality={q} />
          <Enrollment />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
