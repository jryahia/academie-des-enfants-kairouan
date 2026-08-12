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

function hasGPUPower(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    if (!gl) return false
    const ext = gl.getExtension('WEBGL_debug_renderer_info') as
      | { UNMASKED_RENDERER_WEBGL?: number }
      | null
    const renderer = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL as number))
      : ''
    const low = /(SwiftShader|llvmpipe|Software|Mali-?4|Adreno-?3|Adreno-?2)/i.test(renderer)
    return !low
  } catch {
    return false
  }
}

function isLowMemory(): boolean {
  try {
    const anyNav = navigator as unknown as Record<string, unknown>
    const dm = anyNav.deviceMemory as number | undefined
    if (typeof dm === 'number') return dm < 4
  } catch {
    /* ignore */
  }
  return false
}

export function useDeviceQuality(): DeviceQuality {
  return useMemo<DeviceQuality>(() => {
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 768px)').matches
    const lowPower = isLowMemory() || !hasGPUPower()
    // Reduced motion ALWAYS disables heavy 3D, regardless of GPU.
    return {
      lowPower,
      reducedMotion,
      isMobile,
      can3D: !reducedMotion && !lowPower,
    }
  }, [])
}
