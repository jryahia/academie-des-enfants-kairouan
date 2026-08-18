import { useTranslation } from 'react-i18next'
import ScrollWorldFlight from './ScrollWorldFlight'
import type { DeviceQuality } from '../hooks/useDeviceQuality'

/* =========================================================================
  WorldExperience — Section 4: the scroll-world photo flight (signature
  movement #3). The flight replaces the old GSAP-pinned 3D diorama canvas
  with the scroll-world scrub engine: real academy photos, scroll-scrubbed
  camera dives (ffmpeg Ken-Burns clips) with no cuts, scene copy overlays,
  route dots + section nav. The engine owns its own scroll space (track
  height) and gates its fixed layers to this section, so the page above and
  below flows normally. Reduced-motion: the engine cross-dissolves the stills
  without loading any clip.
  ========================================================================= */

export default function WorldExperience({ deviceQuality: _deviceQuality }: { deviceQuality: DeviceQuality }) {
  const { t } = useTranslation()
  return (
    <section id="world" className="relative w-full" aria-label={t('world.title')}>
      <ScrollWorldFlight />
    </section>
  )
}
