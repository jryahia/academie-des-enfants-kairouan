import { MotionConfig } from 'framer-motion'
import SiteNav from './components/SiteNav'
import PlaygroundHero from './components/PlaygroundHero'
import PlaygroundJourney from './components/PlaygroundJourney'
import Programs from './components/Programs'
import Values from './components/Values'
import ContactInvite from './components/ContactInvite'
import Footer from './components/Footer'
import { EnrollmentProvider } from './components/MagicEnrollment'

// Page flow: 3D playground hero (photo ring) -> scroll tour of the playground
// -> programs -> values -> invitation card -> footer. Every enroll CTA opens
// the Magic admission-letter overlay (EnrollmentProvider). Sections are light
// DOM and load eagerly so #anchors work on first click; only the WebGL scene
// inside the hero is code-split.
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <EnrollmentProvider>
        <div className="min-h-screen bg-candy-cream text-candy-ink">
          <SiteNav />
          <main id="top" className="relative z-10">
            <PlaygroundHero />
            <PlaygroundJourney />
            <Programs />
            <Values />
            <ContactInvite />
          </main>
          <Footer />
        </div>
      </EnrollmentProvider>
    </MotionConfig>
  )
}
