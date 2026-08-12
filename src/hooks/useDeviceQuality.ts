import { useMemo } from 'react'

export interface DeviceQuality {
  /** true on low-end / low-memory devices → swap 3D for 2D/Lottie fallback */
  lowPower: boolean
  /** user asked for less motion → calm, static-posed experience, never broken */
  reducedMotion: boolean
  /** touch / narrow → smaller camera FOV, tap-based interactions over hover */
  isMobile: boolean
  /** effective: whether to run full 3D scenes at all */
  can3D: boolean
}

export function useDeviceQuality(): DeviceQuality {
  return useMemo<DeviceQuality>(() => {
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 768px)').matches
    // Do NOT tie 3D off to GPU/memory heuristics — they're unreliable across
    // devices and wrongly disable the animation on capable machines. Heavy 3D
    // is gated ONLY by the user's explicit reduced-motion preference. The dpr
    // cap plus low-poly geometry handles mobile perf.
    const lowPower =
      typeof navigator !== 'undefined' && 'deviceMemory' in navigator
        ? (navigator as unknown as { deviceMemory?: number }).deviceMemory !== undefined &&
          (navigator as unknown as { deviceMemory?: number }).deviceMemory! < 2
        : false
    return {
      lowPower,
      reducedMotion,
      isMobile,
      can3D: !reducedMotion,
    }
  }, [])
}
